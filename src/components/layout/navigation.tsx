import { ModeToggle } from "./mode-togle.tsx";
import { YoutubeLoginButton } from "../login/youtube-login-button.tsx";
import { SpotifyLoginButton } from "../login/spotify-login-button.tsx";

export function Navigation() {
  return (
    <div className={"flex flex-row-reverse p-3 border-b-2"}>
      <ModeToggle />
      <SpotifyLoginButton />
      <YoutubeLoginButton />
    </div>
  );
}
export default Navigation;
