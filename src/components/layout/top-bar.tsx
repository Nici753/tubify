import { ModeToggle } from './mode-toggle.tsx';
import { YoutubeLoginButton } from '../login/youtube-login-button.tsx';
import { SpotifyLoginButton } from '../login/spotify-login-button.tsx';
import { LogoutButton } from '../login/logout-button.tsx';
import { NameTag } from './name-tag.tsx';
import { useEffect } from 'react';

export function TopBar() {
  let youtubeLoggedIn: boolean = false;
  let spotifyLoggedIn: boolean = false;
  let userName: string | null = null;

  if (localStorage.getItem('youtube_access_token')) {
    youtubeLoggedIn = true;
  }
  if (localStorage.getItem('spotify_access_token')) {
    spotifyLoggedIn = true;
  }
  if (localStorage.getItem('user_name')) {
    userName = localStorage.getItem('user_name');
  }

  useEffect(() => {
    if (window.location.hash) {
      const accessToken = getAccessTokenFromUrl();
      if (accessToken) {
        localStorage.setItem('spotify_access_token', accessToken);
        window.location.href = '/';
      }
    }
  }, []);

  function getAccessTokenFromUrl(): string | null {
    const hash = window.location.hash
      .substring(1) // Remove the leading '#'
      .split('&') // Split by '&'
      .reduce(function (initial: Record<string, string>, item: string) {
        const parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});
    window.location.hash = ''; // Clear the hash

    return hash.access_token;
  }

  return (
    <div className={'flex flex-row-reverse p-3 border-b-4'}>
      <ModeToggle />
      {!spotifyLoggedIn && <SpotifyLoginButton />}
      {!youtubeLoggedIn && <YoutubeLoginButton />}
      {youtubeLoggedIn && <LogoutButton />}
      <div className={'flex-auto content-center'}>
        {userName && <NameTag />}
      </div>
    </div>
  );
}
export default TopBar;
