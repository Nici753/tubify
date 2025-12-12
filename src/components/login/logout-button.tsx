import { Button } from '../ui/Button.tsx';
import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu.tsx';
import useUserStore from '../../lib/store/user-store.ts';

export function LogoutButton() {
  const { clearUser, clearSpotify, clearYouTube } = useUserStore();

  function handleLogout() {
    // localStorage.clear();
    // localStorage.removeItem('user-data');
    clearUser();
    window.location.reload();
  }

  function handleYoutubeLogout() {
    clearYouTube();
    window.location.reload();
  }

  function handleSpotifyLogout() {
    clearSpotify();
    window.location.reload();
  }

  return (
    <div className={'mr-3'}>
      <DropdownMenu>
        <DropdownMenuTrigger className={'mr-3'} asChild>
          <Button variant="outline" size="icon">
            <LogOut className={'h-[1.2rem] w-[1.2rem] mr-1'} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className={'h-[1.2rem] w-[1.2rem] mr-1'} />
            Logout both
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleYoutubeLogout}>
            <LogOut className={'h-[1.2rem] w-[1.2rem] mr-1'} />
            Logout YouTube
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSpotifyLogout}>
            <LogOut className={'h-[1.2rem] w-[1.2rem] mr-1'} />
            Logout Spotify
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
