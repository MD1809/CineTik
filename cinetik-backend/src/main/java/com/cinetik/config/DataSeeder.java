package com.cinetik.config;

import com.cinetik.entity.*;
import com.cinetik.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CinemaRoomRepository cinemaRoomRepository;
    private final SeatRepository seatRepository;
    private final MovieRepository movieRepository;
    private final ShowtimeRepository showtimeRepository;
    private final FBItemRepository fbItemRepository;
    private final PricingRuleRepository pricingRuleRepository;
    private final SeatPriceConfigRepository seatPriceConfigRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting CineTik DataSeeder...");
        seedUsers();
        CinemaRoom room = seedCinemaRoomAndSeats();
        List<Movie> movies = seedMovies();
        if (room != null && !movies.isEmpty()) {
            seedShowtimes(room, movies);
        }
        seedFBItems();
        seedPricingRules();
        seedSeatPriceConfigs();
        log.info("CineTik DataSeeder completed successfully!");
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@cinetik.com")) {
            User admin = User.builder()
                    .hoTen("Admin CineTik")
                    .email("admin@cinetik.com")
                    .matKhau(passwordEncoder.encode("admin123"))
                    .soDienThoai("0901234567")
                    .vaiTro(Role.ADMIN)
                    .trangThaiAcc(UserStatus.ACTIVE)
                    .build();
            userRepository.save(admin);
            log.info("Seeded Admin user: admin@cinetik.com");
        }

        if (!userRepository.existsByEmail("staff@cinetik.com")) {
            User staff = User.builder()
                    .hoTen("Staff Soat Ve")
                    .email("staff@cinetik.com")
                    .matKhau(passwordEncoder.encode("staff123"))
                    .soDienThoai("0907654321")
                    .vaiTro(Role.STAFF)
                    .trangThaiAcc(UserStatus.ACTIVE)
                    .build();
            userRepository.save(staff);
            log.info("Seeded Staff user: staff@cinetik.com");
        }
    }

    private CinemaRoom seedCinemaRoomAndSeats() {
        CinemaRoom room;
        if (cinemaRoomRepository.count() == 0) {
            room = CinemaRoom.builder()
                    .tenPhong("Phòng chiếu 01")
                    .soLuongGhe(50)
                    .diagramData("{\"rows\": 5, \"cols\": 10, \"rowLabels\": [\"A\", \"B\", \"C\", \"D\", \"E\"]}")
                    .build();
            room = cinemaRoomRepository.save(room);

            List<Seat> seats = new ArrayList<>();
            String[] rows = {"A", "B", "C", "D", "E"};
            for (String row : rows) {
                SeatType seatType;
                if (row.equals("E")) {
                    seatType = SeatType.COUPLE;
                } else if (row.equals("D")) {
                    seatType = SeatType.VIP;
                } else {
                    seatType = SeatType.SINGLE;
                }

                for (int col = 1; col <= 10; col++) {
                    Seat seat = Seat.builder()
                            .cinemaRoom(room)
                            .hang(row)
                            .cot(col)
                            .loaiGhe(seatType)
                            .build();
                    seats.add(seat);
                }
            }
            seatRepository.saveAll(seats);
            log.info("Seeded 1 CinemaRoom and 50 Seats (Single, VIP, Couple)");
        } else {
            room = cinemaRoomRepository.findAll().get(0);
        }
        return room;
    }

    private List<Movie> seedMovies() {
        List<Movie> movies = new ArrayList<>();
        if (movieRepository.count() == 0) {
            Movie movie1 = Movie.builder()
                    .tenPhim("Lật Mặt 7: Một Điều Ước")
                    .daoDien("Lý Hải")
                    .dienVien("Thanh Hiền, Trương Minh Cường, Đinh Y Nhung")
                    .theLoai("Gia Đình, Hài, Tâm Lý")
                    .thoiLuong(138)
                    .doTuoi("P")
                    .moTa("Câu chuyện cảm động về tình mẫu tử và nỗi lòng của những người con khi mẹ già lâm bệnh.")
                    .posterUrl("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba")
                    .trailerUrl("https://www.youtube.com/watch?v=d8b0163")
                    .trangThai(MovieStatus.DANG_CHIEU)
                    .build();

            Movie movie2 = Movie.builder()
                    .tenPhim("Mai")
                    .daoDien("Trấn Thành")
                    .dienVien("Phương Anh Đào, Tuấn Trần, Hồng Đào")
                    .theLoai("Tâm Lý, Tình Cảm")
                    .thoiLuong(131)
                    .doTuoi("T18")
                    .moTa("Hành trình đi tìm tình yêu và khát vọng sống độc lập của Mai - một người phụ nữ đối mặt với nhiều sóng gió đời thường.")
                    .posterUrl("https://images.unsplash.com/photo-1536440136628-849c177e76a1")
                    .trailerUrl("https://www.youtube.com/watch?v=2cb8eb7")
                    .trangThai(MovieStatus.DANG_CHIEU)
                    .build();

            movies.add(movieRepository.save(movie1));
            movies.add(movieRepository.save(movie2));
            log.info("Seeded 2 Movies");
        } else {
            movies = movieRepository.findAll();
        }
        return movies;
    }

    private void seedShowtimes(CinemaRoom room, List<Movie> movies) {
        if (showtimeRepository.count() == 0 && movies.size() >= 2) {
            LocalDate today = LocalDate.now();
            String priceSetting = "{\"SINGLE\": 80000, \"VIP\": 100000, \"COUPLE\": 150000}";

            Showtime st1 = Showtime.builder()
                    .movie(movies.get(0))
                    .cinemaRoom(room)
                    .ngayChieu(today)
                    .thoiGianBatDau(LocalDateTime.of(today, LocalTime.of(9, 0)))
                    .thoiGianKetThuc(LocalDateTime.of(today, LocalTime.of(11, 18)))
                    .bangGiaSetting(priceSetting)
                    .build();

            Showtime st2 = Showtime.builder()
                    .movie(movies.get(0))
                    .cinemaRoom(room)
                    .ngayChieu(today)
                    .thoiGianBatDau(LocalDateTime.of(today, LocalTime.of(14, 0)))
                    .thoiGianKetThuc(LocalDateTime.of(today, LocalTime.of(16, 18)))
                    .bangGiaSetting(priceSetting)
                    .build();

            Showtime st3 = Showtime.builder()
                    .movie(movies.get(1))
                    .cinemaRoom(room)
                    .ngayChieu(today)
                    .thoiGianBatDau(LocalDateTime.of(today, LocalTime.of(17, 30)))
                    .thoiGianKetThuc(LocalDateTime.of(today, LocalTime.of(19, 41)))
                    .bangGiaSetting(priceSetting)
                    .build();

            Showtime st4 = Showtime.builder()
                    .movie(movies.get(1))
                    .cinemaRoom(room)
                    .ngayChieu(today)
                    .thoiGianBatDau(LocalDateTime.of(today, LocalTime.of(20, 30)))
                    .thoiGianKetThuc(LocalDateTime.of(today, LocalTime.of(22, 41)))
                    .bangGiaSetting(priceSetting)
                    .build();

            showtimeRepository.saveAll(List.of(st1, st2, st3, st4));
            log.info("Seeded 4 Showtimes for today");
        }
    }

    private void seedFBItems() {
        if (fbItemRepository.count() == 0) {
            FBItem item1 = FBItem.builder()
                    .tenItem("Combo 1 Bắp + 1 Nước")
                    .giaTien(new BigDecimal("79000"))
                    .moTa("01 Bắp Ngọt Vừa + 01 Coca Cola 500ml")
                    .hinhAnh("https://images.unsplash.com/photo-1585647347483-22b66260dfff")
                    .trangThai(FBStatus.AVAILABLE)
                    .build();

            FBItem item2 = FBItem.builder()
                    .tenItem("Combo 1 Bắp + 2 Nước")
                    .giaTien(new BigDecimal("99000"))
                    .moTa("01 Bắp Phô Mai + 02 Coca Cola 500ml")
                    .hinhAnh("https://images.unsplash.com/photo-1578849278619-e73505e9610f")
                    .trangThai(FBStatus.AVAILABLE)
                    .build();

            FBItem item3 = FBItem.builder()
                    .tenItem("Combo Gia Đình (2 Bắp + 2 Nước)")
                    .giaTien(new BigDecimal("149000"))
                    .moTa("02 Bắp Ngọt/Phô Mai Lớn + 02 Nước Ngọt Lớn")
                    .hinhAnh("https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c")
                    .trangThai(FBStatus.AVAILABLE)
                    .build();

            fbItemRepository.saveAll(List.of(item1, item2, item3));
            log.info("Seeded 3 F&B Combo items");
        }
    }

    private void seedPricingRules() {
        if (pricingRuleRepository.count() == 0) {
            PricingRule r1 = PricingRule.builder()
                    .tenQuyTac("Phụ thu Giờ Cao Điểm Tối")
                    .loaiDieuChinh(AdjustmentType.SURCHARGE)
                    .hinhThuc(DiscountType.FIXED_AMOUNT)
                    .giaTri(new BigDecimal("15000"))
                    .loaiNgay(DayType.ALL)
                    .gioBatDau(LocalTime.of(18, 0))
                    .gioKetThuc(LocalTime.of(22, 0))
                    .trangThai(true)
                    .build();

            PricingRule r2 = PricingRule.builder()
                    .tenQuyTac("Phụ thu Cuối tuần (T7, CN)")
                    .loaiDieuChinh(AdjustmentType.SURCHARGE)
                    .hinhThuc(DiscountType.FIXED_AMOUNT)
                    .giaTri(new BigDecimal("10000"))
                    .loaiNgay(DayType.WEEKEND)
                    .gioBatDau(null)
                    .gioKetThuc(null)
                    .trangThai(true)
                    .build();

            PricingRule r3 = PricingRule.builder()
                    .tenQuyTac("Giảm giá Suất Chiếu Sớm")
                    .loaiDieuChinh(AdjustmentType.DISCOUNT)
                    .hinhThuc(DiscountType.PERCENTAGE)
                    .giaTri(new BigDecimal("10"))
                    .loaiNgay(DayType.ALL)
                    .gioBatDau(LocalTime.of(8, 0))
                    .gioKetThuc(LocalTime.of(11, 30))
                    .trangThai(true)
                    .build();

            pricingRuleRepository.saveAll(List.of(r1, r2, r3));
            log.info("Seeded 3 Default Pricing Rules");
        }
    }

    private void seedSeatPriceConfigs() {
        if (seatPriceConfigRepository.count() == 0) {
            SeatPriceConfig singleSeat = SeatPriceConfig.builder()
                    .loaiGhe(SeatType.SINGLE)
                    .tenLoaiGhe("Ghế Đơn")
                    .giaGoc(new BigDecimal("80000"))
                    .build();

            SeatPriceConfig vipSeat = SeatPriceConfig.builder()
                    .loaiGhe(SeatType.VIP)
                    .tenLoaiGhe("Ghế VIP")
                    .giaGoc(new BigDecimal("100000"))
                    .build();

            SeatPriceConfig coupleSeat = SeatPriceConfig.builder()
                    .loaiGhe(SeatType.COUPLE)
                    .tenLoaiGhe("Ghế Đôi")
                    .giaGoc(new BigDecimal("150000"))
                    .build();

            seatPriceConfigRepository.saveAll(List.of(singleSeat, vipSeat, coupleSeat));
            log.info("Seeded 3 Default Seat Base Price Configs (SINGLE: 80k, VIP: 100k, COUPLE: 150k)");
        }
    }
}
