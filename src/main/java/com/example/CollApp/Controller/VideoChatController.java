//package com.example.CollApp.Controller;
//
//import com.example.CollApp.DTO.SignalMessage;
//import com.example.CollApp.Model.VideoCall;
//import com.example.CollApp.Repository.VideoCallRepository;
//import com.example.CollApp.Service.Interface.Implementation.VideoCallService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//
//@RestController
//@CrossOrigin
//public class VideoChatController {
//
//    private final SimpMessagingTemplate messagingTemplate;
//    private final VideoCallService roomService;
//    private final VideoCallRepository videoCallRepository;
//
//    @Autowired
//    public VideoChatController(SimpMessagingTemplate messagingTemplate, VideoCallService roomService, VideoCallRepository videoCallRepository) {
//        this.messagingTemplate = messagingTemplate;
//        this.roomService = roomService;
//        this.videoCallRepository = videoCallRepository;
//    }
//
//    @MessageMapping("/signal")
//    public void processSignal(SignalMessage signal) {
//        // For peer-to-peer signals (offer, answer, ice)
//        if (signal.getTargetUserId() != null) {
//            messagingTemplate.convertAndSendToUser(
//                    signal.getTargetUserId(),
//                    "/topic/signal",
//                    signal
//            );
//        } else {
//            // Broadcast to room
//            messagingTemplate.convertAndSend(
//                    "/topic/room/" + signal.getRoomId(),
//                    signal
//            );
//        }
//    }
//
//    @MessageMapping("/join")
//    public void joinRoom(SignalMessage joinRequest) {
//        boolean joined = roomService.joinRoom(joinRequest.getRoomId(), joinRequest.getUserId());
//        if (joined) {
//            // Notify others
//            SignalMessage notification = new SignalMessage();
//            notification.setType("user-joined");
//            notification.setRoomId(joinRequest.getRoomId());
//            notification.setUserId(joinRequest.getUserId());
//
//            messagingTemplate.convertAndSend(
//                    "/topic/room/" + joinRequest.getRoomId(),
//                    notification
//            );
//        }
//    }
//
//    @MessageMapping("/leave")
//    public void leaveRoom(SignalMessage leaveRequest) {
//        boolean left = roomService.leaveRoom(leaveRequest.getRoomId(), leaveRequest.getUserId());
//        if (left) {
//            // Notify others
//            SignalMessage notification = new SignalMessage();
//            notification.setType("user-left");
//            notification.setRoomId(leaveRequest.getRoomId());
//            notification.setUserId(leaveRequest.getUserId());
//
//            messagingTemplate.convertAndSend(
//                    "/topic/room/" + leaveRequest.getRoomId(),
//                    notification
//            );
//        }
//    }
//
//    @PostMapping("/api/rooms")
//    public ResponseEntity<VideoCall> createRoom(@RequestBody Map<String, String> request) {
//        String roomName = request.get("name");
//        VideoCall room = roomService.createRoom(roomName);
//        return ResponseEntity.ok(room);
//    }
//
//    @GetMapping("/api/room-list")
//    public ResponseEntity<List<VideoCall>> getRoomList() {
//        return new ResponseEntity<>(videoCallRepository.findAll(), HttpStatus.OK);
//    }
//
//    @GetMapping("/api/rooms/{roomId}")
//    public ResponseEntity<VideoCall> getRoomInfo(@PathVariable String roomId) {
//        Optional<VideoCall> room = videoCallRepository.findByRoomId(roomId);
//        return room.map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.notFound().build());
//    }
//}
