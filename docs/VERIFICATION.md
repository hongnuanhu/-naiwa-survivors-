# 本地整理与验证记录

日期：2026-11-16。范围：本地源码、静态构建、发布包；没有连接或上传远程仓库，没有更新线上站点。

## 本次已执行

环境：Windows、Node.js v24.22.1，已安装 Microsoft Edge。沙箱内 esbuild 读取上级目录遭权限拒绝；使用本机允许的执行权限后完成测试与构建。这不是游戏构建失败。未据此声称 Linux/macOS 测试通过。

| 检查 | 结果与边界 |
| --- | --- |
| npm test | 2 个测试文件、20 项通过，包括规则边界与三角色整局模拟；模拟不等于真人平衡验收 |
| npm run build | TypeScript 检查及 Vite 生产构建成功；Phaser 块约 1.48 MB，有超过 500 kB 的体积警告 |
| npm run dev | 127.0.0.1:5173 正常启动，浏览器回归访问成功 |
| node scripts/browser-check.mjs | 7 组回归通过：选角 / 键盘、暂停、结算购物、锁定刷新、复活与存档、触屏、竖屏暂停；pageerror 为空 |
| node scripts/serve.mjs | 生产 dist 在 127.0.0.1:4173 正常提供静态文件 |
| node scripts/release-smoke.mjs | 桌面 1366×900、触屏模拟 844×390：加载、开始、移动输入、暂停继续通过；无 pageerror、无 HTTP 400 以上响应；生产不暴露 window.__naiwa |
| 静态服务请求 | GET / 与 HEAD / 返回 200；缺失文件与 package.json 返回 404，POST 返回 405 |
| 素材与依赖说明 | 逐文件素材 SHA-256；锁文件 131 项依赖，当前安装包可获得的 52 份许可 / NOTICE 原文 |
| 干净源码 ZIP 解压 | 在独立解压目录执行 npm ci --offline --no-audit --no-fund，使用本机缓存安装 53 个包；随后 20 项测试及生产构建通过，不依赖原目录 node_modules。未重新验证全新机器首次联网下载 |
| 运行 ZIP 解压 | 未安装项目依赖，直接 node scripts/serve.mjs --port 4174 启动成功；首页、角色素材、音乐和 Phaser 许可均 HTTP 200；源码、Git 配置和服务脚本路径均不对外提供 |
| ZIP 内容校验 | 源码与运行包已解压并逐项核对包内清单 SHA-256；源码的 .gitignore / .gitattributes 均包含；未发现禁止目录。最终文件清单与数量以包内 FILE-MANIFEST.json 为准 |

回归脚本对开发版使用测试接口加速波次、安排死亡和模拟资金；不把这种测试截图作为正常玩法宣传图。本次 README 三张截图由 release-smoke 脚本在生产版新局正常运行后拍摄，无数值修改，已人工查看营地和手机战斗截图。截图不是概念图或参考游戏截图。

本机 npm 在干净安装时提示 esbuild 的安装脚本未列入 allowScripts；安装、测试和构建仍成功，没有修改机器的全局 npm 策略。其他环境若二进制安装受策略阻止，应按本机包管理器说明处理，不必为玩运行包运行安装脚本。

## 复现

```sh
npm ci
npm test
npm run build
```

两个独立终端：一个 npm run dev，另一个 npm run test:browser（需要本机安装 Edge）。生产检查另起 node scripts/serve.mjs，再执行 npm run test:release。端口分别为 5173 与 4173。浏览器结果默认写入被忽略的 artifacts/，截图写入 docs/screenshots/。测试后停止本机服务。

Windows 打包执行 npm run release。清单 FILE-MANIFEST.json 记录包内文件的 SHA-256（不包含清单自身），releases/SHA256SUMS.txt 校验最终 ZIP。打包白名单排除 Git、站点绑定、依赖、缓存、日志和个人状态，并检查常见令牌、私钥、带密码 URL 与本机用户路径；这不是对所有可能秘密的数学证明。

## 未验证 / 已知限制

- 安卓与 iPhone 微信真机，包括中文系统键盘、音频、来电、锁屏恢复及国内网络可达性。
- 真实中端手机连续三局的发热、帧率与长期内存。2026-10-28 的短时压力结果仅为历史记录，本次未重新运行压力脚本。
- 多随机种子、多流派的真人难度平衡；不能从规则模拟推定所有角色和装备组合都平衡。
- Linux、macOS、Safari、Firefox 运行；当前包可跨平台提供静态页面，但不声称已实测。
- 公网部署、自定义域名和 GitHub Pages；当前绝对资源路径要求域名根目录，项目子路径部署需修改后再测。
- 素材再分发权利尚未齐备；代码未选开源许可证。来源说明不是授权书。
