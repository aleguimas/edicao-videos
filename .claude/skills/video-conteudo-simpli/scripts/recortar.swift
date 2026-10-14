// Gera, para cada quadro de public/apresentacao.mp4:
//  - um PNG RGBA com apenas as pessoas (fundo transparente) em scripts/recorte/
//  - as caixas das pessoas detectadas em scripts/pessoas.json
// Uso: swift scripts/recortar.swift
// Variáveis de ambiente opcionais:
//   SO_CENTRO=1        não grava os PNGs (só centro.json/pessoas.json) — use
//                      quando as frases ficam NA FRENTE do apresentador
//   FAIXA_Y=0.38,0.52  faixa vertical (0–1) da cabeça/ombros para o centro
//   MAX_X=0.6          ignora a máscara à direita desse x (ex.: plateia)
import AVFoundation
import CoreImage
import Foundation
import Vision

let entrada = URL(fileURLWithPath: "public/apresentacao.mp4")
let ambiente = ProcessInfo.processInfo.environment
let soCentro = ambiente["SO_CENTRO"] == "1"
let faixaY = (ambiente["FAIXA_Y"] ?? "0.38,0.52").split(separator: ",").map { Double($0)! }
let maxX = Double(ambiente["MAX_X"] ?? "0.6")!
let pastaSaida = URL(fileURLWithPath: "scripts/recorte", isDirectory: true)
try? FileManager.default.createDirectory(at: pastaSaida, withIntermediateDirectories: true)

let asset = AVURLAsset(url: entrada)
let trilha = asset.tracks(withMediaType: .video)[0]
let leitor = try AVAssetReader(asset: asset)
let saida = AVAssetReaderTrackOutput(
  track: trilha,
  outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA]
)
leitor.add(saida)
leitor.startReading()

let contexto = CIContext(options: [.workingColorSpace: CGColorSpace(name: CGColorSpace.sRGB)!])
let espacoCor = CGColorSpace(name: CGColorSpace.sRGB)!

let segmentacao = VNGeneratePersonSegmentationRequest()
segmentacao.qualityLevel = .accurate
segmentacao.outputPixelFormat = kCVPixelFormatType_OneComponent8

let humanos = VNDetectHumanRectanglesRequest()
humanos.upperBodyOnly = false

var caixas: [[[String: Double]]] = []
var centros: [Double] = []
var indice = 0

// Centro horizontal (0–1) do apresentador: média ponderada da máscara na faixa
// da cabeça/ombros (FAIXA_Y), à esquerda de MAX_X
func centroApresentador(_ buffer: CVPixelBuffer) -> Double {
  CVPixelBufferLockBaseAddress(buffer, .readOnly)
  defer { CVPixelBufferUnlockBaseAddress(buffer, .readOnly) }
  let w = CVPixelBufferGetWidth(buffer)
  let h = CVPixelBufferGetHeight(buffer)
  let bpr = CVPixelBufferGetBytesPerRow(buffer)
  let base = CVPixelBufferGetBaseAddress(buffer)!.assumingMemoryBound(to: UInt8.self)
  var soma = 0.0
  var peso = 0.0
  for y in Int(Double(h) * faixaY[0])..<Int(Double(h) * faixaY[1]) {
    for x in 0..<Int(Double(w) * maxX) {
      let v = Double(base[y * bpr + x]) / 255
      soma += v * Double(x)
      peso += v
    }
  }
  return peso > 0 ? soma / peso / Double(w) : -1
}

while let amostra = saida.copyNextSampleBuffer() {
  guard let quadro = CMSampleBufferGetImageBuffer(amostra) else { continue }
  let handler = VNImageRequestHandler(cvPixelBuffer: quadro, options: [:])
  try handler.perform([segmentacao, humanos])

  let imagem = CIImage(cvPixelBuffer: quadro)
  let largura = imagem.extent.width
  let altura = imagem.extent.height

  if let mascaraBuffer = segmentacao.results?.first?.pixelBuffer {
    centros.append(centroApresentador(mascaraBuffer))
  }
  if !soCentro, let mascaraBuffer = segmentacao.results?.first?.pixelBuffer {
    var mascara = CIImage(cvPixelBuffer: mascaraBuffer)
    mascara = mascara.transformed(by: CGAffineTransform(
      scaleX: largura / mascara.extent.width,
      y: altura / mascara.extent.height
    ))
    // Suaviza levemente a borda para não ficar serrilhada
    mascara = mascara.clampedToExtent()
      .applyingGaussianBlur(sigma: 1.2)
      .cropped(to: imagem.extent)
    let recorte = imagem.applyingFilter("CIBlendWithMask", parameters: [
      kCIInputBackgroundImageKey: CIImage(color: .clear).cropped(to: imagem.extent),
      kCIInputMaskImageKey: mascara,
    ])
    let arquivo = pastaSaida.appendingPathComponent(String(format: "%04d.png", indice))
    try contexto.writePNGRepresentation(
      of: recorte, to: arquivo, format: .RGBA8, colorSpace: espacoCor
    )
  }

  // Vision usa origem embaixo à esquerda; convertemos para origem em cima
  let pessoas = (humanos.results ?? []).map { r -> [String: Double] in
    let b = r.boundingBox
    return [
      "x": Double(b.minX), "y": Double(1 - b.maxY),
      "w": Double(b.width), "h": Double(b.height),
      "conf": Double(r.confidence),
    ]
  }
  caixas.append(pessoas)
  indice += 1
  if indice % 30 == 0 { print("quadro \(indice)") }
}

let json = try JSONSerialization.data(withJSONObject: caixas, options: [.prettyPrinted])
try json.write(to: URL(fileURLWithPath: "scripts/pessoas.json"))
try JSONSerialization.data(withJSONObject: centros)
  .write(to: URL(fileURLWithPath: "scripts/centro.json"))
print("pronto: \(indice) quadros")
