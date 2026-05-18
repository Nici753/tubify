import TopBar from './top-bar.tsx';
import { PageMainContent } from './page-main-content.tsx';
import { Toaster } from 'sonner';
import { useTheme } from './theme-provider';

export function View() {
  const { theme } = useTheme()

  return (
    <div className={'flex flex-col h-screen'}>
      <TopBar />
      <PageMainContent />
      <Toaster richColors={true} theme={theme as 'light' | 'dark' | 'system'}/>
    </div>
  );
}
