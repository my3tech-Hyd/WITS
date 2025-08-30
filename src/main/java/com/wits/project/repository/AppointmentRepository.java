package com.wits.project.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.wits.project.model.Appointment;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByUserId(String userId);
    boolean existsByUserIdAndSlotStart(String userId, Instant slotStart);
}


