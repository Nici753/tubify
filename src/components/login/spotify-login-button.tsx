import { Button } from '../ui/Button.tsx';
import SpotifyIcon from '../ui/SpotifyIcon.tsx';

export function SpotifyLoginButton() {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
  const REDIRECT_URI = 'http://127.0.0.1:5173/callback'; //using fixed IPv4 for spotify auth callback
  //const REDIRECT_URI = 'http://[::1]:5173/callback'; // could also use IPv6 for spotify auth callback
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const SCOPES =
    'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private';

  // Generate random string for code verifier
  function generateRandomString(length: number): string {
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  }

  // Generate code challenge from verifier
  async function generateCodeChallenge(codeVerifier: string): Promise<string> {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  async function handleLogin() {
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = crypto.randomUUID();

    // Store for later use
    sessionStorage.setItem('spotify_code_verifier', codeVerifier);
    sessionStorage.setItem('spotify_auth_state', state);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      state: state,
    });

    window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
  }

  return (
    <div className={'mr-3'}>
      <Button variant="outline" onClick={handleLogin}>
        <SpotifyIcon className={'h-[1.2rem] w-[1.2rem] mr-1'} />
        Add Spotify Account
      </Button>
    </div>
  );
}
