import { ModeToggle } from './mode-toggle.tsx';
import { YoutubeLoginButton } from '../login/youtube-login-button.tsx';
import { SpotifyLoginButton } from '../login/spotify-login-button.tsx';
import { LogoutButton } from '../login/logout-button.tsx';
import { NameTag } from './name-tag.tsx';
import { ExImportButton } from '../playlists/ex-import-button.tsx';
import { MockButton } from './mock-button.tsx'
import useUserStore from '../../lib/store/user-store.ts'; // Import Zustand store

export function TopBar() {
  const { youtube_access_token, spotify_access_token, user_name } =
    useUserStore();

  const youtubeLoggedIn = !!youtube_access_token;
  const spotifyLoggedIn = !!spotify_access_token;

  return (
    <div className="flex flex-row-reverse items-center p-3 border-b-4">
      <ModeToggle />
      {(youtubeLoggedIn || spotifyLoggedIn) && <ExImportButton />}
      {!spotifyLoggedIn && <SpotifyLoginButton />}
      {!youtubeLoggedIn && <YoutubeLoginButton />}
      {(youtubeLoggedIn || spotifyLoggedIn) && <LogoutButton />}
      {!(youtubeLoggedIn || spotifyLoggedIn) && <MockButton />}
      <div className="flex-auto content-center">{user_name && <NameTag />}</div>
    </div>
  );
}

export default TopBar;
