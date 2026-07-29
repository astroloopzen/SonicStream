import { createContext, useState, useEffect, useRef, useContext } from 'react';
import { musicService } from '../services/musicService';
import { AuthContext } from './AuthContext';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(new Audio());

  // Clear player on logout
  useEffect(() => {
    if (isAuthenticated === false) {
      audioRef.current.pause();
      audioRef.current.src = "";
      setQueue([]);
      setCurrentIndex(-1);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [isAuthenticated]);
  
  const currentSong = currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex] : null;

  // Initialize audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => playNext();
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [currentIndex, queue]); // Depend on queue/index for playNext closure

  // Play a specific song and update queue
  const playSong = async (song, newQueue = null) => {
    if (newQueue) {
      setQueue(newQueue);
      const index = newQueue.findIndex(s => s._id === song._id);
      setCurrentIndex(index !== -1 ? index : 0);
    } else {
      // If no new queue, just play it as a single song if not in current queue
      const index = queue.findIndex(s => s._id === song._id);
      if (index !== -1) {
        setCurrentIndex(index);
      } else {
        setQueue([song]);
        setCurrentIndex(0);
      }
    }

    try {
      // Call backend tracking
      await musicService.playMusic(song._id);
    } catch (err) {
      console.error("Failed to track playback:", err);
    }
  };

  // Effect to handle actual audio source changes when currentSong changes
  useEffect(() => {
    if (currentSong && currentSong.uri) {
      // Create a blob URL or use direct URI depending on backend
      // Assuming URI is a valid media URL from backend
      audioRef.current.src = currentSong.uri;
      audioRef.current.play().catch(e => console.error("Playback failed", e));
      setIsPlaying(true);
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (!currentSong) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed", e));
    }
  };

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // End of queue
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const playPrevious = () => {
    if (audioRef.current.currentTime > 3) {
      // Restart current song if played for more than 3 seconds
      audioRef.current.currentTime = 0;
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (value) => {
    const newVolume = Math.max(0, Math.min(1, value));
    audioRef.current.volume = newVolume;
    setVolumeState(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      audioRef.current.muted = false;
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    audioRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  return (
    <PlayerContext.Provider 
      value={{ 
        currentSong, 
        queue, 
        isPlaying, 
        currentTime, 
        duration, 
        volume, 
        isMuted,
        playSong, 
        togglePlay, 
        playNext, 
        playPrevious, 
        seek, 
        setVolume, 
        toggleMute 
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};