package com.cinetik.service.impl;

import com.cinetik.dto.LockSeatsRequest;
import com.cinetik.dto.LockSeatsResponse;
import com.cinetik.repository.ShowtimeRepository;
import com.cinetik.service.SeatLockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeatLockServiceImpl implements SeatLockService {

    private final StringRedisTemplate stringRedisTemplate;
    private final ShowtimeRepository showtimeRepository;

    private static final long LOCK_TTL_SECONDS = 300L; // 5 minutes

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
                // Check if current lock is held by same user
                String existingVal = stringRedisTemplate.opsForValue().get(key);
                if (userIdStr.equals(existingVal)) {
                    // Renew lock TTL
                    stringRedisTemplate.expire(key, Duration.ofSeconds(LOCK_TTL_SECONDS));
                } else {
                    // Locked by another user -> Rollback batch attempt!
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
    public boolean isSeatLockedByOther(Long showtimeId, Long seatId, Long userId) {
        String key = buildLockKey(showtimeId, seatId);
        String existingVal = stringRedisTemplate.opsForValue().get(key);
        if (existingVal == null) {
            return false;
        }
        return !existingVal.equals(String.valueOf(userId));
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
