package com.cinetik.service.impl;

import com.cinetik.dto.LockSeatsRequest;
import com.cinetik.dto.LockSeatsResponse;
import com.cinetik.dto.ShowtimeSeatStatusResponse;
import com.cinetik.entity.Seat;
import com.cinetik.entity.Showtime;
import com.cinetik.repository.BookingDetailSeatRepository;
import com.cinetik.repository.SeatRepository;
import com.cinetik.repository.ShowtimeRepository;
import com.cinetik.service.SeatLockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeatLockServiceImpl implements SeatLockService {

    private final StringRedisTemplate stringRedisTemplate;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final BookingDetailSeatRepository bookingDetailSeatRepository;

    private static final long LOCK_TTL_SECONDS = 300L; // 5 minutes

    @Override
    public boolean lockSingleSeat(Long showtimeId, Long seatId, Long userId) {
        if (!showtimeRepository.existsById(showtimeId)) {
            throw new RuntimeException("Không tìm thấy suất chiếu với ID: " + showtimeId);
        }

        // Check if seat is already SOLD
        List<Long> soldSeatIds = bookingDetailSeatRepository.findSoldSeatIdsByShowtimeId(showtimeId);
        if (soldSeatIds.contains(seatId)) {
            throw new RuntimeException("Ghế (ID: " + seatId + ") đã được bán thành công. Vui lòng chọn ghế khác!");
        }

        String key = buildLockKey(showtimeId, seatId);
        String userIdStr = String.valueOf(userId);

        Boolean success = stringRedisTemplate.opsForValue().setIfAbsent(key, userIdStr, Duration.ofSeconds(LOCK_TTL_SECONDS));

        if (Boolean.TRUE.equals(success)) {
            return true;
        } else {
            String existingVal = stringRedisTemplate.opsForValue().get(key);
            if (userIdStr.equals(existingVal)) {
                stringRedisTemplate.expire(key, Duration.ofSeconds(LOCK_TTL_SECONDS));
                return true;
            } else {
                log.warn("Single seat lock collision: showtimeId={}, seatId={}, attemptedBy={}, heldBy={}",
                        showtimeId, seatId, userId, existingVal);
                throw new RuntimeException("Ghế (ID: " + seatId + ") hiện đã được chọn giữ chỗ bởi khách hàng khác. Vui lòng chọn ghế khác!");
            }
        }
    }

    @Override
    public void releaseSingleSeat(Long showtimeId, Long seatId, Long userId) {
        String key = buildLockKey(showtimeId, seatId);
        if (userId != null) {
            String existingVal = stringRedisTemplate.opsForValue().get(key);
            if (String.valueOf(userId).equals(existingVal)) {
                stringRedisTemplate.delete(key);
            }
        } else {
            stringRedisTemplate.delete(key);
        }
    }

    @Override
    public LockSeatsResponse lockSeats(LockSeatsRequest request, Long userId) {
        Long showtimeId = request.getShowtimeId();
        List<Long> seatIds = request.getSeatIds();

        if (seatIds.size() > 8) {
            throw new RuntimeException("Chỉ được chọn tối đa 8 ghế cho 1 lần giữ chỗ");
        }

        if (!showtimeRepository.existsById(showtimeId)) {
            throw new RuntimeException("Không tìm thấy suất chiếu với ID: " + showtimeId);
        }

        List<String> newlyAcquiredKeys = new ArrayList<>();
        String userIdStr = String.valueOf(userId);

        for (Long seatId : seatIds) {
            String key = buildLockKey(showtimeId, seatId);
            Boolean success = stringRedisTemplate.opsForValue().setIfAbsent(key, userIdStr, Duration.ofSeconds(LOCK_TTL_SECONDS));

            if (Boolean.TRUE.equals(success)) {
                newlyAcquiredKeys.add(key);
            } else {
                String existingVal = stringRedisTemplate.opsForValue().get(key);
                if (userIdStr.equals(existingVal)) {
                    stringRedisTemplate.expire(key, Duration.ofSeconds(LOCK_TTL_SECONDS));
                } else {
                    log.warn("Seat lock collision: showtimeId={}, seatId={}, attemptedBy={}, heldBy={}",
                            showtimeId, seatId, userId, existingVal);

                    rollbackKeys(newlyAcquiredKeys);
                    throw new RuntimeException("Ghế (ID: " + seatId + ") hiện đã được chọn giữ chỗ bởi khách hàng khác. Vui lòng chọn ghế khác!");
                }
            }
        }

        return LockSeatsResponse.builder()
                .showtimeId(showtimeId)
                .seatIds(seatIds)
                .ttlSeconds(LOCK_TTL_SECONDS)
                .lockUntil(LocalDateTime.now().plusSeconds(LOCK_TTL_SECONDS))
                .build();
    }

    @Override
    public List<Long> getLockedSeatsForShowtime(Long showtimeId) {
        String pattern = "lock:showtime:" + showtimeId + ":seat:*";
        Set<String> keys = stringRedisTemplate.keys(pattern);

        List<Long> lockedSeatIds = new ArrayList<>();
        if (keys != null && !keys.isEmpty()) {
            for (String key : keys) {
                try {
                    String seatIdStr = key.substring(key.lastIndexOf(":seat:") + 6);
                    lockedSeatIds.add(Long.parseLong(seatIdStr));
                } catch (Exception e) {
                    log.error("Failed to parse seatId from Redis key: {}", key, e);
                }
            }
        }
        return lockedSeatIds;
    }

    @Override
    public void releaseSeats(Long showtimeId, List<Long> seatIds, Long userId) {
        String userIdStr = (userId != null) ? String.valueOf(userId) : null;
        for (Long seatId : seatIds) {
            String key = buildLockKey(showtimeId, seatId);
            if (userIdStr != null) {
                String existingVal = stringRedisTemplate.opsForValue().get(key);
                if (userIdStr.equals(existingVal)) {
                    stringRedisTemplate.delete(key);
                }
            } else {
                stringRedisTemplate.delete(key);
            }
        }
    }

    @Override
    public void releaseMySeats(Long showtimeId, Long userId) {
        if (userId == null) return;
        String pattern = "lock:showtime:" + showtimeId + ":seat:*";
        Set<String> keys = stringRedisTemplate.keys(pattern);

        if (keys != null && !keys.isEmpty()) {
            String userIdStr = String.valueOf(userId);
            for (String key : keys) {
                String existingVal = stringRedisTemplate.opsForValue().get(key);
                if (userIdStr.equals(existingVal)) {
                    stringRedisTemplate.delete(key);
                }
            }
        }
    }

    @Override
    public boolean isSeatLockedByOther(Long showtimeId, Long seatId, Long userId) {
        String key = buildLockKey(showtimeId, seatId);
        String existingVal = stringRedisTemplate.opsForValue().get(key);
        if (existingVal == null) {
            return false;
        }
        return !existingVal.equals(String.valueOf(userId));
    }

    @Override
    public List<ShowtimeSeatStatusResponse> getShowtimeSeatsStatus(Long showtimeId, Long userId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy suất chiếu với ID: " + showtimeId));

        List<Seat> seats = seatRepository.findByCinemaRoomIdOrderByHangAscCotAsc(showtime.getCinemaRoom().getId());

        // Get sold seats (PAID status only) from DB
        Set<Long> soldSeatIds = new HashSet<>(bookingDetailSeatRepository.findSoldSeatIdsByShowtimeId(showtimeId));

        // Get Redis locks for this showtime
        String pattern = "lock:showtime:" + showtimeId + ":seat:*";
        Set<String> keys = stringRedisTemplate.keys(pattern);

        Map<Long, String> redisLocks = new HashMap<>();
        Map<Long, Long> redisTtls = new HashMap<>();

        if (keys != null && !keys.isEmpty()) {
            for (String key : keys) {
                try {
                    String seatIdStr = key.substring(key.lastIndexOf(":seat:") + 6);
                    Long sId = Long.parseLong(seatIdStr);
                    String holderUserId = stringRedisTemplate.opsForValue().get(key);
                    Long expireSeconds = stringRedisTemplate.getExpire(key);

                    if (holderUserId != null) {
                        redisLocks.put(sId, holderUserId);
                        redisTtls.put(sId, expireSeconds);
                    }
                } catch (Exception e) {
                    log.error("Failed to parse seat status key: {}", key, e);
                }
            }
        }

        String userIdStr = (userId != null) ? String.valueOf(userId) : null;
        List<ShowtimeSeatStatusResponse> result = new ArrayList<>();

        for (Seat seat : seats) {
            Long sId = seat.getId();
            String status;
            Long remainingTtl = null;

            if (soldSeatIds.contains(sId)) {
                status = "SOLD";
            } else if (redisLocks.containsKey(sId)) {
                String holderUserId = redisLocks.get(sId);
                remainingTtl = redisTtls.get(sId);

                if (userIdStr != null && userIdStr.equals(holderUserId)) {
                    status = "SELECTED_BY_ME";
                } else {
                    status = "LOCKED_BY_OTHER";
                }
            } else {
                status = "AVAILABLE";
            }

            result.add(ShowtimeSeatStatusResponse.builder()
                    .id(seat.getId())
                    .roomId(seat.getCinemaRoom().getId())
                    .hang(seat.getHang())
                    .cot(seat.getCot())
                    .loaiGhe(seat.getLoaiGhe())
                    .trangThai(status)
                    .remainingTtlSeconds(remainingTtl)
                    .build());
        }

        return result;
    }

    private void rollbackKeys(List<String> keys) {
        for (String key : keys) {
            stringRedisTemplate.delete(key);
        }
    }

    private String buildLockKey(Long showtimeId, Long seatId) {
        return "lock:showtime:" + showtimeId + ":seat:" + seatId;
    }
}
