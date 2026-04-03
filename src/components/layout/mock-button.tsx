import { Button } from '../ui/Button.tsx';

export function MockButton() {
  // not using zustand or stores here for simplicity
  async function setMockData() {
    // Fetch the raw content from the public folder
    // Note: Using .text() keeps the string exactly as it is in the file
    const [userRes, playlistRes] = await Promise.all([
      fetch('/mocks/user-data-mock.json'),
      fetch('/mocks/playlists-data-mock.json') // I assumed .json here for easy fetching
    ]);

    const userDataRaw = await userRes.text();
    const playlistDataRaw = await playlistRes.text();

    localStorage.clear();
    localStorage.setItem('user-data', userDataRaw);
    localStorage.setItem('playlists-data', playlistDataRaw);
    window.location.reload();
  }

  return(
    <Button className={'mr-3'} variant="outline" onClick={setMockData}>
      Mock UI
    </Button>
  );
}