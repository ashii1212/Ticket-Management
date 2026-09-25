package com.edumerge.support.controller;

import com.edumerge.support.dto.request.LoginRequest;
import com.edumerge.support.dto.response.LoginResponse;
import com.edumerge.support.security.JwtUtils;
import com.edumerge.support.security.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        String token = jwtUtils.generateToken(userDetails);

        LoginResponse res = LoginResponse.builder()
                .token(token)
                .id(userDetails.getUser().getId())
                .name(userDetails.getUser().getName())
                .email(userDetails.getUser().getEmail())
                .role(userDetails.getUser().getRole())
                .build();
        return ResponseEntity.ok(res);
    }
}
