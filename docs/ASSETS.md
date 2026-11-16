# 素材与工具来源

## 参考游戏素材

用户要求保留最初提供游戏的素材，并确定三角色为奶蛙、美团鼠、奶蛋。

参考地址：https://h5.metaapp.cn/online/h5/BUsvkkbBiAq2pF2Ttx4j/1.0.2/6/index.html

已使用的资源来自该版本 `assets/characters/`、`assets/backgrounds/` 和 `assets/audio/normal-theme.mp3`。工程独立实现战斗规则及界面，没有复用原游戏的压缩脚本。

- 奶蛙：hero.webp、hero-idle.webp、hero-run.webp。原始逐帧动画。
- 奶蛋：naidan-idle.webp、naidan-call.webp、naidan-laugh.webp。与用户视频形象相符；使用原始姿态及程序过渡。
- 美团鼠：meituan.png。根据用户图片生成透明全身角色，使用程序步态、受伤和倒地反馈。尚非完整逐帧动画图集。
- 敌人：chaser、shooter、bomber、shield、hammer、captain、boss。
- 场景：village、courtyard、throne。战斗地面由原图地面区域在运行时组成，保留建筑上沿。
- 音乐：normal-theme.mp3。

这些素材不因能从公开网址访问而自动取得开源许可证。再分发（包括公开仓库、分享含素材 ZIP）和商业发行前，项目所有者需确认授权范围或替换为可分发素材。原站点当前访问权限与素材版权授权无关。本工程没有找到原素材的明确许可证，不将其声明为开源。

public/assets/story-cover.webp 同样来自参考游戏的封面；public/favicon.svg 是项目内绘制图形；scene.ts 中武器效果由程序绘制，main.ts 的短音效由 Web Audio 合成。源码许可状态见根目录 LICENSE.md。

没有随包分发 AI 模型、权重或推理服务。美团鼠仅包含生成后的 meituan.png；工具名称不是模型版本或权重许可证。参考图片里的社交平台界面、字幕和头像未作为游戏素材加入。

文件级 SHA-256 与来源分组见 ASSET-MANIFEST.json；角色生成过程见 CHARACTER-PROVENANCE.md。未核实的作者和许可证保持“未确认”，不推定授权。

## 工具

- Phaser：https://github.com/phaserjs/phaser （MIT）
- Vite：https://github.com/vitejs/vite （MIT）
- TypeScript：https://github.com/microsoft/TypeScript （Apache-2.0）
- Vitest：https://github.com/vitest-dev/vitest （MIT）
- Playwright：https://github.com/microsoft/playwright （Apache-2.0）

精确版本与依赖树见 package-lock.json。Phaser 许可证随静态资源提供于 /licenses/phaser.txt。

完整直接 / 间接依赖清单和可获得的原始许可文本见 DEPENDENCIES.md 与 licenses/。sharp 仅为开发工具（Apache-2.0，包含的 libvips 等组件各有许可），不属于游戏运行时依赖。
