import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu.tsx';
import { Button } from '../ui/Button.tsx';
import { Folder, Download, Upload } from 'lucide-react';
import { SpotifyAPIService } from '../../lib/apis/SpotifyAPIService.ts';
import { Playlist } from '../../lib/types/Playlist.ts';
import { useDispatch } from 'react-redux';
import { addPlaylist } from '../../lib/store/actions';

export function ExImportButton() {
  const spotifyApi = new SpotifyAPIService();
  const dispatch = useDispatch();

  const importPlaylist = async () => {
    const playlists: Playlist[] = await spotifyApi.importPlaylist();
    playlists.forEach((playlist) => {
      dispatch(addPlaylist(playlist));
    });
  };

  const exportPlaylist = () => {};

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
        <DropdownMenuItem onClick={() => exportPlaylist()}>
          <Upload className="mr-3" />
          Export
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
