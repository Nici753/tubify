# Tubify

A simple music player built with React, TypeScript, Shadcn and Vite.
Can transcribe your playlists from Spotify to YouTube.

## Disclaimer

This project is intended for personal and educational use only. It is designed to demonstrate how to interact with the Spotify and YouTube APIs. You must use your own credentials and only access your own data. Do not use this app to copy, distribute, or manipulate copyrighted content. Any public or commercial use may violate the terms of service of Spotify and Google.

## next steps

### code improvements

- [x] make helper function for deleting and updating playlists
- [x] make a update playlist button
- [x] search songs on YouTube and add them to the playlist
- [x] get your playlists from YouTube
- [x] create a YouTube playlist
- [x] add songs to a YouTube playlist
- [x] handle quota exceeded on update playlist
- [x] use Ref instead of document.getElementById
- [x] fix redux error (doesn't cause any issues yet so it can wait) -> use zustand instead with indexedDB
- [x] fix Spotify login
- [x] fix playlist export again after token refresh
- [x] use structured copy or functions that return an object instead of referencing it
- [x] add a test mode (a button that test logs you in and adds some mock data just to see the app)
- [x] implement search function
- [x] add search function to sidebar and modals
- [ ] implement and add an edit playlist attributes modal
- [ ] write unit tests for both APIs

### ui improvements

- [x] make sidebar and component resizable https://ui.shadcn.com/docs/components/resizable
- [x] make sidebar and component scrollable https://ui.shadcn.com/docs/components/scroll-area
- [x] make modals scrollable https://ui.shadcn.com/docs/components/scroll-area
- [x] add toast notifications about import status
- [x] redesign top bar ... more specific logout functionalities and export button adjustment
- [x] redesign logout
- [x] add a test mode (a button that test logs you in and adds some mock data just to see the app)
- [x] add searchbar to modals
- [ ] improve toasts
- [ ] write some playwright tests
- [ ] add loading spinner
- [ ] add progress bar
- [ ] add skeleton

## how to start

add .env file with the following content:

```
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

then run the following commands:

```bash
bun install
bun dev
```

### Spotify API Key

1. To get your Spotify Client ID:
2. Go to the Spotify Developer Dashboard.
3. Log in with your Spotify account.
4. Click “Create an App”.
5. Fill in the app name and description.
6. After creation, you’ll see your Client ID and Client Secret.

Add the Client ID to your .env file:

```bash
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
```

### YouTube (Google) API Key

1. To get your Google OAuth Client ID for YouTube access:
2. Go to the Google Cloud Console.
3. Create a new project or select an existing one.
4. Navigate to APIs & Services → Library.
5. Search for YouTube Data API v3 and enable it.
6. Go to APIs & Services → Credentials.
7. Click “Create Credentials” → “OAuth 2.0 Client ID”.
8. Choose Web Application and set your Authorized redirect URIs (e.g. http://localhost:3000).
   After creation, copy your Client ID and add it to your .env file:

```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## React + TypeScript + Vite + Bun

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Some Hints
### How I like to debug:

1. Set up a new JavaScriptDebug Configuration
2. In this Case set the URL to http://127.0.0.1:5173/
3. Start the program
   ```bash
   bun run dev
   ```
4. Log in and copy the login data from local storage
5. Start the debug configuration
6. Paste the login data to local storage (we do this cause it is tricky to log into YouTube over the debugging browser)