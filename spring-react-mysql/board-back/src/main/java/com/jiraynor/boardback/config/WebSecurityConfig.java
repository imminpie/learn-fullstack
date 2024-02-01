package com.jiraynor.boardback.config;

import com.jiraynor.boardback.filter.JwtAuthenticationFilter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    protected SecurityFilterChain configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                // CORS 설정
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // JWT 토큰을 사용하므로 CSRF 비활성화
                .csrf(CsrfConfigurer::disable)
                // JWT 토큰을 사용하므로 HTTP 기본 인증 비활성화
                .httpBasic(HttpBasicConfigurer::disable)
                // REST API 는 모두 STATELESS 특성을 가지므로 STATELESS 로 설정
                .sessionManagement(sessionManagement -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(request -> request
                        // 아래 경로에 대한 요청은 인증 없이 접근 가능
                        .requestMatchers("/", "/api/v1/auth/**", "/api/v1/search/**", "/file/**").permitAll()
                        // GET 메서드로 아래 경로에 대한 요청은 인증 없이 접근 가능
                        .requestMatchers(HttpMethod.GET, "/api/v1/board/**", "/api/v1/user/**").permitAll()
                        // 나머지 모든 요청은 사용자 인증이 필요
                        .anyRequest().authenticated())
                // 예외처리
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(new FailedAuthenticationEntryPoint())
                )
                // UsernamePasswordAuthenticationFilter 보다 jwtAuthenticationFilter 가 먼저 실행되도록 한다.
                // 사용자명과 비밀번호를 이용한 인증 이전에 JWT 를 사용한 인증을 먼저 처리하게 된다.
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    // AuthenticationEntryPoint 스프링 시큐리티 인터페이스를 구현한 클래스
    // 사용자가 로그인되지 않았을 때 발생하는 인증 예외에 대한 처리 방법을 설정
    class FailedAuthenticationEntryPoint implements AuthenticationEntryPoint {
        @Override
        public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"code:\": \"AF\", \"message\": \"Authorization Failed.\"}");
        }
    }

    @Bean
    // CORS 설정
    protected CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("*"); // 모든 Origin 을 허용
        configuration.addAllowedMethod("*"); // 모든 HTTP 메서드를 허용
        configuration.addAllowedHeader("*"); // 모든 헤더를 하용

        // 모든 경로에 대해 CORS 설정을 적용
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}