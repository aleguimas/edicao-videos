// Gera, para cada quadro de public/apresentacao.mp4:
//  - um PNG RGBA com apenas as pessoas (fundo transparente) em scripts/recorte/
//  - as caixas das pessoas detectadas em scripts/pessoas.json
// Uso: swift scripts/recortar.swift
import AVFoundation
import CoreImage
import Foundation
import Vision

let entrada = URL(fileURLWithPath: "public/apresentacao.mp4")
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
// da cabeça/ombros, à esquerda da plateia
func centroApresentador(_ buffer: CVPixelBuffer) -> Double {
  CVPixelBufferLockBaseAddress(buffer, .readOnly)
  defer { CVPixelBufferUnlockBaseAddress(buffer, .readOnly) }
  let w = CVPixelBufferGetWidth(buffer)
  let h = CVPixelBufferGetHeight(buffer)
  let bpr = CVPixelBufferGetBytesPerRow(buffer)
  let base = CVPixelBufferGetBaseAddress(buffer)!.assumingMemoryBound(to: UInt8.self)
  var soma = 0.0
  var peso = 0.0
  for y in Int(Double(h) * 0.38)..<Int(Double(h) * 0.52) {
    for x in 0..<Int(Double(w) * 0.6) {
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
