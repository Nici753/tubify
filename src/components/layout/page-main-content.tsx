import { Sidebar } from '../playlists/sidebar.tsx';
import { Content } from '../playlists/content.tsx';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable.tsx';

export function PageMainContent() {
  return (
    <div className={'flex-grow flex h-screen overflow-hidden'}>
      <ResizablePanelGroup direction={'horizontal'}>
        <ResizablePanel defaultSize={24}>
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <Content />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
