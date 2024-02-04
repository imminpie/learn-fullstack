package com.jiraynor.boardback.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignInRequestDto {

    @NotBlank   // 빈 문자열이나 null 이 아닌지를 검증
    private String email;

    @NotBlank
    private String password;

}
