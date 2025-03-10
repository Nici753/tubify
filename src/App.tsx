import { ThemeProvider } from './components/layout/theme-provider';
import { View } from './components/layout/View.tsx';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {<View />}
    </ThemeProvider>
  );
}

export default App;
