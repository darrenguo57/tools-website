# 贡献指南 (Contributing Guide)

感谢你对 UseEasyTool 项目的关注！本文档将帮助你了解如何为项目做出贡献。

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [添加新工具](#添加新工具)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [Pull Request 流程](#pull-request-流程)
- [问题反馈](#问题反馈)

## 行为准则

- 尊重所有贡献者
- 接受建设性的批评
- 专注于对项目最有利的事情
- 展现对项目社区的同理心

## 如何贡献

### 报告 Bug

如果你发现了 Bug，请通过 [GitHub Issues](https://github.com/your-username/useeasytool/issues) 提交，并包含以下信息：

1. **Bug 描述** — 清晰描述问题
2. **复现步骤** — 详细说明如何复现
3. **预期行为** — 你期望的正确结果
4. **实际行为** — 实际发生的结果
5. **环境信息** — 浏览器类型和版本、操作系统
6. **截图** — 如有可能，附上截图

### 提出新功能

欢迎提出新工具建议！请在 Issue 中描述：

1. **工具名称和用途**
2. **目标用户和使用场景**
3. **是否已有类似工具**（如有，说明差异）
4. **建议使用的第三方库**（如需要）

## 添加新工具

### 步骤

1. **复制模板**
   ```bash
   cp tools/template.html tools/<category>/your-tool.html
   ```

2. **修改页面内容**
   - 更新 `<title>` 标签
   - 更新 SEO 元数据（description、keywords、canonical）
   - 更新 Open Graph 和 Twitter Card 信息
   - 更新 JSON-LD 结构化数据
   - 实现工具核心逻辑（在 `<script>` 标签中）
   - 添加页面特定样式（在 `<style>` 标签中）

3. **更新首页导航**
   - 在 `index.html` 中添加新工具的卡片链接
   - 选择正确的分类

4. **更新国际化文件**
   - 在 `locales/en.json` 和 `locales/zh.json` 中添加翻译

5. **更新站点地图**
   - 在 `sitemap.xml` 中添加新页面的 URL

6. **测试**
   - 本地启动服务器验证功能
   - 测试响应式布局（桌面/平板/手机）
   - 测试暗色主题
   - 测试中英文切换

### 工具分类目录

| 目录 | 分类 | 说明 |
|------|------|------|
| `tools/converters/` | 转换工具 | 编码/格式转换类 |
| `tools/calculators/` | 计算器 | 数学/实用计算类 |
| `tools/image-tools/` | 图片工具 | 图片处理类 |
| `tools/generators/` | 生成器 | 数据/内容生成类 |
| `tools/formatters/` | 格式化工具 | 代码/数据格式化类 |
| `tools/crypto/` | 加解密 | 加密/哈希/签名类 |
| `tools/charts/` | 图表工具 | 数据可视化类 |
| `tools/testers/` | 测试工具 | 开发辅助测试类 |

## 代码规范

### HTML

- 使用语义化 HTML5 标签
- 保持正确的缩进（2 空格）
- 所有页面必须包含完整的 SEO 元数据
- 使用 `data-i18n` 属性标记需要翻译的文本

### CSS

- 使用项目已有的 CSS 自定义属性（Design Tokens）
- 页面特定样式写在 `<style>` 标签中
- 遵循移动优先的响应式设计原则
- 确保暗色主题兼容

### JavaScript

- 使用 ES6+ 语法
- 工具逻辑封装在 IIFE 中，避免全局命名空间污染
- 使用 `Utils` 全局对象中的工具函数（clipboard、toast、download 等）
- 添加必要的输入验证和错误处理
- 关键操作添加用户反馈（Toast 提示）

### 国际化

- 所有用户可见文本必须通过 `data-i18n` 属性标记
- 翻译键使用点分隔路径（如 `nav.home`）
- 在 `locales/en.json` 和 `locales/zh.json` 中同步添加翻译

## 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <description>
```

**类型 (type)**：
- `feat`: 新功能/新工具
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `i18n`: 国际化相关
- `test`: 测试相关
- `chore`: 构建/工具链相关

**示例**：
```
feat(generators): add barcode generator tool
fix(converters): fix base64 encoding for non-ASCII characters
docs: update README with new tool list
i18n: add Chinese translations for chart tools
```

## Pull Request 流程

1. Fork 仓库并创建特性分支
2. 按照上述规范开发
3. 确保本地测试通过
4. 提交 PR，描述清楚改动内容
5. 等待 Code Review
6. 根据反馈修改（如需要）
7. 合并后删除特性分支

## 问题反馈

如有任何问题或建议，请通过 [GitHub Issues](https://github.com/your-username/useeasytool/issues) 联系我们。

---

再次感谢你的贡献！🎉
