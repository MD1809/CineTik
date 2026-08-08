package com.cinetik.repository;

import com.cinetik.entity.Movie;
import com.cinetik.entity.MovieStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByTrangThai(MovieStatus trangThai);
}
