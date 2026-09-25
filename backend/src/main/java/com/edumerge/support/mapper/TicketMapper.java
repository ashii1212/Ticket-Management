package com.edumerge.support.mapper;

import com.edumerge.support.dto.response.TicketResponse;
import com.edumerge.support.dto.response.TicketSummaryResponse;
import com.edumerge.support.entity.Ticket;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TicketMapper {
    @Mapping(target = "studentName", source = "student.name")
    @Mapping(target = "studentId", source = "student.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "assignedStaffName", source = "assignedStaff.name")
    @Mapping(target = "assignedStaffId", source = "assignedStaff.id")
    @Mapping(target = "slaStatus", ignore = true)
    TicketResponse toResponse(Ticket ticket);

    @Mapping(target = "studentName", source = "student.name")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "assignedStaffName", source = "assignedStaff.name")
    @Mapping(target = "slaStatus", ignore = true)
    TicketSummaryResponse toSummaryResponse(Ticket ticket);
}
