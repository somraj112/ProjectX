import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import NoteCard from '../components/notes/NoteCard';
import UploadNoteModal from '../components/notes/UploadNoteModal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import notesService from '../services/notes.service';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [searchQuery]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
        const data = await notesService.getNotes(searchQuery);
        // Handle response format (array vs object)
        const notesArray = Array.isArray(data) ? data : (data.notes || []);
        
        // Use mock data if empty (for demo)
        if (notesArray.length === 0 && !searchQuery) {
            setNotes(MOCK_NOTES);
        } else {
            setNotes(notesArray);
        }
    } catch (error) {
        console.error("Failed to fetch notes", error);
        if (!searchQuery) setNotes(MOCK_NOTES);
    } finally {
        setLoading(false);
    }
  };

  const handleUploadNote = async (noteData) => {
    setIsUploading(true);
    try {
        await notesService.uploadNote(noteData);
        // Optimistic update
        const newNote = {
            id: Date.now(),
            ...noteData,
            tags: noteData.tags || []
        };
        setNotes([newNote, ...notes]);
        setIsModalOpen(false);
    } catch (error) {
        console.error("Failed to upload note", error);
    } finally {
        setIsUploading(false);
    }
  };

  const handleDeleteNote = async (id) => {
      if (window.confirm('Are you sure you want to delete this note?')) {
          try {
              await notesService.deleteNote(id);
              setNotes(notes.filter(n => n.id !== id));
          } catch (error) {
              console.error("Failed to delete note", error);
              // Optimistic delete for demo even if API fails
              setNotes(notes.filter(n => n.id !== id));
          }
      }
  };

  const handleEditNote = (note) => {
      console.log('Edit note', note);
      // Implement edit logic or reuse modal
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Notes Hub</h1>
            <p className="text-gray-500 mt-1">Access and share study materials</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="w-full md:w-64">
                <Input 
                    icon={Search} 
                    placeholder="Search notes..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-0" 
                />
             </div>
             <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Upload</Button>
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
            <Loader size="lg" />
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
                <NoteCard 
                    key={note.id} 
                    note={note} 
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                />
            ))}
        </div>
      ) : (
        <EmptyState 
            title="No notes found" 
            description="Upload a new note to get started." 
        />
      )}

      <UploadNoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUpload={handleUploadNote}
        isUploading={isUploading}
      />
    </div>
  );
};

// Mock Data
const MOCK_NOTES = [
    {
        id: 1,
        title: 'DSA Complete Guide',
        subject: 'DSA',
        tags: ['Trees', 'Graphs'],
    },
    {
        id: 2,
        title: 'Physics Formula Sheet',
        subject: 'Physics',
        tags: ['Mechanics'],
    },
    {
        id: 3,
        title: 'React Hooks Cheatsheet',
        subject: 'Web Dev',
        tags: ['React', 'JS'],
    }
];

export default Notes;
