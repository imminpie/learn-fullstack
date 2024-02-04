package com.jiraynor.boardback.service;

import com.jiraynor.boardback.dto.request.auth.SignInRequestDto;
import com.jiraynor.boardback.dto.request.auth.SignUpRequestDto;
import com.jiraynor.boardback.dto.response.auth.SignInResponseDto;
import com.jiraynor.boardback.dto.response.auth.SignUpResponseDto;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    // SignUpResponseDto 또는 SignUpResponseDto 의 부모 타입만 허용한다.
    ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);

    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);

}
