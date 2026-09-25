package com.edumerge.support.dto.request;

import com.edumerge.support.enums.CommentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentCreateRequest {
    @NotBlank
    private String content;
    @NotNull
    private CommentType type;
}
