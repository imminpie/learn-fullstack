package com.jiraynor.boardback.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "user")
@Table(name = "user")
public class UserEntity {

    @Id
    private String email;

    @Column
    private String password;

    @Column
    private String nickname;

    @Column
    private String telNumber;

    @Column
    private String address;

    @Column
    private String addressDetail;

    @Column
    private String profileImage;

    @Column
    private boolean agreedPersonal;

}
