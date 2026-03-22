package com.interviewflux.interviewflux1.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
@Table(name = "interview_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_id")
    private Long id;

    @Column(name = "interviewer_id", nullable = false)
    private Long interviewerId;

    @Column(name = "slot_time", nullable = false)
    private LocalDateTime slotTime;

    private String company;
    private String role;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SlotStatus status;// AVAILABLE or BOOKED

    @ManyToOne
    @JoinColumn(name = "booked_by")
    private User bookedBy;
}