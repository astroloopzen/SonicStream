import { useContext, useEffect, useState, useRef } from 'react';
import { PlayerContext } from '../../context/PlayerContext';

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

  const [isDraggingState, setIsDraggingState] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const isDragging = useRef(false);

  const displayTime = isDraggingState ? dragProgress : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;

  const handleSeekStart = (e) => {
    isDragging.current = true;
    setIsDraggingState(true);
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
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const targetTime = percent * duration;
      seek(targetTime);
      isDragging.current = false;
      setIsDraggingState(false);
    }
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(percent);
  };

  return (
    <footer className="h-24 bg-stream-elevated border-t border-stream-highlight flex items-center px-4 shrink-0 z-20 relative w-full justify-between">
      {/* 1. Song Info (Left) */}
      <div className="w-1/3 flex items-center min-w-[180px]">
        {currentSong ? (
          <>
            <div className="w-14 h-14 bg-gray-800 rounded-md flex items-center justify-center text-2xl mr-4 flex-shrink-0 shadow-md">
              🎵
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
                {currentSong.title}
              </h4>
              <p className="text-xs text-gray-400 truncate hover:underline cursor-pointer">
                {currentSong.artist?.username || 'Unknown Artist'}
              </p>
            </div>
          </>
        ) : (
          <div className="text-xs text-gray-500">No song selected</div>
        )}
      </div>

      {/* 2. Player Controls (Center) */}
      <div className="w-1/3 flex flex-col items-center max-w-[722px] px-4">
        <div className="flex items-center gap-6 mb-2">
          {/* Previous */}
          <button 
            onClick={playPrevious}
            className={`text-gray-400 hover:text-white transition-colors ${!currentSong && 'opacity-50 cursor-not-allowed'}`}
            disabled={!currentSong}
          >
            <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path>
            </svg>
          </button>
          
          {/* Play/Pause */}
          <button 
            onClick={togglePlay}
            className={`w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform ${!currentSong && 'opacity-50 cursor-not-allowed'}`}
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
            className={`text-gray-400 hover:text-white transition-colors ${!currentSong && 'opacity-50 cursor-not-allowed'}`}
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
            onMouseDown={handleSeekStart}
            onMouseMove={handleSeek}
            onMouseUp={handleSeekEnd}
            onMouseLeave={handleSeekEnd}
            onClick={(e) => {
              if(!isDragging.current) {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                seek(percent * duration);
              }
            }}
          >
            <div className="w-full h-1 bg-gray-600 rounded-full relative overflow-hidden group-hover:h-1.5 transition-all">
              <div 
                className="absolute top-0 left-0 h-full bg-white group-hover:bg-green-500 rounded-full"
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
            onClick={handleVolumeChange}
          >
            <div className="w-full h-1 bg-gray-600 rounded-full relative overflow-hidden group-hover:h-1.5 transition-all">
              <div 
                className="absolute top-0 left-0 h-full bg-white group-hover:bg-green-500 rounded-full"
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