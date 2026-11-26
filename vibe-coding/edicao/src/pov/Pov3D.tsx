import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { PARADAS, T, xCarrinho } from "../curva";
import { ARCOS_NOVOS, pista, pistaNova, rolagem, S_PICO, sDeX, sNovo, tangente, V, type V3 } from "./pista";

const LAVANDA = "#B4A3F7";
const AZUL = "#8DB0FF";
const VERMELHO = "#FF4D6A";
const CEU = "#070B1E";
const NEBLINA = "#1B2150";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const tremor = (f: number, s: number) => Math.sin(f * 1.7 + s) * 0.6 + Math.sin(f * 3.1 + s * 2) * 0.4;

// ---------- Câmera ----------
// mistura entre o drone (0) e o assento do carrinho (1)
export const misturaPov = (f: number) =>
  interpolate(f, [52, 100, V.drone, V.drone + 50], [0, 1, 1, 0], { ...cl, easing: Easing.inOut(Easing.cubic) });

const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

const Camera: React.FC = () => {
  const f = useCurrentFrame();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  useLayoutEffect(() => {
    const b = misturaPov(f);
    const naNova = f >= T.virada;
    const fn = naNova ? pistaNova : pista;
    const s = naNova ? sNovo(f) : sDeX(xCarrinho(f));

    // assento: 1,6 m acima do trilho, olhando 14 m à frente
    const p = fn(s);
    const alvo = fn(s + 14);
    let pos: V3 = [p[0], p[1] + 1.7, p[2]];
    let olha: V3 = [alvo[0], alvo[1] + 1.1, alvo[2]];
    // no topo o olhar fica no horizonte (suspense); na queda ele mergulha
    const minDy = interpolate(f, [T.queda - 4, T.queda + 8], [-3.5, -40], cl);
    if (!naNova && olha[1] - pos[1] < minDy) olha = [olha[0], pos[1] + minDy, olha[2]];

    // tremor na queda
    const naQueda = f >= T.queda && f < T.rebobinar;
    let roll = rolagem(s) * 14;
    if (naQueda) {
      const solavanco = [T.queda, T.chave, T.fatura, T.chao]
        .map((q) => interpolate(f - q, [0, 4, 26], [0, 1, 0], cl))
        .reduce((a, v) => Math.max(a, v), 0);
      const impacto = interpolate(f, [796, 800, 830], [0, 1, 0], cl);
      const amp = 0.04 + 0.22 * solavanco + 0.5 * impacto;
      pos = [pos[0] + tremor(f, 1) * amp, pos[1] + tremor(f, 5) * amp, pos[2]];
      roll += tremor(f, 9) * (0.01 + 0.05 * solavanco + 0.08 * impacto);
    }
    // no topo o carrinho balança
    if (f >= T.topo && f < T.queda) roll += Math.sin((f - T.topo) * 0.35) * 0.02;

    // drone: vista lateral alta, mostra a pista inteira (na virada, as duas)
    const final = f >= T.virada;
    const droneAlvo: V3 = final ? [14, 28, -150] : [0, 32, -118];
    const dronePos: V3 = final ? [330, 120, 190] : [330, 110, 215];
    const subida = interpolate(f, [0, 52], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
    const dronePosAnim = lerp3([dronePos[0] * 1.08, dronePos[1] * 1.1, dronePos[2] + 40], dronePos, final ? 1 : subida);

    const e = b;
    const cPos = lerp3(dronePosAnim, pos, e);
    const cAlvo = lerp3(droneAlvo, olha, e);
    camera.fov = 44 + (78 - 44) * e;
    camera.near = 0.1;
    camera.far = 3000;
    camera.updateProjectionMatrix();
    camera.position.set(...cPos);
    camera.up.set(0, 1, 0);
    camera.lookAt(...cAlvo);
    camera.rotateZ(roll * e);
  }, [f, camera]);
  return null;
};

// ---------- Geometria da pista ----------
const lado = (fn: (s: number) => V3, s: number, d: number): V3 => {
  const t = tangente(fn, s);
  const n = Math.hypot(t[0], t[2]);
  const perp: V3 = [-t[2] / n, 0, t[0] / n];
  const p = fn(s);
  return [p[0] + perp[0] * d, p[1], p[2] + perp[2] * d];
};

const tubo = (fn: (s: number) => V3, de: number, ate: number, d: number, raio: number) => {
  const pts: THREE.Vector3[] = [];
  for (let s = de; s <= ate; s += 1) pts.push(new THREE.Vector3(...lado(fn, s, d)));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length * 2, raio, 8, false);
};

