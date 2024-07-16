export const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('playlists', serializedState);
  } catch(e) {
    console.warn(e);
  }
}

export const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('playlists');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch(e) {
    console.warn(e);
    return undefined;
  }
}