package com.cinetik;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CineTikApplication {

    public static void main(String[] args) {
        SpringApplication.run(CineTikApplication.class, args);
    }
}
