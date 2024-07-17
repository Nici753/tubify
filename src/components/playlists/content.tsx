import { useSelector } from 'react-redux';
import { PlaylistState } from '../../lib/types/Playlist.ts';
import { CirclePlay } from 'lucide-react';

export function Content() {
  const selectedPlaylist = useSelector(
    (state: PlaylistState) => state.playlists.selectedPlaylist,
  );

  if (!selectedPlaylist) {
    return null;
  }

  return (
    <div className={'col-span-4 lg:col-span-3 flex flex-col p-3 h-fulls'}>
      <h1 className={'text-3xl font-bold'}>{selectedPlaylist.name}</h1>
      <div className="grid grid-cols-1 gap-2">
        {selectedPlaylist.tracks?.map((song) => (
          <div
            key={song.SpotifyId}
            className="flex items-center space-x-4 p-1 group"
          >
            <CirclePlay
              className="w-8 h-8 opacity-0 group-hover:opacity-100 hover:cursor-pointer"
              //onClick={() => onSongClick(song.SpotifyId)}
            />
            <img
              src={song.imageUrl}
              alt={song.name}
              className="w-12 h-12 rounded"
            />
            <div className="flex flex-col truncate">
              <span className="text-left truncate">{song.name}</span>
              <span className="text-left text-sm text-gray-500 truncate">
                {song.artists?.join(', ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
