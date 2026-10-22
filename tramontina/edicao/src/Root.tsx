import { Composition, Still } from "remotion";
import { CapaVisita } from "./visita/CapaVisita";
import { DURACAO_VISITA, VisitaTramontina } from "./visita/VisitaTramontina";

// Vídeo da visita técnica à Tramontina (Farroupilha-RS), realizada pela FIERGS e pelo Sebrae PE.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="VisitaTramontina" component={VisitaTramontina} durationInFrames={DURACAO_VISITA} fps={30} width={1080} height={1920} />
      <Still id="CapaVisita" component={CapaVisita} width={1080} height={1920} />
    </>
  );
};
