# Character asset provenance

## meituan.png
- Character: 美团鼠.
- Source reference: 项目提供的黄色长耳角色图片；原始聊天附件不随包分发。
- Creation: built-in image_gen tool, reference-based generation, transparent_background=true.
- Generated output: public/assets/meituan.png。删除本机路径，仅保留项目内资产定位。
- Prompt: Make a single transparent game sprite of the yellow character in this reference. Preserve exactly its long upright rounded ears, huge brown oval nose, cream belly, round yellow body, white eyes with brown pupils, short arms, large feet, long tapering tail and soft 3D cartoon material. Full body standing, three-quarter view facing slightly right, hands empty, feet visible. Centered with clear margins. Genuine alpha transparency, no background, floor or shadow. No text, logos, watermark, social UI, weapons or extra characters.
- Visual QA: recognizable reference identity, one complete full-body character, visible feet/tail/ears, no text or social-media UI. Output faces slightly left despite requested right; runtime horizontal flip may be used if required. Single pose, not an animation sheet.

## 奶蛋
Existing naidan-idle.webp / naidan-call.webp / naidan-laugh.webp resources from the reference game were confirmed to match the user video by the main agent. No generated replacement was made.
