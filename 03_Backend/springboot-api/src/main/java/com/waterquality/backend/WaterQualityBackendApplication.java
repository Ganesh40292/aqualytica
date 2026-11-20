package com.waterquality.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WaterQualityBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(WaterQualityBackendApplication.class, args);
	}

}
