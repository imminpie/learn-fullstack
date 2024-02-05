package com.jiraynor.boardback.service;

import com.jiraynor.boardback.dto.request.board.PostBoardRequestDto;
import com.jiraynor.boardback.dto.response.board.PostBoardResponseDto;
import org.springframework.http.ResponseEntity;

public interface BoardService {

    ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email);
}
