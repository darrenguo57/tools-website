# UseEasyTool

> 60+ Free Online Tools for Developers and Designers

[![Deploy](https://github.com/your-username/useeasytool/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-username/useeasytool/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Site](https://img.shields.io/badge/🌐-useeasytool.com-green.svg)](https://useeasytool.com)

## 🌐 在线访问

**官网**: [https://useeasytool.com](https://useeasytool.com)

## 📖 项目简介

UseEasyTool 是一个面向开发者和设计师的免费在线工具集合网站，提供 60+ 个实用工具，涵盖编码转换、格式化、加解密、图片处理、图表生成、计算器等类别。所有工具均在浏览器端运行，无需注册、无需上传数据到服务器，保护用户隐私。

### ✨ 核心特性

- **60+ 在线工具** — 覆盖开发日常高频需求
- **12 种图表工具** — 支持柱状图、折线图、饼图、流程图、思维导图、词云等
- **中英文双语** — 完整国际化支持（i18n）
- **暗色主题** — 支持亮色/暗色主题切换
- **PWA 支持** — 可安装为桌面/移动端应用
- **响应式设计** — 完美适配桌面、平板、手机
- **隐私优先** — 所有计算在浏览器端完成，不上传任何数据
- **SEO 优化** — 完整的结构化数据、sitemap、Open Graph 标签

## 🛠️ 技术栈

| 层面 | 技术 |
|------|------|
| 标记语言 | HTML5 |
| 样式 | 原生 CSS3 + CSS 自定义属性（Design Tokens） |
| 脚本 | 原生 JavaScript (ES6+, IIFE 模式) |
| 图表 | Chart.js、Apache ECharts、D3.js、Mermaid.js |
| 加解密 | CryptoJS、JSEncrypt |
| 图片处理 | Fabric.js、html2canvas |
| 图标 | Lucide Icons |
| 字体 | Inter、Outfit、JetBrains Mono |
| 国际化 | 自研 i18n 模块（JSON 翻译文件） |
| 部署 | GitHub Pages / Firebase Hosting |
| CI/CD | GitHub Actions |

## 📁 项目结构

```
UseEasyTool/
├── index.html                  # 首页（工具导航）
├── about.html                  # 关于页面
├── contact.html                # 联系页面
├── privacy.html                # 隐私政策
├── terms.html                  # 服务条款
├── 404.html                    # 404 页面
├── custom-tool.html            # 自定义工具页面
├── manifest.json               # PWA 清单
├── service-worker.js           # Service Worker
├── sitemap.xml                 # 站点地图
├── robots.txt                  # 爬虫配置
├── CNAME                       # 自定义域名
├── ads.txt                     # AdSense 验证
├── firebase.json               # Firebase 配置
├── .firebaserc                 # Firebase 项目配置
│
├── assets/
│   ├── css/
│   │   ├── main.css            # 主样式（设计系统 + 全局）
│   │   ├── dark.css            # 暗色主题
│   │   ├── tools.css           # 工具页面样式
│   │   └── blog.css            # 博客页面样式
│   ├── js/
│   │   ├── app.js              # 主应用逻辑
│   │   ├── i18n.js             # 国际化模块
│   │   ├── utils.js            # 工具函数库
│   │   ├── ads.js              # 广告管理
│   │   ├── adsense-global.js   # AdSense 全站广告
│   │   ├── ad-slots.js         # 广告位配置
│   │   └── paypal.js           # PayPal 捐赠
│   └── images/                 # 图片资源
│
├── tools/                      # 工具页面（60+）
│   ├── template.html           # 工具页面模板
│   ├── calculators/            # 计算器（6 个）
│   ├── charts/                 # 图表工具（12 个）
│   ├── converters/             # 转换工具（8 个）
│   ├── crypto/                 # 加解密工具（6 个）
│   ├── formatters/             # 格式化工具（8 个）
│   ├── generators/             # 生成器（8 个）
│   ├── image-tools/            # 图片工具（8 个）
│   └── testers/                # 测试工具（4 个）
│
├── blog/                       # 博客/SEO 文章
│   ├── index.html              # 文章列表页
│   ├── template.html           # 文章模板
│   └── articles/               # 文章目录（15 篇）
│
├── locales/                    # 国际化翻译
│   ├── en.json                 # 英文
│   └── zh.json                 # 中文
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages CI/CD
│
├── docs/                       # 项目文档
│   ├── test-plan.md            # 测试计划
│   └── test-cases.md           # 测试用例
│
└── .trae/
    └── documents/              # 内部规划文档
```

## 🚀 快速开始

### 环境要求

- 任何现代浏览器（Chrome、Firefox、Safari、Edge）
- 本地开发服务器（推荐使用以下任一方式）

### 本地运行

由于本项目是纯静态网站，无需安装任何依赖，直接启动一个本地 HTTP 服务器即可：

**方式一：使用 Python（推荐）**
```bash
# Python 3
cd UseEasyTool
python -m http.server 8080

# 访问 http://localhost:8080
```

**方式二：使用 Node.js**
```bash
npx serve .
# 或
npx http-server . -p 8080
```

**方式三：使用 VS Code**
- 安装 "Live Server" 扩展
- 右键 `index.html` → "Open with Live Server"

> ⚠️ **注意**：不能直接以 `file://` 协议打开 HTML 文件，因为 Service Worker 和部分 API 需要 HTTP 协议。

### 部署

**GitHub Pages**：推送到 `main` 分支后自动部署（见 `.github/workflows/deploy.yml`）

**Firebase Hosting**：
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔧 工具分类

| 分类 | 数量 | 代表工具 |
|------|------|---------|
| 🔄 转换工具 | 8 | Base64、URL、JSON↔YAML、时间戳、进制转换 |
| 🧮 计算器 | 6 | 标准计算器、科学计算器、BMI、贷款、年龄、密码强度 |
| 🖼️ 图片工具 | 8 | 压缩、裁剪、滤镜、格式转换、Base64、调色板 |
| ✨ 生成器 | 8 | UUID、QR Code、密码、条形码、Nano ID、随机数 |
| 📝 格式化工具 | 8 | JSON、SQL、XML、代码对比、文本差异、CSV 查看器 |
| 🔐 加解密 | 6 | AES、RSA、Hash、HMAC、Base64 加密、URL 签名 |
| 📊 图表工具 | 12 | 基础图表、高级图表、流程图、思维导图、词云、甘特图 |
| 🧪 测试工具 | 4 | 正则表达式、颜色选择器、CSS 渐变、性能测试 |

## 🧪 测试

详见 [测试计划](docs/test-plan.md) 和 [测试用例](docs/test-cases.md)。

### 运行测试

本项目采用手动测试 + 自动化 E2E 测试相结合的方式：

```bash
# 安装测试依赖
npm install

# 运行 Playwright E2E 测试
npx playwright test

# 查看测试报告
npx playwright show-report
```

## 📝 贡献指南

欢迎贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细流程。

简要步骤：
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/new-tool`)
3. 使用 `tools/template.html` 作为新工具的模板
4. 提交更改 (`git commit -m 'Add new tool: xxx'`)
5. 推送到分支 (`git push origin feature/new-tool`)
6. 创建 Pull Request

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 🔗 相关链接

- **官网**: [https://useeasytool.com](https://useeasytool.com)
- **博客**: [https://useeasytool.com/blog/](https://useeasytool.com/blog/)
- **问题反馈**: [GitHub Issues](https://github.com/your-username/useeasytool/issues)
