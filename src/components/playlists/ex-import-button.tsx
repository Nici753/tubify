import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu.tsx';
import { Button } from '../ui/Button.tsx';
import { Folder, Download, Upload } from 'lucide-react';
import { SpotifyAPIService} from '../../lib/apis/SpotifyAPIService.ts';

export function ExImportButton() {

  const importPlaylist = () => {
    const spotifyApi = new SpotifyAPIService();
    spotifyApi.importPlaylist();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mr-3" asChild>
        <Button variant="outline" size="icon">
          <Folder />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => importPlaylist()}>
          <Download className="mr-3" />
          Import
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Upload className="mr-3" />
          Export
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
