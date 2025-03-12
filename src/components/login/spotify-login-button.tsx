import { Button } from '../ui/Button.tsx';
import SpotifyIcon from '../ui/SpotifyIcon.tsx';

export function SpotifyLoginButton() {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
  const REDIRECT_URI = 'http://localhost:5173';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token&show_dialog=true';
  const SCOPES =
    'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private';

  function handleLogin() {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`;
  }

  return (
    <div className={'mr-3'}>
      <Button variant="outline" onClick={handleLogin}>
        <SpotifyIcon className={'h-[1.2rem] w-[1.2rem] mr-1'} />
        Add Spotify Account
      </Button>
    </div>
  );
}
