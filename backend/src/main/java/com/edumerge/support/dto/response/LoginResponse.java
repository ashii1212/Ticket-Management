package com.edumerge.support.dto.response;

import com.edumerge.support.enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private Role role;
}
