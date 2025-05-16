package com.chatwoot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AplicacionChatwoot {

	public static void main(String[] args) {
		SpringApplication.run(AplicacionChatwoot.class, args);
	}

}
