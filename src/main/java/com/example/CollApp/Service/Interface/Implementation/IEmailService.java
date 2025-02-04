package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.MailBody;

public interface IEmailService {
    public void sendSimpleMessage(MailBody mailBody);
}
