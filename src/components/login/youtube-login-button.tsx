import { Button } from '../ui/Button.tsx';
import { Youtube } from 'lucide-react';

export function YoutubeLoginButton() {
  function handleLogin() {
    console.log('Login with YouTube');
    localStorage.setItem('youtube_access_token', '1234');
    localStorage.setItem('user_name', 'John Doe');
    window.location.reload();

  }

  return (
    <div className={'mr-3'}>
      <Button variant="outline" onClick={handleLogin}>
        <Youtube className={'h-[1.2rem] w-[1.2rem] mr-1'} />
        Login with YouTube
      </Button>
    </div>
  );
}
