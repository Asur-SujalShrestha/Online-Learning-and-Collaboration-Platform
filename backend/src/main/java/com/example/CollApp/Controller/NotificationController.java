package com.example.CollApp.Controller;

import com.example.CollApp.DTO.NotificationDTO;
import com.example.CollApp.Model.Notifications;
import com.example.CollApp.Service.Interface.INotificationService;
import com.example.CollApp.Service.Interface.Implementation.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collapp/notification")
@CrossOrigin
public class NotificationController {
    private final INotificationService notificationService;

    public NotificationController(INotificationService notificationService) {
        this.notificationService = notificationService;
    }

    //https://192.168.101.6:8081/collapp/notification/add-notice
    @PostMapping("/add-notice")
    public ResponseEntity<String> addNotice(@RequestBody NotificationDTO notificationDTO) {
        notificationService.addNotification(notificationDTO);
        return ResponseEntity.ok("Notice Added Successfully");
    }

    @GetMapping("/get-notice/{userId}")
    public ResponseEntity<List<Notifications>> getNoticeByUserId(@PathVariable("userId") long userId) {
        List<Notifications> notificationsList = notificationService.getNoticeByUser(userId);
        return ResponseEntity.ok(notificationsList);
    }
    @GetMapping("/get-notice")
    public ResponseEntity<List<Notifications>> getNotice() {
        return ResponseEntity.ok(notificationService.getNotices());
    }
    @DeleteMapping("/delete-notice/{notificationId}")
    public ResponseEntity<String> deleteNotice(@PathVariable("notificationId") long notificationId) {
        notificationService.deleteNotice(notificationId);
        return ResponseEntity.ok("Notice Deleted Successfully");
    }
}
