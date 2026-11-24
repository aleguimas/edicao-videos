// Folha de contato: junta jpgs numa grade. Uso: swift scripts/folha.swift saida.jpg colunas a.jpg b.jpg ...
import AppKit
let args = CommandLine.arguments
let saida = args[1]; let cols = Int(args[2])!
let imgs = args.dropFirst(3).compactMap { NSImage(contentsOfFile: $0) }
let w = imgs[0].size.width, h = imgs[0].size.height
let rows = (imgs.count + cols - 1) / cols
let canvas = NSImage(size: NSSize(width: w * CGFloat(cols), height: h * CGFloat(rows)))
canvas.lockFocus()
for (i, im) in imgs.enumerated() {
  let c = i % cols, r = i / cols
  im.draw(in: NSRect(x: CGFloat(c) * w, y: CGFloat(rows - 1 - r) * h, width: w, height: h))
}
canvas.unlockFocus()
let rep = NSBitmapImageRep(data: canvas.tiffRepresentation!)!
try! rep.representation(using: .jpeg, properties: [.compressionFactor: 0.85])!.write(to: URL(fileURLWithPath: saida))
