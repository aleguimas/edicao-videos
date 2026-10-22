import { Composition } from "remotion";
import { Depoimento } from "./depoimento/Depoimento";
import { LEGENDAS_EXEMPLO } from "./depoimento/legendas-exemplo";

// Um <Composition> por depoimento. Duração = duracaoVideo + ~112 frames (3,7 s) da citação final.
// Exemplo: depoimento da Vilma Santos (workshop de Cuiabá), vídeo de 0,4 s a 56,65 s.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DepoimentoExemplo"
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
          legendas: LEGENDAS_EXEMPLO,
          destaques: ["CDL", "Cuiabá", "inteligência", "artificial", "Conecta", "Negócios", "Sebrae", "insights", "IA", "ferramenta", "vendas", "incríveis", "descobertas"],
          citacao: ["A IA é uma ferramenta", "que nós, empresários,", "precisamos levar para", "nossas empresas."],
          citacaoInicioDegrade: 2,
          foco: { x: 540, y: 820 },
          // modo moldura (vídeo com legendas/figurinhas queimadas), ex. Maíra:
          // moldura: { x: 108, y: 570, w: 864, h: 850 },
          // fundo: "fundo-sala.mp4",
          // topoTarja: 1290,
        }}
      />
    </>
  );
};
