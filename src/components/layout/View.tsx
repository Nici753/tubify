import TopBar from './top-bar.tsx';
import { PageMainContent } from './page-main-content.tsx';
import { Toaster } from '../ui/toaster.tsx';

export function View() {
  return (
    <div className={'flex flex-col h-screen'}>
      <TopBar />
      <PageMainContent />
      <Toaster />
    </div>
  );
}
