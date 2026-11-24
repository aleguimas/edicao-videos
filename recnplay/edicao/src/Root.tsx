import { Composition, Still } from "remotion";
import { Capa } from "./Capa";
import { Resumo } from "./Resumo";
import { Resumo60 } from "./Resumo60";
import { TesteCamera } from "./rp/TesteCamera";
import { Completo, duracaoCompleto } from "./rp/Completo";
import { Resumo90, duracaoResumo } from "./rp/Resumo90";
import { CORTES, Corte, duracaoCorte } from "./rp/Corte";
import { CapaCorte, CapaRP } from "./rp/CapaRP";

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
      <Composition id="TesteCamera" component={TesteCamera} durationInFrames={600} fps={30} width={1920} height={1080} />
      <Composition id="Completo" component={Completo} durationInFrames={duracaoCompleto(30)} fps={30} width={1920} height={1080} />
      <Composition id="Resumo90" component={Resumo90} durationInFrames={duracaoResumo(30)} fps={30} width={1080} height={1920} />
      {Object.keys(CORTES).map((id) => (
        <Composition key={id} id={id} component={Corte} defaultProps={{ id }} durationInFrames={duracaoCorte(id, 30)} fps={30} width={1080} height={1920} />
      ))}
      <Still id="CapaYoutube" component={CapaRP} width={1920} height={1080} />
      {Object.keys(CORTES).map((id) => (
        <Still key={`capa-${id}`} id={`capa-${id}`} component={CapaCorte} defaultProps={{ id, linhas: CORTES[id].titulo }} width={1080} height={1920} />
      ))}
      <Still id="CapaResumo" component={CapaRP} defaultProps={{ vertical: true }} width={1080} height={1920} />
      <Still id="Capa" component={Capa} width={1080} height={1920} />
    </>
  );
};
