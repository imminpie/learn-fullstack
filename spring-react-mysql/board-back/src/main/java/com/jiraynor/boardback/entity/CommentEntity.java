package com.jiraynor.boardback.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "comment")
@Table(name = "comment")
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int commentNumber;

    @Column
    private String content;

    @Column
    private String writeDatetime;

    @Column
    private String userEmail;

    @Column
    private int boardNumber;
}
