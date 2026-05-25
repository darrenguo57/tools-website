# 工具类静态网站项目计划

## 项目概述

构建一个功能丰富的工具类静态网站，包含60+个工具（含12个图表工具），采用纯HTML/CSS/JS技术栈，支持中英文双语，可部署到GitHub Pages或Firebase，并集成Google广告。包含SEO文章模块，方便后续内容营销。

## 当前状态分析

- **项目类型**: 全新项目
- **技术栈**: 纯HTML/CSS/JS (无框架)
- **部署目标**: GitHub Pages / Firebase Hosting
- **目标用户**: 北美/欧洲用户为主，支持中文

## 开源工具库调研结果

### 文件格式转换
- **IT-Tools** (25k+ stars) - 综合工具集合，含Base64/URL/JSON/YAML转换
- **Vert** (13.7k stars) - 本地文件转换器

### 图表制作
- **Chart.js** (60k stars) - 简单灵活的JS图表库
- **Apache ECharts** (58k stars) - 强大的交互式图表库，支持热力图、桑基图、漏斗图
- **D3.js** (108k stars) - 数据驱动可视化，底层绘图能力
- **Mermaid.js** (20k+ stars) - 流程图、时序图、类图绘制
- **WordCloud2.js** (5k+ stars) - 词云生成

### 计算器
- **mathjs** (14k stars) - 数学表达式解析、单位转换、矩阵运算

### 图片处理
- **Fabric.js** (28k stars) - HTML5 Canvas图像编辑
- **html2canvas** (29k stars) - DOM转Canvas截图
- **TUI Image Editor** (5.2k stars) - 全功能图像编辑器

### 生成器
- **Nano ID** (25k stars) - 唯一ID生成器
- **QRCode.js** (12k stars) - 二维码生成
- **UUID** (13k stars) - UUID生成器

### 格式化工具
- **Prettier** (50k+ stars) - 代码格式化
- **JSON Crack** (43k stars) - JSON可视化

### 加解密
- **Crypto-JS** (15k stars) - AES/SHA/MD5/HMAC等
- **JSEncrypt** (7k stars) - RSA加密

## 网站架构设计

### 目录结构
```
tools-website/
├── index.html                 # 首页
├── tools/                     # 工具页面目录
│   ├── converters/           # 转换工具
│   ├── calculators/          # 计算器
│   ├── image-tools/          # 图片工具
│   ├── generators/           # 生成器
│   ├── formatters/           # 格式化工具
│   ├── crypto/               # 加解密工具
│   ├── charts/               # 图表工具
│   └── testers/              # 测试工具
├── blog/                      # SEO文章模块
│   ├── index.html            # 文章列表页
│   ├── articles/             # 文章目录
│   └── tags/                 # 标签分类
├── assets/
│   ├── css/                  # 样式文件
│   ├── js/                   # 公共JS
│   ├── libs/                 # 第三方库
│   └── images/               # 图片资源
├── locales/                  # 语言文件
│   ├── en.json
│   └── zh.json
└── ads.txt                   # Google广告验证
```

### 工具分类清单 (60+工具)

#### 1. 转换工具 (8个)
- Base64 编解码
- URL 编解码
- JSON ↔ YAML 转换
- 进制转换 (2/8/10/16)
- 单位换算 (长度/重量/温度)
- 时间戳转换
- HTML 实体编解码
- Markdown ↔ HTML

#### 2. 计算器 (6个)
- 标准计算器
- 科学计算器
- 贷款计算器
- BMI计算器
- 年龄计算器
- 密码强度检测器

#### 3. 图片工具 (8个)
- 图片压缩
- 图片格式转换
- 图片Base64转换
- 图片裁剪/旋转
- 图片滤镜
- 截图工具 (html2canvas)
- 调色板生成器
- 图片尺寸调整

#### 4. 生成器 (8个)
- UUID生成器
- Nano ID生成器
- 二维码生成器
- 密码生成器
- Lorem Ipsum生成器
- 随机数生成器
- 条形码生成器
- 假数据生成器

#### 5. 格式化工具 (8个)
- JSON格式化/验证
- JSON可视化 (JSON Crack风格)
- SQL格式化
- HTML/CSS/JS格式化
- XML格式化
- CSV查看器
- 代码对比工具
- 文本差异对比

#### 6. 加解密工具 (6个)
- MD5/SHA哈希
- Base64加密
- AES加密/解密
- RSA加密/解密
- URL签名生成
- HMAC计算

#### 7. 图表工具 (12个)
- 图表生成器 (Chart.js) - 支持柱状图、折线图、饼图、雷达图等
- 高级图表 (ECharts) - 支持热力图、桑基图、漏斗图、K线图
- 流程图绘制 (Mermaid.js) - 流程图、时序图、类图
- 思维导图 - 层级结构可视化
- 甘特图生成器 - 项目进度管理
- 词云生成器 - 文字频率可视化
- 网络关系图 - 节点关系可视化
- 仪表盘/仪表图 - 数据指标展示
- 树状图 - 层级数据展示
- 散点图/气泡图 - 数据分布分析
- 面积图/堆叠图 - 趋势对比
- 实时数据图表 - 动态数据展示

