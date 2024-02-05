package com.jiraynor.boardback.service.implement;

import com.jiraynor.boardback.dto.response.ResponseDto;
import com.jiraynor.boardback.dto.response.user.GetSignInUserResponseDto;
import com.jiraynor.boardback.entity.UserEntity;
import com.jiraynor.boardback.repository.UserRepository;
import com.jiraynor.boardback.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImplement implements UserService {

    private final UserRepository userRepository;

    @Override
    public ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email) {

        UserEntity userEntity = null;

        try {
            userEntity = userRepository.findByEmail(email);
            if (userEntity == null) GetSignInUserResponseDto.notExistUser();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetSignInUserResponseDto.success(userEntity);
    }
}
