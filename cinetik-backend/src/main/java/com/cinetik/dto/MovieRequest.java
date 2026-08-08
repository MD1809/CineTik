package com.cinetik.dto;

import com.cinetik.entity.MovieStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieRequest {

    @NotBlank(message = "Tên phim không được để trống")
    private String tenPhim;

    private String daoDien;

    private String dienVien;

    private String theLoai;

    @NotNull(message = "Thời lượng phim không được để trống")
    private Integer thoiLuong;

    private String doTuoi;

    private String moTa;

    private String posterUrl;

    private String trailerUrl;

    @NotNull(message = "Trạng thái phim không được để trống")
    private MovieStatus trangThai;
}
