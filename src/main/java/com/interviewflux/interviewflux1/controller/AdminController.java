package com.interviewflux.interviewflux1.controller;

import com.interviewflux.interviewflux1.model.InterviewSlot;
import com.interviewflux.interviewflux1.model.SlotStatus;
import com.interviewflux.interviewflux1.repository.SlotRepository;
import com.interviewflux.interviewflux1.service.AdminAnalyticsService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final SlotRepository slotRepository;
    private final AdminAnalyticsService adminAnalyticsService;

    // ============================
    // CREATE SLOT
    // ============================
    @PostMapping("/create-slot")
    public InterviewSlot createSlot(
            @RequestParam Long interviewerId,
            @RequestParam String dateTime,
            @RequestParam String company,
            @RequestParam String role) {

        // Correctly parse date-time sent from frontend
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

        LocalDateTime slotTime = LocalDateTime.parse(dateTime, formatter);

        InterviewSlot slot = InterviewSlot.builder()
                .interviewerId(interviewerId)
                .slotTime(slotTime)
                .company(company)
                .role(role)
                .status(SlotStatus.AVAILABLE)
                .build();

        return slotRepository.save(slot);
    }

    // ============================
    // DASHBOARD STATS
    // ============================
    @GetMapping("/dashboard-stats")
    public Map<String, Object> getDashboardStats() {
        return adminAnalyticsService.getDashboardStats();
    }
}