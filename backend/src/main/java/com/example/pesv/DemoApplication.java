package com.example.pesv;

import com.example.pesv.model.User;
import com.example.pesv.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    CommandLineRunner seed(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new User("Usuario Demo", "user@example.com", "ROLE_USER"));
                userRepository.save(new User("Admin Demo", "admin@example.com", "ROLE_ADMIN"));
            }
        };
    }
}
