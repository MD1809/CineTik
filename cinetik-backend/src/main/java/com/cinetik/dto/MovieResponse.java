package com.cinetik.dto;

import com.cinetik.entity.MovieStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {

    private Long id;
    private String tenPhim;
    private String daoDien;
    private String dienVien;
    private String theLoai;
    private Integer thoiLuong;
    private String doTuoi;
    private String moTa;
    private String posterUrl;
    private String trailerUrl;
    private MovieStatus trangThai;
}
