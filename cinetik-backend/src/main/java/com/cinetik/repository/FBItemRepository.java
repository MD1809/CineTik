package com.cinetik.repository;

import com.cinetik.entity.FBItem;
import com.cinetik.entity.FBStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FBItemRepository extends JpaRepository<FBItem, Long> {

    List<FBItem> findByTrangThai(FBStatus trangThai);
}
