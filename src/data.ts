export type WeaponId = 'milk' | 'fist' | 'lid' | 'horn' | 'peach' | 'turret';
export type CharacterId = 'naiwa' | 'meituan' | 'naidan';
export const CHARACTERS = [
  { id: 'naiwa' as CharacterId, name: '奶蛙', title: '天生乐观派', tag: '均衡 · 推荐初次冒险', image: 'hero.webp', color: '#e6c953', description: '肚子里装着勇气，手里握着奶瓶。任何搭配，都能笑着开场。', perk: '生命 +10 · 伤害 +5%', tradeoff: '没有额外限制', weapon: 'milk' as WeaponId },
  { id: 'meituan' as CharacterId, name: '美团鼠', title: '贴身守护者', tag: '近战 · 更耐打', image: 'meituan.png', color: '#f3c94e', description: '长耳朵，大肚皮。靠近一点，给憋笑小兵一记热情的拳头。', perk: '生命 +25 · 近战伤害 +25%', tradeoff: '移动速度 −8%', weapon: 'fist' as WeaponId },
  { id: 'naidan' as CharacterId, name: '奶蛋', title: '圆滚滚的惊喜', tag: '范围 · 清怪高手', image: 'naidan-idle.webp', color: '#b9dba0', description: '小小的手，大大的动静。让每一次爆炸，都成为全场的笑点。', perk: '范围 +25% · 范围伤害 +15%', tradeoff: '生命 −10', weapon: 'peach' as WeaponId },
];
export const WEAPONS: Record<WeaponId, {name:string; icon:string; kind:'ranged'|'melee'|'area'|'deploy'; damage:number; cooldown:number; range:number; price:number; desc:string; color:string}> = {
  milk: {name:'奶瓶喷射器',icon:'◉',kind:'ranged',damage:10,cooldown:.8,range:380,price:22,desc:'自动瞄准，发射清爽奶球',color:'#bfe3ec'},
  fist: {name:'弹簧拳套',icon:'✊',kind:'melee',damage:23,cooldown:.9,range:115,price:24,desc:'近身挥拳，击退前方敌人',color:'#e9a77e'},
  lid: {name:'旋转锅盖',icon:'◎',kind:'melee',damage:13,cooldown:1.1,range:100,price:25,desc:'环形扫击，保护周围空间',color:'#b6c7cf'},
  horn: {name:'爆笑喇叭',icon:'◁',kind:'area',damage:20,cooldown:1.6,range:190,price:28,desc:'向敌群发出扇形声波',color:'#f2db85'},
  peach: {name:'黄桃罐头炮',icon:'✹',kind:'area',damage:24,cooldown:1.8,range:330,price:30,desc:'投掷罐头，命中后范围爆炸',color:'#efb485'},
  turret: {name:'玩具雷塔',icon:'ϟ',kind:'deploy',damage:12,cooldown:1.4,range:320,price:32,desc:'放下玩具塔，持续自动射击',color:'#bdb5ee'},
};
export const TIERS = ['普通','精良','稀有','史诗'];
export const TIER_COLORS = ['#d4d5c4','#a5d7a0','#83bbeb','#c3a0e8'];
export type Stat = 'health'|'damage'|'speed'|'armor'|'attackSpeed'|'crit'|'regen'|'pickup'|'range'|'harvest'|'luck'|'lifesteal';
export const STAT_NAMES: Record<Stat,string> = {health:'生命上限',damage:'伤害',speed:'移速',armor:'护甲',attackSpeed:'攻速',crit:'暴击',regen:'每秒恢复',pickup:'拾取范围',range:'攻击范围',harvest:'每波收益',luck:'幸运',lifesteal:'吸血'};
export interface Item {id:string;name:string;icon:string;price:number;desc:string;stats:Partial<Record<Stat,number>>}
export const ITEMS:Item[] = [
  {id:'heart',name:'热牛奶',icon:'♥',price:18,desc:'生命上限 +12',stats:{health:12}},
  {id:'sneakers',name:'软糖跑鞋',icon:'»',price:22,desc:'移动速度 +8%',stats:{speed:8}},
  {id:'shell',name:'厚实围裙',icon:'◈',price:24,desc:'护甲 +3 · 移速 −3%',stats:{armor:3,speed:-3}},
  {id:'pepper',name:'勇气胡椒',icon:'✦',price:22,desc:'伤害 +12% · 生命 −4',stats:{damage:12,health:-4}},
  {id:'watch',name:'发条闹钟',icon:'◷',price:25,desc:'攻击速度 +12%',stats:{attackSpeed:12}},
  {id:'clover',name:'幸运叶',icon:'♧',price:18,desc:'幸运 +10',stats:{luck:10}},
  {id:'magnet',name:'奶币磁铁',icon:'∩',price:19,desc:'拾取范围 +35%',stats:{pickup:35}},
  {id:'bandage',name:'柔软绷带',icon:'✚',price:28,desc:'每秒恢复 +0.5',stats:{regen:.5}},
  {id:'lens',name:'放大眼镜',icon:'⌕',price:24,desc:'攻击范围 +12%',stats:{range:12}},
  {id:'farm',name:'黄桃盆栽',icon:'♧',price:25,desc:'每波收益 +8',stats:{harvest:8}},
  {id:'fang',name:'奶牙项链',icon:'♢',price:30,desc:'吸血 +3%',stats:{lifesteal:3}},
  {id:'star',name:'闪亮徽章',icon:'✧',price:27,desc:'暴击 +8%',stats:{crit:8}},
  {id:'pillow',name:'抱抱枕',icon:'▣',price:30,desc:'生命 +20 · 攻速 −6%',stats:{health:20,attackSpeed:-6}},
  {id:'espresso',name:'双份咖啡',icon:'♨',price:28,desc:'攻速 +18% · 护甲 −2',stats:{attackSpeed:18,armor:-2}},
  {id:'cape',name:'英雄披风',icon:'⚑',price:34,desc:'伤害 +10% · 生命 +8',stats:{damage:10,health:8}},
  {id:'bell',name:'小小风铃',icon:'♬',price:22,desc:'移速 +5% · 拾取范围 +15%',stats:{speed:5,pickup:15}},
  {id:'cake',name:'黄桃蛋糕',icon:'▰',price:32,desc:'生命 +10 · 每秒恢复 +0.3',stats:{health:10,regen:.3}},
  {id:'coin',name:'存钱罐',icon:'◉',price:28,desc:'每波收益 +12 · 伤害 −5%',stats:{harvest:12,damage:-5}},
  {id:'glove',name:'幸运手套',icon:'✋',price:29,desc:'暴击 +5% · 幸运 +8',stats:{crit:5,luck:8}},
  {id:'crown',name:'纸板王冠',icon:'♛',price:45,desc:'伤害 +18% · 攻击范围 +10%',stats:{damage:18,range:10}},
];
export const WAVE_SECONDS=[30,35,40,45,45,50,50,50,55,55,60,75];
export const DIFFICULTIES = {easy:{name:'简单',health:.75,damage:.65,speed:.85},normal:{name:'标准',health:1,damage:1,speed:1},hard:{name:'困难',health:1.35,damage:1.3,speed:1.12}};
export interface Difficulty {name:string;health:number;damage:number;speed:number}
export const ENEMIES = {
 chaser:{name:'憋笑小兵',hp:17,speed:63,damage:8,r:15,asset:'chaser',value:2},
 shooter:{name:'紫帽法师',hp:24,speed:38,damage:9,r:16,asset:'shooter',value:2},
 bomber:{name:'发条炸弹',hp:15,speed:91,damage:12,r:14,asset:'bomber',value:2},
 shield:{name:'盾卫',hp:48,speed:36,damage:11,r:19,asset:'shield',value:3},
 hammer:{name:'重锤怪',hp:60,speed:40,damage:14,r:21,asset:'hammer',value:3},
 captain:{name:'铁桶队长',hp:1500,speed:38,damage:18,r:32,asset:'captain',value:30},
 boss:{name:'憋笑魔王',hp:7500,speed:40,damage:23,r:40,asset:'boss',value:100},
};
export type EnemyKind=keyof typeof ENEMIES;
