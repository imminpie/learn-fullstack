package com.jiraynor.boardback.dto.request.board;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PostBoardRequestDto {

    @NotBlank // 빈 문자열이나 null 이 아닌지를 검증
    private String title;

    @NotBlank
    private String content;

    @NotNull // null 인지 아닌지를 검증
    private List<String> boardImageList;
}
