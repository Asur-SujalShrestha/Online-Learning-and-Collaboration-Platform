package com.example.CollApp.DTO;

import lombok.*;



public class ResponseDTO {
    private String role;
    private String token;

    // Private Constructor for Builder
    private ResponseDTO(Builder builder) {
        this.role = builder.role;
        this.token = builder.token;
    }
    public static class Builder {
        private String role;
        private String token;

        public Builder() {}

        public Builder role(String role) {
            this.role = role;
            return this;
        }

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public ResponseDTO build() {
            return new ResponseDTO(this);
        }
    }
    public ResponseDTO(String role, String token) {
        this.role = role;
        this.token = token;
    }

    public ResponseDTO() {
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
    public static Builder builder() {
        return new Builder();
    }
}
