import { useSelector } from 'react-redux';
import { PlaylistState } from '../../lib/types/Playlist';
import React from 'react';

export const Sidebar: React.FC = () => {
  const playlists = useSelector((state: PlaylistState) => {
    console.log(state);
    return state.playlists;
  });

  if (playlists.length === 0) {
    return <p>No playlists available.</p>;
  }

  return (
    <div className={'flex flex-col p-3 border-r-2 h-full break-words'}>
    </div>
  );
};
