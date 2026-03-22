package com.interviewflux.interviewflux1.controller;
import org.springframework.http.ResponseEntity;
import java.util.Map;

import com.interviewflux.interviewflux1.model.InterviewSlot;
import com.interviewflux.interviewflux1.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/slots")
@RequiredArgsConstructor
public class
SlotController {

    private final SlotService slotService;

    // ✅ Get all available slots
    @GetMapping
    public List<InterviewSlot> getAvailableSlots() {
        return slotService.getAvailableSlots();
    }

    // ✅ Book a slot (JWT required)

    @PostMapping("/book/{id}")
    public ResponseEntity<Map<String, String>> bookSlot(@PathVariable Long id,
                                                        Authentication authentication) {
        String email = authentication.getName();
        String result = slotService.bookSlot(id, email);
        return ResponseEntity.ok(Map.of("message", result));
    }

    // ✅ Get logged-in user's bookings
    @GetMapping("/my-bookings")
    public List<InterviewSlot> myBookings(Authentication authentication) {

        String email = authentication.getName();
        return slotService.getUserBookings(email);
    }
    @DeleteMapping("/cancel/{slotId}")
    public ResponseEntity<String> cancelSlot(
            @PathVariable Long slotId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        String response = slotService.cancelBooking(slotId, email);

        return ResponseEntity.ok(response);
    }
}