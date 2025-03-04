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
import React, { useState } from 'react';
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
  const spotifyApi = new SpotifyAPIService();
  const youtubeApi = new YoutubeAPIService();
  const {
    addPlaylist,
    updatePlaylist,
  } = usePlaylistStore();
  const [updateModal, setUpdateModal] = useState(false);
  // const [exportModal, setExportModal] = useState(false);

  const importPlaylist = async (importedPlaylists: Playlist[]) => {
    const playlists: Playlist[] = await spotifyApi.importPlaylist(importedPlaylists);
    playlists.forEach((playlist) => {
      addPlaylist(playlist);
    });
  };

  /*
    async function exportPlaylist(playlistToExport: Playlist): void {
      setExportModal(false);
      const exportedPlaylist = await youtubeApi.exportPlaylist(playlistToExport);
      updatePlaylistLocally(exportedPlaylist);
    }
  */

  /*
    function deletePlaylistLocally() {
      store.dispatch(deleteAllPlaylists());
      localStorage.removeItem('playlists');
      dispatch(selectPlaylist(null));
    }
  */

  async function updatePlaylistWithYoutubeSongs(playlistToUpdate: Playlist) {
    setUpdateModal(false);
    const updatedPlaylist: Playlist = await youtubeApi.updatePlaylist(playlistToUpdate);
    updatePlaylist(updatedPlaylist);
  }

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
          {<DropdownMenuItem onClick={() => setUpdateModal(true)}>
            <RefreshCw className="mr-3" />
            Update
          </DropdownMenuItem>
            /*<DropdownMenuItem onClick={() => setExportModal(true)}>
              <Upload className="mr-3" />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deletePlaylistLocally()}>
              <Trash2 className="mr-3" />
              Delete
            </DropdownMenuItem>*/}
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
      {/*
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
  */}
    </>
  );
}
