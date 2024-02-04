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
@Entity(name = "board_list_view")
@Table(name = "board_list_view")
public class BoardListViewEntity {

    @Id
    private int boardNumber;

    @Column
    private String title;

    @Column
    private String content;

    @Column
    private String titleImage;

    @Column
    private int viewCount;

    @Column
    private int favoriteCount;

    @Column
    private int commentCount;

    @Column
    private String writeDatetime;

    @Column
    private String writerEmail;

    @Column
    private String writerNickname;

    @Column
    private String writerProfileImage;
}