const Trilhos: React.FC<{ readonly fn: (s: number) => V3; readonly de: number; readonly ate: number; readonly cor: string; readonly visivel?: number }> = ({
  fn,
  de,
  ate,
  cor,
  visivel = 1,
}) => {
  const geos = useMemo(
    () => ({
      e: tubo(fn, de, ate, -0.8, 0.11),
      d: tubo(fn, de, ate, 0.8, 0.11),
      ge: tubo(fn, de, ate, -0.8, 0.3),
      gd: tubo(fn, de, ate, 0.8, 0.3),
    }),
    [fn, de, ate],
  );
  return (
    <group>
      <mesh geometry={geos.e}>
        <meshBasicMaterial color={cor} transparent opacity={visivel} />
      </mesh>
      <mesh geometry={geos.d}>
        <meshBasicMaterial color={cor} transparent opacity={visivel} />
      </mesh>
      <mesh geometry={geos.ge}>
        <meshBasicMaterial color={cor} transparent opacity={0.22 * visivel} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh geometry={geos.gd}>
        <meshBasicMaterial color={cor} transparent opacity={0.22 * visivel} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

// dormentes e pilares como instâncias
const Estrutura: React.FC<{ readonly fn: (s: number) => V3; readonly ate: number; readonly visivel?: number }> = ({ fn, ate, visivel = 1 }) => {
  const dormentes = useRef<THREE.InstancedMesh>(null);
  const pilares = useRef<THREE.InstancedMesh>(null);
  const nD = Math.floor((ate + 20) / 1.3);
  const nP = Math.floor((ate + 20) / 7);
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    for (let i = 0; i < nD; i++) {
      const s = -20 + i * 1.3;
      const p = fn(s);
      const t = tangente(fn, s);
      o.position.set(p[0], p[1] - 0.18, p[2]);
      o.lookAt(p[0] + t[0], p[1] - 0.18 + t[1], p[2] + t[2]);
      o.scale.set(1, 1, 1);
      o.updateMatrix();
      dormentes.current?.setMatrixAt(i, o.matrix);
    }
    if (dormentes.current) dormentes.current.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < nP; i++) {
      const s = -20 + i * 7;
      const p = fn(s);
      const h = Math.max(0.1, p[1] - 0.3);
      o.position.set(p[0], h / 2, p[2]);
      o.rotation.set(0, 0, 0);
      o.scale.set(1, h, 1);
      o.updateMatrix();
      pilares.current?.setMatrixAt(i, o.matrix);
    }
    if (pilares.current) pilares.current.instanceMatrix.needsUpdate = true;
  }, [fn, nD, nP]);
  return (
    <group>
      <instancedMesh ref={dormentes} args={[undefined, undefined, nD]}>
        <boxGeometry args={[2.1, 0.14, 0.32]} />
        <meshBasicMaterial color="#3A4688" transparent opacity={visivel} />
      </instancedMesh>
      <instancedMesh ref={pilares} args={[undefined, undefined, nP]}>
        <cylinderGeometry args={[0.16, 0.22, 1, 8]} />
        <meshBasicMaterial color="#232C66" transparent opacity={visivel} />
      </instancedMesh>
    </group>
  );
};

