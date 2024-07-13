import TopBar from './top-bar.tsx';
import { PageMainContent } from './page-main-content.tsx';

export function View() {
  return (
    <div className={'flex flex-col h-screen'}>
      <TopBar />
      <PageMainContent />
    </div>
  );
}
