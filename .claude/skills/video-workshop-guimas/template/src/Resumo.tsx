import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Abertura } from "./Abertura";
import { Assinatura } from "./Assinatura";
import { Clipe } from "./Clipe";
import { Destaque } from "./Destaque";
import { Encerramento } from "./Encerramento";
import { Flash } from "./Flash";
import { Moldura } from "./Moldura";
import { Tarja } from "./Tarja";

// Vídeo resumo do Workshop IA para Empresários (Cuiabá), 90 s (Instagram, TikTok, LinkedIn).
// Trilha: "Running Faster" (Infraction), montada por scripts/preparar-trilha-infraction.sh:
// drop da música no frame 1620 ("mão na massa") e acorde final no frame 2652 (@aleguimas).
export const Resumo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      {/* ---------- 1. Abertura: Cuiabá */}
      <Sequence name="Abertura" durationInFrames={120} premountFor={fps}>
        <Abertura />
      </Sequence>

      {/* ---------- 2. Vilma abre */}
      <Sequence name="Vilma abre" from={120} durationInFrames={322} premountFor={fps}>
        <Clipe arquivo="vilma-abre.mp4" zoom={[1.08, 1.18]} x={[540, 540]} y={[820, 800]} />
      </Sequence>

      {/* ---------- 3–8. Falas do Alexandre (câmera acompanha) */}
      <Sequence name="Humano robotizado" from={442} durationInFrames={126} premountFor={fps}>
        <Clipe arquivo="robotizado.mp4" zoom={[1.75, 1.9]} x={[490, 525]} y={[660, 640]} />
      </Sequence>
      <Sequence name="Banco ou bando" from={568} durationInFrames={135} premountFor={fps}>
        <Clipe arquivo="bando.mp4" zoom={[1.6, 1.7]} x={[675, 440]} y={[660, 650]} />
      </Sequence>
      <Sequence name="Chute bem escrito" from={703} durationInFrames={237} premountFor={fps}>
        <Clipe arquivo="chute.mp4" zoom={[1.7, 1.85]} x={[815, 760]} y={[680, 670]} />
      </Sequence>
      <Sequence name="Erra valendo" from={940} durationInFrames={276} premountFor={fps}>
        <Clipe arquivo="erra-valendo.mp4" zoom={[1.6, 1.75]} x={[600, 610]} y={[740, 720]} />
      </Sequence>
      <Sequence name="Estagiário" from={1216} durationInFrames={213} premountFor={fps}>
        <Clipe arquivo="estagiario.mp4" zoom={[1.7, 1.85]} x={[615, 690]} y={[680, 660]} />
      </Sequence>
      <Sequence name="Motor e freio" from={1429} durationInFrames={144} premountFor={fps}>
        <Clipe arquivo="freio.mp4" zoom={[1.7, 1.85]} x={[750, 750]} y={[700, 680]} />
      </Sequence>

      {/* ---------- 9. Mão na massa (só música, cortes no tempo) */}
      <Sequence name="B-roll slide" from={1573} durationInFrames={47} premountFor={fps}>
        <Clipe arquivo="broll-slide.mp4" zoom={[1.6, 1.9]} x={[700, 720]} y={[560, 540]} mudo />
      </Sequence>
      <Sequence name="B-roll notebooks" from={1620} durationInFrames={60} premountFor={fps}>
        <Clipe arquivo="broll-notebooks.mp4" zoom={[1.5, 1.65]} x={[430, 450]} y={[740, 730]} mudo />
      </Sequence>
      <Sequence name="B-roll palestra" from={1680} durationInFrames={60} premountFor={fps}>
        <Clipe arquivo="broll-palestra.mp4" zoom={[1.75, 1.55]} x={[575, 575]} y={[650, 650]} mudo />
      </Sequence>

      {/* ---------- 10. Maíra (moldura sobre a sala desfocada) */}
      <Sequence name="Maíra" from={1740} durationInFrames={397} premountFor={fps}>
        <Moldura duracao1={298} duracao2={99} />
      </Sequence>

      {/* ---------- 11. Simony */}
      <Sequence name="Simony" from={2137} durationInFrames={204} premountFor={fps}>
        <Clipe arquivo="simony.mp4" trimBefore={9} zoom={[1.05, 1.15]} x={[540, 540]} y={[820, 800]} />
      </Sequence>

      {/* ---------- 12. Vilma fecha */}
      <Sequence name="Vilma fecha" from={2341} durationInFrames={253} premountFor={fps}>
        <Clipe arquivo="vilma-fecha.mp4" zoom={[1.1, 1.2]} x={[540, 540]} y={[800, 780]} />
      </Sequence>

      {/* ---------- 13. Encerramento @aleguimas (impacto no frame 2652, acorde final da música) */}
      <Sequence name="Encerramento" from={2590} durationInFrames={110} premountFor={fps}>
        <Encerramento impacto={62} />
      </Sequence>

      {/* ---------- Assinatura do Guimas (molduras de canto + @aleguimas) */}
      <Sequence name="Assinatura" from={120} durationInFrames={2470} premountFor={fps}>
        <Assinatura />
      </Sequence>

      {/* ---------- Palavras em destaque (sincronizadas com a fala) */}
      <Tarja name="Tarja Vilma" from={135} durationInFrames={135} premountFor={fps} nome="Vilma Santos" cargo="CDL Cuiabá" topo={1560} />
      <Destaque name="Workshop de IA" from={277} durationInFrames={160} premountFor={fps} linha1="WORKSHOP" linha2="DE IA" tamanho1={120} tamanho2={150} atrasoLinha2={0.45} topo={1250} />
      <Destaque name="Humano robotizado" from={482} durationInFrames={84} premountFor={fps} linha1="HUMANO" linha2="ROBOTIZADO" tamanho1={110} tamanho2={130} atrasoLinha2={0.93} topo={1330} />
      <Destaque name="Banco ou bando" from={630} durationInFrames={72} premountFor={fps} linha1="BANCO OU" linha2="BANDO DE DADOS?" tamanho1={110} tamanho2={86} atrasoLinha2={1.3} topo={1330} />
      <Destaque name="Novembro" from={782} durationInFrames={76} premountFor={fps} linha1="QUANTO VOU VENDER" linha2="EM NOVEMBRO?" tamanho1={76} tamanho2={104} atrasoLinha2={0.83} topo={1330} />
      <Destaque name="Chute bem escrito" from={882} durationInFrames={68} premountFor={fps} linha1="UM CHUTE MUITO" linha2="BEM ESCRITO" tamanho1={92} tamanho2={116} atrasoLinha2={1.03} topo={1330} />
      <Destaque name="Erra valendo" from={1052} durationInFrames={120} premountFor={fps} linha1="ELE ERRA" linha2="VALENDO" tamanho1={120} tamanho2={160} atrasoLinha2={0.63} topo={1330} />
      <Destaque name="Achando que está certo" from={1176} durationInFrames={40} premountFor={fps} linha1="ACHANDO QUE" linha2="ESTÁ CERTO" tamanho1={100} tamanho2={130} atrasoLinha2={0.4} topo={1330} />
      <Destaque name="Estagiário" from={1254} durationInFrames={172} premountFor={fps} linha1="A IA É UM" linha2="ESTAGIÁRIO" tamanho1={110} tamanho2={128} atrasoLinha2={2.1} topo={1330} />
      <Destaque name="Motor e freio" from={1457} durationInFrames={116} premountFor={fps} linha1="MELHOR MOTOR" linha2="MELHOR FREIO" tamanho1={104} tamanho2={108} atrasoLinha2={2.23} topo={1330} />
      <Destaque name="Mão na massa" from={1620} durationInFrames={120} premountFor={fps} linha1="MÃO NA" linha2="MASSA" tamanho1={170} tamanho2={230} atrasoLinha2={0.15} topo={760} />
      <Tarja name="Tarja Maíra" from={1752} durationInFrames={130} premountFor={fps} nome="Maíra Calane" cargo="Loja Tuizi" topo={1240} />
      <Destaque name="IA já é realidade" from={1936} durationInFrames={100} premountFor={fps} linha1="A IA JÁ É" linha2="UMA REALIDADE" tamanho1={100} tamanho2={100} atrasoLinha2={0.3} topo={1300} />
      <Destaque name="Cabeça explodindo" from={2078} durationInFrames={59} premountFor={fps} linha1="CABEÇA" linha2="EXPLODINDO" tamanho1={110} tamanho2={128} atrasoLinha2={0.3} topo={1300} />
      <Tarja name="Tarja Simony" from={2145} durationInFrames={130} premountFor={fps} nome="Simony Bastos" cargo="Gestora regional de varejo · Sebrae MT" topo={1560} />
      <Destaque name="Muitos insights" from={2202} durationInFrames={100} premountFor={fps} linha1="MUITOS" linha2="INSIGHTS" tamanho1={110} tamanho2={150} atrasoLinha2={0.5} topo={1120} />
      <Destaque name="Dois dias incríveis" from={2406} durationInFrames={140} premountFor={fps} linha1="DOIS DIAS" linha2="INCRÍVEIS" tamanho1={110} tamanho2={140} atrasoLinha2={3.27} topo={1300} />
      <Destaque name="Muitas descobertas" from={2548} durationInFrames={46} premountFor={fps} linha1="MUITAS" linha2="DESCOBERTAS" tamanho1={110} tamanho2={118} atrasoLinha2={0.35} topo={1300} />

      {/* ---------- Clarões nas trocas de bloco (no tempo da música) */}
      <Sequence name="Flash 120" from={120} durationInFrames={8} premountFor={fps}><Flash /></Sequence>
      <Sequence name="Flash 1573" from={1573} durationInFrames={6} premountFor={fps}><Flash intensidade={0.5} /></Sequence>
      <Sequence name="Flash 1620" from={1620} durationInFrames={8} premountFor={fps}><Flash intensidade={0.85} /></Sequence>
      <Sequence name="Flash 1680" from={1680} durationInFrames={6} premountFor={fps}><Flash intensidade={0.5} /></Sequence>
      <Sequence name="Flash 1740" from={1740} durationInFrames={8} premountFor={fps}><Flash /></Sequence>
      <Sequence name="Flash 2137" from={2137} durationInFrames={5} premountFor={fps}><Flash intensidade={0.4} /></Sequence>
      <Sequence name="Flash 2341" from={2341} durationInFrames={5} premountFor={fps}><Flash intensidade={0.4} /></Sequence>

      {/* ---------- Trilha "Running Faster" (Infraction): ~12 dB abaixo da voz nas falas, cheia na
          abertura, no "mão na massa" e no encerramento, com fade-out no último segundo */}
      <Audio
        name="Trilha"
        src={staticFile("resumo/trilha-infraction-90.wav")}
        premountFor={fps}
        volume={(f) =>
          interpolate(
            f,
            [0, 112, 126, 1566, 1580, 1724, 1740, 2588, 2606, 2670, 2700],
            [0.8, 0.8, 0.22, 0.22, 0.8, 0.8, 0.22, 0.22, 0.85, 0.85, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
    </>
  );
};
