package com.edumerge.support.controller;

import com.edumerge.support.dto.request.CommentCreateRequest;
import com.edumerge.support.dto.response.CommentResponse;
import com.edumerge.support.security.UserDetailsImpl;
import com.edumerge.support.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long ticketId,
                                                      @Valid @RequestBody CommentCreateRequest request,
                                                      @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(ticketService.addComment(ticketId, request, user.getUser().getId(), user.getUser().getRole()));
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long ticketId,
                                                             @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(ticketService.getComments(ticketId, user.getUser().getId(), user.getUser().getRole()));
    }
}
