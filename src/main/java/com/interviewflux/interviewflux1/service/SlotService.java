package com.interviewflux.interviewflux1.service;

import com.interviewflux.interviewflux1.model.InterviewSlot;
import com.interviewflux.interviewflux1.model.User;
import com.interviewflux.interviewflux1.model.SlotStatus;
import com.interviewflux.interviewflux1.repository.SlotRepository;
import com.interviewflux.interviewflux1.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SlotService {

    private final SlotRepository slotRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    // ==============================
    // Get all available slots
    // ==============================
    public List<InterviewSlot> getAvailableSlots() {
        return slotRepository.findByStatus(SlotStatus.AVAILABLE);
    }

    // ==============================
    // Book Slot
    // ==============================
    @Transactional
    public String bookSlot(Long slotId, String email) {

        // 🔒 Lock slot row to prevent race condition
        InterviewSlot slot = slotRepository.findByIdForUpdate(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // 🚫 Slot already booked
        if (slot.getStatus() == SlotStatus.BOOKED) {
            return "Slot already booked";
        }

        // 👤 Get logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ⭐ CHECK: User already booked same company
        List<InterviewSlot> userBookings = slotRepository.findByBookedBy(user);

        for (InterviewSlot bookedSlot : userBookings) {

            if (bookedSlot.getCompany() != null &&
                    bookedSlot.getCompany().trim().equalsIgnoreCase(slot.getCompany().trim())) {

                return "You already booked an interview for " + slot.getCompany();
            }
        }
        // ⭐ Prevent time conflict
        if (slotRepository.existsByBookedByAndSlotTime(user, slot.getSlotTime())) {
            return "You already have an interview scheduled at this time";
        }
        // ✅ Book slot
        slot.setStatus(SlotStatus.BOOKED);
        slot.setBookedBy(user);

        slotRepository.save(slot);

        // 📧 Send confirmation email
        emailService.sendSlotBookingConfirmation(
                user.getEmail(),
                slot.getCompany(),
                slot.getSlotTime().toString()
        );

        return "Slot booked successfully";
    }

    // ==============================
    // Cancel Booking
    // ==============================
    @Transactional
    public String cancelBooking(Long slotId, String email) {

        InterviewSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if this user booked the slot
        if (slot.getBookedBy() == null ||
                !slot.getBookedBy().getEmail().equals(email)) {

            throw new RuntimeException("You did not book this slot");
        }

        // Update slot
        slot.setStatus(SlotStatus.AVAILABLE);
        slot.setBookedBy(null);

        slotRepository.save(slot);

        // 📧 Send cancellation email
        emailService.sendSlotCancellationEmail(
                user.getEmail(),
                slot.getCompany(),
                slot.getSlotTime().toString()
        );

        return "Slot cancelled successfully";
    }

    // ==============================
    // Get logged-in user's bookings
    // ==============================
    public List<InterviewSlot> getUserBookings(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return slotRepository.findByBookedBy(user);
    }
}