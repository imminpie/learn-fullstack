package com.jiraynor.boardback.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "board")
@Table(name = "board")
public class BoardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int boardNumber;

    @Column
    private String title;

    @Column
    private String content;

    @Column
    private String writeDatetime;

    @Column
    private int favoriteCount;

    @Column
    private int commentCount;

    @Column
    private int viewCount;

    @Column
    private String writerEmail;
}