#### 8. 测试工具 (4个)
- 正则表达式测试
- CSS渐变生成器
- 颜色选择器/转换
- 网页性能测试

## 技术实现方案

### 核心特性
1. **纯静态**: 无需后端服务器
2. **响应式设计**: 适配桌面和移动端
3. **PWA支持**: 可离线使用
4. **双语支持**: 中英文切换
5. **深色模式**: 支持light/dark主题

### 第三方库依赖
```html
<!-- 核心库 -->
<script src="libs/mathjs/math.js"></script>
<script src="libs/crypto-js/crypto-js.js"></script>
<script src="libs/chart.js/chart.min.js"></script>
<script src="libs/echarts/echarts.min.js"></script>
<script src="libs/qrcodejs/qrcode.min.js"></script>
<script src="libs/fabric.js/fabric.min.js"></script>
<script src="libs/html2canvas/html2canvas.min.js"></script>
<script src="libs/nanoid/nanoid.js"></script>
<script src="libs/mermaid/mermaid.min.js"></script>
<script src="libs/d3/d3.min.js"></script>
<script src="libs/wordcloud/wordcloud2.js"></script>
```

### Google广告集成
- 在首页和工具页面侧边栏/底部插入广告位
- 使用Google AdSense代码
- 创建ads.txt文件验证

## 页面设计规范

### 视觉风格 (欧美习惯)
- **配色**: 简洁专业，主色调蓝/灰
- **字体**: Inter / Roboto / system-ui
- **布局**: 卡片式网格布局
- **图标**: Lucide icons / Heroicons
- **间距**: 充足的留白，现代感

### 导航结构
- 顶部固定导航栏 (Logo + 搜索 + 语言切换 + 主题切换)
- 左侧分类侧边栏 (桌面端)
- 工具卡片网格展示
- 面包屑导航

### 响应式断点
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 实施步骤

### Phase 1: 基础架构
1. 创建项目目录结构
2. 搭建基础HTML模板
3. 实现CSS框架和主题系统
4. 实现i18n国际化系统
5. 创建首页布局

### Phase 2: 核心工具开发
1. 转换工具类 (8个)
2. 格式化工具类 (8个)
3. 生成器类 (8个)

### Phase 3: 高级工具开发
1. 图片工具类 (8个)
2. 加解密工具类 (6个)
3. 图表工具类 (4个)

### Phase 4: SEO文章模块
1. 创建文章模板系统
2. 开发文章列表页面
3. 创建示例SEO文章 (10篇)
4. 添加文章标签系统
5. 实现文章搜索功能

### Phase 5: 完善与优化
1. 计算器类 (6个)
2. 测试工具类 (4个)
3. Google广告集成
4. SEO优化 (meta标签、结构化数据)
5. PWA配置

### Phase 6: 部署
1. GitHub Pages部署配置
2. Firebase Hosting配置
3. 域名配置 (可选)

## 文件清单

### 核心文件
- `index.html` - 首页
- `assets/css/main.css` - 主样式
- `assets/css/dark.css` - 深色主题
- `assets/js/app.js` - 主应用逻辑
- `assets/js/i18n.js` - 国际化
- `assets/js/utils.js` - 工具函数

### 工具页面 (按类别)
- `tools/converters/*.html` - 8个转换工具
- `tools/calculators/*.html` - 6个计算器
- `tools/image-tools/*.html` - 8个图片工具
- `tools/generators/*.html` - 8个生成器
- `tools/formatters/*.html` - 8个格式化工具
- `tools/crypto/*.html` - 6个加解密工具
- `tools/charts/*.html` - 12个图表工具
- `tools/testers/*.html` - 4个测试工具
- `blog/index.html` - 文章列表页
- `blog/articles/*.html` - SEO文章页面

### 配置文件
- `manifest.json` - PWA配置
- `service-worker.js` - 服务工作线程
- `ads.txt` - Google广告验证
- `robots.txt` - SEO爬虫配置
- `sitemap.xml` - 站点地图

## 验证清单

- [ ] 所有工具页面正常加载
- [ ] 中英文切换功能正常
- [ ] 深色/浅色主题切换正常
- [ ] 移动端响应式适配
- [ ] Google广告代码正确插入
- [ ] PWA离线功能可用
- [ ] 所有工具功能测试通过
- [ ] GitHub Pages部署成功
- [ ] Firebase部署成功

## 假设与决策

1. **技术选择**: 纯HTML/CSS/JS确保最大兼容性和简单部署
2. **库选择**: 优先选择CDN引入，减少维护成本
3. **广告位置**: 侧边栏和底部非侵入式广告位
4. **语言切换**: 使用JSON文件存储翻译，JavaScript动态切换
5. **主题实现**: CSS变量 + class切换实现主题
6. **工具实现**: 优先使用原生JS实现，复杂功能引入轻量库
