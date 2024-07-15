import { Button } from '../ui/Button.tsx';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  function handleLogin() {
    localStorage.clear();
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
