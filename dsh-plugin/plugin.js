/**
 * Kun Like 桌宠 · DeepSeek Harness (DSH) 动态插件源码
 * ----------------------------------------------------------
 * 这是本仓库桌宠的 DSH 动态 Cordis 插件版本（Client half）。
 * 与根目录 index.html 的独立网页版功能一致：
 * 真猫习性的 3D 猫咪 —— CSS 3D 多层头、鼠标追踪转头、
 * 不对称眨眼/慢眨眼、舔毛/打哈欠/歪头好奇/打盹做梦、
 * 喝水后变身巨猫敲屏提醒。纯文字卖萌。
 *
 * 使用方式见同目录 README.md。
 * 该文件内容就是 cordis_define 的 code.client 函数体（纯 JavaScript，
 * 无 JSX / TypeScript，无需打包）。
 */
return {
  name: 'cute-desk-pet-v4',
  inject: ['timer'],
  apply(ctx) {
    const slots = ctx.get('slots')
    if (slots === undefined) return

    styles.insert(`
/* ================= container ================= */
.dspet {
  position: fixed; right: 24px; bottom: 24px;
  width: 240px; height: 200px;
  pointer-events: auto; cursor: grab;
  user-select: none; -webkit-user-select: none;
  touch-action: none; z-index: 50;
}
.dspet:active { cursor: grabbing; }

/* ================= scene (3D perspective) ================= */
.dsp-scene {
  position: absolute; left: 0; bottom: 0; width: 240px; height: 200px;
  perspective: 900px; perspective-origin: 50% 90%;
}
.dsp-shadow {
  position: absolute; bottom: 0; width: 96px; height: 20px;
  border-radius: 50%; pointer-events: none; z-index: 3;
  background: radial-gradient(ellipse at center, rgba(120, 80, 40, 0.32), rgba(120, 80, 40, 0) 70%);
  transition: left 0.85s cubic-bezier(0.22, 1, 0.36, 1), transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1);
}

/* ================= vase ================= */
.dsp-vase { position: absolute; left: 6px; bottom: 0; width: 88px; height: 60px; z-index: 4; }
.dsp-vase-body {
  position: absolute; left: 0; bottom: 0; width: 88px; height: 52px;
  background: linear-gradient(180deg, #bde3ff, #8ecdf5);
  border: 2px solid rgba(90, 140, 180, 0.5);
  border-radius: 14px 14px 22px 22px / 14px 14px 26px 26px;
  box-shadow: 0 5px 12px rgba(90, 140, 180, 0.28), inset 0 -8px 12px rgba(60, 120, 170, 0.18);
}
.dsp-vase-body::before {
  content: ''; position: absolute; left: -2px; right: -2px; top: -7px; height: 14px;
  background: #a8dcff; border: 2px solid rgba(90, 140, 180, 0.5); border-radius: 10px;
}
.dsp-vase-face { position: absolute; left: 50%; bottom: 14px; margin-left: -14px; width: 28px; height: 20px; }
.dsp-vase-eye { position: absolute; top: 2px; width: 5px; height: 6px; background: #4a6a8a; border-radius: 50%; }
.dsp-vase-eye--l { left: 2px; }
.dsp-vase-eye--r { right: 2px; }
.dsp-vase-mouth {
  position: absolute; left: 50%; bottom: 0; margin-left: -5px; width: 10px; height: 6px;
  border-bottom: 2px solid #4a6a8a; border-radius: 0 0 10px 10px;
}

/* ================= flowers ================= */
.dsp-flower {
  position: absolute; bottom: 46px; width: 20px; height: 52px;
  transform-origin: 50% 100%;
  animation: dsp-sway 3.4s ease-in-out infinite;
}
.dsp-flower--f1 { left: 10px; animation-delay: 0s; }
.dsp-flower--f2 { left: 34px; animation-delay: 0.6s; }
.dsp-flower--f3 { left: 58px; animation-delay: 1.2s; }
.dsp-flower-stem {
  position: absolute; left: 50%; bottom: 0; margin-left: -1.5px;
  width: 3px; height: 46px; background: linear-gradient(#7ec87e, #5aae5a);
  border-radius: 3px;
}
.dsp-flower-head {
  position: absolute; left: 50%; bottom: 40px; margin-left: -9px;
  width: 18px; height: 18px; border-radius: 50%;
  box-shadow: inset -3px -4px 0 rgba(0, 0, 0, 0.08);
  animation: dsp-blossom 3.4s ease-in-out infinite;
}
.dsp-flower-head::after {
  content: ''; position: absolute; left: 50%; top: 50%; margin: -3px;
  width: 6px; height: 6px; border-radius: 50%; background: rgba(255, 240, 170, 0.95);
}
.dsp-flower--f1 .dsp-flower-head { background: #ff9db4; animation-delay: 0s; }
.dsp-flower--f2 .dsp-flower-head { background: #ffd76e; animation-delay: 0.6s; }
.dsp-flower--f3 .dsp-flower-head { background: #c9a4ff; animation-delay: 1.2s; }
@keyframes dsp-sway { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(5deg); } }
@keyframes dsp-blossom { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }

/* ================= water bowl ================= */
.dsp-bowl {
  position: absolute; left: 96px; bottom: 2px; width: 44px; height: 18px; z-index: 7;
  background: linear-gradient(180deg, #e8f4ff, #cfe9ff);
  border: 2px solid rgba(120, 170, 210, 0.6);
  border-radius: 8px 8px 14px 14px / 6px 6px 10px 10px;
  box-shadow: 0 2px 6px rgba(90, 140, 180, 0.2);
}
.dsp-bowl::before {
  content: ''; position: absolute; left: 3px; right: 3px; top: 3px; height: 6px;
  background: linear-gradient(180deg, #9fd8ff, #6dbef5);
  border-radius: 6px;
  animation: dsp-water 2s ease-in-out infinite;
}
@keyframes dsp-water { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(1px); } }

/* ================= butterflies (natural flight: banking + hover + dart) ================= */
.dsp-butterflies {
  position: absolute; inset: 0; z-index: 15; pointer-events: none;
  opacity: 0; transition: opacity 0.6s ease;
}
.dsp-butterflies--on { opacity: 1; }
.dsp-bfly { position: absolute; font-size: 20px; }
.dsp-bfly--1 { left: 6px; top: 58px; animation: dsp-fly1 7s ease-in-out infinite; }
.dsp-bfly--2 { left: 78px; top: 26px; animation: dsp-fly2 8.6s ease-in-out infinite; }
.dsp-bfly--3 { left: 32px; top: 82px; animation: dsp-fly3 6.2s ease-in-out infinite; }
.dsp-bfly-wing {
  display: inline-block;
  animation: dsp-flap3d 0.32s ease-in-out infinite;
}
.dsp-bfly--2 .dsp-bfly-wing { animation-duration: 0.24s; }
.dsp-bfly--3 .dsp-bfly-wing { animation-duration: 0.4s; }
@keyframes dsp-flap3d {
  0%, 100% { transform: perspective(400px) rotateY(0deg); }
  50% { transform: perspective(400px) rotateY(78deg); }
}
/* 飞行1：花丛右侧悬停 → 急窜右上（banking）→ 悬停 → 急窜左上远处 → 回花丛 */
@keyframes dsp-fly1 {
  0%, 12% { transform: translate3d(0, 0, 0) rotateZ(0deg) scale(1); }
  24% { transform: translate3d(52px, -30px, 24px) rotateZ(-16deg) scale(1.14); }
  30% { transform: translate3d(58px, -36px, 24px) rotateZ(6deg) scale(1.14); }
  44% { transform: translate3d(58px, -36px, 24px) rotateZ(6deg) scale(1.14); }
  56% { transform: translate3d(6px, -72px, -24px) rotateZ(12deg) scale(0.9); }
  62% { transform: translate3d(-2px, -74px, -24px) rotateZ(-8deg) scale(0.9); }
  76% { transform: translate3d(-2px, -74px, -24px) rotateZ(-8deg) scale(0.9); }
  88% { transform: translate3d(-24px, -46px, 14px) rotateZ(18deg) scale(1.08); }
  94% { transform: translate3d(-14px, -48px, 14px) rotateZ(-10deg) scale(1.08); }
}
/* 飞行2：高处悬停 → 俯冲左下 → 盘旋回花丛上方 */
@keyframes dsp-fly2 {
  0%, 10% { transform: translate3d(0, 0, 0) rotateZ(0deg) scale(1); }
  22% { transform: translate3d(-54px, 14px, -18px) rotateZ(14deg) scale(0.92); }
  28% { transform: translate3d(-60px, 10px, -18px) rotateZ(-10deg) scale(0.92); }
  40% { transform: translate3d(-60px, 10px, -18px) rotateZ(-10deg) scale(0.92); }
  52% { transform: translate3d(-8px, -40px, 22px) rotateZ(-16deg) scale(1.12); }
  58% { transform: translate3d(-2px, -44px, 22px) rotateZ(8deg) scale(1.12); }
  72% { transform: translate3d(-2px, -44px, 22px) rotateZ(8deg) scale(1.12); }
  84% { transform: translate3d(40px, -10px, -12px) rotateZ(-14deg) scale(0.94); }
  92% { transform: translate3d(30px, -12px, -12px) rotateZ(10deg) scale(0.94); }
}
/* 飞行3：花间小范围徘徊 + 小绕圈 */
@keyframes dsp-fly3 {
  0%, 8% { transform: translate3d(0, 0, 0) rotateZ(0deg) scale(1); }
  16% { transform: translate3d(24px, -20px, 10px) rotateZ(-10deg) scale(1.08); }
  24% { transform: translate3d(18px, -34px, 14px) rotateZ(8deg) scale(1.1); }
  36% { transform: translate3d(18px, -34px, 14px) rotateZ(8deg) scale(1.1); }
  46% { transform: translate3d(-14px, -48px, 6px) rotateZ(12deg) scale(1.02); }
  54% { transform: translate3d(-20px, -40px, 6px) rotateZ(-12deg) scale(1.02); }
  66% { transform: translate3d(-20px, -40px, 6px) rotateZ(-12deg) scale(1.02); }
  78% { transform: translate3d(-34px, -18px, -10px) rotateZ(14deg) scale(0.94); }
  88% { transform: translate3d(-16px, -22px, -10px) rotateZ(-10deg) scale(0.94); }
}

/* ================= cat ================= */
.dsp-cat-z {
  position: absolute; left: 104px; bottom: 0; width: 124px; height: 116px;
  transform-style: preserve-3d;
  transition: transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
}
.dsp-cat {
  position: absolute; inset: 0;
  transform: translateZ(30px);
  transform-style: preserve-3d;
}
.dsp-cat-walk {
  position: absolute; inset: 0;
  transform-style: preserve-3d;
  animation: dsp-idlebob 3.6s ease-in-out infinite;
}
.dsp-cat-walk--on { animation: dsp-walkbob 0.75s ease-in-out infinite; }
@keyframes dsp-idlebob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes dsp-walkbob {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  20% { transform: translateY(-5px) rotate(-2.5deg); }
  40% { transform: translateY(0) rotate(0deg); }
  60% { transform: translateY(-5px) rotate(2.5deg); }
  80% { transform: translateY(0) rotate(0deg); }
}
.dsp-cat-tail {
  position: absolute; right: -22px; bottom: 8px; width: 46px; height: 15px;
  background: linear-gradient(180deg, #ffe8c8, #ffd9a6);
  border: 2px solid rgba(214, 164, 112, 0.35);
  border-radius: 4px 12px 12px 4px;
  transform-origin: left center;
  animation: dsp-tailwag 2.4s ease-in-out infinite;
}
@keyframes dsp-tailwag {
  0%, 100% { transform: rotate(9deg); }
  25% { transform: rotate(-7deg); }
  50% { transform: rotate(13deg); }
  75% { transform: rotate(-5deg); }
}

/* ============ 3D head (multi-plane: front / back / sides) ============ */
.dsp-h3d {
  position: absolute; left: 50%; bottom: 26px; margin-left: -46px;
  width: 92px; height: 84px;
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.dsp-h3d-f {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 35% 25%, #fff3dd, #ffe3b8 55%, #ffd9a3);
  border: 2px solid rgba(214, 164, 112, 0.4);
  border-radius: 50% 50% 46% 46% / 56% 56% 44% 44%;
  box-shadow: inset 0 -6px 12px rgba(230, 170, 110, 0.22);
  transform: translateZ(15px);
}
.dsp-h3d-b {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 40%, #f6d3a4, #f0c48e 60%, #e9b87e);
  border: 2px solid rgba(214, 164, 112, 0.35);
  border-radius: 50% 50% 46% 46% / 56% 56% 44% 44%;
  transform: rotateY(180deg) translateZ(15px);
}
/* 左右侧面已移除：头部为正面 + 脑后两层，3D 转身靠透视收缩 */
.dsp-cat-ear {
  position: absolute; top: -16px; width: 0; height: 0;
  border-left: 20px solid transparent; border-right: 20px solid transparent;
  border-bottom: 30px solid #ffe0b2;
  filter: drop-shadow(0 0 1px rgba(214, 164, 112, 0.4));
}
.dsp-cat-ear--l { left: 8px; transform-origin: 50% 100%; animation: dsp-earchirp-l 8s ease-in-out infinite; }
.dsp-cat-ear--r { right: 8px; transform-origin: 50% 100%; animation: dsp-earchirp-r 9s ease-in-out infinite; }
.dsp-cat-ear--l::after, .dsp-cat-ear--r::after {
  content: ''; position: absolute; top: 12px; left: -10px;
  width: 0; height: 0;
  border-left: 10px solid transparent; border-right: 10px solid transparent;
  border-bottom: 15px solid #ffb3c6;
}
@keyframes dsp-earchirp-l {
  0%, 88%, 100% { transform: rotate(-12deg); }
  91% { transform: rotate(-2deg); }
  94% { transform: rotate(-12deg); }
}
@keyframes dsp-earchirp-r {
  0%, 78%, 100% { transform: rotate(12deg); }
  82% { transform: rotate(2deg); }
  86% { transform: rotate(12deg); }
}

/* face features live on the front plane */
.dsp-cat-face {
  position: absolute; top: 16px; left: 0; width: 100%; height: 58px;
  transform-style: preserve-3d;
}
.dsp-eye-pos { position: absolute; top: 6px; }
.dsp-eye-pos--l { left: 18px; }
.dsp-eye-pos--r { right: 18px; }
.dsp-cat-eye {
  width: 13px; height: 16px;
  background: #5b4636; border-radius: 50%;
  position: relative;
}
.dsp-cat-eye::after {
  content: ''; position: absolute; left: 3px; top: 3px; width: 4px; height: 5px;
  background: rgba(255, 255, 255, 0.85); border-radius: 50%;
}
.dsp-eye-pos--l .dsp-cat-eye { animation: dsp-blinkL 4.2s ease-in-out infinite; }
.dsp-eye-pos--r .dsp-cat-eye { animation: dsp-blinkR 5.9s ease-in-out infinite; }
@keyframes dsp-blinkL {
  0%, 86%, 100% { transform: scaleY(1); }
  88%, 91% { transform: scaleY(0.08); }
}
@keyframes dsp-blinkR {
  0%, 60%, 100% { transform: scaleY(1); }
  62%, 65% { transform: scaleY(0.08); }
  78%, 84% { transform: scaleY(0.06); }
}
.dsp-cat-eye--happy {
  width: 12px; height: 7px; background: transparent;
  border-top: 3px solid #5b4636; border-radius: 0; animation: none !important;
}
.dsp-cat-eye--happy::after { display: none; }
.dsp-cat-eye--closed {
  background: transparent; height: 6px;
  border-bottom: 3px solid #5b4636; border-radius: 0; animation: none !important;
}
.dsp-cat-eye--closed::after { display: none; }
.dsp-cat-nose {
  position: absolute; left: 50%; top: 22px; margin-left: -4px;
  width: 8px; height: 6px;
  background: #ff9db4; border-radius: 4px 4px 6px 6px;
  animation: dsp-sniff 5.2s ease-in-out infinite;
}
@keyframes dsp-sniff {
  0%, 90%, 100% { transform: scaleY(1); }
  93% { transform: scaleY(1.25); }
  96% { transform: scaleY(1); }
}
.dsp-cat-blush {
  position: absolute; top: 30px; width: 14px; height: 8px;
  background: rgba(255, 138, 158, 0.75); border-radius: 50%;
}
.dsp-cat-blush--l { left: 6px; }
.dsp-cat-blush--r { right: 6px; }
.dsp-cat-mouth {
  position: absolute; left: 50%; top: 32px; margin-left: -6px;
  width: 12px; height: 7px;
  border-bottom: 2.5px solid #5b4636; border-radius: 0 0 12px 12px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.dsp-cat-yawn {
  position: absolute; left: 50%; top: 26px; margin-left: -10px;
  width: 20px; height: 16px;
  background: #7a4a35; border-radius: 2px 2px 12px 12px;
  transform: scale(0); transform-origin: top center;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
  opacity: 0;
}
.dsp-cat-yawn::after {
  content: ''; position: absolute; left: 4px; top: 8px; width: 12px; height: 7px;
  background: #ff9db4; border-radius: 8px 8px 12px 12px;
}
.dsp-cat--yawn .dsp-cat-yawn { transform: scale(1); opacity: 1; }
.dsp-cat--yawn .dsp-cat-mouth { transform: scale(0); opacity: 0; }
.dsp-whisker {
  position: absolute; top: 26px; width: 26px; height: 2px;
  background: rgba(91, 70, 54, 0.45); border-radius: 2px;
  transform-origin: 100% 50%;
}
.dsp-whisker--l1 { left: -14px; animation: dsp-whiskL1 6s ease-in-out infinite; }
.dsp-whisker--l2 { left: -14px; top: 35px; animation: dsp-whiskL2 7s ease-in-out infinite; }
.dsp-whisker--r1 { right: -14px; animation: dsp-whiskR1 6.4s ease-in-out infinite; }
.dsp-whisker--r2 { right: -14px; top: 35px; animation: dsp-whiskR2 7.4s ease-in-out infinite; }
@keyframes dsp-whiskL1 {
  0%, 88%, 100% { transform: rotate(8deg); }
  92% { transform: rotate(12deg); }
  96% { transform: rotate(8deg); }
}
@keyframes dsp-whiskL2 {
  0%, 84%, 100% { transform: rotate(-6deg); }
  89% { transform: rotate(-10deg); }
  94% { transform: rotate(-6deg); }
}
@keyframes dsp-whiskR1 {
  0%, 86%, 100% { transform: rotate(-8deg); }
  90% { transform: rotate(-12deg); }
  94% { transform: rotate(-8deg); }
}
@keyframes dsp-whiskR2 {
  0%, 82%, 100% { transform: rotate(6deg); }
  87% { transform: rotate(10deg); }
  92% { transform: rotate(6deg); }
}
.dsp-cat-body {
  position: absolute; left: 50%; bottom: 2px; margin-left: -33px;
  width: 66px; height: 40px;
  background: linear-gradient(180deg, #fff0d8, #ffdfae);
  border: 2px solid rgba(214, 164, 112, 0.35);
  border-radius: 20px 20px 14px 14px;
  box-shadow: inset 0 -5px 10px rgba(230, 170, 110, 0.2);
  transform: translateZ(6px);
}
.dsp-cat-scarf {
  position: absolute; left: 50%; bottom: 22px; margin-left: -30px;
  width: 60px; height: 13px;
  background: linear-gradient(180deg, #ff9dbe, #ff7ea8);
  border-radius: 7px;
  box-shadow: 0 2px 4px rgba(255, 126, 168, 0.35);
  transform: translateZ(12px);
}
.dsp-cat-scarf::after {
  content: ''; position: absolute; left: 50%; top: 5px; margin-left: -7px;
  width: 14px; height: 11px; background: #ffb3c9; border-radius: 4px;
}
.dsp-cat-paw {
  position: absolute; bottom: 0; width: 26px; height: 14px;
  background: #ffe8c8; border: 2px solid rgba(214, 164, 112, 0.35);
  border-radius: 50%;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.dsp-cat-paw--l { left: 28px; }
.dsp-cat-paw--r { right: 28px; }
.dsp-cat-paw--up { animation: dsp-pawup 2.2s ease-in-out infinite; }
.dsp-cat-paw--swat { animation: dsp-swat 1.2s ease-in-out infinite; }
@keyframes dsp-pawup { 0%, 100% { transform: translateY(0); } 45% { transform: translateY(-17px) rotate(-12deg); } }
@keyframes dsp-swat {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  30% { transform: translate(-8px, -26px) rotate(-24deg); }
  60% { transform: translate(-2px, -8px) rotate(-8deg); }
}

/* ================= nap fx ================= */
.dsp-napfx {
  position: absolute; inset: 0; z-index: 12; pointer-events: none;
  opacity: 0; transition: opacity 0.6s ease;
}
.dsp-napfx--on { opacity: 1; }
.dsp-zzz span {
  position: absolute; font-size: 16px; font-weight: 700; color: #8fb8e8;
  animation: dsp-zz 2.6s ease-in-out infinite; opacity: 0;
}
.dsp-zzz span:nth-child(1) { left: 138px; top: 34px; }
.dsp-zzz span:nth-child(2) { left: 156px; top: 22px; animation-delay: 0.8s; }
.dsp-zzz span:nth-child(3) { left: 174px; top: 10px; animation-delay: 1.6s; }
@keyframes dsp-zz {
  0% { transform: translateY(10px) scale(0.6); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateY(-26px) scale(1.15); opacity: 0; }
}
.dsp-snot {
  position: absolute; left: 148px; top: 98px; width: 12px; height: 12px;
  background: rgba(170, 215, 250, 0.9);
  border: 1.5px solid rgba(120, 170, 220, 0.6);
  border-radius: 50%;
  animation: dsp-snot 5.5s ease-in-out infinite;
}
@keyframes dsp-snot {
  0% { transform: scale(0.2); opacity: 0; }
  12% { transform: scale(1); opacity: 1; }
  55% { transform: scale(1.6); opacity: 0.9; }
  65% { transform: scale(2.1); opacity: 0; }
  100% { transform: scale(2.1); opacity: 0; }
}
.dsp-dream {
  position: absolute; left: 118px; top: 58px;
  padding: 6px 10px; background: #fff;
  border: 2px solid rgba(214, 164, 112, 0.4); border-radius: 14px;
  font-size: 13px; color: #8a5a3a; white-space: nowrap;
  box-shadow: 0 4px 12px rgba(120, 80, 40, 0.18);
  animation: dsp-dream 5.5s ease-in-out infinite;
}
@keyframes dsp-dream {
  0%, 8% { transform: scale(0.4); opacity: 0; }
  16% { transform: scale(1); opacity: 1; }
  55% { transform: scale(1); opacity: 1; }
  66% { transform: scale(1.3); opacity: 0; }
  100% { transform: scale(1.3); opacity: 0; }
}

/* ================= bubble / hearts / close / summon ================= */
.dsp-bubble {
  position: absolute; left: 58%; bottom: 128px; transform: translateX(-50%);
  max-width: 250px; min-width: 92px;
  padding: 9px 13px;
  background: #fffdf9; color: #6b4a33;
  border: 1.5px solid rgba(214, 164, 112, 0.5);
  border-radius: 14px;
  font-size: 13px; line-height: 1.55; text-align: center;
  box-shadow: 0 6px 18px rgba(120, 80, 40, 0.18);
  animation: dsp-pop 0.28s ease-out;
  white-space: normal; word-break: break-word;
  cursor: default;
  transition: opacity 0.26s ease, transform 0.26s ease;
}
.dsp-bubble--fade { opacity: 0; transform: translateX(-50%) translateY(8px); }
.dsp-bubble::after {
  content: ''; position: absolute; left: 50%; bottom: -7px; margin-left: -7px;
  width: 14px; height: 14px;
  background: #fffdf9;
  border-right: 1.5px solid rgba(214, 164, 112, 0.5);
  border-bottom: 1.5px solid rgba(214, 164, 112, 0.5);
  transform: rotate(45deg);
}
@keyframes dsp-pop {
  from { transform: translateX(-50%) scale(0.6); opacity: 0; }
  to { transform: translateX(-50%) scale(1); opacity: 1; }
}
.dsp-hearts { position: absolute; left: 150px; top: 22px; width: 0; height: 0; pointer-events: none; z-index: 16; }
.dsp-hearts span {
  position: absolute; font-size: 18px;
  animation: dsp-heart 1.3s ease-out forwards;
  opacity: 0;
}
.dsp-hearts span:nth-child(1) { left: -34px; animation-delay: 0s; }
.dsp-hearts span:nth-child(2) { left: -6px; animation-delay: 0.12s; }
.dsp-hearts span:nth-child(3) { left: 16px; animation-delay: 0.24s; }
@keyframes dsp-heart {
  0% { transform: translateY(0) scale(0.5); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(-72px) scale(1.15); opacity: 0; }
}
.dsp-close {
  position: absolute; top: 0; right: 0; width: 22px; height: 22px;
  background: rgba(90, 60, 30, 0.45); color: #fff;
  border-radius: 50%; font-size: 13px; line-height: 20px; text-align: center;
  cursor: pointer; opacity: 0; transition: opacity 0.18s; z-index: 40;
}
.dspet:hover .dsp-close { opacity: 1; }
.dspet-summon {
  position: fixed; right: 26px; bottom: 30px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.92);
  color: #6b4a33; border: 1.5px solid rgba(214, 164, 112, 0.55);
  border-radius: 999px; font-size: 13px;
  box-shadow: 0 6px 18px rgba(120, 80, 40, 0.2);
  cursor: pointer; pointer-events: auto;
  transition: transform 0.15s;
}
.dspet-summon:hover { transform: scale(1.06); }

/* ================= BIG cat knock (3D + springy) ================= */
.dsp-big {
  position: fixed; inset: 0; z-index: 60; pointer-events: none;
  animation: dsp-big-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dsp-big--out { animation: dsp-big-out 0.45s ease-in forwards; }
@keyframes dsp-big-in {
  from { transform: scale(0.2); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
@keyframes dsp-big-out {
  to { transform: scale(0.15); opacity: 0; }
}
.dsp-big-shake { position: absolute; inset: 0; animation: dsp-shake 0.9s ease-in-out infinite; }
@keyframes dsp-shake {
  0%, 100% { transform: translate(0, 0); }
  20% { transform: translate(4px, -3px); }
  40% { transform: translate(-4px, 3px); }
  60% { transform: translate(3px, 2px); }
  80% { transform: translate(-3px, -2px); }
}
.dsp-big-cat {
  position: absolute; left: 50%; bottom: -46px; transform: translateX(-50%);
  width: min(640px, 66vw); height: 380px;
  transform-style: preserve-3d;
}
.dsp-big-ear {
  position: absolute; top: -58px; width: 0; height: 0;
  border-left: 58px solid transparent; border-right: 58px solid transparent;
  border-bottom: 88px solid #ffe0b2;
  filter: drop-shadow(0 0 3px rgba(214, 164, 112, 0.4));
}
.dsp-big-ear--l { left: 12px; transform: rotate(-14deg); }
.dsp-big-ear--r { right: 12px; transform: rotate(14deg); }
.dsp-big-ear--l::after, .dsp-big-ear--r::after {
  content: ''; position: absolute; top: 34px; left: -29px;
  width: 0; height: 0;
  border-left: 29px solid transparent; border-right: 29px solid transparent;
  border-bottom: 44px solid #ffb3c6;
}
.dsp-big-head {
  position: absolute; left: 50%; bottom: 20px; transform: translateX(-50%);
  width: min(430px, 44vw); height: 300px;
  background: radial-gradient(ellipse at 38% 28%, #fff3dd, #ffe3b8 60%, #ffd9a3);
  border: 4px solid rgba(214, 164, 112, 0.45);
  border-radius: 50% 50% 44% 44% / 54% 54% 46% 46%;
  box-shadow: 0 24px 60px rgba(160, 110, 60, 0.3), inset 0 -18px 34px rgba(230, 170, 110, 0.25);
  animation: dsp-bigbob 2.6s ease-in-out infinite;
  transform-style: preserve-3d;
}
@keyframes dsp-bigbob {
  0%, 100% { transform: translateX(-50%) perspective(900px) rotateY(-7deg) translateY(0); }
  50% { transform: translateX(-50%) perspective(900px) rotateY(-7deg) translateY(-10px); }
}
.dsp-big-face { position: absolute; top: 44px; left: 0; width: 100%; height: 200px; }
.dsp-big-eye {
  position: absolute; top: 20px; width: 26px; height: 34px;
  background: #5b4636; border-radius: 50%;
  animation: dsp-bigblink 5s infinite;
  box-shadow: inset 6px 8px 0 rgba(255, 255, 255, 0.55);
}
.dsp-big-eye--l { left: 84px; }
.dsp-big-eye--r { right: 84px; }
@keyframes dsp-bigblink { 0%, 90%, 100% { transform: scaleY(1); } 93%, 96% { transform: scaleY(0.1); } }
.dsp-big-blush {
  position: absolute; top: 74px; width: 34px; height: 18px;
  background: rgba(255, 138, 158, 0.75); border-radius: 50%;
}
.dsp-big-blush--l { left: 30px; }
.dsp-big-blush--r { right: 30px; }
.dsp-big-mouth {
  position: absolute; left: 50%; top: 84px; margin-left: -16px;
  width: 32px; height: 18px;
  border-bottom: 5px solid #5b4636; border-radius: 0 0 22px 22px;
}
.dsp-big-paw {
  position: absolute; left: 50%; top: 26%; margin-left: -95px;
  width: 190px; height: 140px;
  background: radial-gradient(ellipse at 40% 30%, #fff3dd, #ffdfae 60%, #ffd69d);
  border: 4px solid rgba(214, 164, 112, 0.45);
  border-radius: 50% 50% 46% 46% / 58% 58% 42% 42%;
  box-shadow: 0 14px 34px rgba(160, 110, 60, 0.28);
  transform-origin: 50% 0%;
  animation: dsp-knock 0.9s ease-in-out infinite;
}
.dsp-big-paw::after {
  content: ''; position: absolute; left: 50%; bottom: 16px; margin-left: -22px;
  width: 44px; height: 34px; background: rgba(255, 182, 148, 0.9);
  border-radius: 50% 50% 46% 46%;
}
@keyframes dsp-knock {
  0%, 100% { transform: translateY(-42px) rotate(-8deg); }
  25% { transform: translateY(26px) rotate(-3deg) scale(0.97, 0.88); }
  38% { transform: translateY(-10px) rotate(-5deg) scale(1.02, 0.98); }
  50% { transform: translateY(18px) rotate(-3deg) scale(0.97, 0.9); }
  62% { transform: translateY(-6px) rotate(-5deg) scale(1.01, 0.99); }
  74% { transform: translateY(12px) rotate(-3deg) scale(0.98, 0.92); }
}
.dsp-big-ripple {
  position: absolute; left: 50%; bottom: 30px; width: 120px; height: 40px;
  border: 4px solid rgba(255, 200, 120, 0.7);
  border-radius: 50%;
  animation: dsp-ripple 0.9s ease-out infinite;
}
.dsp-big-ripple--1 { animation-delay: 0s; }
.dsp-big-ripple--2 { animation-delay: 0.45s; }
@keyframes dsp-ripple {
  0% { transform: translateX(-50%) scale(0.4); opacity: 0.9; }
  100% { transform: translateX(-50%) scale(1.7); opacity: 0; }
}
.dsp-big-text {
  position: absolute; left: 50%; top: 9%; transform: translateX(-50%);
  font-size: clamp(30px, 5vw, 48px); font-weight: 800; color: #e2536f;
  text-shadow: 0 3px 0 #fff, 0 6px 14px rgba(226, 83, 111, 0.35);
  white-space: nowrap;
  animation: dsp-textpop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
}
.dsp-big-sub {
  position: absolute; left: 50%; top: calc(9% + 62px); transform: translateX(-50%);
  font-size: 17px; font-weight: 600; color: #8a5a3a;
  background: rgba(255, 253, 249, 0.94); padding: 6px 18px; border-radius: 999px;
  box-shadow: 0 4px 12px rgba(120, 80, 40, 0.22);
  white-space: nowrap;
  animation: dsp-textpop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.55s both;
}
@keyframes dsp-textpop {
  from { transform: translateX(-50%) scale(0.3); opacity: 0; }
  to { transform: translateX(-50%) scale(1); opacity: 1; }
}

/* ================= settings ================= */
.dsp-settings {
  max-width: 460px; display: flex; flex-direction: column; gap: 10px; padding: 4px 0;
}
.dsp-settings-desc { margin: 0 0 2px; font-size: 13px; opacity: 0.75; }
.dsp-settings-row {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 8px 10px;
  background: rgba(127, 127, 127, 0.07);
  border: 1px solid rgba(127, 127, 127, 0.18);
  border-radius: 10px;
}
.dsp-settings-label { font-size: 13px; }
.dsp-settings-row--actions { justify-content: flex-start; flex-wrap: wrap; }
.dsp-btn {
  padding: 6px 12px; font-size: 13px; border-radius: 8px;
  border: 1px solid rgba(127, 127, 127, 0.3);
  background: transparent; color: inherit; cursor: pointer;
}
.dsp-btn:hover { background: rgba(127, 127, 127, 0.12); }
.dsp-select {
  padding: 4px 8px; font-size: 13px; border-radius: 8px;
  border: 1px solid rgba(127, 127, 127, 0.3);
  background: transparent; color: inherit;
}
.dsp-switch {
  position: relative; width: 42px; height: 22px; padding: 0;
  border-radius: 999px; border: 1px solid rgba(127, 127, 127, 0.35);
  background: rgba(127, 127, 127, 0.18); cursor: pointer;
  transition: background 0.2s;
}
.dsp-switch--on { background: #ff7ea8; border-color: #ff7ea8; }
.dsp-switch-knob {
  position: absolute; top: 2px; left: 2px; width: 16px; height: 16px;
  border-radius: 50%; background: #fff;
  transition: left 0.2s; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}
.dsp-switch--on .dsp-switch-knob { left: 22px; }
`)

    // ---------- shared store ----------
    const state = {
      visible: true,
      remindersOn: true,
      intervalMin: 45,
      pos: null,
      busy: false,
      nextKind: 0,
    }
    const listeners = new Set()
    function getState() { return state }
    function setState(patch) {
      Object.assign(state, patch)
      for (const fn of listeners) fn()
    }
    function subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    }
    function useStore(select) {
      const [value, setValue] = React.useState(() => select(getState()))
      React.useEffect(() => subscribe(() => setValue(select(getState()))), [])
      return value
    }

    // ---------- cute lines ----------
    const CLICK_LINES = [
      '嘻嘻，找我玩呀？记得多喝水哦～',
      '喵呜～今天也要元气满满哦！',
      '被摸头啦，好开心～',
      '工作加油！累了就歇一歇哦～',
      '你看，花瓶里的花开得多好看呀～',
      '（蹭蹭你的手）',
    ]
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

    // ---------- overlay ----------
    const h = React.createElement

    function Switch({ on, onChange }) {
      return h('button', {
        type: 'button',
        className: 'dsp-switch' + (on ? ' dsp-switch--on' : ''),
        onClick: () => onChange(!on),
        'aria-pressed': on,
      }, h('span', { className: 'dsp-switch-knob' }))
    }

    function PetOverlay() {
      const visible = useStore((s) => s.visible)
      const pos = useStore((s) => s.pos)
      const [pose, setPose] = React.useState({ x: 0, y: 0, rz: 0, ry: 0, sx: 1, s: 1, z: 6, closed: false, happy: false, walking: false })
      const [look, setLook] = React.useState({ x: 0, y: 0 })
      const [mode, setMode] = React.useState('idle')
      const [bubble, setBubble] = React.useState(null)
      const [bubbleFade, setBubbleFade] = React.useState(false)
      const [hearts, setHearts] = React.useState(0)
      const [bigPhase, setBigPhase] = React.useState(null)
      const seqRef = React.useRef(0)
      const bubbleRef = React.useRef(null)
      const bigRef = React.useRef(false)
      const mountedRef = React.useRef(true)
      const dragRef = React.useRef(null)
      const movedRef = React.useRef(false)
      const petRef = React.useRef(null)

      React.useEffect(() => () => { mountedRef.current = false }, [])

      // welcome bubble on first mount
      React.useEffect(() => {
        const t = ctx.timeout(() => {
          if (!mountedRef.current) return
          showBubble('喵～我是你的小猫咪！我会躲猫猫、捉蝴蝶，还会按时提醒你喝水哦～', 8000)
        }, 900)
        return t
      }, [])

      // mouse look: head & eyes follow the pointer, decays back to front
      React.useEffect(() => {
        let decay = null
        const onMove = (e) => {
          const nx = (e.clientX / window.innerWidth) * 2 - 1
          const ny = (e.clientY / window.innerHeight) * 2 - 1
          if (mountedRef.current) setLook({ x: nx, y: ny })
          if (decay) decay()
          decay = ctx.timeout(() => { if (mountedRef.current) setLook({ x: 0, y: 0 }) }, 3200)
        }
        const throttled = ctx.throttle(onMove, 90)
        window.addEventListener('pointermove', throttled)
        return () => { window.removeEventListener('pointermove', throttled); if (decay) decay() }
      }, [])

      // ---------- smooth pose / sequence engine ----------
      function runSeq(steps, onDone) {
        const id = ++seqRef.current
        let i = 0
        const next = () => {
          if (!mountedRef.current || seqRef.current !== id) return
          if (i >= steps.length) { if (onDone) onDone(); return }
          const st = steps[i++]
          if (st.set) setPose((p) => ({ ...p, ...st.set }))
          if (st.fn) st.fn()
          if (st.wait) ctx.timeout(next, st.wait)
          else next()
        }
        next()
      }
      function cancelSeq() { seqRef.current++ }

      function showBubble(text, ms) {
        bubbleRef.current = text
        setBubbleFade(false)
        setBubble(text)
        ctx.timeout(() => {
          if (!mountedRef.current || bubbleRef.current !== text) return
          setBubbleFade(true)
          ctx.timeout(() => {
            if (!mountedRef.current || bubbleRef.current !== text) return
            bubbleRef.current = null
            setBubble(null)
          }, 280)
        }, ms || 6000)
      }

      // crouch + settle helpers: real-cat weight
      function crouch() { return { set: { y: 2, s: 0.97, sx: 1 }, wait: 220 } }
      function settle() {
        return [
          { set: { y: -3, s: 1.02 }, wait: 160 },
          { set: { y: 0, s: 1 } },
        ]
      }
      function wiggle() {
        return [
          { set: { x: -5 }, wait: 150 },
          { set: { x: 5 }, wait: 150 },
          { set: { x: -3 }, wait: 120 },
          { set: { x: 0 }, wait: 120 },
        ]
      }

      // ---------- behaviors ----------
      function startPeek() {
        setMode('peek')
        showBubble('喵？看见我了吗？', 6500)
        runSeq([
          { set: { closed: false, happy: false, walking: false, z: 6, ry: 0, rz: 0, sx: 1, s: 1 }, wait: 200 },
          crouch(),
          ...wiggle(),
          { set: { walking: true, x: -96, z: 2, y: 0, s: 1 }, wait: 1150 },
          { set: { walking: false, ry: -10 }, wait: 300 },
          ...settle(),
          { set: { y: -26 }, wait: 850 },
          { set: { y: 0 }, wait: 650 },
          { set: { y: -26, ry: 8 }, wait: 850 },
          { set: { y: 0, ry: 0 }, wait: 650 },
          crouch(),
          { set: { walking: true, x: 0, z: 6 }, wait: 1150 },
          { set: { walking: false } },
          ...settle(),
        ], () => setMode('idle'))
      }
      function startButterfly() {
        setMode('butterfly')
        showBubble('蝴蝶别跑！看我的～扑！', 6200)
        runSeq([
          { set: { closed: false, happy: false, walking: false, x: 0, z: 6, ry: 6, y: 0, rz: 0, sx: 1, s: 1 }, wait: 1100 },
          { set: { ry: -6 }, wait: 1100 },
          { set: { ry: 6 }, wait: 1100 },
          { set: { ry: -4 }, wait: 1100 },
          { set: { ry: 0 }, wait: 800 },
        ], () => setMode('idle'))
      }
      function startNap() {
        setMode('nap')
        showBubble('呼噜……', 6600)
        runSeq([
          { set: { happy: false, walking: false, x: -14, z: 6, rz: -5, ry: 4, sx: 1, s: 0.97, y: 0, closed: true }, wait: 3200 },
          { set: { s: 0.98 }, wait: 2000 },
          { set: { s: 0.97 }, wait: 1500 },
          { set: { x: 0, rz: 0, ry: 0, s: 1, closed: false } },
        ], () => setMode('idle'))
      }
      function startGroom() {
        setMode('groom')
        showBubble('舔舔爪子…洗脸脸～', 6000)
        runSeq([
          { set: { closed: false, walking: false, x: 0, z: 6, ry: 0, rz: 0, sx: 1, s: 1, y: 0, happy: true }, wait: 300 },
          { set: { ry: 10, rz: 4, y: -3 }, wait: 700 },
          { set: { ry: 4 }, wait: 350 },
          { set: { ry: 10 }, wait: 350 },
          { set: { ry: 4 }, wait: 350 },
          { set: { ry: 0, rz: 0, y: 0 }, wait: 300 },
          { set: { ry: -10, rz: -4, y: -3 }, wait: 700 },
          { set: { ry: 0, rz: 0, y: 0, happy: false } },
        ], () => setMode('idle'))
      }
      function startYawn() {
        setMode('yawn')
        showBubble('哈啊……', 5000)
        runSeq([
          { set: { closed: false, walking: false, x: 0, z: 6, ry: 0, rz: 0, sx: 1, s: 1, y: 0, happy: true }, wait: 250 },
          { set: { ry: -12, rz: -3, y: -4 }, wait: 420 },
          { set: { ry: -18, rz: 0, y: -5 }, wait: 420 },
          { set: { ry: -12 }, wait: 520 },
          { set: { ry: -18 }, wait: 420 },
          { set: { ry: 0, rz: 0, y: 0, happy: false } },
        ], () => setMode('idle'))
      }
      function startStretch() {
        setMode('stretch')
        showBubble('伸个懒腰～起来走两步吧！', 6000)
        runSeq([
          { set: { closed: false, walking: false, x: 0, z: 6, ry: 0, rz: 0, sx: 1, s: 1, y: 0, happy: true }, wait: 250 },
          { set: { sx: 1.14, s: 0.9, y: -2, ry: 6 }, wait: 1100 },
          { set: { sx: 1.1, s: 0.94, y: -1 }, wait: 700 },
          { set: { sx: 1.14, s: 0.9, y: -2 }, wait: 800 },
          { set: { sx: 1, s: 1.04, y: -8 }, wait: 500 },
          { set: { sx: 1, s: 1, y: 0, happy: false } },
        ], () => setMode('idle'))
      }
      function startEyes() {
        setMode('eyes')
        showBubble('看看远方，让眼睛休息一下下吧～', 6000)
        runSeq([
          { set: { closed: false, walking: false, x: 0, z: 6, rz: 0, sx: 1, s: 1, happy: true, ry: 10, y: 0 }, wait: 1300 },
          { set: { ry: -8 }, wait: 1300 },
          { set: { ry: 8 }, wait: 1200 },
          { set: { ry: 0, happy: false } },
        ], () => setMode('idle'))
      }
      function startRelax() {
        setMode('relax')
        showBubble('…主人，我好喜欢你～', 4500)
        runSeq([
          { set: { closed: false, walking: false, x: 0, z: 6, ry: 6, rz: -4, sx: 1, s: 1, y: 0, happy: true }, wait: 900 },
          { set: { happy: false, closed: true }, wait: 380 },
          { set: { closed: false, happy: true }, wait: 720 },
          { set: { ry: 3, rz: -2 }, wait: 700 },
          { set: { ry: 0, rz: 0, happy: false } },
        ], () => setMode('idle'))
      }
      function startCurious() {
        setMode('curious')
        showBubble('？那是什么呀…', 4200)
        runSeq([
          { set: { closed: false, walking: false, x: 0, z: 6, ry: 6, rz: 12, sx: 1, s: 1, y: -3, happy: true }, wait: 900 },
          { set: { ry: -6, rz: -10 }, wait: 900 },
          { set: { ry: 0, rz: 0, y: 0, happy: false } },
        ], () => setMode('idle'))
      }
      function startWater() {
        setMode('drink')
        showBubble('咕咚咕咚…好好喝呀！', 3400)
        runSeq([
          { set: { closed: false, happy: false, walking: false, z: 6, ry: 0, rz: 0, sx: 1, s: 1, y: 0 }, wait: 200 },
          crouch(),
          ...wiggle(),
          { set: { walking: true, x: -34, y: 0, s: 1 }, wait: 1150 },
          { set: { walking: false, happy: true, rz: 16 }, wait: 800 },
          { set: { rz: 0 }, wait: 470 },
          { set: { rz: 16 }, wait: 800 },
          { set: { rz: 0, happy: false } },
          crouch(),
          { set: { walking: true, x: 0 }, wait: 1150 },
          { set: { walking: false } },
          ...settle(),
        ], () => {
          setMode('idle')
          bigRef.current = true
          setBigPhase('in')
          ctx.timeout(() => {
            if (!mountedRef.current) return
            setBigPhase('out')
            ctx.timeout(() => {
              if (!mountedRef.current) return
              bigRef.current = false
              setBigPhase(null)
              setState({ busy: false })
            }, 500)
          }, 10500)
        })
      }

      function finishBusy(ms) {
        ctx.timeout(() => { if (mountedRef.current) setState({ busy: false }) }, ms)
      }
      function fireReminder() {
        const s = getState()
        const kind = s.nextKind % 3
        setState({ nextKind: s.nextKind + 1, busy: true })
        cancelSeq()
        if (kind === 0) startWater()
        else if (kind === 1) { startStretch(); finishBusy(7200) }
        else { startEyes(); finishBusy(7200) }
      }

      // reminder scheduler
      React.useEffect(() => {
        let nextAt = Date.now() + getState().intervalMin * 60000
        let prevKey = getState().intervalMin + ':' + getState().remindersOn
        const unsub = subscribe(() => {
          const key = getState().intervalMin + ':' + getState().remindersOn
          if (key !== prevKey) {
            prevKey = key
            nextAt = Date.now() + getState().intervalMin * 60000
          }
        })
        const dispose = ctx.interval(() => {
          const s = getState()
          if (!s.remindersOn || !s.visible) return
          const now = Date.now()
          if (now >= nextAt) {
            fireReminder()
            nextAt = now + s.intervalMin * 60000
          }
        }, 1000)
        return () => { unsub(); dispose() }
      }, [])

      // idle behavior loop: every ~20s of idling, one random behavior
      React.useEffect(() => {
        let alive = true
        let outer = null
        const loop = () => {
          outer = ctx.timeout(() => {
            if (!alive) return
            const s = getState()
            if (s.visible && !s.busy && !bigRef.current) {
              const names = ['peek', 'butterfly', 'nap', 'groom', 'yawn', 'curious', 'relax']
              const name = names[Math.floor(Math.random() * names.length)]
              if (name === 'peek') startPeek()
              else if (name === 'butterfly') startButterfly()
              else if (name === 'nap') startNap()
              else if (name === 'groom') startGroom()
              else if (name === 'yawn') startYawn()
              else if (name === 'curious') startCurious()
              else startRelax()
              ctx.timeout(() => { if (alive) loop() }, 1000)
            } else loop()
          }, 20000)
        }
        loop()
        return () => { alive = false; if (outer) outer() }
      }, [])

      if (!visible) {
        return h('div', {
          className: 'dspet-summon',
          onClick: () => setState({ visible: true }),
        }, '🐾 小猫咪回来')
      }

      const headRy = pose.ry + look.x * 26
      const headRz = pose.rz * 0.5 + look.y * 4
      const catStyle = {
        transform: 'translateX(' + pose.x + 'px) translateY(' + pose.y + 'px) rotateY(' + pose.ry * 0.5 + 'deg) rotate(' + pose.rz + 'deg) scale(' + pose.sx + ',' + pose.s + ')',
        zIndex: pose.z,
      }
      const headStyle = {
        transform: 'rotateY(' + headRy + 'deg) rotateZ(' + headRz + 'deg)',
      }
      const eyeLook = {
        transform: 'translate(' + (look.x * 3).toFixed(1) + 'px,' + (look.y * 2).toFixed(1) + 'px)',
      }
      const shadowStyle = {
        left: (118 + pose.x) + 'px',
        transform: 'scale(' + Math.max(0.55, 1 + pose.y / 240) + ')',
        opacity: Math.max(0.22, 1 + pose.y / 90),
      }
      const bubbleCls = 'dsp-bubble' + (bubbleFade ? ' dsp-bubble--fade' : '')
      const walkCls = 'dsp-cat-walk' + (pose.walking ? ' dsp-cat-walk--on' : '')
      const bfCls = 'dsp-butterflies' + (mode === 'butterfly' ? ' dsp-butterflies--on' : '')
      const napCls = 'dsp-napfx' + (mode === 'nap' ? ' dsp-napfx--on' : '')
      const catCls = 'dsp-cat' + (mode === 'yawn' ? ' dsp-cat--yawn' : '')
      const eyeCls = 'dsp-cat-eye' +
        (pose.happy ? ' dsp-cat-eye--happy' : '') +
        (pose.closed ? ' dsp-cat-eye--closed' : '')

      function onPointerDown(e) {
        if (e.button !== 0) return
        e.preventDefault()
        const el = petRef.current
        if (!el) return
        try { el.setPointerCapture(e.pointerId) } catch (err) { /* noop */ }
        const rect = el.getBoundingClientRect()
        dragRef.current = {
          pointerId: e.pointerId,
          startX: e.clientX,
          startY: e.clientY,
          baseLeft: rect.left,
          baseTop: rect.top,
        }
        movedRef.current = false
      }
      function onPointerMove(e) {
        const d = dragRef.current
        if (!d || d.pointerId !== e.pointerId) return
        const dx = e.clientX - d.startX
        const dy = e.clientY - d.startY
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) movedRef.current = true
        const vw = window.innerWidth
        const vh = window.innerHeight
        const x = Math.min(Math.max(8, d.baseLeft + dx), vw - 256)
        const y = Math.min(Math.max(8, d.baseTop + dy), vh - 220)
        setState({ pos: { x, y } })
      }
      function onPointerUp(e) {
        const d = dragRef.current
        if (!d || d.pointerId !== e.pointerId) return
        dragRef.current = null
        try { e.currentTarget.releasePointerCapture(e.pointerId) } catch (err) { /* noop */ }
      }
      function onClick(e) {
        if (movedRef.current) return
        cancelSeq()
        setMode('idle')
        setHearts((n) => n + 1)
        showBubble(pick(CLICK_LINES), 6000)
        runSeq([
          { set: { closed: false, walking: false, x: 0, z: 6, sx: 1, happy: true, ry: -8, rz: 0, s: 1.04, y: -6 }, wait: 620 },
          { set: { ry: 8, y: 0 }, wait: 520 },
          { set: { ry: 0, s: 1 } },
        ])
      }
      function stopDown(e) { e.stopPropagation() }

      return h('div', {
        className: 'dspet',
        style: pos ? { left: pos.x + 'px', top: pos.y + 'px', right: 'auto', bottom: 'auto' } : null,
        ref: petRef,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel: onPointerUp,
        onClick,
      },
        !bigPhase && bubble ? h('div', { key: bubble, className: bubbleCls }, bubble) : null,
        hearts > 0
          ? h('div', { key: hearts, className: 'dsp-hearts' },
              h('span', null, '💖'), h('span', null, '✨'), h('span', null, '💕'))
          : null,
        h('div', { className: 'dsp-close', onPointerDown: stopDown, onClick: (e) => { e.stopPropagation(); setState({ visible: false }) } }, '×'),
        h('div', { className: 'dsp-scene' },
          h('div', { className: 'dsp-shadow', style: shadowStyle }),
          h('div', { className: 'dsp-vase' },
            h('div', { className: 'dsp-flower dsp-flower--f1' },
              h('div', { className: 'dsp-flower-stem' }),
              h('div', { className: 'dsp-flower-head' }),
            ),
            h('div', { className: 'dsp-flower dsp-flower--f2' },
              h('div', { className: 'dsp-flower-stem' }),
              h('div', { className: 'dsp-flower-head' }),
            ),
            h('div', { className: 'dsp-flower dsp-flower--f3' },
              h('div', { className: 'dsp-flower-stem' }),
              h('div', { className: 'dsp-flower-head' }),
            ),
            h('div', { className: 'dsp-vase-body' }),
            h('div', { className: 'dsp-vase-face' },
              h('div', { className: 'dsp-vase-eye dsp-vase-eye--l' }),
              h('div', { className: 'dsp-vase-eye dsp-vase-eye--r' }),
              h('div', { className: 'dsp-vase-mouth' }),
            ),
          ),
          h('div', { className: 'dsp-bowl' }),
          h('div', { className: bfCls },
            h('div', { className: 'dsp-bfly dsp-bfly--1' }, h('span', { className: 'dsp-bfly-wing' }, '🦋')),
            h('div', { className: 'dsp-bfly dsp-bfly--2' }, h('span', { className: 'dsp-bfly-wing' }, '🦋')),
            h('div', { className: 'dsp-bfly dsp-bfly--3' }, h('span', { className: 'dsp-bfly-wing' }, '🦋')),
          ),
          h('div', { className: napCls },
            h('div', { className: 'dsp-zzz' }, h('span', null, 'z'), h('span', null, 'z'), h('span', null, 'z')),
            h('div', { className: 'dsp-snot' }),
            h('div', { className: 'dsp-dream' }, '🍗 梦见大餐…'),
          ),
          h('div', { className: 'dsp-cat-z', style: catStyle },
            h('div', { className: walkCls },
              h('div', { className: catCls },
                h('div', { className: 'dsp-cat-tail' }),
                h('div', { className: 'dsp-h3d', style: headStyle },
                  h('div', { className: 'dsp-h3d-b' }),
                  h('div', { className: 'dsp-cat-ear dsp-cat-ear--l' }),
                  h('div', { className: 'dsp-cat-ear dsp-cat-ear--r' }),
                  h('div', { className: 'dsp-h3d-f' },
                    h('div', { className: 'dsp-cat-face' },
                      h('div', { className: 'dsp-eye-pos dsp-eye-pos--l', style: eyeLook },
                        h('div', { className: eyeCls }),
                      ),
                      h('div', { className: 'dsp-eye-pos dsp-eye-pos--r', style: eyeLook },
                        h('div', { className: eyeCls }),
                      ),
                      h('div', { className: 'dsp-cat-nose' }),
                      h('div', { className: 'dsp-cat-blush dsp-cat-blush--l' }),
                      h('div', { className: 'dsp-cat-blush dsp-cat-blush--r' }),
                      h('div', { className: 'dsp-cat-yawn' }),
                      h('div', { className: 'dsp-cat-mouth' }),
                      h('div', { className: 'dsp-whisker dsp-whisker--l1' }),
                      h('div', { className: 'dsp-whisker dsp-whisker--l2' }),
                      h('div', { className: 'dsp-whisker dsp-whisker--r1' }),
                      h('div', { className: 'dsp-whisker dsp-whisker--r2' }),
                    ),
                  ),
                ),
                h('div', { className: 'dsp-cat-body' }),
                h('div', { className: 'dsp-cat-scarf' }),
                h('div', { className: 'dsp-cat-paw dsp-cat-paw--l' + (mode === 'stretch' || mode === 'groom' ? ' dsp-cat-paw--up' : '') }),
                h('div', { className: 'dsp-cat-paw dsp-cat-paw--r' + (mode === 'butterfly' ? ' dsp-cat-paw--swat' : '') }),
              ),
            ),
          ),
        ),
        bigPhase
          ? h('div', { className: 'dsp-big' + (bigPhase === 'out' ? ' dsp-big--out' : '') },
              h('div', { className: 'dsp-big-shake' },
                h('div', { className: 'dsp-big-cat' },
                  h('div', { className: 'dsp-big-ear dsp-big-ear--l' }),
                  h('div', { className: 'dsp-big-ear dsp-big-ear--r' }),
                  h('div', { className: 'dsp-big-head' },
                    h('div', { className: 'dsp-big-face' },
                      h('div', { className: 'dsp-big-eye dsp-big-eye--l' }),
                      h('div', { className: 'dsp-big-eye dsp-big-eye--r' }),
                      h('div', { className: 'dsp-big-blush dsp-big-blush--l' }),
                      h('div', { className: 'dsp-big-blush dsp-big-blush--r' }),
                      h('div', { className: 'dsp-big-mouth' }),
                    ),
                  ),
                  h('div', { className: 'dsp-big-paw' }),
                ),
                h('div', { className: 'dsp-big-ripple dsp-big-ripple--1' }),
                h('div', { className: 'dsp-big-ripple dsp-big-ripple--2' }),
              ),
              h('div', { className: 'dsp-big-text' }, '咚咚咚！该喝水啦！'),
              h('div', { className: 'dsp-big-sub' }, '快喝一口水吧～'),
            )
          : null,
      )
    }

    function PetSettings() {
      const remindersOn = useStore((s) => s.remindersOn)
      const intervalMin = useStore((s) => s.intervalMin)
      const visible = useStore((s) => s.visible)
      return h('div', { className: 'dsp-settings' },
        h('p', { className: 'dsp-settings-desc' }, '真猫习性的 3D 猫咪：会跟着你的鼠标转头、不对称眨眼、舔毛、打哈欠、歪头好奇，到点变身巨猫敲屏提醒你喝水～（纯文字卖萌✨）'),
        h('div', { className: 'dsp-settings-row' },
          h('span', { className: 'dsp-settings-label' }, '喝水 / 活动提醒'),
          h(Switch, { on: remindersOn, onChange: (v) => setState({ remindersOn: v }) }),
        ),
        h('div', { className: 'dsp-settings-row' },
          h('span', { className: 'dsp-settings-label' }, '提醒间隔'),
          h('select', {
            className: 'dsp-select',
            value: String(intervalMin),
            onChange: (e) => setState({ intervalMin: Number(e.target.value) }),
          },
            [30, 45, 60, 90].map((m) => h('option', { key: m, value: String(m) }, m + ' 分钟')),
          ),
        ),
        h('div', { className: 'dsp-settings-row dsp-settings-row--actions' },
          h('button', { className: 'dsp-btn', onClick: () => setState({ pos: null }) }, '↩ 重置位置'),
          h('button', { className: 'dsp-btn', onClick: () => setState({ visible: !visible }) }, visible ? '🙈 藏起来' : '🐾 召唤出来'),
        ),
      )
    }

    // ---------- register UI ----------
    slots.inject('shell.overlay', () => slots.register(
      { name: 'shell.overlay', id: 'cute-desk-pet-overlay' },
      () => React.createElement(PetOverlay),
    ))
    slots.inject('settings.section', () => slots.register(
      { name: 'settings.section', id: 'cute-desk-pet-settings', label: '桌面宠物' },
      () => React.createElement(PetSettings),
    ))
  },
}
