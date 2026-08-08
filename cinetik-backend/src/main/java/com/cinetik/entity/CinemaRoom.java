package com.cinetik.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cinema_rooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CinemaRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_phong", nullable = false)
    private String tenPhong;

    @Column(name = "so_luong_ghe", nullable = false)
    private Integer soLuongGhe;

    @Column(name = "diagram_data", columnDefinition = "TEXT")
    private String diagramData;
}
