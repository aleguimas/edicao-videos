import { Composition, Still } from "remotion";
import { CapaLongo } from "./longo/CapaLongo";
import { DURACAO_LONGO, VideoLongo } from "./longo/VideoLongo";
import { CapaMissao } from "./missao/CapaMissao";
import { DURACAO_MISSAO, MissaoRevestir } from "./missao/MissaoRevestir";

// Revestir Home Center (Fortaleza-CE): letramento em IA e implantação do Agentic Office.
// MissaoRevestir = vertical curto da missão; VideoLongo = vídeo de YouTube 16:9 com o conteúdo.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="MissaoRevestir" component={MissaoRevestir} durationInFrames={DURACAO_MISSAO} fps={30} width={1080} height={1920} />
      <Still id="CapaMissao" component={CapaMissao} width={1080} height={1920} />
      <Composition id="VideoLongo" component={VideoLongo} durationInFrames={DURACAO_LONGO} fps={30} width={1920} height={1080} />
      <Still id="CapaLongo" component={CapaLongo} width={1920} height={1080} />
    </>
  );
};
