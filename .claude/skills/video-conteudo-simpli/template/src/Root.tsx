import { Composition, Folder } from "remotion";
import { Apresentacao } from "./Apresentacao";
import { Destaque } from "./Destaque";
import { Encerramento } from "./Encerramento";
import { VideoConteudo } from "./VideoConteudo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoConteudo"
        component={VideoConteudo}
        durationInFrames={357}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Cenas">
        <Composition
          id="Apresentacao"
          component={Apresentacao}
          durationInFrames={300}
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
            linha1: "Linha um",
            linha2: "Destaque",
            tamanho1: 150,
            tamanho2: 160,
            corDestaque: "#3CE01E",
            atrasoLinha2: 0.4,
          }}
        />
      </Folder>
    </>
  );
};
