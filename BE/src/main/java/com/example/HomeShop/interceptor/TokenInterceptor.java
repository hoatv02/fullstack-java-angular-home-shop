package com.example.HomeShop.interceptor;

import com.example.HomeShop.exception.AppException;
import com.example.HomeShop.exception.UserErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

@Component
public class TokenInterceptor implements HandlerInterceptor {
    @Value("${jwt.secret}")
    private String secretKey;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        // Lấy token từ header
        String authHeader = request.getHeader("Authorization");

        // Nếu không có token hoặc không đúng format -> throw exception
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AppException(UserErrorCode.UNAUTHENTICATED);
        }

        String token = authHeader.substring(7);

        try {
            // Validate token
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Lưu thông tin user vào request attribute để dùng trong controller
            String username = claims.getSubject();
            request.setAttribute("userId", claims.get("userId"));
            request.setAttribute("username", username);

            // Set Spring Security authentication context
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, null,
                    new ArrayList<>());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            return true;
        } catch (Exception e) {
            throw new AppException(UserErrorCode.UNAUTHENTICATED);
        }
    }
}
