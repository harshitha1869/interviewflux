package com.interviewflux.interviewflux1.repository;

import com.interviewflux.interviewflux1.model.User;
import com.interviewflux.interviewflux1.model.Role;   // ✅ IMPORTANT
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;   // ✅ IMPORTANT

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);   // ✅ remove extra ;
}