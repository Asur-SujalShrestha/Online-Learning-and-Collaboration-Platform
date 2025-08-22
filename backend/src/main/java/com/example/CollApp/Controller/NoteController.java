package com.example.CollApp.Controller;

import com.example.CollApp.DTO.NoteDTO;
import com.example.CollApp.Model.Notes;
import com.example.CollApp.Service.Interface.Implementation.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collapp/note")
@CrossOrigin
public class NoteController {
    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping("/add-note")
    public ResponseEntity<String> addNewNote(@RequestBody NoteDTO noteDTO) {
        return noteService.addNote(noteDTO);
    }

    @PutMapping("/update-note/{noteId}")
    public ResponseEntity<String> updateNote(@PathVariable long noteId, @RequestBody NoteDTO noteDTO) {
        return noteService.updateNote(noteId, noteDTO);
    }

    @GetMapping("/get-note/{userId}")
    public ResponseEntity<List<Notes>> getNotes(@PathVariable long userId) {
        return noteService.getNotes(userId);
    }

    @DeleteMapping("/delete-note/{noteId}")
    public ResponseEntity<String> deleteNote(@PathVariable long noteId) {
        return noteService.deleteNote(noteId);
    }
}
