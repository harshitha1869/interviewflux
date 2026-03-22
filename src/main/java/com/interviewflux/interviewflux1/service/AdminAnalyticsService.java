package com.interviewflux.interviewflux1.service;

import com.interviewflux.interviewflux1.repository.SlotRepository;
import com.interviewflux.interviewflux1.model.SlotStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsService {

    private final SlotRepository slotRepository;

    public Map<String,Object> getDashboardStats(){

        long totalSlots = slotRepository.count();
        long bookedSlots = slotRepository.countByStatus(SlotStatus.BOOKED);
        long availableSlots = slotRepository.countByStatus(SlotStatus.AVAILABLE);

        List<Object[]> companyStats = slotRepository.getCompanyBookingStats();

        Map<String,Object> response = new HashMap<>();
        response.put("totalSlots", totalSlots);
        response.put("bookedSlots", bookedSlots);
        response.put("availableSlots", availableSlots);
        response.put("companyStats", companyStats);

        return response;
    }
}