@echo off
chcp 65001 >nul
title Kun Like 桌宠 - Windows 一键打包
cd /d %~dp0

echo ============================================
echo   Kun Like 桌宠 · Windows 一键打包
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 Node.js，请先安装：https://nodejs.org （LTS 版即可）
  pause
  exit /b 1
)

if not exist node_modules (
  echo [1/2] 首次运行，正在安装依赖（需要联网，可能需要几分钟）...
  call npm install
  if errorlevel 1 (
    echo [错误] 依赖安装失败，请检查网络后重试
    pause
    exit /b 1
  )
) else (
  echo [1/2] 依赖已就绪
)

echo [2/2] 正在打包 Windows 安装程序...
call npm run dist
if errorlevel 1 (
  echo [错误] 打包失败，请查看上方错误信息
  pause
  exit /b 1
)

echo.
echo ============================================
echo   打包完成！安装包在 dist 目录：
echo     - KunLike桌宠 Setup x.x.x.exe   （安装版）
echo     - KunLike桌宠 x.x.x.exe         （免安装便携版，双击即用）
echo ============================================
echo.
echo 开发调试（不打包）：node_modules\.bin\electron .
pause
