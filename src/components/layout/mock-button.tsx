import { Button } from '../ui/button.tsx';

const base = import.meta.env.BASE_URL;

async function fetchMock(name: string): Promise<string> {
  const res = await fetch(`${base}mocks/${name}`);
  // GitHub Pages and the nginx preview answer missing files with the HTML 404
  // page, so check the status instead of storing HTML as "data"
  if (!res.ok) throw new Error(`Failed to load ${name}: ${res.status}`);
  return res.text();
}

export function MockButton() {
  async function setMockData() {
    const [userDataRaw, playlistDataRaw] = await Promise.all([
      fetchMock('user-data-mock.json'),
      fetchMock('playlists-data-mock.json'),
    ]);

    localStorage.clear();
    localStorage.setItem('user-data', userDataRaw);
    localStorage.setItem('playlists-data', playlistDataRaw);
    window.location.reload();
  }

  return (
    <Button className="mr-3" variant="outline" onClick={setMockData}>
      Mock UI
    </Button>
  );
}
