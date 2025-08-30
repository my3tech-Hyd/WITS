# Global Exception Handler Guide

## Overview

This Spring Boot application now includes a comprehensive global exception handler that provides consistent error responses across all endpoints. The exception handler is located in `src/main/java/com/wits/project/web/GlobalExceptionHandler.java`.

## Features

### 1. Automatic Exception Handling
The global exception handler automatically catches and processes various types of exceptions:

- **Validation Errors** (`@Valid` annotations)
- **Authentication Errors** (Invalid credentials, unauthorized access)
- **Authorization Errors** (Access denied)
- **Database Errors** (MongoDB exceptions)
- **File Upload Errors** (Size exceeded)
- **JSON Parsing Errors** (Invalid request body)
- **Type Mismatch Errors** (Invalid path variables)
- **404 Errors** (Resource not found)
- **Generic Errors** (Unexpected exceptions)

### 2. Consistent Error Response Format
All error responses follow a standardized format:

```json
{
  "timestamp": "2024-01-15T10:30:45.123",
  "status": 400,
  "error": "Validation Error",
  "message": "Invalid input data",
  "path": "/api/users/register",
  "details": {
    "email": "must be a well-formed email address",
    "password": "must be at least 8 characters"
  }
}
```

### 3. Utility Methods
The `ExceptionUtils` class provides convenient methods for throwing business exceptions:

```java
// Throw different types of exceptions
ExceptionUtils.throwBadRequest("Invalid input");
ExceptionUtils.throwNotFound("User not found");
ExceptionUtils.throwUnauthorized("Invalid credentials");
ExceptionUtils.throwForbidden("Access denied");
ExceptionUtils.throwConflict("Resource already exists");

// Validation helpers
ExceptionUtils.requireTrue(condition, "Condition must be true");
ExceptionUtils.requireNotNull(object, "Object cannot be null");
ExceptionUtils.requireNotEmpty(string, "String cannot be empty");
```

## Usage Examples

### 1. Basic Exception Handling
The global exception handler works automatically. You don't need to add any special annotations to your controllers:

```java
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    // This will automatically be caught by the global exception handler
    if (req.username == null) {
        throw new IllegalArgumentException("Username is required");
    }
    
    // This will return a 400 Bad Request with proper error format
    return ResponseEntity.ok(result);
}
```

### 2. Using ExceptionUtils for Better Error Handling
```java
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
    // Input validation
    ExceptionUtils.requireNotEmpty(req.username, "Username is required");
    ExceptionUtils.requireNotEmpty(req.email, "Email is required");
    ExceptionUtils.requireNotEmpty(req.password, "Password is required");
    
    // Business logic validation
    if (userRepository.findByUsername(req.username).isPresent()) {
        ExceptionUtils.throwConflict("Username already exists");
    }
    
    if (userRepository.findByEmail(req.email).isPresent()) {
        ExceptionUtils.throwConflict("Email already exists");
    }
    
    // Continue with registration logic...
    return ResponseEntity.ok(result);
}
```

### 3. Custom Business Exceptions
```java
@GetMapping("/users/{id}")
public ResponseEntity<?> getUser(@PathVariable String id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new GlobalExceptionHandler.BusinessException(
            "User not found", HttpStatus.NOT_FOUND));
    
    return ResponseEntity.ok(user);
}
```

### 4. Validation with @Valid
```java
@PostMapping("/jobs")
public ResponseEntity<?> createJob(@Valid @RequestBody CreateJobRequest req) {
    // If validation fails, the global exception handler will automatically
    // return a 400 Bad Request with validation details
    return ResponseEntity.ok(jobService.createJob(req));
}
```

## Error Response Types

### 1. Validation Error (400)
```json
{
  "timestamp": "2024-01-15T10:30:45.123",
  "status": 400,
  "error": "Validation Error",
  "message": "Invalid input data",
  "path": "/api/users/register",
  "details": {
    "email": "must be a well-formed email address",
    "password": "must be at least 8 characters"
  }
}
```

### 2. Authentication Error (401)
```json
{
  "timestamp": "2024-01-15T10:30:45.123",
  "status": 401,
  "error": "Authentication Error",
  "message": "Invalid credentials or authentication failed",
  "path": "/api/auth/login"
}
```

### 3. Access Denied (403)
```json
{
  "timestamp": "2024-01-15T10:30:45.123",
  "status": 403,
  "error": "Access Denied",
  "message": "You don't have permission to access this resource",
  "path": "/api/admin/users"
}
```

### 4. Not Found (404)
```json
{
  "timestamp": "2024-01-15T10:30:45.123",
  "status": 404,
  "error": "Not Found",
  "message": "The requested resource was not found",
  "path": "/api/users/999"
}
```

### 5. Internal Server Error (500)
```json
{
  "timestamp": "2024-01-15T10:30:45.123",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred. Please try again later.",
  "path": "/api/jobs"
}
```

## Configuration

The following properties are configured in `application.properties`:

```properties
# Enable proper error handling
spring.mvc.throw-exception-if-no-handler-found=true
spring.web.resources.add-mappings=false

# Logging configuration
logging.level.com.wits.project=INFO
logging.level.org.springframework.security=INFO
logging.level.org.mongodb.driver=WARN
```

## Best Practices

### 1. Use ExceptionUtils for Common Validations
```java
// Good
ExceptionUtils.requireNotEmpty(username, "Username is required");

// Avoid
if (username == null || username.trim().isEmpty()) {
    throw new IllegalArgumentException("Username is required");
}
```

### 2. Use Appropriate HTTP Status Codes
```java
// For business logic errors
ExceptionUtils.throwBadRequest("Invalid input");

// For resource not found
ExceptionUtils.throwNotFound("User not found");

// For authentication issues
ExceptionUtils.throwUnauthorized("Invalid credentials");

// For authorization issues
ExceptionUtils.throwForbidden("Access denied");

// For conflicts (duplicate resources)
ExceptionUtils.throwConflict("Username already exists");
```

### 3. Use @Valid for Input Validation
```java
@PostMapping("/users")
public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest req) {
    // Validation errors will be automatically handled
    return ResponseEntity.ok(userService.createUser(req));
}
```

### 4. Log Errors Appropriately
The global exception handler automatically logs errors:
- `log.warn()` for client errors (4xx)
- `log.error()` for server errors (5xx)

### 5. Don't Expose Sensitive Information
The global exception handler is configured to not expose sensitive information in error messages for security reasons.

## Testing Exception Handling

You can test the exception handling by making requests that trigger different types of errors:

1. **Validation Error**: Send invalid JSON or missing required fields
2. **Authentication Error**: Send invalid credentials
3. **Authorization Error**: Access protected endpoints without proper roles
4. **Not Found Error**: Request non-existent resources
5. **Business Logic Error**: Use ExceptionUtils in your controllers

## Files Created/Modified

1. **GlobalExceptionHandler.java** - Main exception handler class
2. **ExceptionUtils.java** - Utility class for throwing exceptions
3. **AuthController.java** - Updated to demonstrate usage
4. **application.properties** - Added error handling configuration
5. **EXCEPTION_HANDLING_GUIDE.md** - This documentation

The global exception handler is now ready to use and will provide consistent, well-formatted error responses across your entire application!

