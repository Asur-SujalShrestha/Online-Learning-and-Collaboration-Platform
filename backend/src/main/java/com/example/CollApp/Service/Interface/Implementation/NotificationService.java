package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.NotificationDTO;
import com.example.CollApp.Model.Notifications;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.NotificationRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.INotificationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService implements INotificationService {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public NotificationService(UserRepository userRepository, NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void addNotification(NotificationDTO notificationDTO) {
        Optional<Users> user = userRepository.findById(notificationDTO.getReceiverId());
            Notifications notification = Notifications.builder()
                    .title(notificationDTO.getTitle())
                    .description(notificationDTO.getDescription())
                    .date(LocalDateTime.now())
                    .user(user.orElse(null))
                    .build();
            notificationRepository.save(notification);

    }

    @Override
    public List<Notifications> getNoticeByUser(long userId) {
        Users user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
        return notificationRepository.findByUser(user);
    }

    @Override
    public List<Notifications> getNotices() {
        return notificationRepository.findAll();
    }

    @Override
    public void deleteNotice(long notificationId) {
        Notifications notification = notificationRepository.findById(notificationId).orElseThrow(()-> new RuntimeException("Notification not found"));
        notificationRepository.delete(notification);
    }
}
