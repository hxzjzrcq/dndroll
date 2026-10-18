# DNDROLL Windows 桌面版（Tauri 2，v0.4.0）

目标系统：Windows 10/11 x64；需要 Microsoft Edge WebView2 Runtime 111 或更新版本。应用界面和 Core 均嵌入 EXE，运行无需 Node.js、本地服务器或网络。

## 使用

便携版：有 WebView2 的电脑直接运行 `DNDROLL-Windows-x64.exe`。便携指无需安装应用；存档和主题仍写入当前 Windows 用户的 WebView2 应用数据目录，不跟随 EXE 文件移动。

安装版：运行 setup.exe。仅在缺少或过旧 WebView2 时联网补装运行库；随后应用完全离线运行。

桌面版与浏览器版的存档相互独立。首次迁移请从 HTML 导出 JSON，再在桌面版导入。批量结果与最近十组分别保存在当前窗口内存中，关闭后清空；原有当前会话自动保存机制保留。

## 从源码构建（Windows）

构建者需 Node.js 22+、Rust stable（MSVC）、Visual Studio C++ Build Tools 与 Windows SDK；运行者不需要这些开发工具。

在项目根目录执行：

```powershell
npm ci
npm run build:desktop:portable
# 或生成 NSIS 安装版：
npm run build:desktop
```

便携程序路径：`apps/web/src-tauri/target/x86_64-pc-windows-msvc/release/dndroll-desktop.exe`。
安装版路径：`apps/web/src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/`。

CLI 自动执行现有 web 构建并嵌入 `apps/web/dist`；同时仍输出根目录离线 HTML。Core、规则与前端业务逻辑没有复制进 Rust。

## Linux 交叉编译

按照 Tauri 官方 Windows 交叉编译流程，需要 Rust Windows MSVC target、cargo-xwin、LLVM/LLD、llvm-rc；安装包额外需要 NSIS。进入 `apps/web`：

```sh
npm run tauri -- build --runner cargo-xwin --target x86_64-pc-windows-msvc --no-bundle
```

本工程不添加自定义 Rust 指令、文件系统或 shell 插件，前端仍使用既有浏览器 API。

## 本次构建结果

v0.4.0 已重新交叉编译生成 Windows x64 便携程序与 NSIS 安装版；均放在 `Windows/`。包含 DCC 六属性和独立批量生成功能，保留 v0.3 交互与主题修复；Core 规则版本为 0.4.0-2026-10-18，已有版本的规则不变。应用标识保持不变，更新使用原桌面存档位置。

构建环境为 Linux / Rust 1.99.1 / cargo-xwin 0.23.1 / LLVM 18 / Tauri 2.12.4。PE 检查为 x64 Windows GUI，未导入额外 VC++ 运行库或 WebView2Loader DLL，但仍依赖系统 WebView2 Runtime。链接器缺少 Microsoft 库调试 PDB 的警告不影响 release 成品。

Core 97 项、前端 77 项测试通过，类型检查通过；新离线 HTML 已通过真实 Chromium 153 在断网 file:// 下的交互、JSON 导入／导出、TXT 下载验收；记录见 docs/validation.md。二者未签名，也尚未在 Windows 实机运行；需验证剪贴板、下载、导入导出和持久化。

## Windows 验收

构建成功不等于已完成 Windows 实机测试。需在 Windows 验证启动、首次存档/重启恢复、JSON 导入导出、复制（及拒绝时降级）、快速十组历史、主题切换与断网运行。