// arco luminoso por cima do trilho nas paradas
const Arco: React.FC<{ readonly fn: (s: number) => V3; readonly s: number; readonly cor: string; readonly aceso: boolean; readonly visivel?: number }> = ({
  fn,
  s,
  cor,
  aceso,
  visivel = 1,
}) => {
  const ref = useRef<THREE.Group>(null);
  const p = fn(s);
  const t = tangente(fn, s);
  useLayoutEffect(() => {
    ref.current?.lookAt(p[0] + t[0], p[1] + t[1], p[2] + t[2]);
  }, [p, t]);
  return (
    <group ref={ref} position={p}>
      <mesh>
        <torusGeometry args={[3.4, 0.14, 8, 48, Math.PI]} />
        <meshBasicMaterial color={aceso ? "#FFFFFF" : cor} transparent opacity={visivel} />
      </mesh>
      <mesh>
        <torusGeometry args={[3.4, 0.55, 8, 48, Math.PI]} />
        <meshBasicMaterial color={cor} transparent opacity={(aceso ? 0.5 : 0.25) * visivel} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

const Estrelas: React.FC = () => {
  const geo = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 900; i++) {
      const a = random(`ea${i}`) * Math.PI * 2;
      const r = 700 + random(`er${i}`) * 600;
      pts.push(Math.cos(a) * r, 60 + random(`ey${i}`) * 700, Math.sin(a) * r - 170);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <points geometry={geo}>
      <pointsMaterial color="#C9D4FF" size={2} sizeAttenuation={false} transparent opacity={0.7} fog={false} />
    </points>
  );
};

const Cenario: React.FC = () => {
  const f = useCurrentFrame();
  const sCarrinho = sDeX(xCarrinho(Math.min(f, T.rebobinar)));
  const nova = interpolate(f, [T.virada - 10, T.virada], [0, 1], cl);
  const antigaApagada = f >= T.virada ? 0.45 : 1;
  const SFIM = 360;
  return (
    <group>
      <color attach="background" args={[CEU]} />
      <fog attach="fog" args={[NEBLINA, 40 + 260 * (1 - misturaPov(f)), 420 + 700 * (1 - misturaPov(f))]} />
      <Estrelas />
      {/* chão com grade */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -170]}>
        <planeGeometry args={[4000, 4000]} />
        <meshBasicMaterial color="#0B1030" />
      </mesh>
      <gridHelper args={[4000, 400, "#3F58B8", "#3F58B8"]} position={[0, 0, -170]} />

      {/* pista original: sobe em lavanda, cai em vermelho */}
      <Trilhos fn={pista} de={-20} ate={S_PICO + 4} cor={LAVANDA} visivel={antigaApagada} />
      <Trilhos fn={pista} de={S_PICO + 4} ate={SFIM} cor={VERMELHO} visivel={antigaApagada} />
      <Estrutura fn={pista} ate={SFIM} visivel={antigaApagada} />
      {PARADAS.map((x) => (
        <Arco key={x} fn={pista} s={sDeX(x) + 1.5} cor={x > 1900 ? VERMELHO : AZUL} aceso={sCarrinho >= sDeX(x)} visivel={antigaApagada} />
      ))}

      {/* pista nova (só depois do rebobinar) */}
      {nova > 0 ? (
        <group>
          <Trilhos fn={pistaNova} de={-20} ate={SFIM} cor={LAVANDA} visivel={nova} />
          <Estrutura fn={pistaNova} ate={SFIM} visivel={nova} />
          {ARCOS_NOVOS.map((s) => (
            <Arco key={s} fn={pistaNova} s={s} cor={LAVANDA} aceso={sNovo(f) >= s - 1.5} visivel={nova} />
          ))}
        </group>
      ) : null}
    </group>
  );
};

export const Pov3D: React.FC = () => (
  <ThreeCanvas width={1080} height={1920} linear flat gl={{ antialias: true }}>
    <Camera />
    <Cenario />
  </ThreeCanvas>
);
