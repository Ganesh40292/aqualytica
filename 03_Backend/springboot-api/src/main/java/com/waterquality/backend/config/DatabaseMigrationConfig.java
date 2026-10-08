package com.waterquality.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class DatabaseMigrationConfig {

    @Bean
    public CommandLineRunner migrateDatabase(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                log.info("Running schema migration to ensure nitrate and chloride columns are dropped from sensor_data...");
                jdbcTemplate.execute("ALTER TABLE sensor_data DROP COLUMN IF EXISTS nitrate;");
                jdbcTemplate.execute("ALTER TABLE sensor_data DROP COLUMN IF EXISTS chloride;");
                log.info("Database migration finished successfully. sensor_data now strictly adheres to 5 parameters.");
            } catch (Exception e) {
                log.warn("Database migration notification: {}", e.getMessage());
            }
        };
    }
}
