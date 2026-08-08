package com.cinetik.service;

import com.cinetik.dto.FBItemRequest;
import com.cinetik.dto.FBItemResponse;

import java.util.List;

public interface FBService {

    List<FBItemResponse> getPublicFBItems();

    List<FBItemResponse> getAllFBItems();

    FBItemResponse getFBItemById(Long id);

    FBItemResponse createFBItem(FBItemRequest request);

    FBItemResponse updateFBItem(Long id, FBItemRequest request);

    void deleteFBItem(Long id);
}
