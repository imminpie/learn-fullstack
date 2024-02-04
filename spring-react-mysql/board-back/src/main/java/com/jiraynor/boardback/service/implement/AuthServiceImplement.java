package com.jiraynor.boardback.service.implement;

import com.jiraynor.boardback.dto.request.auth.SignInRequestDto;
import com.jiraynor.boardback.dto.request.auth.SignUpRequestDto;
import com.jiraynor.boardback.dto.response.ResponseDto;
import com.jiraynor.boardback.dto.response.auth.SignInResponseDto;
import com.jiraynor.boardback.dto.response.auth.SignUpResponseDto;
import com.jiraynor.boardback.entity.UserEntity;
import com.jiraynor.boardback.provider.JwtProvider;
import com.jiraynor.boardback.repository.UserRepository;
import com.jiraynor.boardback.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService {

    // 의존성 주입
    private final UserRepository userRepository;

    private final JwtProvider jwtProvider;

    /**
     * PasswordEncoder
     * 비밀번호를 안전하게 저장하고 검증하기 위한 인터페이스로, BCryptPasswordEncoder 구현체를 사용한다.
     * 여기서는 의존성 주입을 하지 않고, BCryptPasswordEncoder 객체를 생성하여 필드에 할당한다.
     */
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {
        try {
            // 중복 검사
            String email = dto.getEmail();
            boolean existedEmail = userRepository.existsByEmail(email);
            if (existedEmail) return SignUpResponseDto.duplicateEmail();

            String nickname = dto.getNickname();
            boolean existedNickname = userRepository.existsByNickname(nickname);
            if (existedNickname) return SignUpResponseDto.duplicateNickname();

            String telNumber = dto.getTelNumber();
            boolean existedTelNumber = userRepository.existsByTelNumber(telNumber);
            if (existedTelNumber) return SignUpResponseDto.duplicateTelNumber();

            // 비밀번호 암호화
            String password = dto.getPassword();
            String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword); // 암호화된 비밀번호로 재설정

            // DTO → Entity
            UserEntity userEntity = new UserEntity(dto);
            userRepository.save(userEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
        return SignUpResponseDto.success();
    }

    @Override
    public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {

        String token = null;

        try {
            String email = dto.getEmail();
            UserEntity userEntity = userRepository.findByEmail(email);

            String password = dto.getPassword(); // 사용자가 입력한 비밀번호
            String encodedPassword = userEntity.getPassword();  // 데이터베이스에 저장된 비밀번호
            boolean isMatched = passwordEncoder.matches(password, encodedPassword);
            if (!isMatched) return SignInResponseDto.signInFailed();

            // 사용자 이메일로 JWT 토큰 생성
            token = jwtProvider.create(email);

        } catch (Exception e) {
            e.printStackTrace();
            ResponseDto.databaseError();
        }

        // 생성된 토큰을 가지고 성공 응답을 반환
        return SignInResponseDto.success(token);
    }

}
