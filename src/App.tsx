import { ThemeProvider } from "./components/layout/theme-provider";
import { Navigation } from "./components/layout/navigation";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {<Navigation />}
    </ThemeProvider>
  );
}

export default App;
