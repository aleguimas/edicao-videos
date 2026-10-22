import { Composition } from "remotion";
import { CorteExemplo } from "./corte/CorteExemplo";

// Um <Composition> por corte. Duração = frames do corte preparado + 75 da chamada final.
// Exemplo: corte 04 do workshop de Cuiabá ("a IA erra valendo"), 1330 + 75 frames.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="CorteExemplo" component={CorteExemplo} durationInFrames={1405} fps={30} width={1080} height={1920} />
    </>
  );
};
