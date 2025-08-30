package com.wits.project.web;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wits.project.model.User;
import com.wits.project.repository.UserRepository;
import com.wits.project.security.JwtService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository users;
    private final BCryptPasswordEncoder encoder;
    private final JwtService jwt;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        // Validate input using ExceptionUtils
        ExceptionUtils.requireNotEmpty(req.username, "Username is required");
        ExceptionUtils.requireNotEmpty(req.password, "Password is required");
        
        User u = users.findByUsername(req.username)
                .orElseThrow(() -> new GlobalExceptionHandler.BusinessException("Invalid credentials", HttpStatus.UNAUTHORIZED));
        
        if (!encoder.matches(req.password, u.getPasswordHash())) {
            throw new GlobalExceptionHandler.BusinessException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", u.getRoles());
        String token = jwt.generateToken(u.getId(), claims);
        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        Map<String, Object> user = new HashMap<>();
        user.put("id", u.getId());
        user.put("username", u.getUsername());
        user.put("email", u.getEmail());
        user.put("roles", u.getRoles());
        res.put("user", user);
        return ResponseEntity.ok(res);
    }

    @Getter
    @Setter
    public static class LoginRequest {
        public String username;
        public String password;
    }
}


