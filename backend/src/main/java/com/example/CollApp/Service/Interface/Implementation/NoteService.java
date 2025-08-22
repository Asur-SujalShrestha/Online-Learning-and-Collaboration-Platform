package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.NoteDTO;
import com.example.CollApp.Model.Notes;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.NoteRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.INoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService implements INoteService {
    private final UserRepository userRepository;
    private final NoteRepository noteRepository;

    public NoteService(UserRepository userRepository, NoteRepository noteRepository) {
        this.userRepository = userRepository;
        this.noteRepository = noteRepository;
    }

    @Override
    public ResponseEntity<String> addNote(NoteDTO noteDTO) {
        Users user = userRepository.findById(noteDTO.getUserId()).orElseThrow(()->new RuntimeException("User not found"));
        Notes notes = Notes.builder()
                .title(noteDTO.getTitle())
                .date(noteDTO.getDate())
                .note(noteDTO.getNote())
                .user(user)
                .build();
        noteRepository.save(notes);
        return ResponseEntity.ok("Note added successfully");
    }

    @Override
    public ResponseEntity<String> updateNote(long noteId, NoteDTO noteDTO) {
        Notes notes = noteRepository.findById(noteId).orElseThrow(()->new RuntimeException("Note not found"));
        notes.setTitle(noteDTO.getTitle());
        notes.setDate(noteDTO.getDate());
        notes.setNote(noteDTO.getNote());
        noteRepository.save(notes);
        return ResponseEntity.ok("Note updated successfully");
    }

    @Override
    public ResponseEntity<List<Notes>> getNotes(long userId) {
        Users user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found"));
        return new ResponseEntity<>(noteRepository.findByUser(user), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> deleteNote(long noteId) {
        Notes notes = noteRepository.findById(noteId).orElseThrow(()->new RuntimeException("Note not found"));
        noteRepository.delete(notes);
        return ResponseEntity.ok("Note deleted successfully");
    }
}
