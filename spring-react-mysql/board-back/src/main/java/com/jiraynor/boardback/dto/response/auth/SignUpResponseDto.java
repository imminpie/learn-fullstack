package com.jiraynor.boardback.dto.response.auth;

import com.jiraynor.boardback.common.ResponseCode;
import com.jiraynor.boardback.common.ResponseMessage;
import com.jiraynor.boardback.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class SignUpResponseDto extends ResponseDto {

    /**
     * 부모 클래스에 명시적으로 정의되어 있는 매개변수 생성자가 있다면
     * 자식 클래스에서 super() 를 사용해서 부모 클래스의 매개변수 생성자를 직접 호출해야 한다.
     */
    public SignUpResponseDto() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<SignUpResponseDto> success() {
        SignUpResponseDto result = new SignUpResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> duplicateEmail() {
        ResponseDto result = new ResponseDto(ResponseCode.DUPLICATE_EMAIL, ResponseMessage.DUPLICATE_EMAIL);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    public static ResponseEntity<ResponseDto> duplicateNickname() {
        ResponseDto result = new ResponseDto(ResponseCode.DUPLICATE_NICKNAME, ResponseMessage.DUPLICATE_NICKNAME);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    public static ResponseEntity<ResponseDto> duplicateTelNumber() {
        ResponseDto result = new ResponseDto(ResponseCode.DUPLICATE_TEL_NUMBER, ResponseMessage.DUPLICATE_TEL_NUMBER);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

}
