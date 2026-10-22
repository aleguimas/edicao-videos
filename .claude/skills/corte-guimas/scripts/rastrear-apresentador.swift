// Rastreia o apresentador (em pé, câmera fixa no fundo da sala) em quadros amostrados
// e grava o centro dele (coordenadas 1080x1920) por instante, para a câmera virtual seguir.
// Identifica o apresentador pela COR DA ROUPA no tronco (padrão: azul, a camisa do Guimas em
// Cuiabá), para não seguir quem passa na frente da câmera. Quadros sem ninguém com a cor
// ficam de fora (o gerar-camera.mjs interpola o buraco).
// Uso: swift scripts/rastrear-apresentador.swift <pasta com NNNNN.jpg> <quadros por segundo> <saida.json> [cor: azul|qualquer]
import Foundation
import Vision
import AppKit

let pasta = CommandLine.arguments[1]
let amostrasPorSegundo = Double(CommandLine.arguments[2])!
let saida = CommandLine.arguments[3]
let cor = CommandLine.arguments.count > 4 ? CommandLine.arguments[4] : "azul"
let arquivos = (try FileManager.default.contentsOfDirectory(atPath: pasta)).filter { $0.hasSuffix(".jpg") }.sorted()

// Converte o quadro para um buffer RGBA8 conhecido (a ordem dos bytes do CGImage vindo do
// JPEG varia; ler direto dava cores erradas).
func rgba(_ cg: CGImage) -> [UInt8] {
  var buf = [UInt8](repeating: 0, count: cg.width * cg.height * 4)
  let ctx = CGContext(data: &buf, width: cg.width, height: cg.height, bitsPerComponent: 8, bytesPerRow: cg.width * 4,
                      space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  ctx.draw(cg, in: CGRect(x: 0, y: 0, width: cg.width, height: cg.height))
  return buf
}

// média RGB (0–255) de uma região normalizada (origem embaixo à esquerda, como o Vision)
func mediaCor(_ buf: [UInt8], _ w: Int, _ h: Int, _ r: CGRect) -> (Double, Double, Double) {
  let x0 = max(0, Int(r.minX * Double(w))), x1 = min(w - 1, Int(r.maxX * Double(w)))
  let y0 = max(0, Int((1 - r.maxY) * Double(h))), y1 = min(h - 1, Int((1 - r.minY) * Double(h)))
  if x1 <= x0 || y1 <= y0 { return (0, 0, 0) }
  var s = (0.0, 0.0, 0.0), n = 0.0
  for y in y0...y1 {
    for x in x0...x1 {
      let o = (y * w + x) * 4
      s.0 += Double(buf[o]); s.1 += Double(buf[o + 1]); s.2 += Double(buf[o + 2]); n += 1
    }
  }
  return (s.0 / n, s.1 / n, s.2 / n)
}

var pontos: [[String: Double]] = []
for (i, arq) in arquivos.enumerated() {
  guard let img = NSImage(contentsOfFile: "\(pasta)/\(arq)"),
        let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
  let req = VNDetectHumanRectanglesRequest()
  req.upperBodyOnly = false
  try? VNImageRequestHandler(cgImage: cg).perform([req])
  // em pé (topo da caixa na metade de cima) e fora da faixa da plateia sentada
  // em pé: a caixa é bem mais alta que larga (proporção em pixels >= 1,8); quem está sentado
  // na plateia (mesmo com roupa azulada) fica de fora
  let proporcao = { (b: CGRect) -> Double in (Double(b.height) * Double(cg.height)) / (Double(b.width) * Double(cg.width)) }
  let todas = (req.results ?? []).map { $0.boundingBox }
  var caixas = todas.filter { $0.maxY > 0.6 && $0.height > 0.15 && $0.midX > 0.2 && proporcao($0) >= 1.8 }
  // 2ª tentativa: palestrante com as pernas encobertas pela plateia (caixa só do tronco).
  // Aceita se a cabeça estiver alta no quadro (acima das cabeças de quem está sentado).
  if caixas.isEmpty {
    caixas = todas.filter { $0.maxY > 0.7 && $0.height > 0.08 && $0.midX > 0.2 && proporcao($0) >= 1.0 }
  }
  let buf = rgba(cg)
  var melhor: (CGRect, Double)? = nil
  for b in caixas {
    // peito: faixa de 12%–30% a partir do topo da caixa (abaixo da cabeça, acima do cinto), 40% central
    let tronco = CGRect(x: b.midX - b.width * 0.2, y: b.maxY - b.height * 0.30, width: b.width * 0.4, height: b.height * 0.18)
    let (r, _, bl) = mediaCor(buf, cg.width, cg.height, tronco)
    let azul = bl - r // camisa azul clara: azul bem acima do vermelho
    let nota = cor == "azul" ? azul : Double(b.height)
    // limiar baixo: contra a luz da janela a camisa fica escura e quase cinza (azul−vermelho ≈ 2–8);
    // quem está sentado já saiu pelo filtro de proporção, e roupas quentes (marrom, vermelho) ficam negativas
    if cor == "azul" && azul < 2 { continue }
    if melhor == nil || nota > melhor!.1 { melhor = (b, nota) }
  }
  guard let (b, _) = melhor else { continue }
  // centro horizontal do corpo; vertical: ponto entre cabeça e cintura (topo + 35% da altura)
  pontos.append([
    "t": Double(i) / amostrasPorSegundo,
    "x": Double(b.midX) * 1080,
    "y": Double(1 - b.maxY + b.height * 0.35) * 1920,
    "h": Double(b.height) * 1920,
  ])
}
let dados = try JSONSerialization.data(withJSONObject: pontos, options: [.prettyPrinted])
try dados.write(to: URL(fileURLWithPath: saida))
print("\(pontos.count) de \(arquivos.count) quadros com apresentador -> \(saida)")
