package com.edumerge.support.dto.response;

import com.edumerge.support.enums.CommentType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private String authorName;
    private CommentType type;
    private LocalDateTime createdAt;
}
