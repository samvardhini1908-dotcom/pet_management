package com.example.demo.security;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {

    @Value("${petpulse.jwt.secret}")
    private String jwtSecret;

    @Value("${petpulse.jwt.expiration}")
    private int jwtExpirationMs;

    public JwtUtils() {
    }

    public String generateJwtToken(Authentication authentication) {

        UserDetails userPrincipal =
                (UserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtExpirationMs))
                .signWith(
                        Keys.hmacShaKeyFor(jwtSecret.getBytes()),
                        SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {

        Claims claims =
                Jwts.parserBuilder()
                        .setSigningKey(
                                Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

        return claims.getSubject();
    }

    public boolean validateJwtToken(String authToken) {

        try {

            Jwts.parserBuilder()
                    .setSigningKey(
                            Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                    .build()
                    .parseClaimsJws(authToken);

            return true;

        } catch (JwtException | IllegalArgumentException e) {

            return false;
        }
    }

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
}