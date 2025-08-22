package com.example.CollApp.Service;

import com.example.CollApp.DTO.NoteDTO;
import com.example.CollApp.Model.Notes;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.NoteRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.Implementation.NoteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.sql.Date;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NoteServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private NoteRepository noteRepository;

    @InjectMocks private NoteService noteService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddNote_Success() {
        NoteDTO noteDTO = NoteDTO.builder()
                .title("Daily Plan")
                .note("Work on unit tests")
                .date(new Date(System.currentTimeMillis()))
                .userId(1L)
                .build();

        Users user = new Users();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        ResponseEntity<String> response = noteService.addNote(noteDTO);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Note added successfully", response.getBody());

        verify(noteRepository).save(any());
        System.out.println("✅ Note added response: " + response.getBody());
    }


    @Test
    void testAddNote_UserNotFound() {
        NoteDTO noteDTO = NoteDTO.builder()
                .title("Missing")
                .date(new Date(System.currentTimeMillis()))
                .userId(2L)
                .build();
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> noteService.addNote(noteDTO));

        assertEquals("User not found", ex.getMessage());
        System.out.println("❌ Add note failed: " + ex.getMessage());
    }

    @Test
    void testUpdateNote_Success() {
        Notes note = new Notes();
        note.setId(5L);
        note.setTitle("Old title");
        note.setNote("Old content");
        note.setDate(new Date(System.currentTimeMillis()));

        NoteDTO dto = NoteDTO.builder()
                .title("Updated")
                .note("Updated note")
                .date(new Date(System.currentTimeMillis()))
                .userId(1L) // required but not used in update
                .build();

        when(noteRepository.findById(5L)).thenReturn(Optional.of(note));

        ResponseEntity<String> response = noteService.updateNote(5L, dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Note updated successfully", response.getBody());
        assertEquals("Updated", note.getTitle());
        assertEquals("Updated note", note.getNote());
        verify(noteRepository).save(note);

        System.out.println("📝 Note updated: " + response.getBody());
    }


    @Test
    void testUpdateNote_NotFound() {
        NoteDTO dto = NoteDTO.builder()
                .title("Any")
                .note("Text")
                .date(new Date(System.currentTimeMillis()))
                .userId(1L)  // required, even though not used in update
                .build();

        when(noteRepository.findById(404L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> noteService.updateNote(404L, dto));

        assertEquals("Note not found", ex.getMessage());
        System.out.println("❌ Update failed: " + ex.getMessage());
    }


    @Test
    void testGetNotes_Success() {
        Users user = new Users(); user.setId(1L);
        List<Notes> notes = List.of(new Notes(), new Notes());

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(noteRepository.findByUser(user)).thenReturn(notes);

        ResponseEntity<List<Notes>> response = noteService.getNotes(1L);

        assertEquals(2, response.getBody().size());
        assertEquals(200, response.getStatusCodeValue());
        System.out.println("📒 Notes fetched: " + response.getBody().size());
    }

    @Test
    void testGetNotes_UserNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> noteService.getNotes(999L));

        assertEquals("User not found", ex.getMessage());
        System.out.println("❌ Fetch notes failed: " + ex.getMessage());
    }

    @Test
    void testDeleteNote_Success() {
        Notes note = new Notes(); note.setId(1L);
        when(noteRepository.findById(1L)).thenReturn(Optional.of(note));

        ResponseEntity<String> response = noteService.deleteNote(1L);

        assertEquals("Note deleted successfully", response.getBody());
        verify(noteRepository).delete(note);
        System.out.println("🗑️ Delete note: " + response.getBody());
    }

    @Test
    void testDeleteNote_NotFound() {
        when(noteRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> noteService.deleteNote(999L));

        assertEquals("Note not found", ex.getMessage());
        System.out.println("❌ Delete failed: " + ex.getMessage());
    }
}
