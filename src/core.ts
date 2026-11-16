import {CHARACTERS, DIFFICULTIES, ENEMIES, ITEMS, WEAPONS, WAVE_SECONDS, type CharacterId, type Difficulty, type EnemyKind, type Stat, type WeaponId} from './data';

export const SAVE_KEY='naiwa-survivors:run:v1';
export const WORLD={w:960,h:540,left:35,right:925,top:78,bottom:510};
export type Phase='combat'|'upgrade'|'shop'|'dead'|'won';
export interface Weapon {id:WeaponId;tier:number;cooldown:number}
export interface Actor {id:number;kind:EnemyKind;x:number;y:number;hp:number;maxHp:number;warm:number;attack:number;hit:number}
export interface Shot {id:number;x:number;y:number;vx:number;vy:number;life:number;damage:number;enemy:boolean;r:number;weapon?:WeaponId}
export interface Drop {id:number;x:number;y:number;value:number;heal:boolean}
export interface Turret {id:number;x:number;y:number;life:number;cooldown:number;damage:number}
export interface Hazard {id:number;x:number;y:number;r:number;wait:number;damage:number}
export interface Offer {type:'weapon'|'item';id:string;tier:number;price:number;locked:boolean;sold:boolean}
export interface Upgrade {stat:Stat;value:number;name:string}
export interface Run {
 version:1; seed:number; serial:number; character:CharacterId; difficulty:Difficulty; phase:Phase;
 wave:number; remaining:number; elapsed:number; x:number;y:number;face:number;hp:number;invulnerable:number;
 coins:number;level:number;xp:number;pending:number;kills:number;revived:boolean;deathCause:string;
 weapons:Weapon[];items:string[];bonus:Partial<Record<Stat,number>>; enemies:Actor[];shots:Shot[];drops:Drop[];turrets:Turret[];hazards:Hazard[];
 spawn:number;offers:Offer[];rerolls:number;choices:Upgrade[]; bestCombo:number;damageDone:number;
}
export interface Effect {kind:'hit'|'burst'|'swipe'|'heal'|'hurt'|'shot'|'kill';x:number;y:number;r?:number;value?:number;color?:string}
export interface Stats {maxHp:number;damage:number;speed:number;armor:number;attackSpeed:number;crit:number;regen:number;pickup:number;range:number;harvest:number;luck:number;lifesteal:number}
export const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export const distance=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y);
export function random(r:Run){r.seed=(Math.imul(r.seed,1664525)+1013904223)>>>0;return r.seed/4294967296;}
export function stats(r:Run):Stats {
 const v:Record<Stat,number>={health:70,damage:0,speed:0,armor:0,attackSpeed:0,crit:5,regen:.15,pickup:0,range:0,harvest:3,luck:0,lifesteal:0};
 for(const item of r.items){const data=ITEMS.find(i=>i.id===item);if(data) for(const [key,value] of Object.entries(data.stats))v[key as Stat]+=value;}
 for(const [key,value] of Object.entries(r.bonus))v[key as Stat]+=value;
 if(r.character==='naiwa'){v.health+=10;v.damage+=5;} if(r.character==='meituan'){v.health+=25;v.speed-=8;}if(r.character==='naidan'){v.health-=10;v.range+=25;}
 return {maxHp:clamp(v.health,25,500),damage:clamp(1+v.damage/100,.2,8),speed:clamp(145*(1+v.speed/100),75,290),armor:clamp(v.armor,-10,40),attackSpeed:clamp(1+v.attackSpeed/100,.25,4),crit:clamp(v.crit,0,75)/100,regen:clamp(v.regen,0,10),pickup:clamp(42*(1+v.pickup/100),25,180),range:clamp(1+v.range/100,.5,2),harvest:clamp(v.harvest,0,150),luck:clamp(v.luck,0,100),lifesteal:clamp(v.lifesteal,0,20)/100};
}
export function newRun(character:CharacterId,difficulty:Difficulty=DIFFICULTIES.normal,seed=Date.now()>>>0):Run {
 const r:Run={version:1,seed,serial:1,character,difficulty:{name:difficulty.name,health:clamp(difficulty.health,.5,1.5),damage:clamp(difficulty.damage,.5,1.5),speed:clamp(difficulty.speed,.5,1.5)},phase:'combat',wave:1,remaining:WAVE_SECONDS[0],elapsed:0,x:480,y:300,face:1,hp:70,invulnerable:1.5,coins:0,level:1,xp:0,pending:0,kills:0,revived:false,deathCause:'',weapons:[{id:CHARACTERS.find(c=>c.id===character)!.weapon,tier:1,cooldown:.3}],items:[],bonus:{},enemies:[],shots:[],drops:[],turrets:[],hazards:[],spawn:.6,offers:[],rerolls:0,choices:[],bestCombo:0,damageDone:0};r.hp=stats(r).maxHp;return r;
}
export function xpGoal(level:number){return 8+level*8;}
export function gain(r:Run,amount:number){r.coins+=amount;r.xp+=amount;while(r.xp>=xpGoal(r.level)){r.xp-=xpGoal(r.level);r.level++;r.pending++;}}
export function clearCombat(r:Run){r.enemies=[];r.shots=[];r.drops=[];r.turrets=[];r.hazards=[];}
export function nextWave(r:Run){if(r.phase!=='shop'||r.wave>=12)return false;r.wave++;r.phase='combat';r.remaining=WAVE_SECONDS[r.wave-1];r.spawn=.7;r.x=480;r.y=300;r.invulnerable=1.5;r.rerolls=0;r.hp=Math.min(stats(r).maxHp,r.hp+stats(r).maxHp*.2);clearCombat(r);for(const w of r.weapons)w.cooldown=.2;
 if(r.wave===6||r.wave===12)spawnEnemy(r,r.wave===6?'captain':'boss',480,130);return true;}
