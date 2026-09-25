package com.edumerge.support.mapper;

import com.edumerge.support.dto.response.CommentResponse;
import com.edumerge.support.entity.TicketComment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    @Mapping(target = "authorName", source = "author.name")
    CommentResponse toResponse(TicketComment comment);
}
