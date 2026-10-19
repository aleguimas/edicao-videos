import { Composition, Still } from "remotion";
import { Capa } from "./Capa";
import { Resumo } from "./Resumo";
import { Resumo60 } from "./Resumo60";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Resumo60"
        component={Resumo60}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Resumo"
        component={Resumo}
        durationInFrames={2700}
        fps={30}
        width={1080}
        height={1920}
      />
      <Still id="Capa" component={Capa} width={1080} height={1920} />
    </>
  );
};
