// Captura uma tela do Agentic Office em tamanho de celular (412 px) num Chrome aberto com --remote-debugging-port=9333.
// uso: node capturar-mobile.mjs <url|-> <saida.png> [espera_ms] [js]
// url "-" mantém a página atual; js é executado antes da captura (trocar aba, rolar, abrir item).
const [url,saida,espera='2500',js]=process.argv.slice(2);
const lista=await (await fetch('http://127.0.0.1:9333/json')).json();
const alvo=lista.find(t=>t.type==='page'&&t.url.includes('simpli'))||lista.find(t=>t.type==='page');
const ws=new WebSocket(alvo.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let id=0;const pend={};ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pend[d.id]){pend[d.id](d);delete pend[d.id]}};
const c=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}))});
await c('Emulation.setDeviceMetricsOverride',{width:412,height:915,deviceScaleFactor:2,mobile:true});
await c('Emulation.setTouchEmulationEnabled',{enabled:true});
await c('Emulation.setUserAgentOverride',{userAgent:'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'});
await c('Page.enable');await c('Runtime.enable');
if(url!=='-')await c('Page.navigate',{url});
await new Promise(r=>setTimeout(r,+espera));
if(js){const r=await c('Runtime.evaluate',{expression:js,returnByValue:true,awaitPromise:true});console.log(JSON.stringify(r.result?.result?.value??r.result));await new Promise(r=>setTimeout(r,1500));}
const u=await c('Runtime.evaluate',{expression:'location.href',returnByValue:true});console.log(u.result.result.value);
const s=await c('Page.captureScreenshot',{format:'png'});
(await import('fs')).writeFileSync(saida,Buffer.from(s.result.data,'base64'));ws.close();
