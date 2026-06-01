/**
 * ad-slots.js - 广告位配置
 * 
 * 在此文件中定义所有广告位
 * slot-id 需要在 Google AdSense 后台获取
 */

const AD_SLOTS = {
  // 首页广告位
  homepage: {
    header: {
      slot_id: '0000000000', // 替换为实际 ID
      name: '首页顶部',
      size: '728x90' // Desktop
    },
    banner: {
      slot_id: '0000000001',
      name: '首页横幅',
      size: '728x90'
    },
    content: {
      slot_id: '0000000002',
      name: '首页内容间',
      size: '300x250'
    },
    sidebar: {
      slot_id: '0000000003',
      name: '首页侧边栏',
      size: '300x250'
    },
    footer: {
      slot_id: '0000000004',
      name: '首页底部',
      size: '728x90'
    }
  },
  
  // 工具页面广告位
  tool: {
    top: {
      slot_id: '0000000005',
      name: '工具页顶部',
      size: '728x90'
    },
    sidebar: {
      slot_id: '0000000006',
      name: '工具页侧边栏',
      size: '300x250'
    },
    bottom: {
      slot_id: '0000000007',
      name: '工具页底部',
      size: '728x90'
    }
  },

  // 文章页面广告位
  article: {
    header: {
      slot_id: '0000000008',
      name: '文章页顶部',
      size: '728x90'
    },
    inContent: {
      slot_id: '0000000009',
      name: '文章内容中',
      size: '300x250'
    },
    footer: {
      slot_id: '0000000010',
      name: '文章页底部',
      size: '728x90'
    }
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
