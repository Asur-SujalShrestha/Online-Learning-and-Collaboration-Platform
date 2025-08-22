package com.example.CollApp.DTO;

import lombok.Builder;

@Builder
public record MailBody(String to, String subject, String text, boolean isHtml) {
    public static MailBodyBuilder builder() {
        return new MailBodyBuilder();
    }

    public static class MailBodyBuilder {
        private String to;
        private String subject;
        private String text;
        private boolean isHtml;

        public MailBodyBuilder to(String to) {
            this.to = to;
            return this;
        }

        public MailBodyBuilder subject(String subject) {
            this.subject = subject;
            return this;
        }

        public MailBodyBuilder text(String text) {
            this.text = text;
            return this;
        }

        public MailBodyBuilder isHtml(boolean isHtml) {
            this.isHtml = isHtml;
            return this;
        }

        public MailBody build() {
            return new MailBody(to, subject, text, isHtml);
        }
    }
}
