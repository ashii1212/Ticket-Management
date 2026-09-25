package com.edumerge.support.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="staff_profiles")
@Getter
@Setter
public class StaffProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    private User user;
    private String department;
    private String designation;
    private String contactNumber;
    private boolean active = true;
}
