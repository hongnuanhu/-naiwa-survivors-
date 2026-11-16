import { mkdir, readFile, writeFile, readdir, copyFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const hash = data => createHash('sha256').update(data).digest('hex');
async function files(dir) {
  const output = [];
  for(const e of await readdir(dir,{withFileTypes:true})) {
    if(e.isSymbolicLink()) throw new Error(`发布输入不允许符号链接：${e.name}`);
    const path = resolve(dir,e.name);
    if(e.isDirectory()) output.push(...await files(path)); else if(e.isFile()) output.push(path);
  }
  return output.sort();
}
const assets = [];
for(const path of await files(resolve(root,'public'))) {
  const file = relative(root,path).replaceAll('\\','/');
  const source = file.includes('/licenses/') ? 'Phaser MIT license' : file.endsWith('favicon.svg') ? '项目绘制；原创部分许可未指定' : file.endsWith('meituan.png') ? '参考图片经 image_gen 生成；参考形象授权未确认' : '参考游戏；再分发许可未确认';
  const data = await readFile(path);
  assets.push({file,bytes:data.length,sha256:hash(data),source});
}
await writeFile(resolve(root,'docs/ASSET-MANIFEST.json'),JSON.stringify({reference:'https://h5.metaapp.cn/online/h5/BUsvkkbBiAq2pF2Ttx4j/1.0.2/6/index.html',assets},null,2)+'\n');
const sourceInputs = ['src','public','docs','scripts','README.md','LICENSE.md','.gitignore','.gitattributes','index.html','package.json','package-lock.json','tsconfig.json','vite.config.ts'];
const runtimeInputs = ['dist','docs','LICENSE.md'];
async function stage(kind,inputs) {
  const dest = resolve(root,'.release-stage',`naiwa-survivors-${kind}`);
  const inputFiles = [];
  for(const input of inputs) {
    const path=resolve(root,input);
    if((await stat(path)).isDirectory()) inputFiles.push(...await files(path)); else inputFiles.push(path);
  }
  if(kind==='runtime') inputFiles.push(resolve(root,'scripts/serve.mjs'));
  const manifest=[];
  for(const path of inputFiles) {
    const rel=relative(root,path).replaceAll('\\','/');
    if(/(^|\/)(node_modules|\.git|\.openai|artifacts|releases)(\/|$)/i.test(rel)) throw new Error(`发布包含禁止目录：${rel}`);
    const data=await readFile(path);
    if(/\.(md|json|ts|mjs|ps1|html|css)$/.test(rel)) {
      const txt=data.toString('utf8');
      if(/(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|sk-[A-Za-z0-9]{32,}|-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----|https?:\/\/[^\s/]+:[^\s/@]+@|[A-Z]:[\\/]Users[\\/])/i.test(txt)) throw new Error(`疑似凭据或个人路径，停止打包：${rel}`);
    }
    const target=resolve(dest,rel); await mkdir(dirname(target),{recursive:true}); await copyFile(path,target);
    manifest.push({file:rel,bytes:data.length,sha256:hash(data)});
  }
  if(kind==='runtime') {
    const text='# 奶蛙幸存者运行包\n\n完整解压，安装 Node.js 24，在此目录运行：\n\n```sh\nnode scripts/serve.mjs\n```\n\n打开 http://127.0.0.1:4173/，无需 npm ci，Ctrl+C 停止。不要直接双击 dist/index.html。\n\n手机同 Wi-Fi：node scripts/serve.mjs --host 0.0.0.0，再访问电脑局域网 IP:4173。操作、胜负、重开和常见问题见 docs/USER_GUIDE.md；验证见 docs/VERIFICATION.md；许可限制见 LICENSE.md 和 docs/ASSETS.md。\n\nWASD / 方向键移动，Esc 暂停；手机横屏拖动空白战场移动。全自动攻击。十二波存活，最后一波撑完或击败魔王获胜；生命归零失败；结算点重新开局。每局可输入 szx牛逼 复活一次。\n';
    await writeFile(resolve(dest,'README.md'),text); manifest.push({file:'README.md',bytes:Buffer.byteLength(text),sha256:hash(text)});
  }
  await writeFile(resolve(dest,'FILE-MANIFEST.json'),JSON.stringify({kind,version:'0.1.0',note:'本清单不包含自身；不包含 Git 历史、个人存档或凭据。',files:manifest},null,2)+'\n');
  console.log(`${kind}: ${manifest.length} 个文件，已检查常见凭据格式与个人路径。`);
}
await stage('source',sourceInputs); await stage('runtime',runtimeInputs);
