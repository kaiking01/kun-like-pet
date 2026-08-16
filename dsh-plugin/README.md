# 在 DeepSeek Harness 中安装本桌宠

本目录是桌宠的 **DSH 动态 Cordis 插件**版本（与根目录 `index.html` 独立网页版功能一致，但使用 React + DSH 的插槽系统，以悬浮层形式运行在 DSH Web 界面右下角）。

## 文件说明

- `plugin.js` — 插件源码，即 `cordis_define` 的 `code.client` 函数体（纯 JavaScript，无 JSX / TypeScript，无需打包）

## 安装步骤

1. 在 DSH 会话中调用 `cordis_define` 工具：

   - `plugin.kind`：`new`
   - `plugin.idPrefix`：建议 `cute`（3–6 位小写字母）
   - `name`：`可爱桌面宠物`
   - `purpose`：一句话说明
   - `code.client`：粘贴本目录 `plugin.js` 的完整内容（从 `return {` 开始）

2. 调用 `cordis_run` 激活：

   - `pluginId`：定义后返回的 ID（如 `cute-1`）
   - `packageId`：返回的包 ID（如 `pkg-1`）
   - `mode`：`run`

3. 在浏览器界面批准运行后，猫咪会出现在 Web 界面右下角（`shell.overlay` 插槽），设置入口在左下角设置 →「桌面宠物」（`settings.section` 插槽）。

## 插件说明

| 项 | 值 |
|---|---|
| 平台 | Client（浏览器端） |
| 插槽 | `shell.overlay`（宠物悬浮层）、`settings.section`（设置页） |
| 依赖 | `timer` 服务（`ctx.interval` / `ctx.timeout`） |
| 运行时 | DSH Web 客户端（动态 Cordis 插件运行时） |

## 注意事项

- 动态插件为会话级临时运行，刷新页面或重启 Harness 后需要重新运行（定义会保留）。
- 首次运行客户端插件需要用户在界面批准。
- 插件源码里使用的 `React` / `styles` / `slots` / `ctx` 均为 DSH 动态客户端运行时提供的内置符号，请勿在独立网页版中直接套用。
