# Google AdSense 审核通过 — 全面优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标:** 修复所有导致 Google AdSense 审核未通过的问题，包括内容不足、品牌不一致、SEO 缺陷、政策页面不完善等。

**架构:** 分为 5 个阶段：P0 紧急修复 → P1 SEO 基础 → P2 内容扩充 → P3 博客文章 → P4 最终验证

**技术栈:** 纯前端 HTML/CSS/JS 静态网站，GitHub Pages 部署，Google AdSense 自动广告

---

## 当前状态分析

### 审核未通过的根因（按严重程度排序）

| 优先级 | 问题 | 影响 |
|--------|------|------|
| P0 | 品牌名称不一致：首页 "UseEasyTool" vs 其他页面 "ToolBox" | 品牌验证失败 |
| P0 | 隐私政策过于简短，缺少 AdSense/Cookie 披露 | 直接拒审原因 |
| P0 | blog/index.html 有 7 篇幽灵文章（404） | 大量 404 损害 SEO |
| P0 | blog/index.html JS 语法错误 | 博客页面无法正常渲染 |
| P0 | JSON-LD 中虚假评分数据（4.8分/1000评价） | 违反 Google 政策 |
| P0 | 所有工具页面 footer 链接指向 `#` | 导航不完整 |
| P1 | 60+ 工具页面缺少 canonical/OG/SEO 元数据 | SEO 基础缺失 |
| P1 | sitemap.xml 包含不存在的页面 | 爬虫抓取错误 |
| P1 | 工具页面 meta description 过短 | 搜索结果展示差 |
| P1 | og-image.png 不存在 | 社交分享无预览图 |
| P2 | 博客文章只有 3 篇，内容不足 | 内容过薄 |
| P2 | 工具页面缺少使用说明和 FAQ | 页面价值不足 |
| P2 | 服务条款过于简短 | 合规不完善 |
| P3 | ad-slots.js 中广告位 ID 为占位符 | 广告无法正常展示 |
| P3 | manifest.json 引用不存在的图标文件 | PWA 功能异常 |

---

## Task 1: P0 紧急修复 — 品牌统一

**Files:**
- Modify: `about.html`
- Modify: `privacy.html`
- Modify: `terms.html`
- Modify: `contact.html`
- Modify: `custom-tool.html`
- Modify: `404.html`
- Modify: `blog/index.html`
- Modify: `blog/template.html`
- Modify: `blog/articles/*.html` (3 篇)
- Modify: `tools/template.html`
- Modify: `locales/en.json`
- Modify: `locales/zh.json`

- [ ] **Step 1: 全局搜索替换品牌名**

在所有 HTML 文件中将 "ToolBox" 替换为 "UseEasyTool"，"toolbox" 替换为 "useeasytool"（URL 中）。

- [ ] **Step 2: 修复 blog 文章中的域名**

将所有 `toolbox.example.com` 替换为 `useeasytool.com`。

- [ ] **Step 3: 更新国际化文件中的品牌名**

检查 en.json 和 zh.json 中所有包含 "ToolBox" 的键值，替换为 "UseEasyTool"。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "fix: unify brand name to UseEasyTool across all pages"
```

---

## Task 2: P0 紧急修复 — 移除虚假评分数据

**Files:**
- Modify: `index.html` (第 60-78 行 JSON-LD)

- [ ] **Step 1: 移除 AggregateRating**

从 index.html 的 JSON-LD `SoftwareApplication` schema 中删除 `aggregateRating` 部分。保留其他结构化数据。

修改前：
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "ratingCount": "1000"
}
```
修改后：删除整个 `aggregateRating` 块。

- [ ] **Step 2: 提交**

```bash
git commit -m "fix: remove fake AggregateRating from JSON-LD"
```

---

## Task 3: P0 紧急修复 — 修复 blog/index.html

**Files:**
- Modify: `blog/index.html`

- [ ] **Step 1: 删除 7 篇幽灵文章的 JS 数据**

从 blog/index.html 的 JavaScript 文章数组中删除以下不存在的文章条目：
- `aes-encryption-guide`
- `image-compression-tips`
- `regex-beginner-tutorial`
- `color-theory-web-designers`
- `unit-conversion-cheat-sheet`
- `markdown-vs-html-guide`
- `data-visualization-best-practices`

同时修复已存在的 3 篇文章条目中的 JS 语法错误（缺少逗号、属性名合并等问题）。

- [ ] **Step 2: 提交**

