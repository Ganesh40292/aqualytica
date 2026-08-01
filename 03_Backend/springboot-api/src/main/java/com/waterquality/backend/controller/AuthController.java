package com.waterquality.backend.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.waterquality.backend.dto.GoogleAuthDto;
import com.waterquality.backend.dto.UserLoginDto;
import com.waterquality.backend.dto.UserRegistrationDto;
import com.waterquality.backend.entity.User;
import com.waterquality.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Value("${google.client-id}")
    private String googleClientId;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationDto registrationDto) {
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already registered."));
        }
        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is already taken."));
        }

        User user = new User();
        user.setUsername(registrationDto.getUsername());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setAuthProvider(User.AuthProvider.LOCAL);

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElse(null);

        if (user != null && passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body(Map.of("message", "Access Denied: Invalid email or security token."));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody GoogleAuthDto googleAuthDto) {
        try {
            // Build a verifier that checks the token's signature, audience, and issuer
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            // Verify and decode the ID token
            GoogleIdToken idToken = verifier.verify(googleAuthDto.getIdToken());
            if (idToken == null) {
                return ResponseEntity.status(401)
                        .body(Map.of("message", "Invalid Google ID token."));
            }

            // Extract user profile from the verified token payload
            GoogleIdToken.Payload payload = idToken.getPayload();
            String googleId = payload.getSubject();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            // 1. Check if user already exists by Google ID
            User user = userRepository.findByGoogleId(googleId).orElse(null);

            if (user == null) {
                // 2. Check if a local account exists with the same email — link it
                user = userRepository.findByEmail(email).orElse(null);

                if (user != null) {
                    // Link existing local account with Google
                    user.setGoogleId(googleId);
                    user.setProfilePicture(pictureUrl);
                    if (user.getAuthProvider() == User.AuthProvider.LOCAL) {
                        user.setAuthProvider(User.AuthProvider.GOOGLE);
                    }
                    userRepository.save(user);
                } else {
                    // 3. Create a brand new Google user
                    user = new User();
                    user.setEmail(email);
                    user.setUsername(name != null ? name : email.split("@")[0]);
                    user.setGoogleId(googleId);
                    user.setProfilePicture(pictureUrl);
                    user.setAuthProvider(User.AuthProvider.GOOGLE);
                    // Set a random placeholder password (DB column may still have NOT NULL constraint)
                    user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
                    userRepository.save(user);
                }
            } else {
                // Update profile picture on each login (it may change)
                user.setProfilePicture(pictureUrl);
                userRepository.save(user);
            }

            // Build success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Google authentication successful!");
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("profilePicture", user.getProfilePicture());
            response.put("authProvider", user.getAuthProvider().name());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Google authentication failed: " + e.getMessage()));
        }
    }
}
