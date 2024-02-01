package com.jiraynor.boardback.filter;

import com.jiraynor.boardback.provider.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
// 클라이언트의 요청이 컨트롤러로 전달되는 과정에서 필터는 일종의 중간 단계로 작동한다.
// 클라이언트가 요청을 보내면 필터를 거쳐 컨트롤러로 전달되는 것이다.
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        try {
            // HTTP 요청 헤더에서 Bearer 토큰 추출
            String token = parseBearerToken(request);

            // 토큰이 없으면 다음 필터로 이동
            if (token == null) {
                filterChain.doFilter(request, response);
                return;
            }

            // JWT 유효성 검사를 통해 토큰 주제 추출 (이메일)
            String email = jwtProvider.validate(token);

            // 유효한 토큰이 아니면 다음 필터로 이동
            if (email == null) {
                filterChain.doFilter(request, response);
                return;
            }

            // 스프링 시큐리티에 사용자 인증 정보를 등록
            AbstractAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, null, AuthorityUtils.NO_AUTHORITIES); // 아이디, 비밀번호, 권한
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authenticationToken);

            // SecurityContextHolder 를 사용하여 외부에서 사용자 인증 정보를 참조할 수 있도록 함
            // @AuthenticationPrincipal 을 통해 현재 사용자의 인증 정보를 가져올 수 있게 된다.
            SecurityContextHolder.setContext(securityContext);
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 모든 처리가 끝난 후, 다음 필터로 요청 전달
        filterChain.doFilter(request, response);
    }

    // Authorization 헤더에서 Bearer 토큰을 추출하는 메서드
    private String parseBearerToken(HttpServletRequest request) {

        // Authorization 헤더에서 토큰 추출
        String authorization = request.getHeader("Authorization");

        // Authorization 헤더의 값이 존재하는지 확인
        boolean hasAuthorization = StringUtils.hasText(authorization);
        if (!hasAuthorization) return null;

        // Authorization 헤더의 값이 'Bearer' 로 시작하는지 확인
        boolean isBearer = authorization.startsWith("Bearer ");
        if (!isBearer) return null;

        String token = authorization.substring(7);
        return token;
    }
}
