import type { Caption } from "@remotion/captions";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Assinatura } from "../Assinatura";
import { Cantos } from "../Cantos";
import { AZUL_GUIMAS, DEGRADE_BARRA, fonteMono } from "../fonte";
import { Tarja } from "../Tarja";
import { CitacaoDupla, type CitacaoPessoa } from "./CitacaoDupla";
import { CitacaoFinal } from "./CitacaoFinal";
import { Flash } from "../Flash";
import { Legendas } from "./Legendas";

// Cor do depoimento: correção leve, sem saturar. Um pouco de contraste, realces um
// tico mais baixos (o fundo claro "estoura" no celular) e um toque quente para
// tirar o tom esverdeado/frio da luz da sala. Saturação abaixo de 1.
export const FILTRO_DEPOIMENTO =
  "contrast(1.05) brightness(0.98) saturate(0.96) sepia(0.04)";

export type DepoimentoProps = {
  readonly arquivo: string; // em public/depoimentos/
  readonly inicioMs: number; // corte do início do arquivo
  readonly duracaoVideo: number; // frames de vídeo usados
  readonly nome: string;
  readonly cargo: string;
  readonly evento: string;
  readonly legendas: Caption[];
  readonly destaques: readonly string[];
  readonly citacao: readonly string[];
  readonly citacaoInicioDegrade: number;
  // ponto da origem 1080x1920 que fica no centro da tela (rosto/tronco)
  readonly foco: { readonly x: number; readonly y: number };
  // modo moldura (vídeo com legendas/figurinhas queimadas, ex.: repost do Instagram):
  // região limpa da origem 1080x1920 que aparece dentro da moldura, e o vídeo de fundo
  // (desfocado) em public/depoimentos/
  readonly moldura?: {
    readonly x: number;
    readonly y: number;
    readonly w: number;
    readonly h: number;
  };
  readonly fundo?: string;
  readonly topoTarja?: number;
  // vários depoimentos curtos num vídeo só: cada pessoa com o segundo (no arquivo
  // preparado) em que começa a falar e a sua citação. Substitui nome/cargo/citacao.
  readonly pessoas?: readonly (CitacaoPessoa & { readonly inicioS: number })[];
};

// largura da moldura na tela e posição do topo (abaixo do cabeçalho)
const MOLDURA_LARGURA = 880;
const MOLDURA_TOPO = 360;

