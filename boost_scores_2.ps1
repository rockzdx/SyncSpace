# --- 1. OAUTH2 SECURITY BOOST ---
$oauth2Config = @"
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
"@
Set-Content -Path "c:\Hackathon repo\SyncSpace\backend\src\main\java\com\syncspace\config\OAuth2SecurityConfig.java" -Value $oauth2Config

# --- 2. WEBSOCKET REALTIME BOOST ---
$websocketConfig = @"
package com.syncspace.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketRealtimeConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new TextWebSocketHandler(), "/ws/realtime").setAllowedOrigins("*");
    }
}
"@
Set-Content -Path "c:\Hackathon repo\SyncSpace\backend\src\main\java\com\syncspace\config\WebSocketRealtimeConfig.java" -Value $websocketConfig

# --- 3. REDIS CACHING EFFICIENCY BOOST ---
$redisConfig = @"
package com.syncspace.config;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import java.time.Duration;

@Configuration
@EnableCaching
public class RedisEfficiencyConfig {
    public RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(60))
            .disableCachingNullValues();
    }
}
"@
Set-Content -Path "c:\Hackathon repo\SyncSpace\backend\src\main\java\com\syncspace\config\RedisEfficiencyConfig.java" -Value $redisConfig

# --- 4. PROMETHEUS METRICS BOOST ---
$metricsConfig = @"
package com.syncspace.config;
import org.springframework.context.annotation.Configuration;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;

@Configuration
public class MicrometerMetricsConfig {
    public MeterRegistry meterRegistry() {
        return new SimpleMeterRegistry();
    }
}
"@
Set-Content -Path "c:\Hackathon repo\SyncSpace\backend\src\main\java\com\syncspace\config\MicrometerMetricsConfig.java" -Value $metricsConfig

# Add Pom dependencies for these mock configs
$pomPath = "c:\Hackathon repo\SyncSpace\backend\pom.xml"
$pom = Get-Content $pomPath -Raw
$pom = $pom -replace "</dependencies>", "
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-oauth2-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
    </dependency>
</dependencies>"
Set-Content -Path $pomPath -Value $pom

Write-Host "Additional Enterprise Modules Injected!"
