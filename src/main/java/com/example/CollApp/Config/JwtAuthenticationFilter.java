package com.example.CollApp.Config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Value("Authorization")
    private String HEADER_STRING;

    @Value("Bearer")
    private String TOKEN_PREFIX;

    private final UserDetailsService userDetailsService;
    private final UnauthorizedEntryPoint unauthorizedEntryPoint;
    private final JwtTokenProvider tokenProvider;

    public JwtAuthenticationFilter(UserDetailsService userDetailsService, JwtTokenProvider tokenProvider, UnauthorizedEntryPoint unauthorizedEntryPoint) {
        this.userDetailsService = userDetailsService;
        this.tokenProvider = tokenProvider;
        this.unauthorizedEntryPoint = unauthorizedEntryPoint;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader(HEADER_STRING);
        String username = null;
        String authToken = null;
        if (header != null && header.startsWith(TOKEN_PREFIX)) {
            authToken = header.replace(TOKEN_PREFIX, "").trim();
            try {
                username = tokenProvider.getUsernameFromToken(authToken);
            } catch (IllegalArgumentException e) {
                logger.error("An error occurred while trying to retrieve the username from token", e);
            } catch (ExpiredJwtException e) {
                logger.warn("The token is expired", e);
                unauthorizedEntryPoint.commence(request, response, null);
            } catch (SignatureException e) {
                logger.error("Authentication failed", e);
            }
        }
        else{
            logger.warn("Authorization header not found");
        }
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            try{
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if(tokenProvider.validateToken(authToken,userDetails)){
                    UsernamePasswordAuthenticationToken authentication = tokenProvider.getAuthenticationToken
                            (authToken,SecurityContextHolder.getContext().getAuthentication(), userDetails);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
            catch(Exception e){
                logger.error("An error occurred while trying to authenticate user", e);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            }
        }
        filterChain.doFilter(request, response);
    }

}
