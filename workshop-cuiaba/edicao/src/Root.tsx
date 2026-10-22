import { Composition, Still } from "remotion";
import { Capa } from "./Capa";
import { CapaCorte } from "./corte/CapaCorte";
import { Corte01 } from "./corte/Corte01";
import { Corte02 } from "./corte/Corte02";
import { Corte03 } from "./corte/Corte03";
import { Corte04 } from "./corte/Corte04";
import { Corte06 } from "./corte/Corte06";
import { Corte07 } from "./corte/Corte07";
import { Corte10 } from "./corte/Corte10";
import { CapaDepoimento } from "./depoimento/CapaDepoimento";
import { CapaDepoimentoDupla } from "./depoimento/CapaDepoimentoDupla";
import { Depoimento } from "./depoimento/Depoimento";
import { LEGENDAS_MAIRA } from "./depoimento/legendas-maira";
import { LEGENDAS_SIMONY_GERALDO } from "./depoimento/legendas-simony-geraldo";
import { LEGENDAS_VILMA } from "./depoimento/legendas-vilma";
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
      {/* Corte 01 editado (modelo de corte @aleguimas): 52,7 s de fala + 2,5 s de chamada final */}
      <Composition id="Corte01" component={Corte01} durationInFrames={1657} fps={30} width={1080} height={1920} />
      <Composition id="Corte02" component={Corte02} durationInFrames={1450} fps={30} width={1080} height={1920} />
      <Composition id="Corte03" component={Corte03} durationInFrames={1434} fps={30} width={1080} height={1920} />
      <Composition id="Corte04" component={Corte04} durationInFrames={1405} fps={30} width={1080} height={1920} />
      <Composition id="Corte06" component={Corte06} durationInFrames={1752} fps={30} width={1080} height={1920} />
      <Composition id="Corte07" component={Corte07} durationInFrames={1500} fps={30} width={1080} height={1920} />
      <Composition id="Corte10" component={Corte10} durationInFrames={1632} fps={30} width={1080} height={1920} />
      <Still
        id="CapaCorte10"
        component={CapaCorte}
        width={1080}
        height={1920}
        defaultProps={{
          foto: "resumo/capa-frame-perto.png",
          foco: { x: 680, y: 600, zoom: 1.35 },
          etiqueta: "IA NA PRÁTICA",
          topo: "O QUE VOCÊ COLOCA NA IA",
          riscada: "É SÓ SEU",
          destaque: "TREINA",
          fim: "A FERRAMENTA",
        }}
      />
      <Still
        id="CapaCorte07"
        component={CapaCorte}
        width={1080}
        height={1920}
        defaultProps={{
          foto: "resumo/capa-frame-perto.png",
          foco: { x: 680, y: 600, zoom: 1.35 },
          etiqueta: "IA NA PRÁTICA",
          topo: "NA IA, O SINAL NÃO É",
          riscada: "VERDE",
          destaque: "VERMELHO",
          fim: "NÃO ENTRA",
        }}
      />
      <Still
        id="CapaCorte06"
        component={CapaCorte}
        width={1080}
        height={1920}
        defaultProps={{
          foto: "resumo/capa-frame-perto.png",
          foco: { x: 680, y: 600, zoom: 1.35 },
          etiqueta: "IA NA PRÁTICA",
          topo: "NÃO É SÓ O MELHOR",
          riscada: "MOTOR",
          destaque: "FREIO",
          fim: "TAMBÉM GANHA CORRIDA",
        }}
      />
      <Still
        id="CapaCorte04"
        component={CapaCorte}
        width={1080}
        height={1920}
        defaultProps={{
          foto: "resumo/capa-frame-perto.png",
          foco: { x: 680, y: 600, zoom: 1.35 },
          etiqueta: "IA NA PRÁTICA",
          topo: "NÃO É QUE A IA",
          riscada: "PODE",
          destaque: "ERRA",
          fim: "VALENDO",
        }}
      />
      <Still
        id="CapaCorte03"
        component={CapaCorte}
        width={1080}
        height={1920}
        defaultProps={{
          foto: "resumo/capa-frame-perto.png",
          foco: { x: 680, y: 600, zoom: 1.35 },
          etiqueta: "IA NA PRÁTICA",
          topo: "NAS EMPRESAS TEM MUITO",
          riscada: "ROBÔ",
          destaque: "HUMANO",
          fim: "ROBOTIZADO",
        }}
      />
      <Still
        id="CapaCorte02"
        component={CapaCorte}
        width={1080}
        height={1920}
        defaultProps={{
          foto: "resumo/capa-frame-perto.png",
          foco: { x: 680, y: 600, zoom: 1.35 },
          etiqueta: "IA NA PRÁTICA",
          topo: "QUANTO VOU VENDER EM NOVEMBRO?",
          riscada: "PREVISÃO",
          destaque: "CHUTE",
          fim: "MUITO BEM ESCRITO",
        }}
      />
      <Still
        id="CapaCorte01"
        component={CapaCorte}
        width={1080}
        height={1920}
        defaultProps={{
          foto: "resumo/capa-frame-perto.png",
          foco: { x: 680, y: 600, zoom: 1.35 },
          etiqueta: "IA NA PRÁTICA",
          topo: "SUA EMPRESA TEM UM",
          riscada: "BANCO",
          destaque: "BANDO",
          fim: "DE DADOS?",
        }}
      />
      <Still id="Capa" component={Capa} width={1080} height={1920} />
      {/* Capas dos depoimentos: frase literal de cada pessoa */}
      <Still
        id="CapaDepoimentoVilma"
        component={CapaDepoimento}
        width={1080}
        height={1920}
        defaultProps={{
          foto: "capa-vilma.png",
          centro: { x: 540, y: 640 },
          escala: 1.12,
          frase: ["Dois dias incríveis,", "muitas descobertas"],
          inicioDegrade: 1,
          nome: "Vilma Santos",
          cargo: "CDL Cuiabá",
          evento: "WORKSHOP IA · CUIABÁ",
        }}
      />
      <Still
        id="CapaDepoimentoSimonyGeraldo"
        component={CapaDepoimentoDupla}
        width={1080}
        height={1920}
        defaultProps={{
          rostos: [
            { foto: "capa-simony.png", centro: { x: 520, y: 540 }, escala: 0.95, nome: "Simony Bastos", cargo: "Sebrae MT" },
            { foto: "capa-geraldo.png", centro: { x: 540, y: 560 }, escala: 0.95, nome: "Geraldo Costa", cargo: "Estrela da Borracha" },
          ],
          frase: ["Duas manhãs", "bem produtivas"],
          inicioDegrade: 1,
          evento: "WORKSHOP IA · CUIABÁ",
        }}
      />
      <Still
        id="CapaDepoimentoMaira"
        component={CapaDepoimento}
        width={1080}
        height={1920}
        defaultProps={{
          foto: "capa-maira.png",
          centro: { x: 540, y: 1000 },
          escala: 1.0,
          frase: ["Voltei com a cabeça", "explodindo"],
          inicioDegrade: 1,
          nome: "Maíra Calane",
          cargo: "Loja Tuizi",
          evento: "WORKSHOP IA · CUIABÁ",
        }}
      />
      {/* Depoimento da Vilma: vídeo de 0,4 s a 56,65 s (1688 frames) + 112 frames de citação = 60 s */}
      <Composition
        id="DepoimentoVilma"
        component={Depoimento}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          arquivo: "vilma-santos.mp4",
          inicioMs: 400,
          duracaoVideo: 1688,
          nome: "Vilma Santos",
          cargo: "CDL Cuiabá",
          evento: "WORKSHOP IA · CUIABÁ",
          legendas: LEGENDAS_VILMA,
          destaques: ["CDL", "Cuiabá", "inteligência", "artificial", "Conecta", "Negócios", "Sebrae", "insights", "IA", "ferramenta", "vendas", "incríveis", "descobertas"],
          citacao: ["A IA é uma ferramenta", "que nós, empresários,", "precisamos levar para", "nossas empresas."],
          citacaoInicioDegrade: 2,
          foco: { x: 540, y: 820 },
        }}
      />
      {/* Depoimento da Maíra: repost do Instagram (legendas e figurinhas queimadas) ->
          modo moldura com a região limpa y 570–1420 e a sala do workshop desfocada atrás.
          Vídeo de 0,15 s a 55,6 s (1662 frames) + 112 frames de citação */}
      <Composition
        id="DepoimentoMaira"
        component={Depoimento}
        durationInFrames={1774}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          arquivo: "maira-calane.mp4",
          inicioMs: 150,
          duracaoVideo: 1662,
          nome: "Maíra Calane",
          cargo: "Loja Tuizi",
          evento: "WORKSHOP IA · CUIABÁ",
          legendas: LEGENDAS_MAIRA,
          destaques: ["cabeça", "explodindo", "workshop", "inteligência", "artificial", "realidade", "automatizar", "informação", "CDL", "Cuiabá", "Sebrae", "valioso", "possibilidades"],
          citacao: ["A inteligência artificial", "já é uma realidade,", "nós precisamos aprender", "a trabalhar com ela."],
          citacaoInicioDegrade: 2,
          foco: { x: 540, y: 960 },
          moldura: { x: 108, y: 570, w: 864, h: 850 },
          fundo: "fundo-sala.mp4",
          topoTarja: 1290,
        }}
      />
      {/* Simony (Sebrae MT) + Geraldo (Estrela da Borracha): dois depoimentos curtos num vídeo.
          Arquivo preparado: Simony 0–20,2 s, Geraldo a partir de 20,2 s. Vídeo de 0,15 s a 38,75 s
          (1158 frames) + 150 frames da citação dupla */}
      <Composition
        id="DepoimentoSimonyGeraldo"
        component={Depoimento}
        durationInFrames={1308}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          arquivo: "simony-geraldo.mp4",
          inicioMs: 150,
          duracaoVideo: 1158,
          nome: "Simony Bastos",
          cargo: "Sebrae MT",
          evento: "WORKSHOP IA · CUIABÁ",
          legendas: LEGENDAS_SIMONY_GERALDO,
          destaques: ["Sebrae", "Conecta", "Negócios", "CDL", "Cuiabá", "insights", "soluções", "workshop", "IA", "negócios", "produtivas"],
          citacao: [],
          citacaoInicioDegrade: 0,
          foco: { x: 540, y: 860 },
          pessoas: [
            {
              nome: "Simony Bastos",
              cargo: "Gestora regional de varejo · Sebrae MT",
              inicioS: 0,
              citacao: ["Muitos insights", "para os empresários", "e soluções para facilitar", "o dia a dia dos negócios."],
              citacaoInicioDegrade: 2,
            },
            {
              nome: "Geraldo Costa",
              cargo: "Estrela da Borracha",
              inicioS: 20.2,
              citacao: ["Foram duas manhãs", "bem produtivas."],
              citacaoInicioDegrade: 1,
            },
          ],
        }}
      />
    </>
  );
};
