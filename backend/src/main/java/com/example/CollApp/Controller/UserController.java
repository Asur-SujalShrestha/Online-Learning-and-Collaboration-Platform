package com.example.CollApp.Controller;

import com.example.CollApp.DTO.LoginDTO;
import com.example.CollApp.DTO.RegisterDTO;
import com.example.CollApp.DTO.ResponseDTO;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Service.Interface.IUserService;
import com.example.CollApp.Service.Interface.Implementation.AuthService;
import com.example.CollApp.Service.Interface.Implementation.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collapp/users")
@CrossOrigin
public class UserController {
    private final IUserService userService;
    private final AuthService authService;

    public UserController(IUserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterDTO request) {
        try {
            userService.registerUser(request);
            return ResponseEntity.ok("User registered successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginDTO request) {
        try {
            ResponseDTO user = authService.generateToken(request);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    //https://192.168.101.3:8081/collapp/users/all-user
    @GetMapping("/all-user")
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }

    //https://192.168.101.3:8081/collapp/users/get-user-by-organization/1
    @GetMapping("/get-user-by-organization/{organizationId}")
    public ResponseEntity<List<Users>> getUsersByOrganization(@PathVariable long organizationId) {
        List<Users> response = userService.getUserByOrganization(organizationId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-user-role/{userId}")
    public ResponseEntity<String> updateUserRole(@PathVariable long userId, @RequestBody String role) {
        userService.updateRole(userId, role);
        return ResponseEntity.ok("User's role updated successfully.");
    }

    //https://192.168.101.6:8081/collapp/users/get-user/7
    @GetMapping("/get-user/{userId}")
    public ResponseEntity<Users> getUser(@PathVariable long userId) {
        Users user = userService.getUser(userId);
        return ResponseEntity.ok(user);
    }
}
