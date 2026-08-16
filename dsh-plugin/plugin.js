/**
 * Kun Like 桌宠 · DeepSeek Harness (DSH) 动态插件源码
 * ----------------------------------------------------------
 * 这是本仓库桌宠的 DSH 动态 Cordis 插件版本（Client half，Canvas 3D 版）。
 * 与根目录 index.html 的独立网页版功能一致：
 * Canvas 2D 自绘 3D 软渲染猫 —— 真实渐变光影、3D 头部转向（特征随转角
 * 收缩错位）、弹性呼吸/走路/尾巴、鼠标追踪、不对称眨眼、舔毛/打哈欠/
 * 歪头好奇/打盹做梦、喝水后变身巨猫敲屏提醒。纯文字卖萌，零依赖。
 *
 * 使用方式见同目录 README.md。
 * 该文件内容就是 cordis_define 的 code.client 函数体（纯 JavaScript，
 * 无 JSX / TypeScript，无需打包）。
 */
return {
  name: 'cute-desk-pet-v5',
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

/* ================= scene ================= */
.dsp-scene {
  position: absolute; left: 0; bottom: 0; width: 240px; height: 200px;
  overflow: hidden;
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

/* ================= butterflies（从外飞入：绕花 / 绕猫逗玩） ================= */
.dsp-butterflies {
  position: absolute; inset: 0; z-index: 15; pointer-events: none;
  opacity: 0; transition: opacity 0.6s ease;
}
.dsp-butterflies--on { opacity: 1; }
.dsp-bfly { position: absolute; font-size: 20px; }
/* 1：从左侧飞入 → 绕花一圈 → 右侧飞出 */
.dsp-bfly--1 { left: -60px; top: 90px; animation: dsp-fly1 12s ease-in-out infinite; }
/* 2：从右侧飞入 → 绕小猫转圈逗猫 → 左侧飞出 */
.dsp-bfly--2 { left: 250px; top: 30px; animation: dsp-fly2 14s ease-in-out infinite; }
/* 3：从左下飞入 → 绕花半圈 + 绕猫半圈 → 左下飞出 */
.dsp-bfly--3 { left: -60px; top: 150px; animation: dsp-fly3 13s ease-in-out infinite; }
.dsp-bfly-wing {
  display: inline-block;
  animation: dsp-flap3d 0.32s ease-in-out infinite;
}
.dsp-bfly--2 .dsp-bfly-wing { animation-duration: 0.26s; }
.dsp-bfly--3 .dsp-bfly-wing { animation-duration: 0.38s; }
@keyframes dsp-flap3d {
  0%, 100% { transform: perspective(400px) rotateY(0deg); }
  50% { transform: perspective(400px) rotateY(78deg); }
}
/* 绕花：飞入 → 绕花丛一圈（带 banking 倾斜 + 远近缩放）→ 右侧飞出 */
@keyframes dsp-fly1 {
  0%, 100% { transform: translate3d(0, 0, 0) rotateZ(0deg) scale(1); }
  7% { transform: translate3d(95px, 5px, 10px) rotateZ(8deg) scale(1); }
  12% { transform: translate3d(115px, 15px, 16px) rotateZ(-6deg) scale(1.08); }
  20% { transform: translate3d(152px, 28px, 20px) rotateZ(-14deg) scale(1.1); }
  28% { transform: translate3d(162px, -10px, 12px) rotateZ(10deg) scale(1.02); }
  36% { transform: translate3d(132px, -36px, 0px) rotateZ(16deg) scale(0.96); }
  44% { transform: translate3d(95px, -26px, -8px) rotateZ(-10deg) scale(0.92); }
  52% { transform: translate3d(84px, 10px, -4px) rotateZ(-16deg) scale(0.96); }
  60% { transform: translate3d(115px, 15px, 10px) rotateZ(6deg) scale(1.05); }
  68% { transform: translate3d(172px, -5px, 18px) rotateZ(14deg) scale(1.08); }
  78% { transform: translate3d(300px, -20px, 24px) rotateZ(10deg) scale(1.12); }
  90%, 100% { transform: translate3d(340px, -15px, 24px) rotateZ(0deg) scale(1.1); }
}
/* 绕猫：右侧飞入 → 绕小猫头部转圈逗它 → 左侧飞出 */
@keyframes dsp-fly2 {
  0%, 100% { transform: translate3d(0, 0, 0) rotateZ(0deg) scale(1); }
  6% { transform: translate3d(-70px, 35px, 12px) rotateZ(-10deg) scale(1.05); }
  12% { transform: translate3d(-60px, 60px, 18px) rotateZ(6deg) scale(1.1); }
  20% { transform: translate3d(-95px, 76px, 16px) rotateZ(14deg) scale(1.08); }
  28% { transform: translate3d(-130px, 60px, 8px) rotateZ(12deg) scale(1); }
  36% { transform: translate3d(-136px, 30px, -6px) rotateZ(-10deg) scale(0.94); }
  44% { transform: translate3d(-100px, 14px, -10px) rotateZ(-16deg) scale(0.9); }
  52% { transform: translate3d(-70px, 30px, 0px) rotateZ(8deg) scale(0.98); }
  60% { transform: translate3d(-85px, 52px, 14px) rotateZ(-8deg) scale(1.08); }
  68% { transform: translate3d(-115px, 20px, 20px) rotateZ(12deg) scale(1.12); }
  78% { transform: translate3d(-200px, -10px, 24px) rotateZ(10deg) scale(1.14); }
  90%, 100% { transform: translate3d(-240px, 5px, 24px) rotateZ(0deg) scale(1.1); }
}
/* 串场：左下飞入 → 绕花半圈 → 绕猫半圈 → 左下飞出 */
@keyframes dsp-fly3 {
  0%, 100% { transform: translate3d(0, 0, 0) rotateZ(0deg) scale(1); }
  8% { transform: translate3d(90px, -60px, 10px) rotateZ(10deg) scale(1.04); }
  16% { transform: translate3d(140px, -75px, 14px) rotateZ(-12deg) scale(1.08); }
  24% { transform: translate3d(150px, -105px, 10px) rotateZ(8deg) scale(1.02); }
  32% { transform: translate3d(120px, -122px, 0px) rotateZ(16deg) scale(0.96); }
  40% { transform: translate3d(85px, -102px, -8px) rotateZ(-12deg) scale(0.92); }
  48% { transform: translate3d(120px, -96px, 6px) rotateZ(-16deg) scale(0.98); }
  56% { transform: translate3d(186px, -80px, 16px) rotateZ(10deg) scale(1.06); }
  64% { transform: translate3d(226px, -96px, 20px) rotateZ(-8deg) scale(1.1); }
  72% { transform: translate3d(216px, -56px, 16px) rotateZ(14deg) scale(1.06); }
  80% { transform: translate3d(180px, -46px, 8px) rotateZ(10deg) scale(1); }
  88% { transform: translate3d(120px, -36px, -6px) rotateZ(-10deg) scale(0.94); }
  94% { transform: translate3d(20px, -10px, -12px) rotateZ(-16deg) scale(0.9); }
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

/* ================= canvas cat ================= */
.dsp-canvas {
  position: absolute; left: 0; bottom: 0; width: 240px; height: 200px;
  z-index: 3; pointer-events: none;
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

/* ================= BIG cat knock ================= */
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
}
@keyframes dsp-bigbob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
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

    // ============================================================
    // Canvas 3D 软渲染器：真实光影 + 3D 头部转向 + 弹性动作
    // ============================================================
    function createCatRenderer(canvas) {
      const W = 240, H = 200
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = W * dpr
      canvas.height = H * dpr
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)

      const S = {
        x: 0, y: 0, rz: 0, ry: 0, sx: 1, s: 1,
        walking: false, closed: false, happy: false,
        look: { x: 0, y: 0 },
        mode: 'idle',
        t: 0,
      }
      const blink = { l: 0, r: 0 }
      let blinkLAt = 1600, blinkRAt = 3400
      const ear = { l: 0, r: 0 }
      let earLAt = 4200, earRAt = 6100
      let last = Date.now()

      function ell(x, y, rx, ry, c1, c2, alpha) {
        const g = ctx.createRadialGradient(x - rx * 0.35, y - ry * 0.45, rx * 0.12, x, y, Math.max(rx, ry))
        g.addColorStop(0, c1)
        g.addColorStop(1, c2)
        if (alpha !== undefined) ctx.globalAlpha = alpha
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
      function tri(x1, y1, x2, y2, x3, y3, c1, c2) {
        const cx = (x1 + x2 + x3) / 3, cy = (y1 + y2 + y3) / 3
        const g = ctx.createRadialGradient(cx - 2, cy - 3, 2, cx, cy, Math.max(14, Math.abs(x2 - x1)))
        g.addColorStop(0, c1)
        g.addColorStop(1, c2)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.lineTo(x3, y3)
        ctx.closePath()
        ctx.fill()
      }

      function draw() {
        const now = Date.now()
        const dt = Math.min(80, now - last)
        last = now
        S.t += dt * 0.001
        if (now > blinkLAt) { blink.l = 1; blinkLAt = now + 1800 + Math.random() * 4200 }
        if (now > blinkRAt) { blink.r = 1; blinkRAt = now + 2400 + Math.random() * 4800 }
        blink.l = Math.max(0, blink.l - dt / 130)
        blink.r = Math.max(0, blink.r - dt / 150)
        if (now > earLAt) { ear.l = 1; earLAt = now + 3000 + Math.random() * 5000 }
        if (now > earRAt) { ear.r = 1; earRAt = now + 3500 + Math.random() * 5500 }
        ear.l = Math.max(0, ear.l - dt / 240)
        ear.r = Math.max(0, ear.r - dt / 260)

        ctx.clearRect(0, 0, W, H)
        const walk = S.walking ? Math.sin(S.t * 12) : 0
        const breathe = S.walking ? 0 : Math.sin(S.t * 2.1) * 1.6
        const bob = S.walking ? Math.abs(Math.sin(S.t * 12)) * -4 : 0

        const shScale = Math.max(0.55, 1 + S.y / 240)
        ell(170 + S.x, 166, 40 * shScale, 9 * shScale, 'rgba(120,80,40,0.30)', 'rgba(120,80,40,0)', 0.9)

        const ox = 170 + S.x
        const oy = 166 - S.y
        const rz = (S.rz * Math.PI) / 180
        const cosR = Math.cos(rz), sinR = Math.sin(rz)
        function P(lx, ly, lz) {
          const rx0 = lx * cosR - ly * sinR
          const ry0 = lx * sinR + ly * cosR
          const sc = 1 + lz * 0.0011
          return { x: ox + rx0 * sc, y: oy - ry0 * sc, z: lz }
        }

        const parts = []
        function push(z, fn) { parts.push({ z, fn }) }

        const headYaw = ((S.ry + S.look.x * 30) * Math.PI) / 180
        const headPitch = (S.look.y * 12 * Math.PI) / 180
        const cy_ = Math.cos(headYaw), sy_ = Math.sin(headYaw)
        function faceX(lx, lz) { return lx * cy_ - lz * sy_ }

        const tw = Math.sin(S.t * 1.8) * 0.55 + Math.sin(S.t * 0.9) * 0.25
        let tx = -30, ty = 22
        for (let i = 0; i < 5; i++) {
          const a = tw + i * 0.16
          tx += Math.cos(a) * 8
          ty += Math.sin(a) * 5 + i * 0.6
          const p = P(tx, ty + 2, 4 - i)
          const r = 5.5 - i * 0.6
          push(2 - i, () => ell(p.x, p.y, r, r * 1.35, '#ffe9cc', '#f2c890'))
        }

        const bodyY = 30 + breathe * 0.6 + bob
        const bx = S.sx, by = S.s * (S.closed ? 0.97 : 1)
        push(10, () => ell(P(0, bodyY, 8).x, P(0, bodyY, 8).y, 34 * bx, 30 * by, '#fff3dd', '#f5cf9e'))
        push(10.5, () => ell(P(0, bodyY - 6, 14).x, P(0, bodyY - 6, 14).y, 18 * bx, 15 * by, 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0)'))
        push(11, () => ell(P(0, bodyY + 22, 14).x, P(0, bodyY + 22, 14).y, 26 * bx, 8, '#ff9dbe', '#ff6f9c'))
        push(11.5, () => ell(P(0, bodyY + 22, 16).x, P(0, bodyY + 22, 16).y, 8, 6, '#ffc3d6', '#ff9dbe'))

        const pawUpL = S.mode === 'stretch' || S.mode === 'groom'
        const swatR = S.mode === 'butterfly'
        const plx = -15, prx = 15
        const plY = 6 + (pawUpL ? Math.abs(Math.sin(S.t * 5)) * -16 : Math.max(0, Math.sin(S.t * 12 + 0.8)) * -2.4) + (S.mode === 'groom' ? -4 : 0)
        const prY = 6 + (swatR ? -Math.abs(Math.sin(S.t * 9)) * 14 : Math.max(0, Math.sin(S.t * 12)) * -2.4)
        push(9, () => ell(P(plx, plY, 12).x, P(plx, plY, 12).y, 12, 8, '#ffe9cc', '#f2c890'))
        push(9, () => ell(P(prx, prY, 12).x, P(prx, prY, 12).y, 12, 8, '#ffe9cc', '#f2c890'))
        push(9.1, () => ell(P(plx, plY + 4, 13).x, P(plx, plY + 4, 13).y, 5, 3.4, 'rgba(255,150,160,0.85)', 'rgba(255,120,140,0.85)'))
        push(9.1, () => ell(P(prx, prY + 4, 13).x, P(prx, prY + 4, 13).y, 5, 3.4, 'rgba(255,150,160,0.85)', 'rgba(255,120,140,0.85)'))

        const headY = 72 + breathe + bob * 0.6 + (S.mode === 'yawn' ? -3 : 0)
        const hp = P(0, headY, 0)
        const hr = 30
        push(20, () => ell(hp.x, hp.y, hr, hr * 0.92, '#fff6e4', '#f7d5a5'))
        push(20.4, () => ell(hp.x - hr * 0.28, hp.y - hr * 0.34, hr * 0.5, hr * 0.34, 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0)'))

        const eL = faceX(-21, 4), eR = faceX(21, 4)
        const elx = hp.x + eL, ely = hp.y - 34 - Math.sin(headPitch) * 18 + ear.l * -4
        const erx = hp.x + eR, ery = hp.y - 34 - Math.sin(headPitch) * 18 + ear.r * -4
        const ew = 13 * (0.6 + 0.4 * Math.cos(headYaw))
        push(19, () => tri(elx - ew, ely + 16, elx + ew, ely + 16, elx, ely, '#ffe4bd', '#f0c48e'))
        push(19, () => tri(erx - ew, ery + 16, erx + ew, ery + 16, erx, ery, '#ffe4bd', '#f0c48e'))
        push(18.6, () => tri(elx - ew * 0.5, ely + 15, elx + ew * 0.5, ely + 15, elx, ely + 6, '#ffb8cc', '#ff9db4'))
        push(18.6, () => tri(erx - ew * 0.5, ery + 15, erx + ew * 0.5, ery + 15, erx, ery + 6, '#ffb8cc', '#ff9db4'))

        push(21, () => {
          const pitch = Math.sin(headPitch)
          const eyeY0 = hp.y - 6 - pitch * 8
          const eyeOpenL = S.happy || S.closed ? 1 : 1 - blink.l * 0.92
          const eyeOpenR = S.happy || S.closed ? 1 : 1 - blink.r * 0.92
          const exL = faceX(-13, 10), exR = faceX(13, 10)
          const exl = hp.x + exL + S.look.x * 2, exr = hp.x + exR + S.look.x * 2
          const ewl = 5.6 * (0.5 + 0.5 * Math.cos(headYaw)), ewr = ewl
          const ehl = 7.5 * eyeOpenL, ehr = 7.5 * eyeOpenR
          if (S.happy || S.closed) {
            const arc = S.closed ? -1 : 1
            ctx.strokeStyle = '#5b4636'
            ctx.lineWidth = 2.2
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.arc(exl, eyeY0, 5, Math.PI * (arc > 0 ? 0 : 0.15), Math.PI * (arc > 0 ? 1 : 0.85), arc < 0)
            ctx.stroke()
            ctx.beginPath()
            ctx.arc(exr, eyeY0, 5, Math.PI * (arc > 0 ? 0 : 0.15), Math.PI * (arc > 0 ? 1 : 0.85), arc < 0)
            ctx.stroke()
          } else {
            ell(exl, eyeY0, ewl, ehl, '#5b4636', '#4a3828')
            ell(exr, eyeY0, ewl, ehr, '#5b4636', '#4a3828')
            ell(exl - ewl * 0.25, eyeY0 - ehl * 0.3, ewl * 0.4, ehl * 0.32, 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0)')
            ell(exr - ewl * 0.25, eyeY0 - ehl * 0.3, ewl * 0.4, ehl * 0.32, 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0)')
          }
          const bxl = faceX(-20, 6), bxr = faceX(20, 6)
          ell(hp.x + bxl, hp.y + 4, 6.5, 3.6, 'rgba(255,138,158,0.8)', 'rgba(255,120,145,0.5)', 0.9)
          ell(hp.x + bxr, hp.y + 4, 6.5, 3.6, 'rgba(255,138,158,0.8)', 'rgba(255,120,145,0.5)', 0.9)
          const nx = hp.x + faceX(0, 14)
          ell(nx, hp.y + 10 - pitch * 4, 3.4, 2.6, '#ff9db4', '#ff7f9e')
          const mx = hp.x + faceX(0, 14)
          const my = hp.y + 15 - pitch * 5
          if (S.mode === 'yawn') {
            ell(mx, my + 2, 8, 7, '#7a4a35', '#5f3525')
            ell(mx, my + 4, 5, 3.4, '#ff9db4', '#ff7f9e')
          } else {
            ctx.strokeStyle = '#5b4636'
            ctx.lineWidth = 1.8
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.arc(mx, my, 4, 0, Math.PI)
            ctx.stroke()
          }
          ctx.strokeStyle = 'rgba(91,70,54,0.5)'
          ctx.lineWidth = 1
          const wx = hp.x + faceX(-22, 4), wy = hp.y + 2
          ctx.beginPath(); ctx.moveTo(wx, wy - 5); ctx.quadraticCurveTo(wx - 14, wy - 6, wx - 18, wy - 9); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(wx, wy + 2); ctx.quadraticCurveTo(wx - 14, wy + 4, wx - 18, wy + 4); ctx.stroke()
          const wx2 = hp.x + faceX(22, 4)
          ctx.beginPath(); ctx.moveTo(wx2, wy - 5); ctx.quadraticCurveTo(wx2 + 14, wy - 6, wx2 + 18, wy - 9); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(wx2, wy + 2); ctx.quadraticCurveTo(wx2 + 14, wy + 4, wx2 + 18, wy + 4); ctx.stroke()
          ctx.strokeStyle = 'rgba(200,150,110,0.4)'
          ctx.lineWidth = 2
          for (let i = 0; i < 3; i++) {
            const sx = hp.x + faceX(-8 + i * 8, 2)
            ctx.beginPath()
            ctx.moveTo(sx, hp.y - 18 + pitch * 4)
            ctx.quadraticCurveTo(sx + (i - 1) * 2, hp.y - 24, sx, hp.y - 27 + pitch * 2)
            ctx.stroke()
          }
        })

        parts.sort((a, b) => a.z - b.z)
        for (const p of parts) p.fn()
      }

      return {
        update(state) { Object.assign(S, state) },
        frame: draw,
      }
    }

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
      const [pose, setPose] = React.useState({ x: 0, y: 0, rz: 0, ry: 0, sx: 1, s: 1, closed: false, happy: false, walking: false })
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
      const canvasRef = React.useRef(null)
      const rendererRef = React.useRef(null)
      const latestRef = React.useRef({ x: 0, y: 0, rz: 0, ry: 0, sx: 1, s: 1, closed: false, happy: false, walking: false, look: { x: 0, y: 0 }, mode: 'idle' })
      latestRef.current = { ...pose, look, mode }

      React.useEffect(() => () => { mountedRef.current = false }, [])

      // canvas renderer loop
      React.useEffect(() => {
        if (!canvasRef.current) return
        const renderer = createCatRenderer(canvasRef.current)
        rendererRef.current = renderer
        let disposed = false
        let raf = 0
        const loop = () => {
          if (disposed) return
          renderer.update(latestRef.current)
          renderer.frame()
          raf = window.requestAnimationFrame(loop)
        }
        if (typeof window.requestAnimationFrame === 'function') {
          raf = window.requestAnimationFrame(loop)
        } else {
          const id = ctx.interval(loop, 16)
          return () => { disposed = true; id() }
        }
        return () => { disposed = true; window.cancelAnimationFrame(raf) }
      }, [])

      // welcome bubble on first mount
      React.useEffect(() => {
        const t = ctx.timeout(() => {
          if (!mountedRef.current) return
          showBubble('喵～我是你的小猫咪！我会躲猫猫、捉蝴蝶，还会按时提醒你喝水哦～', 8000)
        }, 900)
        return t
      }, [])

      // mouse look
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

      function startPeek() {
        setMode('peek')
        showBubble('喵？看见我了吗？', 6500)
        runSeq([
          { set: { closed: false, happy: false, walking: false, ry: 0, rz: 0, sx: 1, s: 1 }, wait: 200 },
          crouch(),
          ...wiggle(),
          { set: { walking: true, x: -96, y: 0, s: 1 }, wait: 1150 },
          { set: { walking: false, ry: -10 }, wait: 300 },
          ...settle(),
          { set: { y: -26 }, wait: 850 },
          { set: { y: 0 }, wait: 650 },
          { set: { y: -26, ry: 8 }, wait: 850 },
          { set: { y: 0, ry: 0 }, wait: 650 },
          crouch(),
          { set: { walking: true, x: 0 }, wait: 1150 },
          { set: { walking: false } },
          ...settle(),
        ], () => setMode('idle'))
      }
      function startButterfly() {
        setMode('butterfly')
        showBubble('蝴蝶别跑！看我的～扑！', 6200)
        runSeq([
          { set: { closed: false, happy: false, walking: false, ry: 6, y: 0, rz: 0, sx: 1, s: 1 }, wait: 1100 },
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
          { set: { happy: false, walking: false, rz: -5, ry: 4, sx: 1, s: 0.97, closed: true }, wait: 3200 },
          { set: { s: 0.98 }, wait: 2000 },
          { set: { s: 0.97 }, wait: 1500 },
          { set: { rz: 0, ry: 0, s: 1, closed: false } },
        ], () => setMode('idle'))
      }
      function startGroom() {
        setMode('groom')
        showBubble('舔舔爪子…洗脸脸～', 6000)
        runSeq([
          { set: { closed: false, walking: false, ry: 0, rz: 0, sx: 1, s: 1, happy: true }, wait: 300 },
          { set: { ry: 10, rz: 4, y: -3 }, wait: 700 },
          { set: { ry: 4 }, wait: 350 },
          { set: { ry: 10 }, wait: 350 },
          { set: { ry: 4 }, wait: 350 },
          { set: { ry: 0, rz: 0, y: 0 }, wait: 300 },
          { set: { ry: -10, rz: -4, y: -3 }, wait: 700 },
          { set: { ry: 0, rz: 0, happy: false } },
        ], () => setMode('idle'))
      }
      function startYawn() {
        setMode('yawn')
        showBubble('哈啊……', 5000)
        runSeq([
          { set: { closed: false, walking: false, ry: 0, rz: 0, sx: 1, s: 1, happy: true }, wait: 250 },
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
          { set: { closed: false, walking: false, ry: 0, rz: 0, sx: 1, s: 1, happy: true }, wait: 250 },
          { set: { sx: 1.14, s: 0.9, y: -2, ry: 6 }, wait: 1100 },
          { set: { sx: 1.1, s: 0.94, y: -1 }, wait: 700 },
          { set: { sx: 1.14, s: 0.9, y: -2 }, wait: 800 },
          { set: { sx: 1, s: 1.04, y: -8 }, wait: 500 },
          { set: { sx: 1, s: 1, happy: false } },
        ], () => setMode('idle'))
      }
      function startEyes() {
        setMode('eyes')
        showBubble('看看远方，让眼睛休息一下下吧～', 6000)
        runSeq([
          { set: { closed: false, walking: false, rz: 0, sx: 1, s: 1, happy: true, ry: 10 }, wait: 1300 },
          { set: { ry: -8 }, wait: 1300 },
          { set: { ry: 8 }, wait: 1200 },
          { set: { ry: 0, happy: false } },
        ], () => setMode('idle'))
      }
      function startRelax() {
        setMode('relax')
        showBubble('…主人，我好喜欢你～', 4500)
        runSeq([
          { set: { closed: false, walking: false, ry: 6, rz: -4, sx: 1, s: 1, happy: true }, wait: 900 },
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
          { set: { closed: false, walking: false, ry: 6, rz: 12, sx: 1, s: 1, y: -3, happy: true }, wait: 900 },
          { set: { ry: -6, rz: -10 }, wait: 900 },
          { set: { ry: 0, rz: 0, happy: false } },
        ], () => setMode('idle'))
      }
      function startWater() {
        setMode('drink')
        showBubble('咕咚咕咚…好好喝呀！', 3400)
        runSeq([
          { set: { closed: false, happy: false, walking: false, ry: 0, rz: 0, sx: 1, s: 1 }, wait: 200 },
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

      // idle behavior loop
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

      const shadowStyle = {
        left: (118 + pose.x) + 'px',
        transform: 'scale(' + Math.max(0.55, 1 + pose.y / 240) + ')',
        opacity: Math.max(0.22, 1 + pose.y / 90),
      }
      const bubbleCls = 'dsp-bubble' + (bubbleFade ? ' dsp-bubble--fade' : '')
      const bfCls = 'dsp-butterflies' + (mode === 'butterfly' ? ' dsp-butterflies--on' : '')
      const napCls = 'dsp-napfx' + (mode === 'nap' ? ' dsp-napfx--on' : '')

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
          { set: { closed: false, walking: false, sx: 1, happy: true, ry: -8, rz: 0, s: 1.04, y: -6 }, wait: 620 },
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
          h('canvas', { className: 'dsp-canvas', ref: canvasRef }),
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
        h('p', { className: 'dsp-settings-desc' }, 'Canvas 3D 软渲染的猫咪：真实光影 + 3D 头部转向 + 弹性动作，跟着鼠标转头、不对称眨眼、舔毛、打哈欠、歪头好奇，到点变身巨猫敲屏提醒你喝水～（纯文字卖萌✨）'),
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
