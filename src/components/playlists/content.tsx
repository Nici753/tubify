import { CirclePlay } from 'lucide-react';
import SpotifyMusicPlayer from './SpotifyMusicPlayer.tsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import usePlaylistStore from '../../lib/store/playlist-store.ts';
import { ScrollArea } from '../ui/scroll-area.tsx';
import { Searchbar } from './searchbar.tsx';
import { Track } from '../../lib/types/Track.ts';

export function Content() {
  const selectedPlaylist = usePlaylistStore((state) => state.selectedPlaylist);

  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [parentWidth, setParentWidth] = useState<number>(0);
  const parentRefWidth = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSongSearchQuery('');
  }, [selectedPlaylist?.SpotifyId]);

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
    return (): void => {
      window.removeEventListener('resize', updateParentWidth);
    };
  }, []);

  const filteredSongs: Track[] = useMemo((): Track[] => {
    if (!selectedPlaylist?.tracks) return [];

    const query: string = songSearchQuery.toLowerCase();
    return selectedPlaylist.tracks.filter((song: Track): boolean =>
      song.name.toLowerCase().includes(query) ||
      song.artists?.some(artist => artist.toLowerCase().includes(query))
    );
  }, [selectedPlaylist, songSearchQuery]);
  if (!selectedPlaylist) {
    return null;
  }

  return (
    <div
      className={'flex flex-col h-full w-full overflow-hidden'}
      ref={parentRefWidth}
    >
      <div className={'flex flex-col gap-4 p-3 border-b-2'}>
        <h1 className={'text-3xl font-bold'}>
          {selectedPlaylist.name}
        </h1>
        <div className={'flex flex-row-reverse'}>
          <div>
          <Searchbar
            value={songSearchQuery}
            onChange={setSongSearchQuery}
          />
          </div>
        </div>
      </div>
      <ScrollArea className={'h-full w-full'}>
        <div className={'grid grid-cols-1 gap-2 px-3 pt-4 pb-32'}>
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song: Track) => (
              <div
                key={song.SpotifyId}
                className={'flex items-center space-x-4 p-1 group'}
              >
                <CirclePlay
                  className={
                    'w-8 h-8 opacity-0 group-hover:opacity-100 hover:cursor-pointer transition-opacity'
                  }
                  onClick={(): void => setCurrentSong(song.SpotifyId)}
                />
                <img
                  src={song.imageUrl}
                  alt={song.name}
                  className={'w-12 h-12 rounded'}
                />
                <div className={'flex flex-col truncate'}>
                  <span className={'text-left truncate font-medium'}>{song.name}</span>
                  <span
                    className={
                      'text-left text-sm text-zinc-800 dark:text-gray-400 truncate'
                    }
                  >
                    {song.artists?.join(', ')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className={'text-center py-20 text-muted-foreground'}>
              {songSearchQuery ? `No songs found matching "${songSearchQuery}"` : "This playlist is empty."}
            </div>
          )}
        </div>
      </ScrollArea>
      <div className={'fixed bottom-2 right-2 z-50'}>
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
