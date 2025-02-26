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
import { useDispatch, useSelector } from 'react-redux';
import {
  addPlaylist,
  deleteAllPlaylists,
  selectPlaylist,
} from '../../lib/store/actions';
import { store } from '../../lib/store/store.ts';
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

export function ExImportButton() {
  const spotifyApi = new SpotifyAPIService();
  const youtubeApi = new YoutubeAPIService();
  const dispatch = useDispatch();

  const [updateModal, setUpdateModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);

  const playlists = useSelector((state: PlaylistState) => {
    return state.playlists.playlists;
  });

  const importPlaylist = async () => {
    if (localStorage.getItem('playlists')) {
      deletePlaylistLocally();
    }
    const playlists: Playlist[] = await spotifyApi.importPlaylist();
    playlists.forEach((playlist) => {
      dispatch(addPlaylist(playlist));
    });
  };

  async function exportPlaylist(playlistToExport: Playlist): void {
    setExportModal(false);
    const exportedPlaylist = await youtubeApi.exportPlaylist(playlistToExport);
    updatePlaylistLocally(exportedPlaylist);
  }

  function deletePlaylistLocally() {
    store.dispatch(deleteAllPlaylists());
    localStorage.removeItem('playlists');
    dispatch(selectPlaylist(null));
  }

  function updatePlaylistLocally(updatedPlaylist: Playlist): void {
    const allPlaylists = playlists.filter(
      (playlist: Playlist) => playlist.SpotifyId !== updatedPlaylist.SpotifyId,
    );
    allPlaylists.push(updatedPlaylist);

    deletePlaylistLocally();

    allPlaylists.forEach((playlist: Playlist): void => {
      dispatch(addPlaylist(playlist));
    });
  }

  async function updatePlaylist(playlistToUpdate: Playlist) {
    setUpdateModal(false);
    console.log(playlistToUpdate);
    console.log('Tracks:');
    // safe all tracks without youtubeId to a new array and console log them
    const tracksWithoutYoutubeId = playlistToUpdate.tracks.filter(
      (track) => !track.YoutubeId,
    );
    console.log(tracksWithoutYoutubeId);

    const updatedPlaylist = await youtubeApi.updatePlaylist(playlistToUpdate);
    updatePlaylistLocally(updatedPlaylist);
    console.log(updatedPlaylist);
    // safe all the songs that are equal to the tracksWithoutYoutubeId array to a new array and console log them
    const updatedSongs = updatedPlaylist.tracks.filter((track) =>
      tracksWithoutYoutubeId.includes(track),
    );
    console.log(updatedSongs);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={'mr-3'} asChild>
          <Button variant="outline" size="icon">
            <Folder />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => importPlaylist()}>
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
          <DropdownMenuItem onClick={() => deletePlaylistLocally()}>
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
                  onClick={() => updatePlaylist(playlist)}
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
    </>
  );
}
