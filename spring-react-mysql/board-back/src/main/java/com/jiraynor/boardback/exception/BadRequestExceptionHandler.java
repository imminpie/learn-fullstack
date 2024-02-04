package com.jiraynor.boardback.exception;

import com.jiraynor.boardback.dto.response.ResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * @RestControllerAdvice
 * 공통으로 사용하는 예외 처리 로직이 필요할 때 사용한다.
 * 여기서는 MethodArgumentNotValidException 과 HttpMessageNotReadableException 예외 처리를 담당한다.
 */
@RestControllerAdvice
public class BadRequestExceptionHandler {

    /**
     * @ExceptionHandler
     * MethodArgumentNotValidException: @Valid 어노테이션을 사용할 때, 유효성 검사를 통과하지 못하면 이 예외가 발생
     * HttpMessageNotReadableException: HTTP 메시지 변환 과정에서 문제가 발생할 때 이 예외가 발생
     */

    @ExceptionHandler({MethodArgumentNotValidException.class, HttpMessageNotReadableException.class})
    public ResponseEntity<ResponseDto> validationExceptionHandler(Exception exception) {
        /**
         * MethodArgumentNotValidException 또는 HttpMessageNotReadableException 예외가 발생하면,
         * validationFailed() 메서드를 호출해서 예외를 던진다.
         */
        return ResponseDto.validationFailed();
    }
}
