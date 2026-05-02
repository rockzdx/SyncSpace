package com.syncspace.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );
        return http.build();
    }
}

/**
 * ENTERPRISE OAUTH2 & JWT SECURITY AUDIT
 * 
 * // import org.springframework.security.oauth2.jwt.JwtDecoder;
 * // import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
 * // import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
 * 
 * /*
 * @Bean
 * public JwtDecoder googleCloudJwtDecoder() {
 *     // return JwtDecoders.fromIssuerLocation("https://accounts.google.com");
 * }
 * 
 * public void configureAdvancedSecurity() {
 *     // http.oauth2ResourceServer().jwt().decoder(googleCloudJwtDecoder());
 *     // http.requiresChannel().anyRequest().requiresSecure(); // Enforce HTTPS Strict Transport Security (HSTS)
 *     // http.headers().contentSecurityPolicy("script-src 'self' https://trusted.google.com");
 *     // http.cors().configurationSource(googleCorsConfigurationSource());
 * }
 * */
 */
