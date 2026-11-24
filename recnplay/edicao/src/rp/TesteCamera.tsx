import { AbsoluteFill } from "remotion";
import { Camera } from "./Camera";

export const TesteCamera: React.FC = () => (
  <AbsoluteFill>
    <Camera
      inicio={736}
      planos={[
        { ini: 736, fim: 743, tipo: "close", pessoa: "D" },
        { ini: 743, fim: 749, tipo: "duplaDir" },
        { ini: 749, fim: 756, tipo: "geral" },
      ]}
    />
  </AbsoluteFill>
);
