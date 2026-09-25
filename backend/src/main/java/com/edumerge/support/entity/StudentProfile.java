package com.edumerge.support.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="student_profiles")
@Getter
@Setter
public class StudentProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    private User user;
    private String studentId;
    private String department;
    private String semester;
    private String contactNumber;
}
