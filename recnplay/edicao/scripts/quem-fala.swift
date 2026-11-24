// Detecta, quadro a quadro, a posição de cada pessoa do palco e quem está com a mão
// (microfone) perto da boca. Usa a pose do corpo do Apple Vision.
// Uso: swift scripts/quem-fala.swift <pasta com jpgs 00001.jpg = segundo 0> > ../analise/poses.csv
// Saída CSV: seg,x_nariz,y_nariz,ombros,dist_mao_boca  (coordenadas 0..1, y de cima para baixo)
import Foundation
import Vision
import AppKit

let pasta = CommandLine.arguments[1]
let arquivos = (try FileManager.default.contentsOfDirectory(atPath: pasta)).filter { $0.hasSuffix(".jpg") }.sorted()
print("seg,x,y,ombros,dist")
for arq in arquivos {
  let seg = (Int(arq.replacingOccurrences(of: ".jpg", with: "")) ?? 1) - 1
  guard let img = NSImage(contentsOfFile: "\(pasta)/\(arq)"),
        let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
  let req = VNDetectHumanBodyPoseRequest()
  try? VNImageRequestHandler(cgImage: cg).perform([req])
  for obs in req.results ?? [] {
    guard let pts = try? obs.recognizedPoints(.all) else { continue }
    func p(_ k: VNHumanBodyPoseObservation.JointName) -> CGPoint? {
      guard let v = pts[k], v.confidence > 0.2 else { return nil }
      return v.location
    }
    guard let nariz = p(.nose) else { continue }
    var ombros = 0.0
    if let a = p(.leftShoulder), let b = p(.rightShoulder) { ombros = Double(hypot(a.x - b.x, a.y - b.y)) }
    var dist = 9.0
    for m in [p(.leftWrist), p(.rightWrist)] {
      if let m = m { dist = min(dist, Double(hypot(m.x - nariz.x, m.y - nariz.y))) }
    }
    print(String(format: "%d,%.3f,%.3f,%.3f,%.3f", seg, nariz.x, 1 - nariz.y, ombros, dist))
  }
}
