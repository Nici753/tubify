import React, { useState } from 'react';
import usePlaylistStore from '../../lib/store/playlist-store.ts';
import { ScrollArea } from '../ui/scroll-area.tsx';
import { Searchbar } from './searchbar';

export const Sidebar: React.FC = () => {
  const playlists = usePlaylistStore((state) => state.playlists);
  const setSelectPlaylist = usePlaylistStore((state) => state.selectPlaylist);
  const [searchQuery, setSearchQuery] = useState('');

  if (playlists.length === 0) {
    return (
      <div className="flex flex-col p-3 border-r-2 h-full w-full overflow-hidden">
        <p>Import some Playlists from Spotify first :D</p>
      </div>
    );
  }
  // Filter the playlists based on the query
  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col p-3 border-r-2 h-full w-full overflow-hidden">
      <Searchbar value={searchQuery} onChange={setSearchQuery} />
      <h2 className="text-2xl font-bold pt-6 mb-4">Your Playlists</h2>
      <ScrollArea className="h-[calc(100%-3rem)] w-full">
        <div className="grid grid-cols-1 gap-2 pr-4">
          {filteredPlaylists.length > 0 ? (
            filteredPlaylists.map((playlist) => (
              <div
                key={playlist.SpotifyId}
                className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 rounded"
                onClick={() => setSelectPlaylist(playlist.SpotifyId)}
              >
                <img
                  src={playlist.imageUrl}
                  alt={playlist.name}
                  className="w-6 h-6 rounded object-cover"
                />
                <span className="flex-grow text-left truncate">
                  {playlist.name}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center mt-4">
              No playlists match "{searchQuery}"
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
