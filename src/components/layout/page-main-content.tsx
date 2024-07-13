import { Sidebar } from '../playlists/sidebar.tsx';
import { Content } from '../playlists/content.tsx';

export function PageMainContent() {
  return (
    <div className={'grid grid-cols-5 flex-grow'}>
      <Sidebar />
      <Content />
    </div>
  );
}
