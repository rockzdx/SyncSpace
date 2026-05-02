package com.syncspace.config;
import org.springframework.stereotype.Component;
import java.util.Date;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {
    private String secret = "super-secret-enterprise-key-for-syncspace-platform";
    public String generateToken(String username) {
        return Jwts.builder().setSubject(username).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(SignatureAlgorithm.HS256, secret).compact();
    }
}
