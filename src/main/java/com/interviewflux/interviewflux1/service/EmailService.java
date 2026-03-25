package com.interviewflux.interviewflux1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    //@Autowired
    //private JavaMailSender mailSender;

    public void sendAdminCredentials(String toEmail, String username, String password) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Admin Account Created - InterviewFlux");

        message.setText(
                "Your admin account has been created.\n\n" +
                        "Username: " + username + "\n" +
                        "Password: " + password + "\n\n" +
                        "Please login and change your password."
        );

       // mailSender.send(message);
    }

    public void sendSlotBookingConfirmation(
            String toEmail,
            String company,
            String slotTime
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Interview Slot Confirmation - InterviewFlux");

        message.setText(
                "Your interview slot has been successfully booked.\n\n" +
                        "Company: " + company + "\n" +
                        "Interview Time: " + slotTime + "\n\n" +
                        "Please join the interview on time.\n\n" +
                        "Best of luck!\n\n" +
                        "InterviewFlux Team"
        );

        //mailSender.send(message);
    }
    public void sendSlotCancellationEmail(
            String toEmail,
            String company,
            String slotTime
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Interview Slot Cancelled - InterviewFlux");

        message.setText(
                "Your interview slot has been cancelled.\n\n" +
                        "Company: " + company + "\n" +
                        "Interview Time: " + slotTime + "\n\n" +
                        "You can book another slot from the dashboard.\n\n" +
                        "InterviewFlux Team"
        );

        //mailSender.send(message);
    }
}