import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu.tsx';
import { Button } from '../ui/button.tsx';
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
import { ScrollArea } from '../ui/scroll-area.tsx';
import usePlaylistStore from '../../lib/store/playlist-store.ts';
import playlistStore from '../../lib/store/playlist-store.ts';
import useUserStore from '../../lib/store/user-store.ts';
import { Searchbar } from './searchbar.tsx';

export function ExImportButton() {
  const spotifyApi: SpotifyAPIService = SpotifyAPIService.getInstance();
  const youtubeApi: YoutubeAPIService = YoutubeAPIService.getInstance();
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
  const [updateSearchQuery, setUpdateSearchQuery] = useState('');
  const [exportSearchQuery, setExportSearchQuery] = useState('');

  const { youtube_access_token, spotify_access_token } = useUserStore();

  const youtubeLoggedIn: boolean = !!youtube_access_token;
  const spotifyLoggedIn: boolean = !!spotify_access_token;

  const importPlaylist = async (importedPlaylists: Playlist[]) => {
    const playlists: Playlist[] =
      await spotifyApi.importPlaylist(importedPlaylists);
    playlists.forEach((playlist: Playlist): void => {
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

  const selectedPlaylist: Playlist | null = usePlaylistStore((state) => state.selectedPlaylist);
  const playlists: Playlist[] = playlistStore((state: PlaylistState) => state.playlists);

  const filteredUpdatePlaylists: Playlist[] = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(updateSearchQuery.toLowerCase()),
  );

  const filteredExportPlaylists: Playlist[] = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(exportSearchQuery.toLowerCase()),
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={'mr-3'} asChild>
          <Button variant={'outline'} size={'icon'}>
            <Folder />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {spotifyLoggedIn && (
            <DropdownMenuItem onClick={(): Promise<void> => importPlaylist(playlists)}>
              <Download className={'mr-3'} />
              Import
            </DropdownMenuItem>
          )}
          {youtubeLoggedIn && (
            <DropdownMenuItem onClick={(): void => setUpdateModal(true)}>
              <RefreshCw className={'mr-3'} />
              Update
            </DropdownMenuItem>
          )}
          {youtubeLoggedIn && (
            <DropdownMenuItem onClick={(): void => setExportModal(true)}>
              <Upload className={'mr-3'} />
              Export
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={(): void => setDeleteModal(true)}>
            <Trash2 className={'mr-3'} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {updateModal &&
        createPortal(
          <Card
            className={'inset-x-1/4 top-[20vh] h-[60vh] flex flex-col absolute z-50 border-4 shadow-md shadow-neutral-950'}>
            <CardHeader className={'shrink-0'}>
              <CardTitle>Update Playlists</CardTitle>
              <CardDescription>
                Choose a playlist to add song equivalents from YouTube
              </CardDescription>
              <div className={'pt-2'}>
                <Searchbar
                  value={updateSearchQuery}
                  onChange={setUpdateSearchQuery}
                />
              </div>
            </CardHeader>
            <CardContent className={'flex-1 overflow-hidden p-0 px-6'}>
              <ScrollArea className={'h-full w-full pr-4'}>
                <div className={'flex flex-col gap-2 pb-6'}>
                  {filteredUpdatePlaylists.length > 0 ? (
                    filteredUpdatePlaylists.map((playlist: Playlist) => (
                      <div
                        key={playlist.SpotifyId}
                        className={'flex items-center space-x-2 p-1 cursor-pointer hover:bg-accent rounded'}
                        onClick={(): Promise<void> => updatePlaylistWithYoutubeSongs(playlist)}
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
                    ))
                  ) : (
                    <p className={'text-center text-muted-foreground py-10'}>No playlists found.</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className={'flex flex-row-reverse shrink-0 pt-4'}>
              <Button variant={'outline'} onClick={(): void => {
                setUpdateModal(false);
                setUpdateSearchQuery(''); // Reset search on close
              }}>
                Cancel
              </Button>
            </CardFooter>
          </Card>,
          document.body,
        )}
      {exportModal &&
        createPortal(
          <Card
            className={'inset-x-1/4 top-[20vh] h-[60vh] flex flex-col absolute z-50 border-4 shadow-md shadow-neutral-950'}>
            <CardHeader className={'shrink-0'}>
              <CardTitle>Export Playlists</CardTitle>
              <CardDescription>
                Choose a playlist to export to YouTube
              </CardDescription>
              <div className={'pt-2'}>
                <Searchbar
                  value={exportSearchQuery}
                  onChange={setExportSearchQuery}
                />
              </div>
            </CardHeader>
            <CardContent className={'flex-1 overflow-hidden p-0 px-6'}>
              <ScrollArea className={'h-full w-full pr-4'}>
                <div className={'flex flex-col gap-2 pb-6'}>
                  {filteredExportPlaylists.length > 0 ? (
                    filteredExportPlaylists.map((playlist: Playlist) => (
                      <div
                        key={playlist.SpotifyId}
                        className={'flex items-center space-x-2 p-1 cursor-pointer hover:bg-accent rounded'}
                        onClick={(): Promise<void> => exportPlaylist(playlist)}
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
                    ))
                  ) : (
                    <p className={'text-center text-muted-foreground py-10 text-sm'}>
                      No matches found.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className={'flex flex-row-reverse shrink-0 pt-4'}>
              <Button variant={'outline'} onClick={(): void => {
                setExportModal(false);
                setExportSearchQuery(''); // Reset search on close
              }}>
                Cancel
              </Button>
            </CardFooter>
          </Card>,
          document.body,
        )}
      {deleteModal &&
        createPortal(
          <Card
            className={'inset-x-1/4 top-[40vh] h-[20vh] absolute z-50 border-4 shadow-md shadow-neutral-950'}>
            <CardHeader>
              <CardTitle>Delete Playlists Locally</CardTitle>
              <CardDescription>
                Do you want to delete the selected or all playlist(s)?
              </CardDescription>
            </CardHeader>
            <CardContent className={'flex flex-row gap-2 h-fit'}>
              <div className={'grid grid-cols-2 gap-2 w-full'}>
                {selectedPlaylist && selectedPlaylist.SpotifyId && (
                  <Button
                    variant={'outline'}
                    className={'w-full'}
                    onClick={(): void => {
                      removePlaylist(selectedPlaylist.SpotifyId);
                      unselectPlaylist();
                      setDeleteModal(false);
                    }}
                  >
                    Delete Selected Playlist
                  </Button>
                )}
                <Button
                  variant={'outline'}
                  className={'w-full'}
                  onClick={(): void => {
                    clearPlaylists();
                    setDeleteModal(false);
                  }}
                >
                  Delete All Playlists
                </Button>
              </div>
            </CardContent>
            <CardFooter className={'flex flex-row-reverse'}>
              <Button variant={'outline'} onClick={(): void => setDeleteModal(false)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>,
          document.body,
        )}
    </>
  );
}
