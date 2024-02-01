package com.jiraynor.boardback.dto.object;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor  // 기본 생성자 생성
@AllArgsConstructor // 모든 필드를 포함한 생성자 생성
public class CommentListItem {

    private String nickname;
    private String profileImage;
    private String writeDatetime;
    private String content;

}
