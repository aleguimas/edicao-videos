import { Composition, Folder } from "remotion";
import { Apresentacao } from "./Apresentacao";
import { DestaqueFrente } from "./DestaqueFrente";
import { Encerramento } from "./Encerramento";
import { VideoConteudo } from "./VideoConteudo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoFreio"
        component={VideoConteudo}
        durationInFrames={1365}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Cenas">
        <Composition
          id="Apresentacao"
          component={Apresentacao}
          durationInFrames={1308}
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
          id="DestaqueFrente"
          component={DestaqueFrente}
          durationInFrames={75}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            linha1: "Um ótimo",
            linha2: "freio",
            tamanho1: 110,
            tamanho2: 170,
            opacidadeTexto: 0.85,
            atrasoLinha2: 0.75,
          }}
        />
      </Folder>
    </>
  );
};
