package com.example.CollApp.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroupMemberDTO {
    private long groupId;
    private long userId;
    private String role;
}
