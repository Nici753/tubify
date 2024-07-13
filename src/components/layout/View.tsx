import Navigation from './navigation.tsx';
import { PageMainContent } from './page-main-content.tsx';

export function View() {
  return (
    <div className={'flex flex-col h-screen'}>
      <Navigation />
      <PageMainContent />
    </div>
  );
}
