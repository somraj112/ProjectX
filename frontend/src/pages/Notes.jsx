import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import NoteCard from '../components/notes/NoteCard';
import UploadNoteModal from '../components/notes/UploadNoteModal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import notesService from '../services/notes.service';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Notes = () => {
  const { user: currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editNote, setEditNote] = useState(null); // null = upload mode, object = edit mode

  useEffect(() => {
    fetchNotes();
  }, [searchQuery]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await notesService.getNotes(searchQuery);
      const notesArray = Array.isArray(data) ? data : (data.notes || []);
      setNotes(notesArray);
    } catch (error) {
      console.error('Failed to fetch notes', error);
      toast.error('Failed to fetch notes');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpload = () => {
    setEditNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditNote(null);
  };

  const handleUploadNote = async (noteData) => {
    setIsUploading(true);
    try {
      await notesService.uploadNote(noteData);
      toast.success('Note uploaded successfully!');
      handleCloseModal();
      await fetchNotes();
    } catch (error) {
      console.error('Failed to upload note', error);
      toast.error(error.response?.data?.msg || 'Failed to upload note');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    setIsUploading(true);
    try {
      await notesService.updateNote(id, noteData);
      toast.success('Note updated successfully!');
      handleCloseModal();
      await fetchNotes();
    } catch (error) {
      console.error('Failed to update note', error);
      toast.error(error.response?.data?.msg || 'Failed to update note');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesService.deleteNote(id);
        toast.success('Note deleted');
        setNotes(notes.filter(n => n._id !== id));
      } catch (error) {
        console.error('Failed to delete note', error);
        toast.error('Failed to delete note');
      }
    }
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
          <Button icon={Plus} onClick={handleOpenUpload}>Upload</Button>
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
              key={note._id}
              note={note}
              currentUser={currentUser}
              onEdit={handleOpenEdit}
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
        onClose={handleCloseModal}
        onUpload={handleUploadNote}
        onUpdate={handleUpdateNote}
        isUploading={isUploading}
        editNote={editNote}
      />
    </div>
  );
};

export default Notes;
