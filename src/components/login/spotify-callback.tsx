import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button.tsx';
import useUserStore from '../../lib/store/user-store.ts';

export function SpotifyCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { setSpotifyToken } = useUserStore();

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const storedState = sessionStorage.getItem('spotify_auth_state');
      const codeVerifier = sessionStorage.getItem('spotify_code_verifier');

      // Verify state matches
      if (state !== storedState) {
        setError('State mismatch - possible CSRF attack');
        return;
      }

      if (!code || !codeVerifier) {
        setError('Missing authorization code or verifier');
        return;
      }

      try {
        // Exchange code for access token
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://127.0.0.1:5173/callback',
            code_verifier: codeVerifier,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error_description || 'Failed to get access token',
          );
        }

        const data = await response.json();

        // Store tokens
        sessionStorage.setItem('spotify_access_token', data.access_token);
        sessionStorage.setItem('spotify_refresh_token', data.refresh_token);
        sessionStorage.setItem(
          'spotify_token_expiry',
          String(Date.now() + data.expires_in * 1000),
        );
        setSpotifyToken(data.access_token);

        // Clean up
        sessionStorage.removeItem('spotify_code_verifier');
        sessionStorage.removeItem('spotify_auth_state');

        // Redirect to your app
        navigate('/');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Token exchange error:', err);
      }
    }

    handleCallback();
  }, [navigate, setSpotifyToken]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600">{error}</p>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
          >
            Back to main page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">Connecting to Spotify...</p>
      </div>
    </div>
  );
}