export function spawnEnemy(r:Run,kind:EnemyKind,x?:number,y?:number){if(r.enemies.length>=105)return;const d=ENEMIES[kind];if(x===undefined||y===undefined){for(let n=0;n<12;n++){const side=Math.floor(random(r)*4);x=side===0?40:side===1?920:50+random(r)*860;y=side===2?90:side===3?505:90+random(r)*405;if(distance(r,{x,y})>145)break;}if(distance(r,{x:x!,y:y!})<145){x=r.x<480?910:50;y=r.y<300?490:95;}}
 const wave=r.wave-1;const hp=d.hp*r.difficulty.health*(kind==='boss'||kind==='captain'?1:1+wave*.1+wave*wave*.035);r.enemies.push({id:r.serial++,kind,x:x!,y:y!,hp,maxHp:hp,warm:1,attack:2+random(r)*2,hit:0});}
function awardEnd(r:Run){for(const d of r.drops){if(!d.heal)gain(r,d.value);}gain(r,Math.round(stats(r).harvest));clearCombat(r);r.rerolls=0;makeShop(r);if(r.pending>0){r.phase='upgrade';makeChoices(r);}else r.phase='shop';}
export function endWave(r:Run){if(r.phase!=='combat')return;if(r.wave===12){r.phase='won';clearCombat(r);}else awardEnd(r);}
export function makeShop(r:Run){const carry=r.offers.filter(o=>o.locked&&!o.sold);r.offers=carry.slice(0,4);while(r.offers.length<4){const index=r.offers.length;const weapon=(r.wave<=2&&index<2)||random(r)<.48;const tier=1+(r.wave>=4&&random(r)<.3?1:0)+(r.wave>=9&&random(r)<.15?1:0);if(weapon){const ids=Object.keys(WEAPONS) as WeaponId[];const id=random(r)<.45?r.weapons[Math.floor(random(r)*r.weapons.length)].id:ids[Math.floor(random(r)*ids.length)];r.offers.push({type:'weapon',id,tier,price:Math.round(WEAPONS[id].price*(1+(tier-1)*.65)*(1+r.wave*.045)),locked:false,sold:false});}else{const item=ITEMS[Math.floor(random(r)*ITEMS.length)];r.offers.push({type:'item',id:item.id,tier:1,price:Math.round(item.price*(1+r.wave*.04)),locked:false,sold:false});}}}
export function purchaseInfo(r:Run,index:number){const o=r.offers[index];if(!o||o.sold)return {ok:false,reason:'已售出',merge:-1};if(r.phase!=='shop')return {ok:false,reason:'商店未开放',merge:-1};const merge=o.type==='weapon'&&o.tier<4&&r.weapons.length>=6?r.weapons.findIndex(w=>w.id===o.id&&w.tier===o.tier):-1;if(o.type==='weapon'&&merge===-1&&r.weapons.length>=6)return {ok:false,reason:'武器槽已满',merge};if(r.coins<o.price)return {ok:false,reason:'奶币不足',merge};return {ok:true,reason:merge>=0?'购买并合成':'购买',merge};}
export function buy(r:Run,index:number){const info=purchaseInfo(r,index);if(!info.ok)return false;const o=r.offers[index];const oldHp=stats(r).maxHp;r.coins-=o.price;o.sold=true;o.locked=false;if(o.type==='weapon'){if(info.merge>=0)r.weapons[info.merge].tier++;else r.weapons.push({id:o.id as WeaponId,tier:o.tier,cooldown:.2});}else r.items.push(o.id);const newHp=stats(r).maxHp;r.hp=clamp(r.hp+Math.max(0,newHp-oldHp),1,newHp);return true;}
export function recycle(r:Run,index:number){if(r.phase!=='shop'||r.weapons.length<=1||!r.weapons[index])return false;const w=r.weapons.splice(index,1)[0];r.coins+=Math.floor(WEAPONS[w.id].price*(1+(w.tier-1)*.65)*.45);return true;}
export function combine(r:Run,index:number){if(r.phase!=='shop')return false;const w=r.weapons[index];if(!w||w.tier>=4)return false;const j=r.weapons.findIndex((other,i)=>i!==index&&other.id===w.id&&other.tier===w.tier);if(j<0)return false;w.tier++;r.weapons.splice(j,1);return true;}
export function rerollPrice(r:Run){return 4+r.wave+3*r.rerolls;}
export function reroll(r:Run){if(r.phase!=='shop'||r.offers.every(o=>o.locked&&!o.sold))return false;const price=rerollPrice(r);if(r.coins<price)return false;r.coins-=price;r.rerolls++;makeShop(r);return true;}
export function toggleLock(r:Run,index:number){const o=r.offers[index];if(r.phase!=='shop'||!o||o.sold)return false;o.locked=!o.locked;return true;}
export function makeChoices(r:Run){const choices:Upgrade[]=[{stat:'health',value:10,name:'结实体魄'},{stat:'damage',value:8,name:'勇气加倍'},{stat:'attackSpeed',value:10,name:'手脚利落'},{stat:'armor',value:2,name:'肚皮护盾'},{stat:'speed',value:5,name:'轻盈脚步'},{stat:'crit',value:5,name:'灵光一击'},{stat:'harvest',value:5,name:'丰收口袋'},{stat:'regen',value:.4,name:'慢慢回血'}];r.choices=[];while(r.choices.length<3){const i=Math.floor(random(r)*choices.length);r.choices.push(choices.splice(i,1)[0]);}}
export function chooseUpgrade(r:Run,index:number){if(r.phase!=='upgrade'||r.pending<=0||!r.choices[index])return false;const c=r.choices[index];r.bonus[c.stat]=(r.bonus[c.stat]||0)+c.value;if(c.stat==='health')r.hp+=c.value;r.pending--;if(r.pending>0)makeChoices(r);else{r.phase='shop';r.choices=[];}return true;}
export function revive(r:Run,code:string){if(r.phase!=='dead'||r.revived||code.trim()!=='szx牛逼')return false;r.revived=true;r.phase='combat';r.hp=stats(r).maxHp;r.invulnerable=3;r.x=480;r.y=300;r.shots=r.shots.filter(s=>!s.enemy);r.hazards=[];for(const e of r.enemies){if(distance(r,e)<160){const a=Math.atan2(e.y-r.y,e.x-r.x);e.x=clamp(r.x+Math.cos(a)*170,40,920);e.y=clamp(r.y+Math.sin(a)*170,90,500);e.warm=Math.max(e.warm,.8);}}return true;}
export function hurt(r:Run,amount:number,cause:string,fx:Effect[]=[]){if(r.phase!=='combat'||r.invulnerable>0)return;const armor=stats(r).armor;const multiplier=armor>=0?1/(1+armor/15):1-armor/15;r.hp=Math.max(0,r.hp-amount*multiplier);r.invulnerable=.7;fx.push({kind:'hurt',x:r.x,y:r.y,value:Math.round(amount*multiplier)});if(r.hp<=0){r.phase='dead';r.deathCause=cause;}}
function damageEnemy(r:Run,e:Actor,amount:number,fx:Effect[]){if(e.hp<=0||e.warm>0)return;const critical=random(r)<stats(r).crit;const damage=amount*(critical?1.7:1);e.hp-=damage;e.hit=.12;r.damageDone+=damage;fx.push({kind:'hit',x:e.x,y:e.y,value:Math.round(damage),color:critical?'#ffe68b':undefined});if(stats(r).lifesteal>0&&random(r)<stats(r).lifesteal)r.hp=Math.min(stats(r).maxHp,r.hp+1);if(e.hp<=0){r.kills++;const d=ENEMIES[e.kind];r.drops.push({id:r.serial++,x:e.x,y:e.y,value:d.value,heal:false});if(random(r)<.025+stats(r).luck*.0003)r.drops.push({id:r.serial++,x:e.x+12,y:e.y,value:8,heal:true});fx.push({kind:'kill',x:e.x,y:e.y});}}
function target(r:Run,x:number,y:number,range:number){let chosen:Actor|undefined;let best=range;for(const e of r.enemies){if(e.hp<=0||e.warm>0)continue;const d=Math.hypot(e.x-x,e.y-y);if(d<best){best=d;chosen=e;}}return chosen;}
function fire(r:Run,x:number,y:number,e:{x:number;y:number},damage:number,weapon:WeaponId|undefined,enemy=false,speed=370,angleOffset=0){if(r.shots.length>=260)return;const a=Math.atan2(e.y-y,e.x-x)+angleOffset;r.shots.push({id:r.serial++,x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:enemy?4:1.4,damage,enemy,r:enemy?6:weapon==='peach'?8:4,weapon});}
export function tick(r:Run,dt:number,input:{x:number;y:number},fx:Effect[]=[]){if(r.phase!=='combat')return;dt=clamp(dt,0,.05);const s=stats(r);r.elapsed+=dt;r.remaining=Math.max(0,r.remaining-dt);r.invulnerable=Math.max(0,r.invulnerable-dt);r.hp=Math.min(s.maxHp,r.hp+s.regen*dt);
 const length=Math.hypot(input.x,input.y);if(length>.01){r.x=clamp(r.x+input.x/Math.max(1,length)*s.speed*dt,WORLD.left,WORLD.right);r.y=clamp(r.y+input.y/Math.max(1,length)*s.speed*dt,WORLD.top,WORLD.bottom);if(Math.abs(input.x)>.1)r.face=input.x>0?1:-1;}
 r.spawn-=dt;if(r.spawn<=0){r.spawn=Math.max(.22,.95-r.wave*.052);const count=r.wave>=8?2:1;for(let n=0;n<count;n++){const pool:EnemyKind[]=r.wave<2?['chaser']:r.wave<4?['chaser','chaser','shooter']:r.wave<6?['chaser','shooter','bomber']:['chaser','chaser','shooter','bomber','shield','hammer'];spawnEnemy(r,pool[Math.floor(random(r)*pool.length)]);}}
 for(const e of r.enemies){if(e.hp<=0)continue;e.hit=Math.max(0,e.hit-dt);e.warm-=dt;if(e.warm>0)continue;const d=ENEMIES[e.kind];const dist=distance(r,e);const ranged=e.kind==='shooter';if(dist>1&&(!ranged||dist>230)){e.x+=(r.x-e.x)/dist*d.speed*r.difficulty.speed*dt;e.y+=(r.y-e.y)/dist*d.speed*r.difficulty.speed*dt;}if(dist<d.r+13)hurt(r,d.damage*r.difficulty.damage*(1+r.wave*.025),d.name,fx);e.attack-=dt;if(e.attack<=0){if(ranged){fire(r,e.x,e.y,r,d.damage*r.difficulty.damage,undefined,true,150);e.attack=2.5;}else if(e.kind==='boss'||e.kind==='captain'){e.attack=e.hp<e.maxHp*.5?2.6:3.8;for(const offset of [-.4,0,.4])fire(r,e.x,e.y,r,d.damage*r.difficulty.damage,undefined,true,145,offset);r.hazards.push({id:r.serial++,x:r.x,y:r.y,r:65,wait:1,damage:d.damage*r.difficulty.damage});}else e.attack=2;}}
 if(r.phase!=='combat')return;
 for(const w of r.weapons){w.cooldown-=dt;if(w.cooldown>0)continue;const def=WEAPONS[w.id],range=def.range*s.range,e=target(r,r.x,r.y,range);if(!e){w.cooldown=.07;continue;}let damage=def.damage*(1+(w.tier-1)*.65)*s.damage;if(r.character==='meituan'&&def.kind==='melee')damage*=1.25;if(r.character==='naidan'&&def.kind==='area')damage*=1.15;w.cooldown=def.cooldown/s.attackSpeed;
 if(w.id==='milk'||w.id==='peach'){fire(r,r.x,r.y,e,damage,w.id,false,w.id==='peach'?260:410);fx.push({kind:'shot',x:r.x,y:r.y});}
 else if(w.id==='turret'){const max=2+r.weapons.filter(k=>k.id==='turret').length;if(r.turrets.length<max)r.turrets.push({id:r.serial++,x:r.x+Math.cos(r.elapsed)*35,y:r.y+Math.sin(r.elapsed)*35,life:6,cooldown:.1,damage});w.cooldown=3/s.attackSpeed;}
 else{const aim=Math.atan2(e.y-r.y,e.x-r.x);fx.push({kind:w.id==='lid'?'burst':'swipe',x:r.x,y:r.y,r:range,color:def.color});for(const foe of r.enemies){if(distance(r,foe)>range)continue;const delta=Math.atan2(Math.sin(Math.atan2(foe.y-r.y,foe.x-r.x)-aim),Math.cos(Math.atan2(foe.y-r.y,foe.x-r.x)-aim));if(w.id==='lid'||Math.abs(delta)<(w.id==='horn'?1:.85)){damageEnemy(r,foe,damage,fx);const a=Math.atan2(foe.y-r.y,foe.x-r.x);foe.x=clamp(foe.x+Math.cos(a)*12,30,930);foe.y=clamp(foe.y+Math.sin(a)*12,78,515);}}}}
 for(const t of r.turrets){t.life-=dt;t.cooldown-=dt;if(t.cooldown<=0){const e=target(r,t.x,t.y,320*s.range);if(e){fire(r,t.x,t.y,e,t.damage,'turret');t.cooldown=.55;}else t.cooldown=.15;}}r.turrets=r.turrets.filter(t=>t.life>0);
 const grid=new Map<string,Actor[]>();for(const e of r.enemies){if(e.hp<=0||e.warm>0)continue;const key=`${Math.floor(e.x/80)},${Math.floor(e.y/80)}`;if(!grid.has(key))grid.set(key,[]);grid.get(key)!.push(e);}
 for(const p of r.shots){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.life<=0)continue;if(p.enemy){if(distance(p,r)<p.r+13){hurt(r,p.damage,'敌方弹幕',fx);p.life=0;}}else{const gx=Math.floor(p.x/80),gy=Math.floor(p.y/80);let hit:Actor|undefined;for(let xx=-1;xx<=1&&!hit;xx++)for(let yy=-1;yy<=1&&!hit;yy++)hit=grid.get(`${gx+xx},${gy+yy}`)?.find(e=>e.hp>0&&distance(e,p)<ENEMIES[e.kind].r+p.r);if(hit){p.life=0;if(p.weapon==='peach'){const radius=66*s.range;fx.push({kind:'burst',x:p.x,y:p.y,r:radius,color:'#ffcd76'});for(const e of r.enemies)if(distance(e,p)<radius)damageEnemy(r,e,p.damage,fx);}else damageEnemy(r,hit,p.damage,fx);}}}
 for(const h of r.hazards){h.wait-=dt;if(h.wait<=0){if(distance(r,h)<h.r+12)hurt(r,h.damage,'魔王的地面重击',fx);fx.push({kind:'burst',x:h.x,y:h.y,r:h.r,color:'#ec7961'});}}r.hazards=r.hazards.filter(h=>h.wait>0);
 const bossKilled=r.wave===12&&r.enemies.some(e=>e.kind==='boss'&&e.hp<=0);r.enemies=r.enemies.filter(e=>e.hp>0);r.shots=r.shots.filter(p=>p.life>0&&p.x>-20&&p.x<980&&p.y>35&&p.y<570);
 if(r.phase!=='combat')return;
 r.drops=r.drops.filter(d=>{const dist=distance(d,r);if(dist<s.pickup+30&&dist>1){d.x+=(r.x-d.x)/dist*290*dt;d.y+=(r.y-d.y)/dist*290*dt;}if(dist<20){if(d.heal){r.hp=Math.min(s.maxHp,r.hp+d.value);fx.push({kind:'heal',x:r.x,y:r.y,value:d.value});}else gain(r,d.value);return false;}return true;});
 if(r.drops.length>150){const a=r.drops.find(d=>!d.heal);if(a){const extra=r.drops.filter(d=>!d.heal&&d!==a).slice(0,40);for(const d of extra)a.value+=d.value;const ids=new Set(extra.map(d=>d.id));r.drops=r.drops.filter(d=>!ids.has(d.id));}}
 if(r.phase==='combat'&&(r.remaining<=0||bossKilled))endWave(r);
}

