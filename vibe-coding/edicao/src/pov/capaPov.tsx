import { Frente } from "./MontanhaRussaPov";
import { Pov3D } from "./Pov3D";

// Fundo da capa: a cena 3D no quadro em que a capa é renderizada
export const MontanhaRussaPovFrente: React.FC = () => (
  <>
    <Pov3D />
    <Frente />
  </>
);
