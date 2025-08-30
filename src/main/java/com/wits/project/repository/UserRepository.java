package com.wits.project.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.wits.project.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}


