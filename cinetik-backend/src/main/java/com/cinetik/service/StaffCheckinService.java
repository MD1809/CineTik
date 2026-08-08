package com.cinetik.service;

import com.cinetik.dto.StaffCheckinRequest;
import com.cinetik.dto.StaffCheckinResponse;

public interface StaffCheckinService {

    StaffCheckinResponse processCheckin(StaffCheckinRequest request);

    StaffCheckinResponse getTicketDetailForStaff(String ticketCode);
}
