package com.interviewflux.interviewflux1.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;  // CANDIDATE or ADMIN

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;
}