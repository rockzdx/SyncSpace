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