export function encode(r:Run){return JSON.stringify(r);}
export function decode(raw:string|null):Run|null {try{
 if(!raw||raw.length>1_000_000)return null;const r=JSON.parse(raw) as Run;
 const finite=(v:unknown)=>typeof v==='number'&&Number.isFinite(v)&&Math.abs(v)<1e12;
 const position=(v:{x:number;y:number})=>v&&finite(v.x)&&finite(v.y)&&Math.abs(v.x)<3000&&Math.abs(v.y)<3000;
 const tier=(n:number)=>Number.isInteger(n)&&n>=1&&n<=4;
 const statKeys=['health','damage','speed','armor','attackSpeed','crit','regen','pickup','range','harvest','luck','lifesteal'];
 if(!r||r.version!==1||!CHARACTERS.some(c=>c.id===r.character)||!['combat','upgrade','shop','dead','won'].includes(r.phase)||!Number.isInteger(r.wave)||r.wave<1||r.wave>12)return null;
 for(const key of ['hp','x','y','face','seed','coins','remaining','elapsed','serial','level','xp','pending','invulnerable','spawn','rerolls','kills','damageDone'] as const)if(!finite(r[key]))return null;
 if(!position(r)||r.hp<0||r.coins<0||r.remaining<0||r.remaining>90||r.pending<0||r.pending>500||r.level<1||typeof r.revived!=='boolean'||typeof r.deathCause!=='string'||r.deathCause.length>100)return null;
 if(!r.difficulty||!['简单','标准','困难','自定义'].includes(r.difficulty.name)||!['health','damage','speed'].every(k=>{const n=r.difficulty[k as 'health'];return finite(n)&&n>=.5&&n<=1.5;}))return null;
 for(const key of ['weapons','items','enemies','shots','drops','turrets','hazards','offers','choices'] as const)if(!Array.isArray(r[key]))return null;
 if(r.weapons.length<1||r.weapons.length>6||r.weapons.some(w=>!w||!Object.hasOwn(WEAPONS,w.id)||!tier(w.tier)||!finite(w.cooldown)))return null;
 if(r.items.length>1000||r.items.some(id=>!ITEMS.some(i=>i.id===id))||!r.bonus||typeof r.bonus!=='object'||Array.isArray(r.bonus)||Object.entries(r.bonus).some(([k,v])=>!statKeys.includes(k)||!finite(v)))return null;
 if(r.enemies.length>105||r.enemies.some(e=>!position(e)||!Object.hasOwn(ENEMIES,e.kind)||!['id','hp','maxHp','warm','attack','hit'].every(k=>finite(e[k as 'hp']))))return null;
 if(r.shots.length>260||r.shots.some(s=>!position(s)||typeof s.enemy!=='boolean'||!['id','vx','vy','life','damage','r'].every(k=>finite(s[k as 'damage']))||(s.weapon!==undefined&&!Object.hasOwn(WEAPONS,s.weapon))))return null;
 if(r.drops.length>250||r.drops.some(d=>!position(d)||!finite(d.value)||d.value<0||!finite(d.id)||typeof d.heal!=='boolean'))return null;
 if(r.turrets.length>10||r.turrets.some(t=>!position(t)||!['id','life','cooldown','damage'].every(k=>finite(t[k as 'damage']))))return null;
 if(r.hazards.length>40||r.hazards.some(h=>!position(h)||!['id','r','wait','damage'].every(k=>finite(h[k as 'damage']))))return null;
 if(r.offers.length>4||r.offers.some(o=>!o||!tier(o.tier)||!finite(o.price)||o.price<0||typeof o.locked!=='boolean'||typeof o.sold!=='boolean'||(o.type==='weapon'?!Object.hasOwn(WEAPONS,o.id):o.type==='item'?!ITEMS.some(i=>i.id===o.id):true)))return null;
 if(r.choices.length>3||r.choices.some(c=>!c||!statKeys.includes(c.stat)||!finite(c.value)||typeof c.name!=='string'||c.name.length>20)||r.phase==='upgrade'&&(r.pending<1||r.choices.length!==3))return null;
 return r;
 }catch{return null;}}
