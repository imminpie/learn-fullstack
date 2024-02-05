package com.jiraynor.boardback.controller;

import com.jiraynor.boardback.dto.request.board.PostBoardRequestDto;
import com.jiraynor.boardback.dto.response.board.PostBoardResponseDto;
import com.jiraynor.boardback.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    /**
     * @Valid : 입력 값의 유효성 검사
     * PostBoardRequestDto 클래스에 정의된 제약 조건에 위배되는 경우 예외를 발생시킨다.
     */

    /**
     * @AuthenticationPrincipal
     * 스프링 시큐리티에서 제공하는 어노테이션으로, 현재 로그인된 사용자의 정보를 가져올 수 있다.
     * JwtAuthenticationFilter 클래스의 authenticationToken 에 저장된 정보를 읽는다.
     */
    @PostMapping("")
    public ResponseEntity<? super PostBoardResponseDto> postBoard(
            @RequestBody @Valid PostBoardRequestDto requestDto,
            @AuthenticationPrincipal String email) {

        System.out.println(111111);
        System.out.println("requestDto = " + requestDto + ", email = " + email);
        ResponseEntity<? super PostBoardResponseDto> response = boardService.postBoard(requestDto, email);
        return response;
    }

}
