import { CirclePlay } from 'lucide-react';
import SpotifyMusicPlayer from './SpotifyMusicPlayer.tsx';
import { useEffect, useRef, useState } from 'react';
import usePlaylistStore from '../../lib/store/playlist-store.ts';
import { ScrollArea } from '../ui/scroll-area.tsx';

export function Content() {
  const selectedPlaylist = usePlaylistStore(state => state.selectedPlaylist);

  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [parentWidth, setParentWidth] = useState<number>(0);
  const parentRefWidth = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateParentWidth = () => {
      if (!parentRefWidth.current) {
        return null;
      } else {
        setParentWidth(parentRefWidth.current.clientWidth - 124);
      }
    };
    updateParentWidth();
    window.addEventListener('resize', updateParentWidth);
    return () => {
      window.removeEventListener('resize', updateParentWidth);
    };
  }, [parentWidth]);

  if (!selectedPlaylist) {
    return null;
  }

  return (
    <div
      className={'flex flex-col h-full w-full overflow-hidden'}
      ref={parentRefWidth}
    >
      <h1 className={'text-3xl font-bold px-3 pt-3 mb-2'}>{selectedPlaylist.name}</h1>
      <ScrollArea className={'h-[calc(100%-4rem)] w-full'}>
        <div className={'grid grid-cols-1 gap-2 px-3 pb-32'}>
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
      </ScrollArea>
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