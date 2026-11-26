import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  angulo,
  camera,
  caminho,
  caminhoNovo,
  CHAO,
  PARADAS,
  PICO,
  PONTOS_NOVOS,
  T,
  X0,
  XE,
  xCarrinho,
  xNovo,
  xPercorrido,
  XP,
  yCurva,
  yNova,
} from "./curva";
import { fonteMono } from "./fonte";

const VERMELHO = "#FF4D6A";

// O carrinho, desenhado em pixels de tela (origem = ponto de contato no trilho)
const Carrinho: React.FC<{ brilho: number; vermelho: number }> = ({ brilho, vermelho }) => (
  <g>
    <ellipse cx={0} cy={-30} rx={70} ry={40} fill={vermelho > 0.5 ? VERMELHO : "#9A7BF0"} opacity={0.22 * brilho} filter="url(#desfoque)" />
    {/* notebook aberto em cima do carrinho */}
    <g transform="translate(6,-50) rotate(-12)">
      <rect x={-20} y={-34} width={40} height={30} rx={4} fill="#1A2350" stroke="#C9D4FF" strokeWidth={3} />
      <rect x={-14} y={-28} width={28} height={18} rx={2} fill={vermelho > 0.5 ? VERMELHO : "#8DB0FF"} opacity={0.9} />
    </g>
    <rect x={-44} y={-48} width={88} height={34} rx={12} fill="url(#corpoCarrinho)" stroke="#FFFFFF" strokeWidth={3} />
    <rect x={-36} y={-40} width={30} height={6} rx={3} fill="#FFFFFF" opacity={0.55} />
    <circle cx={-26} cy={-9} r={9} fill="#0C1128" stroke="#FFFFFF" strokeWidth={3.5} />
    <circle cx={26} cy={-9} r={9} fill="#0C1128" stroke="#FFFFFF" strokeWidth={3.5} />
    <circle cx={44} cy={-31} r={5} fill="#FFF6C9" />
  </g>
);

