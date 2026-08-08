package com.cinetik.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seats")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private CinemaRoom cinemaRoom;

    @Column(name = "hang", nullable = false)
    private String hang;

    @Column(name = "cot", nullable = false)
    private Integer cot;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_ghe", nullable = false)
    private SeatType loaiGhe;
}
