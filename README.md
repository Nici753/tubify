# Tubify

A simple music player built with React, TypeScript, and Vite.
Will transcribe your playlists from Spotify to YouTube.

## next steps

### adding YouTube

- [x] make helper function for deleting and updating playlists
- [x] make a update playlist button
- [x] search songs on YouTube and add them to the playlist
- [x] get your playlists from YouTube
- [x] create a YouTube playlist
- [x] add songs to a YouTube playlist
- [X] handle quota exceeded on update playlist
- [x] use Ref instead of document.getElementById
- [x] fix redux error (doesn't cause any issues yet so it can wait) -> use zustand instead with indexedDB
- [ ] use structured copy or functions that return an object instead of referencing it

### ui improvements

- [x] make sidebar and component resizable https://ui.shadcn.com/docs/components/resizable
- [ ] make sidebar and component scrollable https://ui.shadcn.com/docs/components/scroll-area
- [ ] add toast notifications about import status
- [ ] add loading spinner

## how to start

add .env file with the following content:

```
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

first install [bun!](https://bun.sh/) alternatively you can use npm or yarn

then run the following commands:

```bash
bun install
bun dev
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
