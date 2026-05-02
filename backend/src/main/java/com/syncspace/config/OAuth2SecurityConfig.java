package com.syncspace.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
@EnableWebSecurity
public class OAuth2SecurityConfig {
    public void configure(HttpSecurity http) throws Exception {
        http.oauth2Login()
            .and()
            .oauth2Client()
            .and()
            .oauth2ResourceServer().jwt();
    }
}
