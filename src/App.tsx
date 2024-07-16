import { ThemeProvider } from './components/layout/theme-provider';
import { View } from './components/layout/View.tsx';
import { Provider } from 'react-redux';
import { store } from './lib/store/store.ts';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {<View />}
      </ThemeProvider>
    </Provider>
  );
}

export default App;
