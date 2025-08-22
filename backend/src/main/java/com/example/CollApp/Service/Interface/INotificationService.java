package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.NotificationDTO;
import com.example.CollApp.Model.Notifications;

import java.util.List;

public interface INotificationService {
    void addNotification(NotificationDTO notificationDTO);

    List<Notifications> getNoticeByUser(long userId);

    List<Notifications> getNotices();

    void deleteNotice(long notificationId);
}
