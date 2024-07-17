import { useDispatch, useSelector } from 'react-redux';
import { PlaylistState } from '../../lib/types/Playlist';
import React from 'react';
import { selectPlaylist } from '../../lib/store/actions';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const playlists = useSelector((state: PlaylistState) => {
    return state.playlists.playlists;
  });

  if (playlists.length === 0) {
    return (
      <div className={'flex flex-col p-3 border-r-2 h-full break-words'}>
        <p>Import some Playlists from Spotify first :D</p>
      </div>
    );
  }

  return (
    <div className={'flex flex-col p-3 border-r-2 h-full break-words'}>
      <h2 className={'text-2xl font-bold'}>Your Playlists</h2>
      <div className={'grid grid-cols-1 gap-2'}>
        {playlists.map((playlist) => (
          <div
            key={playlist.SpotifyId}
            className={'flex items-center space-x-2 p-1 cursor-pointer'}
            onClick={() => dispatch(selectPlaylist(playlist))}
          >
            <img
              src={playlist.imageUrl}
              alt={playlist.name}
              className={'w-6 h-6 rounded'}
            />
            <span className={'flex-grow text-left truncate'}>
              {playlist.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
