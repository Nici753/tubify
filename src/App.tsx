import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/layout/theme-provider';
import { View } from './components/layout/View.tsx';
import { SpotifyCallback } from './components/login/spotify-callback.tsx';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<View />} />
          <Route path="/callback" element={<SpotifyCallback />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
