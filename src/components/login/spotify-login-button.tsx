import { Button } from '../ui/Button.tsx';
import { Headphones } from 'lucide-react';

export function SpotifyLoginButton() {
  function handleLogin() {
    console.log('Login with Spotify');
  }

  return (
    <div className={'mr-3'}>
      <Button variant="outline" onClick={handleLogin}>
        <Headphones className={'h-[1.2rem] w-[1.2rem] mr-1'} />
        Add Spotify Account
      </Button>
    </div>
  );
}
