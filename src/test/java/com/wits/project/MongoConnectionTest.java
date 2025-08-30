package com.wits.project;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.data.mongodb.uri=mongodb://localhost:27017/wits_test"
})
public class MongoConnectionTest {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Test
    public void testMongoConnection() {
        assertNotNull(mongoTemplate);
        // This will throw an exception if connection fails
        mongoTemplate.getDb().getName();
        System.out.println("MongoDB connection successful! Database: " + mongoTemplate.getDb().getName());
    }
}

