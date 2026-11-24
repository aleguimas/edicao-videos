import { Composition, Still } from "remotion";
import { CapaDecisao, CapaDecisaoInsta } from "./decisao/Capa";
import { CORTES_DECISAO } from "./decisao/Cortes";
import { Decisao, DecisaoPiloto, DURACAO_DECISAO, DURACAO_DECISAO_PILOTO } from "./decisao/Decisao";
import { AcompanhamentoCompleto, AcompanhamentoPiloto, DURACAO_COMPLETO_ACOMP, DURACAO_PILOTO_ACOMP } from "./acompanhamento/Acompanhamento";
import { CapaAcompanhamento } from "./acompanhamento/CapaAcompanhamento";
import { CapaApresentacao } from "./apresentacao/CapaApresentacao";
import { CapaCorte1, Corte1, DURACAO_CORTE1 } from "./cortes/Corte1";
import { CORTES } from "./cortes/Cortes";
import { ApresentacaoCrm, DURACAO_CRM } from "./crm/Apresentacao";
import { CapaCrm } from "./crm/CapaCrm";
import { AnuncioCrm, DURACAO_ANUNCIO_CRM } from "./crm/Anuncio";
import { AnuncioVerticalCrm, BumperCrm, DURACAO_ANUNCIO_V_CRM, DURACAO_BUMPER_CRM } from "./crm/AnunciosCurtos";
import { LARGURA_CRM, ALTURA_CRM } from "./crm/Kit";
import { TelaAgenteIA } from "./crm/TelaAgente";
import { TelaChatNoite } from "./crm/TelaChat";
import { TelaFaq } from "./crm/TelaFaq";
import { CORTES_ACOMP } from "./cortes-acompanhamento/Cortes";
import { CORTES_CRM } from "./cortes-crm/Cortes";
import { Apresentacao, ApresentacaoPiloto, DURACAO_APRESENTACAO, DURACAO_PILOTO } from "./apresentacao/Apresentacao";
import { CapaVerbas } from "./verbas/CapaVerbas";
import { CapaContasVerba } from "./verbas/CapaContasVerba";
import { CapaTreinamento } from "./verbas/CapaTreinamento";
import { DURACAO_TREINAMENTO, TreinamentoVerbas } from "./verbas/Treinamento";
import { DURACAO_VERBAS, VerbasAcordos } from "./verbas/VerbasAcordos";
import { DURACAO_COMPLETO, VerbasCompleto } from "./verbas/VerbasCompleto";
import { ContasVerba, DURACAO_CONTAS_VERBA } from "./verbas/ContasVerba";