```bash
git commit -m "fix: remove ghost blog articles and fix JS syntax errors"
```

---

## Task 4: P0 紧急修复 — 修复所有工具页面 footer 链接

**Files:**
- Modify: `tools/**/*.html` (约 60 个文件)
- Modify: `tools/template.html`

- [ ] **Step 1: 修复 template.html 的 footer**

将 template.html 中 footer 的 `href="#"` 链接改为正确的相对路径：
- `#` → `../about.html`
- `#` → `../privacy.html`
- `#` → `../terms.html`
- `#` → `../contact.html`
- `#` → `../index.html`

- [ ] **Step 2: 批量修复所有工具页面 footer**

对 tools/ 下所有 HTML 文件执行相同的 footer 链接修复。使用脚本批量处理。

- [ ] **Step 3: 提交**

```bash
git commit -m "fix: update footer links in all tool pages from # to actual paths"
```

---

## Task 5: P0 紧急修复 — 修复 sitemap.xml

**Files:**
- Modify: `sitemap.xml`

- [ ] **Step 1: 删除不存在的页面 URL**

从 sitemap.xml 中删除：
- `tools/charts/dashboard.html`（不存在）
- `tools/formatters/code-compare.html`（不存在）

- [ ] **Step 2: 添加缺失的政策页面**

添加以下 URL 到 sitemap：
- `https://useeasytool.com/about.html`
- `https://useeasytool.com/privacy.html`
- `https://useeasytool.com/terms.html`
- `https://useeasytool.com/contact.html`
- `https://useeasytool.com/custom-tool.html`

- [ ] **Step 3: 提交**

```bash
git commit -m "fix: remove broken URLs and add policy pages to sitemap"
```

---

## Task 6: P0 紧急修复 — 扩充隐私政策

**Files:**
- Modify: `privacy.html`

- [ ] **Step 1: 重写隐私政策**

将 privacy.html 的内容扩充为详尽的隐私政策，必须包含以下章节：

1. **概述** — 说明 UseEasyTool 是什么，本政策的适用范围
2. **信息收集** — 详细列出收集的数据类型（Cookie、IP、浏览器信息、使用数据）
3. **Cookie 使用** — 说明第一方和第三方 Cookie 的类型和用途
4. **Google AdSense 和第三方广告**（关键！）— 明确说明：
   - 使用 Google AdSense 展示广告
   - Google 使用 Cookie 投放个性化广告
   - 用户可通过 Google 广告设置关闭个性化广告
   - 引用 Google 隐私政策链接：https://policies.google.com/privacy
   - 引用 Google 广告设置链接：https://www.google.com/settings/ads
5. **Google Analytics** — 说明使用情况（如果使用）
6. **数据共享** — 说明与哪些第三方共享数据
7. **数据安全** — 说明安全措施
8. **用户权利** — 访问、更正、删除数据的权利
9. **未成年人隐私** — 不面向 13 岁以下儿童
10. **政策变更** — 如何通知用户变更
11. **联系方式** — darrenguo57@gmail.com

内容长度：至少 1500-2000 字。

- [ ] **Step 2: 同步更新 en.json 和 zh.json 中的隐私政策翻译键**

- [ ] **Step 3: 提交**

```bash
git commit -m "feat: comprehensive privacy policy with AdSense disclosure"
```

---

## Task 7: P0 紧急修复 — 扩充服务条款

**Files:**
- Modify: `terms.html`

- [ ] **Step 1: 扩充服务条款**

将 terms.html 的内容扩充，增加以下内容：
- 用户年龄限制（13+）
- 知识产权归属细节
- DMCA 声明
- 免责声明（工具结果仅供参考）
- 责任限制
- 适用法律
- 赔偿条款

内容长度：至少 1000-1500 字。

- [ ] **Step 2: 提交**

```bash
git commit -m "feat: comprehensive terms of service"
```

---

## Task 8: P1 SEO — 为工具页面添加 SEO 元数据

**Files:**
- Modify: `tools/template.html`（更新模板）
- Modify: `tools/**/*.html`（约 60 个文件，通过脚本批量处理）

- [ ] **Step 1: 更新 tools/template.html 模板**

在 template.html 的 `<head>` 中确保包含：
- `<link rel="canonical" href="https://useeasytool.com/tools/CATEGORY/TOOL.html">`
- Open Graph meta tags (og:title, og:description, og:url, og:image, og:type)
- Twitter Card meta tags
- JSON-LD WebApplication 结构化数据
- 更详细的 `<meta description>`（至少 100-150 字符）

