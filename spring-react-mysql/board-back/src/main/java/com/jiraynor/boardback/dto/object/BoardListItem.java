package com.jiraynor.boardback.dto.object;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor  // 기본 생성자 생성
@AllArgsConstructor // 모든 필드를 포함한 생성자 생성
public class BoardListItem {

    private int boardNumber;
    private String title;
    private String content;
    private String boardTitleImage;
    private int favoriteCount;
    private int commentCount;
    private int viewCount;
    private String writeDatetime;
    private String writerNickName;
    private String writerProfileImage;

}
