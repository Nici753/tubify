import { ModeToggle } from './mode-toggle.tsx';
import { YoutubeLoginButton } from '../login/youtube-login-button.tsx';
import { SpotifyLoginButton } from '../login/spotify-login-button.tsx';
import { NameTag } from './name-tag.tsx';

export function Navigation() {
  return (
    <div className={'flex flex-row-reverse p-3 border-b-4'}>
      <ModeToggle />
      <SpotifyLoginButton />
      <YoutubeLoginButton />
      <div className={'flex-auto content-center'}>
        <NameTag />
      </div>
    </div>
  );
}
export default Navigation;
