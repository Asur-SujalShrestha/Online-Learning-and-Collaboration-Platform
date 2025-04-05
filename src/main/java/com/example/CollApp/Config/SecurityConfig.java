package com.example.CollApp.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    private final UnauthorizedEntryPoint unauthorizedEntryPoint;
    private final UserDetailsService userDetailsService;
    private final JwtTokenProvider jwtTokenProvider;

    public SecurityConfig(UnauthorizedEntryPoint unauthorizedEntryPoint, UserDetailsService userDetailsService, JwtTokenProvider jwtTokenProvider) {
        this.unauthorizedEntryPoint = unauthorizedEntryPoint;
        this.userDetailsService = userDetailsService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Bean
    public SecurityFilterChain SecurityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf((AbstractHttpConfigurer::disable))
                .cors(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth->{
                        auth.requestMatchers("/collapp/users/register", "/collapp/users/login", "/collapp/auth/**", "/collapp/posts/**", "/collapp/post-like/**", "/collapp/post-comment/**"
                                ,"/collapp/program/**", "/collapp/program-member/**", "/collapp/group/**", "/collapp/group-member/**",
                                        "/collapp/assignment/**","/collapp/users/all-user", "/collapp/submitted-assignment/**", "/collapp/teacher-content/**",
                                        "/ws/**", "/collapp/get-messages", "/collapp/note/**", "/collapp/upload-image", "/collapp/get-group-messages/**",
                                        "/collapp/get-program-messages/**","/collapp/planning/**", "/api/**", "/api/room-list", "/video-chat/**", "/api/rooms/**", "/**").permitAll()
                                .anyRequest().authenticated();})
                .exceptionHandling((ex)->ex.authenticationEntryPoint(unauthorizedEntryPoint))
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(authenticationTokenFilterBean(), UsernamePasswordAuthenticationFilter.class).build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public JwtAuthenticationFilter authenticationTokenFilterBean(){
        return new JwtAuthenticationFilter(userDetailsService,jwtTokenProvider,unauthorizedEntryPoint);
    }


}
