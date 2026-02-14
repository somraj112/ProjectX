import React from 'react';
import { FileText, Edit2, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <Card className="h-full flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
      {/* Red Left Border Accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>

      <div className="flex justify-between items-start mb-4 pl-2">
         {/* Icon */}
        <div className="bg-red-50 p-3 rounded-2xl text-red-500">
            <FileText size={24} />
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(note)} className="hover:text-blue-500 transition-colors">
                <Edit2 size={16} />
            </button>
            <button onClick={() => onDelete(note.id)} className="hover:text-red-500 transition-colors">
                <Trash2 size={16} />
            </button>
        </div>
      </div>
      
      <div className="pl-2 mb-4">
        <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{note.title}</h3>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{note.subject}</p>
      </div>
      
      <div className="mt-auto pl-2 flex flex-wrap gap-2">
        {note.tags && note.tags.map((tag, index) => (
            <Badge key={index} variant="gray" className="bg-gray-50 text-gray-500 border border-gray-100 text-[10px] uppercase tracking-wide">
                #{tag}
            </Badge>
        ))}
      </div>
    </Card>
  );
};

export default NoteCard;
