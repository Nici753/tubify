import { Button } from '../ui/Button.tsx';
import { useGoogleLogin } from '@react-oauth/google';
import useUserStore from '../../lib/store/user-store.ts';
import { toast } from 'sonner';
import YouTubeIcon from '../ui/YouTubeIcon.tsx';

export function YoutubeLoginButton() {
  const { setYouTubeToken, setUserName, setUserEmail, setUserPicture } =
    useUserStore();
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/youtube',
    onSuccess: async (tokenResponse) => {
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
        setUserEmail(userInfo.email);
        setUserName(userInfo.name);
        setUserPicture(userInfo.picture);

        window.location.reload();
      } catch (error) {
        console.error('Failed to fetch user information: ' + error);
        toast.error('Failed to fetch user information: ', {
          description: error.message,
        });
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
        <YouTubeIcon className={'h-[1.2rem] w-[1.2rem] mr-1'} />
        Login with YouTube
      </Button>
    </div>
  );
}
