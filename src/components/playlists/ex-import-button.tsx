import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu.tsx';
import { Button } from '../ui/Button.tsx';
import { Folder, Download, Upload, Trash2, RefreshCw } from 'lucide-react';
import { SpotifyAPIService } from '../../lib/apis/SpotifyAPIService.ts';
import { Playlist, PlaylistState } from '../../lib/types/Playlist.ts';
import { YoutubeAPIService } from '../../lib/apis/YoutubeAPIService.ts';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card.tsx';
import usePlaylistStore from '../../lib/store/playlist-store.ts';
import playlistStore from '../../lib/store/playlist-store.ts';

export function ExImportButton() {
  const spotifyApi = SpotifyAPIService.getInstance();
  const youtubeApi =  YoutubeAPIService.getInstance();
  const {
    addPlaylist,
    updatePlaylist,
    removePlaylist,
    clearPlaylists,
    unselectPlaylist,
  } = usePlaylistStore();

  const [updateModal, setUpdateModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const importPlaylist = async (importedPlaylists: Playlist[]) => {
    const playlists: Playlist[] = await spotifyApi.importPlaylist(importedPlaylists);
    playlists.forEach((playlist) => {
      addPlaylist(playlist);
    });
  };

    async function exportPlaylist(playlistToExport: Playlist): Promise<void> {
      setExportModal(false);
      updatePlaylist(await youtubeApi.exportPlaylist(playlistToExport));
    }

  async function updatePlaylistWithYoutubeSongs(playlistToUpdate: Playlist) {
    setUpdateModal(false);
    updatePlaylist(await youtubeApi.updatePlaylist(playlistToUpdate));
  }

  const selectedPlaylist = usePlaylistStore(state => state.selectedPlaylist);
  const playlists = playlistStore((state: PlaylistState) => state.playlists);
  console.log(playlists);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={'mr-3'} asChild>
          <Button variant="outline" size="icon">
            <Folder />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => importPlaylist(playlists)}>
            <Download className="mr-3" />
            Import
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUpdateModal(true)}>
            <RefreshCw className="mr-3" />
            Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setExportModal(true)}>
              <Upload className="mr-3" />
              Export
            </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteModal(true)}>
            <Trash2 className="mr-3" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {updateModal &&
        createPortal(
          <Card className={'inset-x-1/4 top-1/4 absolute z-50 border-4'}>
            <CardHeader>
              <CardTitle>Update Playlists</CardTitle>
              <CardDescription>
                Choose a playlist to add song equivalents from YouTube
              </CardDescription>
            </CardHeader>
            <CardContent className={'flex flex-col gap-2 h-fit'}>
              {playlists.map((playlist) => (
                <div
                  key={playlist.SpotifyId}
                  className={'flex items-center space-x-2 p-1 cursor-pointer'}
                  onClick={() => updatePlaylistWithYoutubeSongs(playlist)}
                >
                  <img
                    src={playlist.imageUrl}
                    alt={playlist.name}
                    className={'w-12 h-12 rounded'}
                  />
                  <span className={'flex-grow text-left truncate'}>
                    {playlist.name}
                  </span>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-row-reverse">
              <Button variant="outline" onClick={() => setUpdateModal(false)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>,
          document.body,
        )}
      {exportModal &&
        createPortal(
          <Card className={'inset-x-1/4 top-1/4 absolute z-50 border-4'}>
            <CardHeader>
              <CardTitle>Export Playlists</CardTitle>
              <CardDescription>
                Choose a playlist to export to YouTube
              </CardDescription>
            </CardHeader>
            <CardContent className={'flex flex-col gap-2 h-fit'}>
              {playlists.map((playlist: Playlist) => (
                <div
                  key={playlist.SpotifyId}
                  className={'flex items-center space-x-2 p-1 cursor-pointer'}
                  onClick={() => exportPlaylist(playlist)}
                >
                  <img
                    src={playlist.imageUrl}
                    alt={playlist.name}
                    className={'w-12 h-12 rounded'}
                  />
                  <span className={'flex-grow text-left truncate'}>
                    {playlist.name}
                  </span>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-row-reverse">
              <Button variant="outline" onClick={() => setExportModal(false)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>,
          document.body,
        )}
      {deleteModal &&
        createPortal(
          <Card className={'inset-x-1/4 top-1/4 absolute z-50 border-4'}>
            <CardHeader>
              <CardTitle>Delete Playlists Locally</CardTitle>
              <CardDescription>
                Do you want to delete the selected or all playlist(s)?
              </CardDescription>
            </CardHeader>
            <CardContent className={'flex flex-row gap-2 h-fit'}>
              <div className="grid grid-cols-2 gap-2 w-full">
                {selectedPlaylist && selectedPlaylist.SpotifyId && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      removePlaylist(selectedPlaylist.SpotifyId);
                      unselectPlaylist();
                      setDeleteModal(false);
                    }}
                  >
                    Delete Selected Playlist
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    clearPlaylists();
                    setDeleteModal(false);
                  }}
                >
                  Delete All Playlists
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row-reverse">
              <Button variant="outline" onClick={() => setDeleteModal(false)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>,
          document.body,
        )}
    </>
  );
}
