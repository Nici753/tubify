import React from 'react';

interface SpotifyMusicPlayerProps {
  spotifyUri: string;
  parentWidth: number;
}

const SpotifyMusicPlayer: React.FC<SpotifyMusicPlayerProps> = ({
  spotifyUri,
  parentWidth,
}) => {
  const src = `https://open.spotify.com/embed/track/${spotifyUri}`;

  return (
    <iframe
      src={src}
      width={parentWidth}
      height="100"
      allow="encrypted-media"
    ></iframe>
  );
};

export default SpotifyMusicPlayer;
