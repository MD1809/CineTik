package com.cinetik.service.impl;

import com.cinetik.dto.*;
import com.cinetik.entity.CinemaRoom;
import com.cinetik.entity.Movie;
import com.cinetik.entity.Seat;
import com.cinetik.entity.Showtime;
import com.cinetik.repository.CinemaRoomRepository;
import com.cinetik.repository.MovieRepository;
import com.cinetik.repository.SeatRepository;
import com.cinetik.repository.ShowtimeRepository;
import com.cinetik.service.PricingEngineService;
import com.cinetik.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowtimeServiceImpl implements ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final CinemaRoomRepository cinemaRoomRepository;
    private final SeatRepository seatRepository;
    private final PricingEngineService pricingEngineService;

    @Override
    public List<ShowtimeResponse> getPublicShowtimes(Long movieId, LocalDate date) {
        List<Showtime> showtimes;
        if (movieId != null && date != null) {
            showtimes = showtimeRepository.findByMovieIdAndNgayChieu(movieId, date);
        } else if (movieId != null) {
            showtimes = showtimeRepository.findByMovieId(movieId);
        } else if (date != null) {
            showtimes = showtimeRepository.findByNgayChieu(date);
        } else {
            showtimes = showtimeRepository.findAll();
        }
        return showtimes.stream().map(this::mapToShowtimeResponse).collect(Collectors.toList());
    }

    @Override
    public ShowtimeResponse getShowtimeById(Long id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy suất chiếu với ID: " + id));
        return mapToShowtimeResponse(showtime);
    }

    @Override
    public ShowtimeResponse createShowtime(ShowtimeRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phim với ID: " + request.getMovieId()));

        CinemaRoom room = cinemaRoomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng chiếu với ID: " + request.getRoomId()));

        LocalDateTime start = request.getThoiGianBatDau();
        LocalDateTime end = request.getThoiGianKetThuc();
        if (end == null) {
            end = start.plusMinutes(movie.getThoiLuong() != null ? movie.getThoiLuong() : 120);
        }

        validateShowtimeNoOverlap(room.getId(), request.getNgayChieu(), start, end, null);

        Showtime showtime = Showtime.builder()
                .movie(movie)
                .cinemaRoom(room)
                .ngayChieu(request.getNgayChieu())
                .thoiGianBatDau(start)
                .thoiGianKetThuc(end)
                .bangGiaSetting(request.getBangGiaSetting())
                .build();

        Showtime savedShowtime = showtimeRepository.save(showtime);
        return mapToShowtimeResponse(savedShowtime);
    }

    @Override
    public ShowtimeResponse updateShowtime(Long id, ShowtimeRequest request) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy suất chiếu với ID: " + id));

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phim với ID: " + request.getMovieId()));

        CinemaRoom room = cinemaRoomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng chiếu với ID: " + request.getRoomId()));

        LocalDateTime start = request.getThoiGianBatDau();
        LocalDateTime end = request.getThoiGianKetThuc();
        if (end == null) {
            end = start.plusMinutes(movie.getThoiLuong() != null ? movie.getThoiLuong() : 120);
        }

        validateShowtimeNoOverlap(room.getId(), request.getNgayChieu(), start, end, id);

        showtime.setMovie(movie);
        showtime.setCinemaRoom(room);
        showtime.setNgayChieu(request.getNgayChieu());
        showtime.setThoiGianBatDau(start);
        showtime.setThoiGianKetThuc(end);
        showtime.setBangGiaSetting(request.getBangGiaSetting());

        Showtime updatedShowtime = showtimeRepository.save(showtime);
        return mapToShowtimeResponse(updatedShowtime);
    }

    @Override
    public CalculatePriceResponse calculatePrice(CalculatePriceRequest request) {
        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy suất chiếu với ID: " + request.getShowtimeId()));

        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        if (seats.isEmpty()) {
            throw new RuntimeException("Không tìm thấy ghế nào phù hợp với danh sách ID đã cung cấp");
        }

        return pricingEngineService.calculateTicketPrice(showtime, seats);
    }

    private void validateShowtimeNoOverlap(Long roomId, LocalDate ngayChieu, LocalDateTime start, LocalDateTime end, Long excludeShowtimeId) {
        List<Showtime> existingList = showtimeRepository.findByCinemaRoomIdAndNgayChieu(roomId, ngayChieu);
        for (Showtime st : existingList) {
            if (excludeShowtimeId != null && st.getId().equals(excludeShowtimeId)) {
                continue;
            }
            if (start.isBefore(st.getThoiGianKetThuc()) && end.isAfter(st.getThoiGianBatDau())) {
                throw new RuntimeException("Khung giờ chiếu bị trùng với suất chiếu khác trong cùng phòng chiếu");
            }
        }
    }

    private ShowtimeResponse mapToShowtimeResponse(Showtime showtime) {
        MovieResponse movieResp = MovieResponse.builder()
                .id(showtime.getMovie().getId())
                .tenPhim(showtime.getMovie().getTenPhim())
                .daoDien(showtime.getMovie().getDaoDien())
                .dienVien(showtime.getMovie().getDienVien())
                .theLoai(showtime.getMovie().getTheLoai())
                .thoiLuong(showtime.getMovie().getThoiLuong())
                .doTuoi(showtime.getMovie().getDoTuoi())
                .moTa(showtime.getMovie().getMoTa())
                .posterUrl(showtime.getMovie().getPosterUrl())
                .trailerUrl(showtime.getMovie().getTrailerUrl())
                .trangThai(showtime.getMovie().getTrangThai())
                .build();

        CinemaRoomResponse roomResp = CinemaRoomResponse.builder()
                .id(showtime.getCinemaRoom().getId())
                .tenPhong(showtime.getCinemaRoom().getTenPhong())
                .soLuongGhe(showtime.getCinemaRoom().getSoLuongGhe())
                .diagramData(showtime.getCinemaRoom().getDiagramData())
                .build();

        return ShowtimeResponse.builder()
                .id(showtime.getId())
                .movie(movieResp)
                .cinemaRoom(roomResp)
                .ngayChieu(showtime.getNgayChieu())
                .thoiGianBatDau(showtime.getThoiGianBatDau())
                .thoiGianKetThuc(showtime.getThoiGianKetThuc())
                .bangGiaSetting(showtime.getBangGiaSetting())
                .appliedSurcharges(pricingEngineService.getAppliedSurcharges(showtime))
                .appliedDiscounts(pricingEngineService.getAppliedDiscounts(showtime))
                .build();
    }
}
