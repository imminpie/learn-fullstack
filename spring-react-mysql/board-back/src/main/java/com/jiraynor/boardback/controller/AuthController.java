package com.jiraynor.boardback.controller;

import com.jiraynor.boardback.dto.request.auth.SignUpRequestDto;
import com.jiraynor.boardback.dto.response.auth.SignUpResponseDto;
import com.jiraynor.boardback.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/sign-up")
    public ResponseEntity<? super SignUpResponseDto> signup(@RequestBody @Valid SignUpRequestDto dto) {
        /**
         * @Valid : 입력 값의 유효성 검사
         * SignUpRequestDto 클래스에 정의된 제약 조건에 위배되는 경우 예외를 발생시킨다.
         */
        ResponseEntity<? super SignUpResponseDto> response = authService.signUp(dto);
        return response;
    }

}
