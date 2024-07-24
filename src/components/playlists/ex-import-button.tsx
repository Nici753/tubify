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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const playlists = useSelector((state: PlaylistState) => {
    return state.playlists.playlists;
  });

  const importPlaylist = async () => {
    if (localStorage.getItem('playlists')) {
      deletePlaylist();
    }
    const playlists: Playlist[] = await spotifyApi.importPlaylist();
    playlists.forEach((playlist) => {
      dispatch(addPlaylist(playlist));
    });
  };

  const exportPlaylist = () => {};

  function deletePlaylist() {
    store.dispatch(deleteAllPlaylists());
    localStorage.removeItem('playlists');
    dispatch(selectPlaylist(null));
  }

  function updatePlaylist(playlistToUpdate: Playlist) {
    setIsModalOpen(false);
    console.log('updating playlists');
    const updatetedPlaylist = youtubeApi.updatePlaylist(playlistToUpdate);
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
          <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
            <RefreshCw className="mr-3" />
            Update
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
      {isModalOpen &&
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
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>,
          document.body,
        )}
    </>
  );
}
