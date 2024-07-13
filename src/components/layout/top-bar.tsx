import { ModeToggle } from './mode-toggle.tsx';
import { YoutubeLoginButton } from '../login/youtube-login-button.tsx';
import { SpotifyLoginButton } from '../login/spotify-login-button.tsx';
import { LogoutButton } from '../login/logout-button.tsx';
import { NameTag } from './name-tag.tsx';

export function TopBar() {

  let youtubeLoggedIn: boolean = false;
  let spotifyLoggedIn: boolean = false;
  let userName: string | null= null;

  if (localStorage.getItem('youtube_access_token')) {
    youtubeLoggedIn = true;
  }
  if (localStorage.getItem('spotify_access_token')) {
    spotifyLoggedIn = true;
  }
  if (localStorage.getItem('user_name')) {
    userName = localStorage.getItem('user_name');
  }

  return (
    <div className={'flex flex-row-reverse p-3 border-b-4'}>
      <ModeToggle />
      {!spotifyLoggedIn && <SpotifyLoginButton />}
      {!youtubeLoggedIn && <YoutubeLoginButton/>}
      {youtubeLoggedIn && <LogoutButton/>}
      <div className={'flex-auto content-center'}>
        {userName && <NameTag />}
      </div>
    </div>
  );
}
export default TopBar;
