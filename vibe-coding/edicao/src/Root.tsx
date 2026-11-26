import { Composition } from "remotion";
import { Capa } from "./Capa";
import { DURACAO_FATURA, FaturaAoVivo } from "./fatura/FaturaAoVivo";
import { CapaFatura } from "./fatura/CapaFatura";
import { DURACAO, MontanhaRussa } from "./MontanhaRussa";
import { DURACAO_POV, MontanhaRussaPov } from "./pov/MontanhaRussaPov";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="MontanhaRussa" component={MontanhaRussa} durationInFrames={DURACAO} fps={30} width={1080} height={1920} />
      <Composition id="MontanhaRussaPov" component={MontanhaRussaPov} durationInFrames={DURACAO_POV} fps={30} width={1080} height={1920} />
      <Composition id="CapaPov" component={Capa} defaultProps={{ versao: "pov" as const }} durationInFrames={DURACAO_POV} fps={30} width={1080} height={1920} />
      <Composition id="Capa2d" component={Capa} defaultProps={{ versao: "2d" as const }} durationInFrames={DURACAO} fps={30} width={1080} height={1920} />
      <Composition id="FaturaAoVivo" component={FaturaAoVivo} durationInFrames={DURACAO_FATURA} fps={30} width={1080} height={1920} />
      <Composition id="CapaFatura" component={CapaFatura} durationInFrames={DURACAO_FATURA} fps={30} width={1080} height={1920} />
    </>
  );
};
