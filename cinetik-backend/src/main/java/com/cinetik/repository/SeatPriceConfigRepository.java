package com.cinetik.repository;

import com.cinetik.entity.SeatPriceConfig;
import com.cinetik.entity.SeatType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeatPriceConfigRepository extends JpaRepository<SeatPriceConfig, Long> {

    Optional<SeatPriceConfig> findByLoaiGhe(SeatType loaiGhe);
}
