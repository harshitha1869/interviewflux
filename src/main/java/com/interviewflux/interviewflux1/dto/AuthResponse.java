package com.interviewflux.interviewflux1.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {


    private String token;
    private String role;
    private String username;
    private String message;
}