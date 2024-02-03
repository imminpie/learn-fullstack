package com.jiraynor.boardback.dto.request.auth;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignUpRequestDto {

    @NotBlank // 빈 문자열이나 null 이 아닌지를 검증
    @Email    // 이메일 형식 검증
    private String email;

    @NotBlank
    @Size(min = 8, max = 20) // 문자열 길이 제한
    private String password;

    @NotBlank
    private String nickname;

    @NotBlank
    @Pattern(regexp = "^[0-9]{11,13}$") // 11자 또는 13자의 숫자만 허용
    private String telNumber;

    @NotBlank
    private String address;

    private String addressDetail;

    @NotNull    // null 인지 아닌지를 검증
    @AssertTrue // 값이 true 일 때만 유효성 검사를 통과
    private Boolean agreedPersonal;

}
