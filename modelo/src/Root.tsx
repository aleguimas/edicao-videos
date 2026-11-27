import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const Root = () => (
  <Composition
    id="MyVideo"
    component={MyVideo}
    durationInFrames={150}
    fps={30}
    width={1080}
    height={1920}
  />
);
