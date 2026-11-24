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

// Versão de 60 s (YouTube Shorts) do resumo do workshop. Em relação à de 90 s:
// cada fala começa direto no ponto (trimBefore), sai o "motor e freio" e um
// b-roll do "mão na massa", e os depoimentos ficam só com a frase principal.
// Trilha: "Running Faster" (Infraction), montada por scripts/preparar-trilha-infraction.sh:
// drop da música no frame 1050 ("mão na massa") e acorde final no frame 1743 (@aleguimas).
export const Resumo60: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      {/* ---------- Abertura: Cuiabá */}
      <Sequence name="Abertura" durationInFrames={120} premountFor={fps}>
        <Abertura />
      </Sequence>

      {/* ---------- Vilma abre: "Finalizamos aí o workshop de IA com o facilitador Alexandre." */}
      <Sequence name="Vilma abre" from={120} durationInFrames={222} premountFor={fps}>
        <Clipe arquivo="vilma-abre.mp4" trimBefore={98} zoom={[1.08, 1.18]} x={[540, 540]} y={[820, 800]} />
      </Sequence>

      {/* ---------- Falas do Alexandre */}
      <Sequence name="Humano robotizado" from={342} durationInFrames={126} premountFor={fps}>
        <Clipe arquivo="robotizado.mp4" zoom={[1.75, 1.9]} x={[490, 525]} y={[660, 640]} />
      </Sequence>
      <Sequence name="Banco ou bando" from={468} durationInFrames={135} premountFor={fps}>
        <Clipe arquivo="bando.mp4" zoom={[1.6, 1.7]} x={[675, 440]} y={[660, 650]} />
      </Sequence>
      <Sequence name="Chute bem escrito" from={603} durationInFrames={160} premountFor={fps}>
        <Clipe arquivo="chute.mp4" trimBefore={78} zoom={[1.72, 1.85]} x={[800, 760]} y={[680, 670]} />
      </Sequence>
      <Sequence name="Erra valendo" from={763} durationInFrames={90} premountFor={fps}>
        <Clipe arquivo="erra-valendo.mp4" trimBefore={66} zoom={[1.6, 1.7]} x={[600, 605]} y={[740, 730]} />
      </Sequence>
      <Sequence name="Estagiário" from={853} durationInFrames={180} premountFor={fps}>
        <Clipe arquivo="estagiario.mp4" trimBefore={34} zoom={[1.7, 1.85]} x={[620, 690]} y={[680, 660]} />
      </Sequence>

      {/* ---------- Mão na massa (drop da música no frame 1050) */}
      <Sequence name="B-roll slide" from={1033} durationInFrames={17} premountFor={fps}>
        <Clipe arquivo="broll-slide.mp4" zoom={[1.6, 1.9]} x={[700, 720]} y={[560, 540]} mudo />
      </Sequence>
      <Sequence name="B-roll notebooks" from={1050} durationInFrames={60} premountFor={fps}>
        <Clipe arquivo="broll-notebooks.mp4" zoom={[1.5, 1.65]} x={[430, 450]} y={[740, 730]} mudo />
      </Sequence>

      {/* ---------- Maíra: "obviamente a IA já é uma realidade…" + "cabeça explodindo" */}
      <Sequence name="Maíra" from={1110} durationInFrames={248} premountFor={fps}>
        <Moldura inicio1={150} duracao1={149} duracao2={99} />
      </Sequence>

      {/* ---------- Simony: "…trouxe muitos insights para os empresários…" */}
      <Sequence name="Simony" from={1358} durationInFrames={154} premountFor={fps}>
        <Clipe arquivo="simony.mp4" trimBefore={60} zoom={[1.05, 1.15]} x={[540, 540]} y={[820, 800]} />
      </Sequence>

      {/* ---------- Vilma fecha: "foram dois dias maravilhosos e incríveis, muitas descobertas" */}
      <Sequence name="Vilma fecha" from={1512} durationInFrames={195} premountFor={fps}>
        <Clipe arquivo="vilma-fecha.mp4" trimBefore={60} zoom={[1.1, 1.2]} x={[540, 540]} y={[800, 780]} />
      </Sequence>

      {/* ---------- Encerramento @aleguimas (impacto no frame 1743, acorde final da música) */}
      <Sequence name="Encerramento" from={1689} durationInFrames={111} premountFor={fps}>
        <Encerramento impacto={54} />
      </Sequence>

      {/* ---------- Assinatura do Guimas (molduras de canto + @aleguimas) */}
      <Sequence name="Assinatura" from={120} durationInFrames={1569} premountFor={fps}>
        <Assinatura />
      </Sequence>

      {/* ---------- Palavras em destaque e tarjas */}
      <Tarja name="Tarja Vilma" from={126} durationInFrames={120} premountFor={fps} nome="Vilma Santos" cargo="CDL Cuiabá" topo={1600} />
      <Destaque name="Workshop de IA" from={179} durationInFrames={160} premountFor={fps} linha1="WORKSHOP" linha2="DE IA" tamanho1={120} tamanho2={150} atrasoLinha2={0.45} topo={1040} />
      <Destaque name="Humano robotizado" from={382} durationInFrames={84} premountFor={fps} linha1="HUMANO" linha2="ROBOTIZADO" tamanho1={110} tamanho2={130} atrasoLinha2={0.93} topo={1330} />
      <Destaque name="Banco ou bando" from={530} durationInFrames={72} premountFor={fps} linha1="BANCO OU" linha2="BANDO DE DADOS?" tamanho1={110} tamanho2={86} atrasoLinha2={1.3} topo={1330} />
      <Destaque name="Novembro" from={605} durationInFrames={76} premountFor={fps} linha1="QUANTO VOU VENDER" linha2="EM NOVEMBRO?" tamanho1={76} tamanho2={104} atrasoLinha2={0.83} topo={1330} />
      <Destaque name="Chute bem escrito" from={706} durationInFrames={57} premountFor={fps} linha1="UM CHUTE MUITO" linha2="BEM ESCRITO" tamanho1={92} tamanho2={116} atrasoLinha2={1.03} topo={1330} />
      <Destaque name="Erra valendo" from={767} durationInFrames={86} premountFor={fps} linha1="ELE ERRA" linha2="VALENDO" tamanho1={120} tamanho2={160} atrasoLinha2={2.17} topo={1330} />
      <Destaque name="Estagiário" from={857} durationInFrames={172} premountFor={fps} linha1="A IA É UM" linha2="ESTAGIÁRIO" tamanho1={110} tamanho2={128} atrasoLinha2={2.1} topo={1330} />
      <Destaque name="Mão na massa" from={1050} durationInFrames={58} premountFor={fps} linha1="MÃO NA" linha2="MASSA" tamanho1={170} tamanho2={230} atrasoLinha2={0.15} topo={760} />
      <Tarja name="Tarja Maíra" from={1115} durationInFrames={110} premountFor={fps} nome="Maíra Calane" cargo="Loja Tuizi" topo={1200} />
      <Destaque name="IA já é realidade" from={1159} durationInFrames={99} premountFor={fps} linha1="A IA JÁ É" linha2="UMA REALIDADE" tamanho1={100} tamanho2={100} atrasoLinha2={0.3} topo={1420} />
      <Destaque name="Cabeça explodindo" from={1302} durationInFrames={56} premountFor={fps} linha1="CABEÇA" linha2="EXPLODINDO" tamanho1={110} tamanho2={128} atrasoLinha2={0.3} topo={1300} />
      <Tarja name="Tarja Simony" from={1363} durationInFrames={110} premountFor={fps} nome="Simony Bastos" cargo="Gestora regional de varejo · Sebrae MT" topo={1560} />
      <Destaque name="Muitos insights" from={1372} durationInFrames={100} premountFor={fps} linha1="MUITOS" linha2="INSIGHTS" tamanho1={110} tamanho2={150} atrasoLinha2={0.5} topo={1120} />
      <Destaque name="Dois dias incríveis" from={1517} durationInFrames={140} premountFor={fps} linha1="DOIS DIAS" linha2="INCRÍVEIS" tamanho1={110} tamanho2={140} atrasoLinha2={3.27} topo={1300} />
      <Destaque name="Muitas descobertas" from={1661} durationInFrames={41} premountFor={fps} linha1="MUITAS" linha2="DESCOBERTAS" tamanho1={110} tamanho2={118} atrasoLinha2={0.35} topo={1300} />

      {/* ---------- Clarões nas trocas de bloco */}
      <Sequence name="Flash 120" from={120} durationInFrames={8} premountFor={fps}><Flash /></Sequence>
      <Sequence name="Flash 1033" from={1033} durationInFrames={6} premountFor={fps}><Flash intensidade={0.5} /></Sequence>
      <Sequence name="Flash 1050" from={1050} durationInFrames={8} premountFor={fps}><Flash intensidade={0.85} /></Sequence>
      <Sequence name="Flash 1110" from={1110} durationInFrames={8} premountFor={fps}><Flash /></Sequence>
      <Sequence name="Flash 1358" from={1358} durationInFrames={5} premountFor={fps}><Flash intensidade={0.4} /></Sequence>
      <Sequence name="Flash 1512" from={1512} durationInFrames={5} premountFor={fps}><Flash intensidade={0.4} /></Sequence>

      {/* ---------- Trilha "Running Faster" (Infraction): baixa nas falas, cheia na abertura,
          no "mão na massa" e no final, com fade-out no último segundo */}
      <Audio
        name="Trilha"
        src={staticFile("resumo/trilha-infraction-60.wav")}
        premountFor={fps}
        volume={(f) =>
          interpolate(
            f,
            [0, 112, 126, 1036, 1050, 1094, 1110, 1680, 1700, 1770, 1800],
            [0.8, 0.8, 0.22, 0.22, 0.8, 0.8, 0.22, 0.22, 0.85, 0.85, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
    </>
  );
};
