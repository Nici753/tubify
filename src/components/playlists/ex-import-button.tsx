import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu.tsx';
import { Button } from '../ui/Button.tsx';
import { Folder, Download, Upload, Trash2 } from 'lucide-react';
import { SpotifyAPIService } from '../../lib/apis/SpotifyAPIService.ts';
import { Playlist } from '../../lib/types/Playlist.ts';
import { useDispatch } from 'react-redux';
import { addPlaylist, deleteAllPlaylists } from '../../lib/store/actions';
import { store } from '../../lib/store/store.ts';

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

  function deletePlaylist() {
    store.dispatch(deleteAllPlaylists());
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
        <DropdownMenuItem onClick={() => exportPlaylist()}>
          <Upload className="mr-3" />
          Export
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => deletePlaylist()}>
          <Trash2 className="mr-3" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
