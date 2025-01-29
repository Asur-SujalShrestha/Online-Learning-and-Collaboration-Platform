package com.example.CollApp.Config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AssignmentFileConfiguration {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "df9rujz7c",
                "api_key", "645716118854351",
                "api_secret", "PlXBrlZhvFhNkqm1wkvK1tny24c"
        ));
    }
}
