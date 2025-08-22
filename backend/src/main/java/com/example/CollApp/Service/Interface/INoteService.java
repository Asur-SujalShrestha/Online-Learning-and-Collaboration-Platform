package com.example.CollApp.Service.Interface;


import com.example.CollApp.DTO.NoteDTO;
import com.example.CollApp.Model.Notes;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface INoteService {
    ResponseEntity<String> addNote(NoteDTO noteDTO);

    ResponseEntity<String> updateNote(long noteId, NoteDTO noteDTO);

    ResponseEntity<List<Notes>> getNotes(long userId);

    ResponseEntity<String> deleteNote(long noteId);
}
