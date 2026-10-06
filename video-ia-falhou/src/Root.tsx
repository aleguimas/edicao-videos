import { Composition, Folder } from "remotion";
import { Apresentacao } from "./Apresentacao";
import { Capa } from "./Capa";
import { Destaque } from "./Destaque";
import { Encerramento } from "./Encerramento";
import { VideoIAFalhou } from "./VideoIAFalhou";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoIAFalhou"
        component={VideoIAFalhou}
        durationInFrames={451}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Capa"
        component={Capa}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          linha1: "A IA",
          linha2: "Falhou?",
          selo: "Ou foi o processo?",
        }}
      />
      <Folder name="Cenas">
        <Composition
          id="Apresentacao"
          component={Apresentacao}
          durationInFrames={394}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Encerramento"
          component={Encerramento}
          durationInFrames={75}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ corFundo: "#0B0B0C" }}
        />
      </Folder>
      <Folder name="Elementos">
        <Composition
          id="Destaque"
          component={Destaque}
          durationInFrames={60}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            linha1: "IA",
            linha2: "Falhou",
            tamanho1: 230,
            tamanho2: 200,
            corDestaque: "#3CE01E",
            atrasoLinha2: 0.45,
          }}
        />
      </Folder>
    </>
  );
};