- [ ] **Step 2: 为每个工具页面生成并注入 SEO 元数据**

创建一个 Node.js/Python 脚本，读取每个工具页面的 `<title>` 和 `data-i18n` 属性，自动生成：
- canonical link（基于文件路径）
- OG tags（基于工具名称和描述）
- Twitter Card tags
- JSON-LD WebApplication schema
- 更丰富的 meta description

将脚本生成的 meta 标签注入到每个工具页面的 `<head>` 中。

- [ ] **Step 3: 提交**

```bash
git commit -m "feat: add SEO metadata to all tool pages (canonical, OG, JSON-LD)"
```

---

## Task 9: P1 SEO — 丰富工具页面描述

**Files:**
- Modify: `locales/en.json`
- Modify: `locales/zh.json`

- [ ] **Step 1: 扩充所有工具的描述文本**

将所有 `tool_*_desc` 键的值从简短描述扩充为更详细的描述（50-80 个字符），例如：

修改前：`"Format and validate JSON"`
修改后：`"Free online JSON formatter, validator, and beautifier. Format messy JSON data with syntax highlighting and error detection."`

对以下工具分类的所有描述进行扩充：
- converters (8 个工具)
- calculators (6 个工具)
- image-tools (8 个工具)
- generators (8 个工具)
- formatters (8 个工具)
- crypto (6 个工具)
- charts (12 个工具)
- testers (4 个工具)

同时更新中文翻译。

- [ ] **Step 2: 提交**

```bash
git commit -m "feat: enrich tool descriptions for better SEO"
```

---

## Task 10: P2 内容 — 为工具页面添加使用说明区域

**Files:**
- Modify: `tools/template.html`（添加模板结构）
- Modify: `assets/css/tools.css`（添加样式）
- Modify: `locales/en.json`
- Modify: `locales/zh.json`

- [ ] **Step 1: 在 template.html 中添加 "How to Use" 区域**

在工具页面的工具工作区下方添加：
```html
<section class="tool-guide">
  <h3 data-i18n="tool_how_to_use">How to Use</h3>
  <ol class="tool-guide-steps">
    <li data-i18n="tool_step_input">Enter or paste your content in the input area above</li>
    <li data-i18n="tool_step_action">Click the action button to process</li>
    <li data-i18n="tool_step_output">View the result in the output area</li>
    <li data-i18n="tool_step_copy">Copy the result to clipboard or download</li>
  </ol>
</section>
```

- [ ] **Step 2: 添加 CSS 样式**

在 tools.css 中添加 `.tool-guide` 相关样式，确保与现有设计一致。

- [ ] **Step 3: 添加 i18n 翻译键**

在 en.json 和 zh.json 中添加 `tool_how_to_use`、`tool_step_input`、`tool_step_action`、`tool_step_output`、`tool_step_copy` 的翻译。

- [ ] **Step 4: 提交**

```bash
git commit -m "feat: add How to Use section to tool pages"
```

---

## Task 11: P3 博客文章 — 创建 5 篇高质量 SEO 软文

**Files:**
- Create: `blog/articles/base64-vs-url-encoding.html`
- Create: `blog/articles/json-formatter-common-mistakes.html`
- Create: `blog/articles/qr-code-marketing-guide.html`
- Create: `blog/articles/password-security-best-practices-2026.html`
- Create: `blog/articles/free-online-tools-developers.html`
- Modify: `blog/index.html`（添加新文章条目）
- Modify: `sitemap.xml`（添加新文章 URL）

每篇文章要求：
- 1500-2500 字
- 英文撰写
- 包含完整的 SEO 元数据（title, description, OG, Twitter Card, JSON-LD Article schema, canonical）
- 包含站内工具链接（内链建设）
- 使用 blog/template.html 的结构
- 域名使用 `useeasytool.com`

### 文章 1: Base64 vs URL Encoding — 何时使用哪种编码？

- [ ] **Step 1: 创建文章 HTML**

内容大纲：
1. 什么是 Base64 编码
2. 什么是 URL 编码
3. 两者的区别对比（表格）
4. 各自的使用场景
5. 常见错误和注意事项
6. 站内链接：Base64 工具、URL 编码工具

- [ ] **Step 2: 添加到 blog/index.html 和 sitemap.xml**

### 文章 2: JSON Formatter 常见错误及修复方法

