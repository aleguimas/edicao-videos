// Procura, em quadros amostrados do workshop, os momentos em que o apresentador
// aparece maior (mais perto da câmera). Usa a detecção de pessoas do Apple Vision.
// Uso: swift scripts/achar-apresentador.swift <pasta com jpgs nomeados pelo segundo>
import Foundation
import Vision
import AppKit

let pasta = CommandLine.arguments[1]
let arquivos = (try FileManager.default.contentsOfDirectory(atPath: pasta)).filter { $0.hasSuffix(".jpg") }.sorted()
var resultados: [(String, Double, Double, Double)] = []

for arq in arquivos {
  guard let img = NSImage(contentsOfFile: "\(pasta)/\(arq)"),
        let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
  let req = VNDetectHumanRectanglesRequest()
  req.upperBodyOnly = false
  try? VNImageRequestHandler(cgImage: cg).perform([req])
  // apresentador: em pé (topo da caixa na metade de cima do quadro), longe da borda esquerda
  // onde ficam as pessoas sentadas em primeiro plano
  let candidatos = (req.results ?? []).filter { r in
    let b = r.boundingBox
    return b.maxY > 0.62 && b.midX > 0.3 && b.midX < 0.9 && b.height > 0.2
  }
  if let maior = candidatos.max(by: { $0.boundingBox.height < $1.boundingBox.height }) {
    let b = maior.boundingBox
    resultados.append((arq, Double(b.height), Double(b.midX), Double(1 - b.maxY)))
  }
}
for r in resultados.sorted(by: { $0.1 > $1.1 }).prefix(25) {
  print(String(format: "%@  altura %.2f  centroX %.2f  topo %.2f", r.0, r.1, r.2, r.3))
}
