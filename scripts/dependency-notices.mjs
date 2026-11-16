import { readFile, writeFile, mkdir, readdir, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const lock = JSON.parse(await readFile(resolve(root,'package-lock.json'),'utf8'));
const direct = ['phaser','vite','typescript','vitest','@playwright/test','sharp'];
const rows = [], notices = [];
for(const [path, info] of Object.entries(lock.packages)) {
  if(!path) continue;
  const name = path.split('node_modules/').at(-1);
  rows.push(`| ${name} | ${info.version} | ${info.dev?'开发':'运行'} | ${info.license || '锁文件未注明'} | [包来源](${info.resolved || 'https://www.npmjs.com/package/'+name}) |`);
  const target = `docs/licenses/${name.replaceAll('/','__')}@${info.version}`;
  let files;
  try { files = await readdir(resolve(root,path), {withFileTypes:true}); } catch { continue; }
  for(const file of files) {
    if(!file.isFile() || !/^(licen[cs]e|copying|notice|third.party)([.-]|$)/i.test(file.name)) continue;
    await mkdir(resolve(root,target), {recursive:true});
    await copyFile(resolve(root,path,file.name), resolve(root,target,file.name));
    notices.push(`${target}/${file.name}`);
  }
}
await writeFile(resolve(root,'docs/DEPENDENCIES.md'), `# 依赖来源与许可清单\n\n由 package-lock.json 生成。运行时直接依赖只有 Phaser；其余直接依赖为构建、测试或素材处理工具。直接依赖：${direct.join('、')}。\n\n精确版本和下载校验值以锁文件为准。以下包括未安装的其他平台可选包；docs/licenses/ 只收录当前已安装包中可获得的许可证 / NOTICE 原文，不声称覆盖未安装平台的全部附带组件。sharp 的本机二进制包许可文本也收录在内。跨平台再发布工具二进制时应检查对应发行包许可。游戏运行包不包含开发依赖二进制。\n\n| 包 | 锁定版本 | 类别 | 许可标识 | 来源 |\n| --- | --- | --- | --- | --- |\n${rows.join('\n')}\n\n原文文件清单见 [DEPENDENCY-NOTICES.json](DEPENDENCY-NOTICES.json)。Phaser MIT 文本也随游戏 dist/licenses/phaser.txt 分发。工具许可证不覆盖游戏图片和音乐。\n`);
await writeFile(resolve(root,'docs/DEPENDENCY-NOTICES.json'), JSON.stringify(notices.sort(),null,2)+'\n');
console.log(`依赖清单 ${rows.length} 项，许可原文 ${notices.length} 份。`);
