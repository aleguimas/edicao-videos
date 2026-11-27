import { Config } from "@remotion/cli/config";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// O Chrome headless não roda de dentro de ~/Documents (pasta sincronizada pelo
// iCloud e protegida pelo macOS): falha com "icudtl.dat not found in bundle".
// Por isso ele fica fora do projeto, em ~/.local/remotion.
const chrome = join(
  homedir(),
  ".local/remotion/chrome-headless-shell-158.0.8127.2/chrome-headless-shell",
);
if (existsSync(chrome)) {
  Config.setBrowserExecutable(chrome);
}