export const Mundo: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camera(f);
  const z = cam.zoom;
  const b = interpolate(f, [55, 100, T.rebobinar, 915], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const px = (v: number) => v / z; // converte pixels de tela em unidades do mundo

  const naVirada = f >= T.virada;
  // carrinho: na virada ele roda a curva nova
  const xc = naVirada ? xNovo(f) : xCarrinho(f);
  const yc = naVirada ? yNova(xc) : yCurva(xc);
  const angc = naVirada ? Math.atan2(yNova(xc + 4) - yNova(xc - 4), 8) : angulo(xc);
  const balanco = f >= T.topo && f < T.queda ? Math.sin((f - T.topo) * 0.35) * 4 : 0;

  // gancho: a curva inteira se desenha no primeiro segundo e meio
  const xFantasma = interpolate(f, [0, 42], [X0, XE], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const opFantasma = interpolate(f, [0, 60, 100, T.rebobinar, T.virada], [0.75, 0.75, 0.22, 0.22, 0.16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // a linha percorrida apaga um pouco na virada
  const opAcesa = interpolate(f, [T.rebobinar, T.virada], [1, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const larguraLinha = px(7 + 8 * b);
  const escalaCarrinho = px(0.62 + 0.5 * b);
  const vermelho = !naVirada && xc > XP + 30 ? 1 : 0;

  const transform = `translate(540 ${cam.telaY}) rotate(${cam.rot}) scale(${z}) translate(${-cam.cx} ${-cam.cy})`;

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="linhaGrad" gradientUnits="userSpaceOnUse" x1={X0} y1={0} x2={XE} y2={0}>
            <stop offset="0" stopColor="#6F8FF2" />
            <stop offset={(XP - X0 - 150) / (XE - X0)} stopColor="#B4A3F7" />
            <stop offset={(XP - X0 + 60) / (XE - X0)} stopColor="#FF8FA3" />
            <stop offset={(XP - X0 + 200) / (XE - X0)} stopColor={VERMELHO} />
            <stop offset="1" stopColor="#E0284A" />
          </linearGradient>
          <linearGradient id="novaGrad" gradientUnits="userSpaceOnUse" x1={X0} y1={0} x2={XE} y2={0}>
            <stop offset="0" stopColor="#6F8FF2" />
            <stop offset="1" stopColor="#B4A3F7" />
          </linearGradient>
          <linearGradient id="corpoCarrinho" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8DB0FF" />
            <stop offset="1" stopColor="#9A7BF0" />
          </linearGradient>
          <linearGradient id="areaGrad" gradientUnits="userSpaceOnUse" x1={X0} y1={0} x2={XE} y2={0}>
            <stop offset="0" stopColor="#6F8FF2" stopOpacity={0.05} />
            <stop offset={(XP - X0) / (XE - X0)} stopColor="#B4A3F7" stopOpacity={0.22} />
            <stop offset={(XP - X0 + 160) / (XE - X0)} stopColor={VERMELHO} stopOpacity={0.2} />
            <stop offset="1" stopColor={VERMELHO} stopOpacity={0.05} />
          </linearGradient>
          <filter id="brilho" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={px(10)} />
          </filter>
          <filter id="desfoque" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation={18} />
          </filter>
        </defs>

        <g transform={transform}>
          {/* grade do gráfico */}
          {Array.from({ length: 22 }, (_, i) => (
            <line key={`v${i}`} x1={-400 + i * 200} y1={-600} x2={-400 + i * 200} y2={CHAO + 900} stroke="#8FA9E6" strokeOpacity={0.07} strokeWidth={px(1.5)} />
          ))}
          {Array.from({ length: 18 }, (_, i) => (
            <line key={`h${i}`} x1={-600} y1={-500 + i * 200} x2={XE + 1200} y2={-500 + i * 200} stroke="#8FA9E6" strokeOpacity={0.07} strokeWidth={px(1.5)} />
          ))}

          {/* eixos */}
          <line x1={X0 - 80} y1={CHAO + 50} x2={XE + 60} y2={CHAO + 50} stroke="#FFFFFF" strokeOpacity={0.85} strokeWidth={px(4)} />
          <line x1={X0 - 80} y1={CHAO + 50} x2={X0 - 80} y2={PICO - 260} stroke="#FFFFFF" strokeOpacity={0.85} strokeWidth={px(4)} />
          <path d={`M${X0 - 80 - px(14)},${PICO - 240} L${X0 - 80},${PICO - 268} L${X0 - 80 + px(14)},${PICO - 240}`} fill="none" stroke="#FFFFFF" strokeOpacity={0.85} strokeWidth={px(4)} />
          <path d={`M${XE + 40},${CHAO + 50 - px(14)} L${XE + 68},${CHAO + 50} L${XE + 40},${CHAO + 50 + px(14)}`} fill="none" stroke="#FFFFFF" strokeOpacity={0.85} strokeWidth={px(4)} />
          <text
            x={X0 - 80 - px(22)}
            y={(PICO + CHAO) / 2}
            transform={`rotate(-90 ${X0 - 80 - px(22)} ${(PICO + CHAO) / 2})`}
            textAnchor="middle"
            fill="#8FA9E6"
            fontFamily={fonteMono}
            fontWeight={700}
            fontSize={px(22)}
            letterSpacing={px(4)}
          >
            CONFIANÇA
          </text>
          <text x={(X0 + XE) / 2} y={CHAO + 50 + px(40)} textAnchor="middle" fill="#8FA9E6" fontFamily={fonteMono} fontWeight={700} fontSize={px(22)} letterSpacing={px(4)}>
            TEMPO
          </text>

          {/* curva fantasma (o caminho todo) */}
          <path d={caminho(X0, xFantasma)} fill="none" stroke="#C9D4FF" strokeOpacity={opFantasma} strokeWidth={px(4)} strokeDasharray={`${px(14)} ${px(12)}`} strokeLinecap="round" />

          {/* trecho já percorrido */}
          <g opacity={opAcesa}>
            <path d={`${caminho(X0, xPercorrido(f))} L${xPercorrido(f)},${CHAO + 50} L${X0},${CHAO + 50} Z`} fill="url(#areaGrad)" />
            <path d={caminho(X0, xPercorrido(f))} fill="none" stroke="url(#linhaGrad)" strokeWidth={larguraLinha * 2.2} strokeOpacity={0.55} filter="url(#brilho)" />
            <path d={caminho(X0, xPercorrido(f))} fill="none" stroke="url(#linhaGrad)" strokeWidth={larguraLinha} strokeLinecap="round" />
            {PARADAS.map((p) => {
              const ativo = xPercorrido(f) >= p - 2;
              return (
                <circle
                  key={p}
                  cx={p}
                  cy={yCurva(p)}
                  r={px(ativo ? 11 : 8)}
                  fill={ativo ? "#FFFFFF" : "#0C1128"}
                  stroke={p > XP ? VERMELHO : "#B4A3F7"}
                  strokeWidth={px(4)}
                />
              );
            })}
          </g>

          {/* curva nova da virada */}
          {f >= T.virada ? (
            <g>
              <path d={caminhoNovo(X0, xNovo(f))} fill="none" stroke="url(#novaGrad)" strokeWidth={px(20)} strokeOpacity={0.5} filter="url(#brilho)" />
              <path d={caminhoNovo(X0, xNovo(f))} fill="none" stroke="url(#novaGrad)" strokeWidth={px(9)} strokeLinecap="round" />
              {PONTOS_NOVOS.map((p, i) => {
                const ativo = xNovo(f) >= p;
                return ativo ? (
                  <g key={p}>
                    <circle cx={p} cy={yNova(p)} r={px(19)} fill="#B4A3F7" stroke="#FFFFFF" strokeWidth={px(3)} />
                    <text x={p} y={yNova(p) + px(7)} textAnchor="middle" fontFamily={fonteMono} fontWeight={800} fontSize={px(20)} fill="#0C1128">
                      {i + 1}
                    </text>
                  </g>
                ) : null;
              })}
            </g>
          ) : null}

          {/* carrinho */}
          <g transform={`translate(${xc} ${yc - px(4)}) rotate(${(angc * 180) / Math.PI + balanco}) scale(${escalaCarrinho})`}>
            <Carrinho brilho={1} vermelho={vermelho} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
