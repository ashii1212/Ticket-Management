package com.edumerge.support.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;

@RestController
@RequestMapping("/api/sla-policies")
public class SlaPolicyController {
    @GetMapping
    public ResponseEntity<?> getSlaPolicies() {
        return ResponseEntity.ok(Collections.emptyList());
    }
}
