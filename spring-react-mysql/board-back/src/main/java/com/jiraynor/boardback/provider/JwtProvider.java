package com.jiraynor.boardback.provider;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtProvider {

    // 비밀키
    @Value("${secret-key}")
    private String secretKey;

    // JWT 토큰 생성
    public String create(String email) {
        // JWT 토큰 만료 시간 설정 (현재 시간으로부터 1시간 뒤 만료)
        Date expiredDate = Date.from(Instant.now().plus(1, ChronoUnit.HOURS));

        // 제공된 비밀 키를 사용하여 새로운 암호화된 키를 생성
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

        // JWT 토큰 생성 정보 설정
        String jwt = Jwts
                .builder()
                .setSubject(email) // 토큰 주제 설정
                .setIssuedAt(new Date()) // 토큰 발급 시간 설정
                .setExpiration(expiredDate) // 토큰 만료 시간 설정
                .signWith(key, SignatureAlgorithm.HS256) // SHA-256 알고리즘으로 토큰 서명
                .compact();
        return jwt;
    }

    // JWT 토큰 유효성 검증
    public String validate(String jwt) {
        Claims claims = null;
        // 제공된 비밀 키를 사용하여 새로운 암호화된 키를 생성
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

        try {
            claims = Jwts
                    .parserBuilder() // JWT 분석 시작
                    .setSigningKey(key) // 서명 검증에 사용되는 키를 설정
                    .build()
                    .parseClaimsJws(jwt) // 주어진 토큰을 파싱하고 서명을 확인
                    .getBody(); // 토큰의 내용을 얻기
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        // 유효성 검사에 성공하면 JWT 토큰 주제를 반환 (이메일)
        return claims.getSubject();
    }
}
