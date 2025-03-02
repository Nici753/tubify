import { Button } from '../ui/Button.tsx';
import { LogOut } from 'lucide-react';

export function LogoutButton() {

  function handleLogout() {
    // localStorage.clear();
    localStorage.removeItem('user-data');
    window.location.reload();
  }

  return (
    <div className={'mr-3'}>
      <Button variant="outline" onClick={handleLogout}>
        <LogOut className={'h-[1.2rem] w-[1.2rem] mr-1'} />
        Logout
      </Button>
    </div>
  );
}
