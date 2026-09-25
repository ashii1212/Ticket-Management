package com.edumerge.support.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @GetMapping
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(Collections.emptyList());
    }
}
