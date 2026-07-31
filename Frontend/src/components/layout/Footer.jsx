import { useContext, useEffect, useState, useRef } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import { AuthContext } from '../../context/AuthContext';

const formatTime = (time) => {
  if (isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Footer = () => {
  const { 
    currentSong, 
    isPlaying, 
    currentTime, 
    duration, 
    volume, 
    isMuted,
    togglePlay, 
    playNext, 
    playPrevious, 
    seek, 
    setVolume, 
    toggleMute 
  } = useContext(PlayerContext);

  const { favorites, toggleFavorite, isAuthenticated } = useContext(AuthContext);

  const [isDraggingState, setIsDraggingState] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const isDragging = useRef(false);

  const [isVolDraggingState, setIsVolDraggingState] = useState(false);
  const [volDragProgress, setVolDragProgress] = useState(0);
  const isVolDragging = useRef(false);

  const displayTime = isDraggingState ? dragProgress : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;
  
  const displayVolume = isVolDraggingState ? volDragProgress : volume;
  const volumePercent = isMuted ? 0 : displayVolume * 100;

  const handleSeekStart = (e) => {
    isDragging.current = true;
    setIsDraggingState(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setDragProgress(percent * duration);
  };
  
  const handleSeek = (e) => {
    if (!isDragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setDragProgress(percent * duration);
  };

  const handleSeekEnd = (e) => {
    if (isDragging.current) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const targetTime = percent * duration;
      seek(targetTime);
      isDragging.current = false;
      setIsDraggingState(false);
    }
  };

  const handleVolumeStart = (e) => {
    isVolDragging.current = true;
    setIsVolDraggingState(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolDragProgress(percent);
    setVolume(percent);
  };
  
  const handleVolumeMove = (e) => {
    if (!isVolDragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolDragProgress(percent);
    setVolume(percent);
  };

  const handleVolumeEnd = (e) => {
    if (isVolDragging.current) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setVolume(percent);
      isVolDragging.current = false;
      setIsVolDraggingState(false);
    }
  };

  const isFavorite = currentSong && favorites && favorites.includes(currentSong._id);

  return (
    <footer className="h-24 bg-stream-elevated/95 backdrop-blur-xl border-t border-white/5 flex items-center px-4 sm:px-6 lg:px-8 shrink-0 z-50 relative w-full justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
      {/* 1. Song Info (Left) */}
      <div className="w-1/3 flex items-center min-w-[180px]">
        {currentSong ? (
          <>
            <div className="w-14 h-14 bg-gray-800 rounded-md flex items-center justify-center text-2xl mr-4 flex-shrink-0 shadow-md border border-white/10">
              🎵
            </div>
            <div className="overflow-hidden flex-1 max-w-[150px]">
              <h4 className="text-sm font-semibold text-white truncate hover:underline cursor-pointer transition-colors hover:text-stream-accent">
                {currentSong.title}
              </h4>
              <p className="text-xs text-gray-400 truncate hover:underline cursor-pointer transition-colors hover:text-white">
                {currentSong.artist?.username || 'Unknown Artist'}
              </p>
            </div>
            {isAuthenticated && (
              <button 
                onClick={() => toggleFavorite(currentSong._id)}
                className={`ml-4 text-xl hover:scale-110 active:scale-95 transition-transform ${isFavorite ? 'text-stream-accent' : 'text-gray-400 hover:text-white'}`}
              >
                {isFavorite ? '♥' : '♡'}
              </button>
            )}
          </>
        ) : (
          <div className="text-xs text-gray-500 font-medium">No song selected</div>
        )}
      </div>

      {/* 2. Player Controls (Center) */}
      <div className="w-1/3 flex flex-col items-center max-w-[722px] px-4">
        <div className="flex items-center gap-6 mb-2">
          {/* Previous */}
          <button 
            onClick={playPrevious}
            className={`text-gray-400 hover:text-white hover:scale-110 active:scale-95 transition-all ${!currentSong && 'opacity-50 cursor-not-allowed hover:scale-100 hover:text-gray-400'}`}
            disabled={!currentSong}
          >
            <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path>
            </svg>
          </button>
          
          {/* Play/Pause */}
          <button 
            onClick={togglePlay}
            className={`w-9 h-9 flex items-center justify-center bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-sm ${!currentSong && 'opacity-50 cursor-not-allowed hover:scale-100'}`}
            disabled={!currentSong}
          >
            {isPlaying ? (
              <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
              </svg>
            ) : (
              <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor" className="ml-1">
                <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
              </svg>
            )}
          </button>
          
          {/* Next */}
          <button 
            onClick={playNext}
            className={`text-gray-400 hover:text-white hover:scale-110 active:scale-95 transition-all ${!currentSong && 'opacity-50 cursor-not-allowed hover:scale-100 hover:text-gray-400'}`}
            disabled={!currentSong}
          >
            <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.106A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2 text-xs text-gray-400">
          <span className="min-w-[40px] text-right">{formatTime(displayTime)}</span>
          <div 
            className="flex-1 h-3 flex items-center group cursor-pointer"
            onPointerDown={handleSeekStart}
            onPointerMove={handleSeek}
            onPointerUp={handleSeekEnd}
            onPointerCancel={handleSeekEnd}
          >
            <div className="w-full h-1.5 bg-gray-600/50 rounded-full relative overflow-hidden group-hover:h-2 transition-all">
              <div 
                className="absolute top-0 left-0 h-full bg-white group-hover:bg-stream-accent rounded-full transition-colors"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <span className="min-w-[40px]">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Extra Controls (Right - Volume) */}
      <div className="w-1/3 flex justify-end min-w-[180px]">
        <div className="flex items-center gap-2 w-32">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white">
            {isMuted || volume === 0 ? (
              <svg role="presentation" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path><path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-13zM2.819 6.262L7.616 3.49v9.019l-4.797-2.771a2.139 2.139 0 0 1-1.014-1.815V8.078a2.14 2.14 0 0 1 1.014-1.816z"></path></svg>
            ) : volume < 0.5 ? (
              <svg role="presentation" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.41a2.139 2.139 0 0 0-1.014 1.816v.043a2.14 2.14 0 0 0 1.014 1.816l4.797 2.771V3.49l-4.797 2.771z"></path><path d="M15.25 8a.75.75 0 0 1-.75.75h-2a.75.75 0 0 1 0-1.5h2a.75.75 0 0 1 .75.75z"></path></svg>
            ) : (
              <svg role="presentation" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.41a2.139 2.139 0 0 0-1.014 1.816v.043a2.14 2.14 0 0 0 1.014 1.816l4.797 2.771V3.49l-4.797 2.771z"></path><path d="M15.25 8a.75.75 0 0 1-.75.75h-2a.75.75 0 0 1 0-1.5h2a.75.75 0 0 1 .75.75zm-3.25-3.5a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75zm.75 7.75a.75.75 0 0 0-.75.75v.01a.75.75 0 0 0 .75.75h2a.75.75 0 0 0 0-1.5h-2z"></path></svg>
            )}
          </button>
          
          <div 
            className="flex-1 h-3 flex items-center group cursor-pointer"
            onPointerDown={handleVolumeStart}
            onPointerMove={handleVolumeMove}
            onPointerUp={handleVolumeEnd}
            onPointerCancel={handleVolumeEnd}
          >
            <div className="w-full h-1.5 bg-gray-600/50 rounded-full relative overflow-hidden group-hover:h-2 transition-all">
              <div 
                className="absolute top-0 left-0 h-full bg-white group-hover:bg-stream-accent rounded-full transition-colors"
                style={{ width: `${volumePercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;