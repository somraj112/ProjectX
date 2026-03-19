import React from 'react';
import { FileText, Image, Edit2, Trash2, Eye, Download, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const NoteCard = ({ note, currentUser, onEdit, onDelete }) => {
  const attachment = note.attachments?.[0];
  const externalLink = note.externalLink;
  const isPdf = attachment?.fileType === 'pdf';
  const isImage = attachment?.fileType === 'image';
  const isLink = !!externalLink;
  
  const isOwner = currentUser && note.uploadedBy &&
    (currentUser._id === (note.uploadedBy._id || note.uploadedBy));

  const handleView = () => {
    if (isLink) {
      window.open(externalLink, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!attachment?.fileUrl) return;
    
    // Check if it's a legacy 'raw' upload or a new 'image' upload
    const isLegacyRaw = attachment.fileUrl.includes('/raw/');

    if (isPdf && isLegacyRaw) {
      // For legacy raw uploads, we still need the Google Docs Viewer workaround
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(attachment.fileUrl)}&embedded=false`;
      window.open(viewerUrl, '_blank', 'noopener,noreferrer');
    } else {
      // For new image-type PDFs or images, open directly
      window.open(attachment.fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="h-full flex flex-col relative overflow-hidden group hover:shadow-lg transition-all duration-200 p-0">
      {/* Colored top bar based on file type */}
      <div className={`h-1.5 w-full ${isLink ? 'bg-green-500' : isPdf ? 'bg-red-500' : 'bg-blue-500'}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          {/* File type icon */}
          <div className={`p-3 rounded-2xl ${
            isLink ? 'bg-green-50 text-green-600' : 
            isPdf ? 'bg-red-50 text-red-500' : 
            'bg-blue-50 text-blue-500'
          }`}>
            {isLink ? <LinkIcon size={22} /> : isPdf ? <FileText size={22} /> : <Image size={22} />}
          </div>

          {/* Owner actions — only visible on hover */}
          {isOwner && (
            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(note)}
                title="Edit note"
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() => onDelete(note._id)}
                title="Delete note"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Title & subject */}
        <div className="mb-3 flex-1">
          <h3 className="font-bold text-base text-gray-900 leading-snug mb-1 line-clamp-2">
            {note.title}
          </h3>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            {note.subject}
          </p>
          {note.semester && note.semester !== 'N/A' && (
            <p className="text-xs text-gray-400 mt-0.5">{note.semester} Semester</p>
          )}
        </div>

        {/* Uploader */}
        {note.uploadedBy?.name && (
          <p className="text-xs text-gray-400 mb-3">
            By <span className="font-medium text-gray-600">{note.uploadedBy.name}</span>
          </p>
        )}

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {note.tags.slice(0, 4).map((tag, i) => (
              <Badge
                key={i}
                variant="gray"
                className="bg-gray-50 text-gray-500 border border-gray-100 text-[10px] uppercase tracking-wide px-2 py-0.5"
              >
                #{tag}
              </Badge>
            ))}
            {note.tags.length > 4 && (
              <span className="text-[10px] text-gray-400">+{note.tags.length - 4} more</span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <button
            onClick={handleView}
            className={`flex items-center justify-center gap-1.5 flex-1 py-2 px-3 rounded-xl ${
              isLink ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-900 hover:bg-gray-700'
            } text-white text-sm font-medium transition-colors`}
          >
            {isLink ? <ExternalLink size={14} /> : <Eye size={14} />}
            {isLink ? 'Open Link' : 'View'}
          </button>
          
          {!isLink && (
            <a
              href={attachment?.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              title="Download"
            >
              <Download size={14} />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NoteCard;
