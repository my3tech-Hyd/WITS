package com.wits.project.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.wits.project.model.Message;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {

    List<Message> findBySenderId(String senderId);
    
    List<Message> findByReceiverId(String receiverId);
    
    List<Message> findBySenderIdAndReceiverId(String senderId, String receiverId);
    
    List<Message> findByServiceId(String serviceId);
    
    List<Message> findByApplicationId(String applicationId);
    
    List<Message> findByMessageType(String messageType);
    
    List<Message> findByIsRead(Boolean isRead);
    
    List<Message> findByReceiverIdAndIsRead(String receiverId, Boolean isRead);
    
    @Query("{'sentAt': {$gte: ?0, $lte: ?1}}")
    List<Message> findBySentAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'$or': [{'senderId': ?0}, {'receiverId': ?0}]}")
    List<Message> findBySenderIdOrReceiverId(String userId);
    
    @Query("{'$or': [{'senderId': ?0}, {'receiverId': ?0}], 'isDeleted': {$ne: true}}")
    List<Message> findConversationMessages(String userId);
    
    @Query("{'receiverId': ?0, 'isRead': false, 'isDeleted': {$ne: true}}")
    List<Message> findUnreadMessages(String receiverId);
    
    @Query("{'receiverId': ?0, 'isRead': false, 'isDeleted': {$ne: true}}")
    Long countUnreadMessages(String receiverId);
}
