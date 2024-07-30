import { useSelector } from 'react-redux';
import { PlaylistState } from '../../lib/types/Playlist.ts';
import { CirclePlay } from 'lucide-react';
import SpotifyMusicPlayer from './SpotifyMusicPlayer.tsx';
import { useEffect, useState } from 'react';

export function Content() {
  const selectedPlaylist = useSelector(
    (state: PlaylistState) => state.playlists.selectedPlaylist,
  );

  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [parentWidth, setParentWidth] = useState<number>(null);

  useEffect(() => {
    const updateParentWidth = () => {
      if (!document.getElementById('parent-width')) {
        return null;
      } else {
        setParentWidth(
          document.getElementById('parent-width').clientWidth - 124,
        );
      }
    };
    updateParentWidth();
    window.addEventListener('resize', updateParentWidth);
    return () => {
      window.removeEventListener('resize', updateParentWidth);
    };
  }, []);

  if (!selectedPlaylist) {
    return null;
  }

  return (
    <div
      className={
        'flex flex-col px-3 pt-3 pb-32 h-fulls'
      }
      id="parent-width"
    >
      <h1 className={'text-3xl font-bold'}>{selectedPlaylist.name}</h1>
      <div className={'grid grid-cols-1 gap-2'}>
        {selectedPlaylist.tracks?.map((song) => (
          <div
            key={song.SpotifyId}
            className={'flex items-center space-x-4 p-1 group'}
          >
            <CirclePlay
              className={
                'w-8 h-8 opacity-0 group-hover:opacity-100 hover:cursor-pointer'
              }
              onClick={() => setCurrentSong(song.SpotifyId)}
            />
            <img
              src={song.imageUrl}
              alt={song.name}
              className={'w-12 h-12 rounded'}
            />
            <div className={'flex flex-col truncate'}>
              <span className={'text-left truncate'}>{song.name}</span>
              <span
                className={
                  'text-left text-sm text-zinc-800 dark:text-gray-300 truncate'
                }
              >
                {song.artists?.join(', ')}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={'fixed bottom-2 right-2'}>
        {currentSong && (
          <SpotifyMusicPlayer
            spotifyUri={currentSong}
            parentWidth={parentWidth}
          />
        )}
      </div>
    </div>
  );
}
