/**
 * ad-slots.js - 广告位配置
 * 
 * Google AdSense 广告位配置文件
 * Publisher ID: ca-pub-5246764554303000
 */

const AD_SLOTS = {
  // 展示广告 (AMP Display Ad) - 用于首页、博客列表页、工具页
  display: {
    slot_id: '4644408855',
    name: '展示广告',
    type: 'amp-ad',
    format: 'rspv',
    size: '100vw x 320 (responsive)'
  },

  // 文章内嵌广告 (In-Article Ad) - 用于博客文章内容中
  inArticle: {
    slot_id: '2018245511',
    name: '文章内嵌广告',
    type: 'adsbygoogle',
    format: 'fluid (in-article)',
    size: 'responsive'
  },

  // 多重广告 (AMP Multi Ad) - 用于页面底部
  multi: {
    slot_id: '3469113897',
    name: '多重广告',
    type: 'amp-ad',
    format: 'mcrspv',
    size: '100vw x 320 (responsive)'
  }
};

// 广告位放置位置说明
const AD_PLACEMENTS = {
  homepage: {
    display: 'Hero 区域下方,工具卡片网格上方',
    multi: '工具卡片网格下方,页脚上方'
  },
  blogIndex: {
    display: '博客 Hero 下方,标签筛选上方',
    multi: '文章列表下方,页脚上方'
  },
  blogArticle: {
    inArticle: '文章封面下方,文章内容开头前',
    multi: '文章内容结束后,文章页脚前'
  },
  toolPage: {
    display: '工具工作区下方,工具说明区域前',
    multi: '使用示例下方,页脚上方'
  }
};

// 移动端和桌面端的广告尺寸映射
const RESPONSIVE_SIZES = {
  desktop: [
    [728, 90],  // 大横幅
    [468, 60],  // 中横幅
    [320, 50],  // 小横幅
  ],
  mobile: [
    [320, 100], // 移动端大
    [320, 50],  // 移动端小
    [300, 250], // 中矩形
  ]
};