- [ ] **Step 3: 创建文章 HTML**

内容大纲：
1. JSON 是什么
2. 常见 JSON 格式错误（5 种）
3. 如何验证 JSON
4. JSON vs XML vs YAML 对比
5. 站内链接：JSON Formatter、JSON to YAML、JSON Visualizer

- [ ] **Step 4: 添加到 blog/index.html 和 sitemap.xml**

### 文章 3: QR Code 营销完全指南 — 10 种创意用法

- [ ] **Step 5: 创建文章 HTML**

内容大纲：
1. QR Code 的历史和工作原理
2. 静态 vs 动态 QR Code
3. 10 种创意营销用法
4. QR Code 设计最佳实践
5. 站内链接：QR Code 生成器

- [ ] **Step 6: 添加到 blog/index.html 和 sitemap.xml**

### 文章 4: 2026 年密码安全最佳实践

- [ ] **Step 7: 创建文章 HTML**

内容大纲：
1. 为什么密码安全很重要
2. 强密码的标准
3. 密码管理策略
4. 常见密码攻击方式
5. 如何检测密码强度
6. 站内链接：密码生成器、密码强度检测、Hash 生成器

- [ ] **Step 8: 添加到 blog/index.html 和 sitemap.xml**

### 文章 5: 开发者必备的 15 个免费在线工具

- [ ] **Step 9: 创建文章 HTML**

内容大纲：
1. 为什么在线工具对开发者重要
2. 分类介绍 15 个工具（每个 100-150 字）
   - 转换器类：Base64、URL、JSON-YAML
   - 格式化类：JSON Formatter、SQL Formatter
   - 生成器类：UUID、QR Code、密码
   - 加密类：Hash、AES
   - 测试类：Regex Tester
3. 站内链接：每个工具都链接到对应页面

- [ ] **Step 10: 添加到 blog/index.html 和 sitemap.xml**

- [ ] **Step 11: 提交**

```bash
git commit -m "feat: add 5 SEO blog articles for AdSense approval"
```

---

## Task 12: P3 最终验证 — 全站自检

**Files:**
- Modify: `blog/index.html`（添加缺失的 i18n 键）
- Modify: `locales/en.json`
- Modify: `locales/zh.json`

- [ ] **Step 1: 添加缺失的博客 i18n 键**

在 en.json 和 zh.json 中添加：
- `blog_title`: "Blog" / "博客"
- `blog_desc`: "Tips, guides, and insights about online tools" / "在线工具使用技巧、指南和深度解析"
- `blog_search_placeholder`: "Search articles..." / "搜索文章..."
- `blog_no_results`: "No articles found" / "未找到文章"

- [ ] **Step 2: 检查所有页面无 404 链接**

遍历所有 HTML 文件中的 `<a href>` 链接，确认目标文件存在。

- [ ] **Step 3: 检查所有页面无 JS 语法错误**

确认所有页面的内联脚本无语法错误。

- [ ] **Step 4: 确认 ads.txt 正确且可访问**

- [ ] **Step 5: 确认 robots.txt 未屏蔽 Google 爬虫**

- [ ] **Step 6: 提交**

```bash
git commit -m "feat: final verification and i18n fixes"
git push origin main
```

---

## 假设与决策

1. **品牌名统一为 "UseEasyTool"** — 这是首页已使用的品牌名，统一全站
2. **博客文章用英文撰写** — AdSense 支持英文，英文内容覆盖面更广
3. **隐私政策和服务条款直接写在 HTML 中** — 不使用外部生成工具，确保内容原创
4. **工具页面 SEO 元数据通过脚本批量生成** — 60+ 页面手动修改不现实
5. **不创建 og-image.png** — 这是锦上添花的功能，不影响审核核心
6. **不修复 manifest.json 图标** — PWA 功能与 AdSense 审核无关
7. **不替换 ad-slots.js 中的占位符** — 使用自动广告模式，不需要手动广告位 ID

## 验证步骤

1. 用浏览器打开首页，确认品牌名一致
2. 打开 blog/index.html，确认无 JS 错误，无 404 链接
3. 打开任意工具页面，确认 footer 链接可正常跳转
4. 打开 privacy.html，确认内容详尽且包含 AdSense 披露
5. 打开 terms.html，确认内容完整
6. 检查 sitemap.xml，确认无不存在页面的 URL
7. 用 Google Rich Results Test 验证结构化数据
8. 用 Google Mobile-Friendly Test 验证移动端适配
