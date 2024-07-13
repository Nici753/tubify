import { Button } from '../ui/Button.tsx';
import { Youtube } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export function YoutubeLoginButton() {
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/youtube',
    onSuccess: tokenResponse =>
      localStorage.setItem('youtube_access_token', tokenResponse.access_token),
    onError: errorResponse =>
      console.error('Youtube Login failed: ' + errorResponse)
  });

  function handleLogin() : void {
    console.log('Login with YouTube');
    login();
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
