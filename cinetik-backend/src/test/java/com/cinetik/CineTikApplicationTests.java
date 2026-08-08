package com.cinetik;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration"
})
class CineTikApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring ApplicationContext initializes properly
    }
}
