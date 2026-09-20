import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { Song } from '@/data/songs';

export interface SongPlayerProps {
  song: Song;
}

function asDuration(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function formatTime(value: number) {
  const totalSeconds = Math.floor(asDuration(value));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${minutes}:${seconds}`;
}

export function SongPlayer({ song }: SongPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);

  const hasAudio = Boolean(song.audioSrc);
  const updateDuration = () => setDuration(asDuration(audioRef.current?.duration ?? 0));
  const updateCurrentTime = () => setCurrentTime(asDuration(audioRef.current?.currentTime ?? 0));

  const handlePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setHasPlaybackError(true);
      setIsPlaying(false);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(event.target.value);
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(nextTime)) return;

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const playbackLabel = `${isPlaying ? 'Pause' : 'Play'} ${song.title}`;

  return (
    <section aria-label={`Player for ${song.title}`} className="song-player" data-testid="song-player">
      {hasAudio && (
        <audio
          aria-hidden="true"
          className="song-player-audio"
          onEnded={() => {
            setCurrentTime(duration);
            setIsPlaying(false);
          }}
          onError={() => {
            setHasPlaybackError(true);
            setIsPlaying(false);
          }}
          onLoadedMetadata={updateDuration}
          onPause={() => setIsPlaying(false)}
          onPlay={() => {
            setHasPlaybackError(false);
            setIsPlaying(true);
          }}
          onTimeUpdate={updateCurrentTime}
          preload="metadata"
          ref={audioRef}
          src={song.audioSrc}
        />
      )}

      <div className="song-player-header">
        <p className="song-player-title">{song.title}</p>
        <p className="song-player-author">{song.author}</p>
      </div>

      <div className="song-player-transport">
        <button
          aria-label={playbackLabel}
          aria-pressed={isPlaying}
          className="song-player-playback"
          data-testid="button-song-playback"
          disabled={!hasAudio}
          onClick={handlePlayback}
          type="button"
        >
          {isPlaying ? <Pause aria-hidden="true" size={16} /> : <Play aria-hidden="true" size={16} />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <div className="song-player-progress">
          <label className="sr-only" htmlFor={`song-seek-${song.id}`}>Seek {song.title}</label>
          <input
            aria-label={`Seek ${song.title}`}
            disabled={!hasAudio || !duration}
            id={`song-seek-${song.id}`}
            max={duration}
            min="0"
            onChange={handleSeek}
            step="0.1"
            type="range"
            value={Math.min(currentTime, duration)}
            data-testid="input-song-seek"
          />
          <p className="song-player-time" data-testid="text-song-time">{formatTime(currentTime)} / {formatTime(duration)}</p>
        </div>
      </div>

      {(!hasAudio || hasPlaybackError) && <p aria-live="polite" className="song-player-error" role="status">Playback unavailable.</p>}

      {song.body.trim() && (
        <div className="song-player-lyrics">
          <h2>Lyrics</h2>
          <p data-testid="text-song-body">{song.body}</p>
        </div>
      )}
    </section>
  );
}