// Vídeos de demonstração dos módulos do Agentic Office (16:9), apresentados pela Ana,
// a Assistente de IA da Simplí. Voz: scripts/gerar-voz.py a partir de scripts/falas-<módulo>.json.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="ApresentacaoCrm" component={ApresentacaoCrm} durationInFrames={DURACAO_CRM} fps={30} width={1920} height={1080} />
      <Composition id="AnuncioCrm" component={AnuncioCrm} durationInFrames={DURACAO_ANUNCIO_CRM} fps={30} width={1920} height={1080} />
      <Composition id="AnuncioVerticalCrm" component={AnuncioVerticalCrm} durationInFrames={DURACAO_ANUNCIO_V_CRM} fps={30} width={1080} height={1920} />
      <Composition id="BumperCrm" component={BumperCrm} durationInFrames={DURACAO_BUMPER_CRM} fps={30} width={1920} height={1080} />
      {CORTES_CRM.map((c) => (
        <Composition key={c.n} id={`CorteCrm${c.n}`} component={c.Corte} durationInFrames={c.duracao} fps={30} width={1080} height={1920} />
      ))}
      {CORTES_CRM.map((c) => (
        <Still key={c.n} id={`CapaCorteCrm${c.n}`} component={c.Capa} width={1080} height={1920} />
      ))}
      <Still id="CapaCrm" component={CapaCrm} width={1920} height={1080} />
      <Still id="CrmAgenteIA" component={TelaAgenteIA} width={LARGURA_CRM} height={ALTURA_CRM} />
      <Still id="CrmChat" component={TelaChatNoite} width={LARGURA_CRM} height={ALTURA_CRM} />
      <Still id="CrmFaq" component={TelaFaq} width={LARGURA_CRM} height={ALTURA_CRM} />
      <Composition id="Apresentacao" component={Apresentacao} durationInFrames={DURACAO_APRESENTACAO} fps={30} width={1920} height={1080} />
      <Composition id="AcompanhamentoCompleto" component={AcompanhamentoCompleto} durationInFrames={DURACAO_COMPLETO_ACOMP} fps={30} width={1920} height={1080} />
      <Still id="CapaAcompanhamento" component={CapaAcompanhamento} width={1920} height={1080} />
      {CORTES_ACOMP.map((c) => (
        <Composition key={c.n} id={`CorteAcomp${c.n}`} component={c.Corte} durationInFrames={c.duracao} fps={30} width={1080} height={1920} />
      ))}
      {CORTES_ACOMP.map((c) => (
        <Still key={c.n} id={`CapaCorteAcomp${c.n}`} component={c.Capa} width={1080} height={1920} />
      ))}
      <Composition id="AcompanhamentoPiloto" component={AcompanhamentoPiloto} durationInFrames={DURACAO_PILOTO_ACOMP} fps={30} width={1920} height={1080} />
      <Composition id="Corte1" component={Corte1} durationInFrames={DURACAO_CORTE1} fps={30} width={1080} height={1920} />
      <Still id="CapaCorte1" component={CapaCorte1} width={1080} height={1920} />
      {CORTES.map((c) => (
        <Composition key={c.n} id={`Corte${c.n}`} component={c.Corte} durationInFrames={c.duracao} fps={30} width={1080} height={1920} />
      ))}
      {CORTES.map((c) => (
        <Still key={c.n} id={`CapaCorte${c.n}`} component={c.Capa} width={1080} height={1920} />
      ))}
      <Still id="CapaApresentacao" component={CapaApresentacao} width={1920} height={1080} />
      <Composition id="Decisao" component={Decisao} durationInFrames={DURACAO_DECISAO} fps={30} width={1920} height={1080} />
      <Still id="CapaDecisao" component={CapaDecisao} width={1920} height={1080} />
      <Still id="CapaDecisaoInsta" component={CapaDecisaoInsta} width={1080} height={1920} />
      {CORTES_DECISAO.map((c) => (
        <Composition key={c.chave} id={`CorteDecisao${c.n}`} component={c.Corte} durationInFrames={c.duracao} fps={30} width={1080} height={1920} />
      ))}
      {CORTES_DECISAO.map((c) => (
        <Still key={c.chave} id={`CapaCorteDecisao${c.n}`} component={c.Capa} width={1080} height={1920} />
      ))}
      <Composition id="DecisaoPiloto" component={DecisaoPiloto} durationInFrames={DURACAO_DECISAO_PILOTO} fps={30} width={1920} height={1080} />
      <Composition id="ApresentacaoPiloto" component={ApresentacaoPiloto} durationInFrames={DURACAO_PILOTO} fps={30} width={1920} height={1080} />
      <Still id="CapaVerbas" component={CapaVerbas} width={1920} height={1080} />
      <Still id="CapaContasVerba" component={CapaContasVerba} width={1920} height={1080} />
      <Still id="CapaTreinamento" component={CapaTreinamento} width={1920} height={1080} />
      <Composition id="ContasVerba" component={ContasVerba} durationInFrames={DURACAO_CONTAS_VERBA} fps={30} width={1920} height={1080} />
      <Composition id="TreinamentoVerbas" component={TreinamentoVerbas} durationInFrames={DURACAO_TREINAMENTO} fps={30} width={1920} height={1080} />
      <Composition id="VerbasCompleto" component={VerbasCompleto} durationInFrames={DURACAO_COMPLETO} fps={30} width={1920} height={1080} />
      <Composition id="VerbasAcordos" component={VerbasAcordos} durationInFrames={DURACAO_VERBAS} fps={30} width={1920} height={1080} />
    </>
  );
};
