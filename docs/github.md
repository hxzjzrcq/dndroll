# 从完整源码 ZIP 创建 GitHub 仓库

解压后进入含 package.json、README.md、packages/、apps/ 的 dndroll 目录，以这个目录作为仓库根目录，不需要重新组织工程。

ZIP 不含 .git，因此不会带入先前的本地提交历史；其中已有的历史补丁供阅读，源码已经包含其修改，不要再应用一次。可以从一次初始提交开始。

## 本地建立仓库

现有 .gitignore 会排除 node_modules、常规 Web dist、Tauri target/gen 和 *.log；离线交付、Core 编译产物、Windows 包、合同和发布验证资料有意保留。解压包本身不带开发依赖或构建缓存。

```sh
git init -b main
git add .
git status --short
git commit -m "Import DNDROLL v0.4.0 source and documentation"
```

提交前查看状态，确认只包含准备交付的项目文件。如果 Git 尚未配置作者身份，先按自己的身份完成 Git 配置。

## 连接 GitHub

在 GitHub 创建空仓库，不预先添加 README 或其他初始化文件，然后把下面的占位地址换成自己的仓库地址：

```sh
git remote add origin https://github.com/YOUR_ACCOUNT/DNDROLL.git
git push -u origin main
```

也可以用 GitHub Desktop 添加这个本地仓库后发布。此源码包没有连接远端、创建仓库或执行推送，这些操作由维护者完成。

## 后续开发

按 [CONTRIBUTING.md](../CONTRIBUTING.md) 安装和验证。README 是运行入口，contracts/api.md 是当前行为合同，CHANGELOG 是沿革；不要把历史报告当作当前接口说明。

本次只做文档整理，功能版本仍为 v0.4.0；HTML／EXE 沿用已交付的同一字节内容，现有 Windows 实机未验收限制不变。没有新增 CI 或发布自动化。
