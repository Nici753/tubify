import { Button } from '../ui/Button.tsx';
import { Youtube } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import useUserStore from '../../lib/store/user-store.ts';

export function YoutubeLoginButton() {
  const { setYouTubeToken, setUserName, setUserEmail, setUserPicture } = useUserStore();
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/youtube',
    onSuccess: async (tokenResponse) => {
      // localStorage.setItem('youtube_access_token', tokenResponse.access_token);
      setYouTubeToken(tokenResponse.access_token); // Store token in Zustand
      try {
        const request = new Request(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );
        const response = await fetch(request);
        const userInfo = await response.json();
        /*localStorage.setItem('user_email', userInfo.email);
        localStorage.setItem('user_name', userInfo.name);
        localStorage.setItem('user_picture', userInfo.picture);*/
        setUserEmail(userInfo.email);
        setUserName(userInfo.name);
        setUserPicture(userInfo.picture);
        
        window.location.reload();
      } catch (error) {
        console.error('Failed to fetch user information: ' + error);
      }
    },
    onError: (errorResponse) =>
      console.error('Youtube Login failed: ' + errorResponse),
  });

  function handleLogin(): void {
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
