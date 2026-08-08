import React from 'react';
import { X } from 'lucide-react';

const TrailerModal = ({ isOpen, onClose, trailerUrl, movieTitle }) => {
  if (!isOpen) return null;

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    
    // Extract video ID from youtube.com/watch?v=ID or youtu.be/ID
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  const embedUrl = getEmbedUrl(trailerUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white truncate">
            Trailer: {movieTitle || 'Phim'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`Trailer ${movieTitle}`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
              Chưa có Video Trailer cho bộ phim này.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TrailerModal;