// Padrão de depoimento do Guimas: a pessoa em tela cheia com aproximação lenta,
// cabeçalho "DEPOIMENTO", tarja com nome, legenda palavra a palavra e, no fim,
// a frase mais forte da pessoa como citação assinada.
export const Depoimento: React.FC<DepoimentoProps> = ({
  arquivo,
  inicioMs,
  duracaoVideo,
  nome,
  cargo,
  evento,
  legendas,
  destaques,
  citacao,
  citacaoInicioDegrade,
  foco,
  moldura,
  fundo,
  topoTarja = 1150,
  pessoas,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // aproximação lenta e contínua: 1,03 → 1,10 ao longo do depoimento
  const z = interpolate(frame, [0, duracaoVideo], [1.03, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const cx = Math.min(1080 - 540 / z, Math.max(540 / z, foco.x));
  const cy = Math.min(1920 - 960 / z, Math.max(960 / z, foco.y));
  const cabecalho = interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const fimCitacao = durationInFrames - duracaoVideo;
  const trimBefore = Math.round((inicioMs / 1000) * fps);
  const entradaMoldura = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C1128" }}>
      {moldura ? (
        <Sequence
          name="Depoimento (moldura)"
          durationInFrames={duracaoVideo}
          premountFor={fps}
        >
          <AbsoluteFill style={{ overflow: "hidden" }}>
            {fundo ? (
              <Video
                src={staticFile(`depoimentos/${fundo}`)}
                muted
                loop
                style={{
                  position: "absolute",
                  width: 1080,
                  height: 1920,
                  scale: "1.15",
                  filter: "blur(22px) brightness(0.55) saturate(0.9)",
                }}
              />
            ) : null}
            {/* tinta navy + brilhos do padrão do Guimas */}
            <AbsoluteFill
              style={{
                background:
                  "radial-gradient(circle at 0% 0%, rgba(52,86,178,0.5), transparent 55%), radial-gradient(circle at 100% 100%, rgba(92,66,190,0.5), transparent 55%), rgba(12,17,40,0.45)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: (1080 - MOLDURA_LARGURA) / 2,
                top: MOLDURA_TOPO,
                width: MOLDURA_LARGURA,
                height: (moldura.h * MOLDURA_LARGURA) / moldura.w,
                borderRadius: 28,
                border: "2px solid rgba(143,169,230,0.45)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
                opacity: entradaMoldura,
                scale: String(
                  (0.92 + 0.08 * entradaMoldura) *
                    interpolate(frame, [0, duracaoVideo], [1, 1.035]),
                ),
              }}
            >
              <Cantos margem={-22} tamanho={[110, 88]} espessura={4} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 26,
                  overflow: "hidden",
                }}
              >
                <Video
                  src={staticFile(`depoimentos/${arquivo}`)}
                  trimBefore={trimBefore}
                  style={{
                    position: "absolute",
                    left: (-moldura.x * MOLDURA_LARGURA) / moldura.w,
                    top: (-moldura.y * MOLDURA_LARGURA) / moldura.w,
                    width: (1080 * MOLDURA_LARGURA) / moldura.w,
                    height: (1920 * MOLDURA_LARGURA) / moldura.w,
                    filter: FILTRO_DEPOIMENTO,
                  }}
                />
              </div>
            </div>
          </AbsoluteFill>
        </Sequence>
      ) : (
        <Sequence
          name="Depoimento"
          durationInFrames={duracaoVideo}
          premountFor={fps}
        >
          <AbsoluteFill style={{ overflow: "hidden" }}>
            <Video
              src={staticFile(`depoimentos/${arquivo}`)}
              trimBefore={trimBefore}
              style={{
                position: "absolute",
                width: 1080,
                height: 1920,
                scale: String(z),
                translate: `${z * (540 - cx)}px ${z * (960 - cy)}px`,
                filter: FILTRO_DEPOIMENTO,
              }}
            />
            {/* vinheta leve + base navy para a legenda ler bem sobre roupa clara */}
            <AbsoluteFill
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(12,17,40,0.35) 100%), linear-gradient(180deg, rgba(12,17,40,0.45) 0%, transparent 14%, transparent 62%, rgba(12,17,40,0.72) 82%, rgba(12,17,40,0.85) 100%)",
              }}
            />
          </AbsoluteFill>
        </Sequence>
      )}

      {/* cabeçalho fixo */}
      <Sequence
        name="Cabeçalho"
        durationInFrames={duracaoVideo}
        premountFor={fps}
      >
        <div
          style={{
            position: "absolute",
            left: 84,
            top: 176,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: "18px 26px 20px",
            borderRadius: 16,
            backgroundColor: "rgba(12,17,40,0.72)",
            border: "1.5px solid rgba(143,169,230,0.25)",
            opacity: cabecalho,
            translate: `${(1 - cabecalho) * -30}px 0px`,
          }}
        >
          <div
            style={{
              fontFamily: fonteMono,
              fontWeight: 500,
              fontSize: 28,
              letterSpacing: "9px",
              color: "#FFFFFF",
              textShadow: "0 2px 12px rgba(5,8,25,0.8)",
            }}
          >
            {pessoas && pessoas.length > 1 ? "DEPOIMENTOS" : "DEPOIMENTO"}
          </div>
          <div
            style={{
              width: 64,
              height: 5,
              borderRadius: 3,
              backgroundImage: DEGRADE_BARRA,
            }}
          />
          <div
            style={{
              fontFamily: fonteMono,
              fontWeight: 500,
              fontSize: 22,
              letterSpacing: "4px",
              color: AZUL_GUIMAS,
              textShadow: "0 2px 12px rgba(5,8,25,0.9)",
            }}
          >
            {evento}
          </div>
        </div>
      </Sequence>

      <Sequence
        name="Assinatura"
        durationInFrames={duracaoVideo}
        premountFor={fps}
      >
        <Assinatura />
      </Sequence>

      {pessoas ? (
        pessoas.map((p, k) => {
          // frame (no vídeo editado) em que a pessoa começa
          const inicio = Math.max(
            0,
            Math.round((p.inicioS - inicioMs / 1000) * fps),
          );
          return (
            <Sequence
              key={p.nome}
              name={`Troca ${p.nome}`}
              from={inicio}
              durationInFrames={Math.round(5.2 * fps)}
              premountFor={fps}
            >
              {k > 0 ? (
                <Sequence name="Flash" durationInFrames={6}>
                  <Flash intensidade={0.45} />
                </Sequence>
              ) : null}
              <Tarja
                name={`Tarja ${p.nome}`}
                from={Math.round((k > 0 ? 0.3 : 0.6) * fps)}
                durationInFrames={Math.round(4.5 * fps)}
                premountFor={fps}
                nome={p.nome}
                cargo={p.cargo}
                topo={topoTarja}
              />
            </Sequence>
          );
        })
      ) : (
        <Tarja
          name="Tarja"
          from={Math.round(0.6 * fps)}
          durationInFrames={Math.round(4.5 * fps)}
          premountFor={fps}
          nome={nome}
          cargo={cargo}
          topo={topoTarja}
        />
      )}

      <Sequence
        name="Legendas"
        durationInFrames={duracaoVideo}
        premountFor={fps}
      >
        <Legendas
          legendas={legendas}
          destaques={destaques}
          deslocamentoMs={inicioMs}
          topo={moldura ? 1480 : 1440}
        />
      </Sequence>

      <Sequence
        name="Citação final"
        from={duracaoVideo - 3}
        durationInFrames={fimCitacao + 3}
        premountFor={fps}
      >
        {pessoas && pessoas.length > 1 ? (
          <CitacaoDupla pessoas={pessoas} />
        ) : (
          <CitacaoFinal
            linhas={citacao}
            inicioDegrade={citacaoInicioDegrade}
            nome={nome}
            cargo={cargo}
          />
        )}
      </Sequence>
    </AbsoluteFill>
  );
};
