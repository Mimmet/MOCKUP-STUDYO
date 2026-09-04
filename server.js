const h=require('http'),f=require('fs'),p=require('path'),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
h.createServer((q,s)=>{
  if (q.method==='POST' && q.url.split('?')[0]==='/result') {
    let body='';
    q.on('data',(d)=>body+=d);
    q.on('end',()=>{
      try { f.writeFileSync(path.join(process.cwd(),'tools','smoke-result.txt'), body, 'utf8'); } catch(e){}
      s.writeHead(200,{'Content-Type':'text/plain'}); s.end('OK');
    });
    return;
  }
  let u=decodeURIComponent(q.url.split('?')[0]);
  if(u==='/')u='/index.html';
  let fp=p.join(process.cwd(),u);
  f.readFile(fp,(e,d)=>{
    if(e){s.writeHead(404);return s.end('404');}
    s.writeHead(200,{'Content-Type':mime[p.extname(fp)]||'application/octet-stream'});
    s.end(d);
  });
}).listen(8123,()=>console.log('READY'));