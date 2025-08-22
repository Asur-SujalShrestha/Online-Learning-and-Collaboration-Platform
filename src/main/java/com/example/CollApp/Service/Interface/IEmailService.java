package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.MailBody;

public interface IEmailService {
    public void sendSimpleMessage(MailBody mailBody);
}
