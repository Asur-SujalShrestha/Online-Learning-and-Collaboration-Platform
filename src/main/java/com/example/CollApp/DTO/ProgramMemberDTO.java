package com.example.CollApp.DTO;

public class ProgramMemberDTO {
    private long userId;
    private long programId;
    private String role;

    public ProgramMemberDTO() {
    }

    public ProgramMemberDTO(long userId, long programId, String role) {
        this.userId = userId;
        this.programId = programId;
        this.role = role;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getProgramId() {
        return programId;
    }

    public void setProgramId(long programId) {
        this.programId = programId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
