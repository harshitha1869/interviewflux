package com.interviewflux.interviewflux1.repository;

import com.interviewflux.interviewflux1.model.InterviewSlot;
import com.interviewflux.interviewflux1.model.User;
import com.interviewflux.interviewflux1.model.SlotStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import jakarta.persistence.LockModeType;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

public interface SlotRepository extends JpaRepository<InterviewSlot, Long> {

    // Get all slots by status (AVAILABLE / BOOKED)
    List<InterviewSlot> findByStatus(SlotStatus status);

    // Lock slot row to prevent race condition (important for concurrent booking)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM InterviewSlot s WHERE s.id = :id")
    Optional<InterviewSlot> findByIdForUpdate(Long id);

    // Check if user already booked any slot
    boolean existsByBookedBy(User user);

    // Get all bookings for a user
    List<InterviewSlot> findByBookedBy(User user);

    // ⭐ NEW: check if user already booked slot for same company
    Optional<InterviewSlot> findByBookedByAndCompanyAndStatus(
            User user,
            String company,
            SlotStatus status
    );
    boolean existsByBookedByAndSlotTime(User user, LocalDateTime slotTime);
    long countByStatus(SlotStatus status);

    @Query("SELECT s.company, COUNT(s) FROM InterviewSlot s WHERE s.status='BOOKED' GROUP BY s.company")
    List<Object[]> getCompanyBookingStats();

    @Query("SELECT DATE(s.slotTime), COUNT(s) FROM InterviewSlot s WHERE s.status='BOOKED' GROUP BY DATE(s.slotTime)")
    List<Object[]> getDailyBookings();

}