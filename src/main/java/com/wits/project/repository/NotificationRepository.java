package com.wits.project.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.wits.project.model.Notification;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdAndRead(String userId, Boolean read);
}


