import { Button } from '../ui/Button.tsx';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  function handleLogin() {
    // localStorage.clear();
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('youtube_access_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_picture');
    window.location.reload();
  }

  return (
    <div className={'mr-3'}>
      <Button variant="outline" onClick={handleLogin}>
        <LogOut className={'h-[1.2rem] w-[1.2rem] mr-1'} />
        Logout
      </Button>
    </div>
  );
}
