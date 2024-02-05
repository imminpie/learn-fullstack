package com.jiraynor.boardback.controller;

import com.jiraynor.boardback.dto.response.user.GetSignInUserResponseDto;
import com.jiraynor.boardback.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * @AuthenticationPrincipal
     * 스프링 시큐리티에서 제공하는 어노테이션으로, 현재 로그인된 사용자의 정보를 가져올 수 있다.
     * JwtAuthenticationFilter 클래스의 authenticationToken 에 저장된 정보를 읽는다.
     */
    @GetMapping
    public ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(@AuthenticationPrincipal String email) {
        ResponseEntity<? super GetSignInUserResponseDto> response = userService.getSignInUser(email);
        return response;
    }
}
