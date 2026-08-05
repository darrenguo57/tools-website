/**
 * adsense-global.js - Google AdSense 全站自动广告集成
 * 
 * 集成方式：自动广告 (Auto Ads) - 推荐
 * Google AI 会自动在最佳位置插入广告
 */

const AdSenseGlobal = (() => {
  'use strict';

  // Google AdSense 发布商 ID
  const PUBLISHER_ID = 'ca-pub-5246764554303000';
  
  // 广告配置
  const CONFIG = {
    // 自动广告配置
    autoAds: {
      // 是否启用自动广告
      enabled: true,
      // 广告类型
      formats: {
        display: true,      // 展示广告
        anchor: true,       // 锚定广告（页面底部）
        vignette: true,     // 插页广告（页面切换时）
        inPage: true,       // 页面内广告
        multiplex: true     // 相关广告
      }
    },
    
    // 手动广告位（可选，作为补充）
    // 如需使用手动广告位，请在 Google AdSense 后台创建广告单元，
    // 获取真实 Slot ID 后替换下面的占位符
    manualAds: {
      // 首页顶部横幅
      homepageHeader: {
        slot: 'SLOT_ID_1', // TODO: 替换为 AdSense 后台获取的真实 Slot ID
        size: '728x90',
        responsive: true
      },
      // 工具页侧边栏
      toolSidebar: {
        slot: 'SLOT_ID_2', // TODO: 替换为 AdSense 后台获取的真实 Slot ID
        size: '300x250',
        responsive: true
      },
      // 内容页底部
      contentFooter: {
        slot: 'SLOT_ID_3', // TODO: 替换为 AdSense 后台获取的真实 Slot ID
        size: '728x90',
        responsive: true
      }
    }
  };

  let scriptLoaded = false;

  /**
   * 加载 AdSense 脚本（自动广告模式）
   */
  function loadAutoAdsScript() {
    if (scriptLoaded) return;
    
    // 检查是否已加载
    if (document.querySelector('script[data-ad-client]')) {
      scriptLoaded = true;
      return;
    }

    // 创建 AdSense 脚本
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${PUBLISHER_ID.replace('ca-pub-', '')}`;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-ad-client', PUBLISHER_ID);
    script.setAttribute('data-auto-ads', 'true');
    
    script.onload = () => {
      console.log('[AdSense] Auto ads script loaded');
      scriptLoaded = true;
      
      // 配置自动广告
      configureAutoAds();
    };
    
    script.onerror = () => {
      console.error('[AdSense] Failed to load script');
    };

    document.head.appendChild(script);
  }

  /**
   * 配置自动广告
   */
  function configureAutoAds() {
    if (typeof adsbygoogle !== 'undefined') {
      // 启用自动广告
      adsbygoogle.push({
        google_ad_client: PUBLISHER_ID,
        enable_page_level_ads: true
      });
      
      console.log('[AdSense] Auto ads configured');
    }
  }

  /**
   * 插入手动广告位（可选补充）
   */
  function insertManualAd(containerId, slotId, format = 'auto') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`[AdSense] Container #${containerId} not found`);
      return;
    }

    // 创建广告元素
    const adElement = document.createElement('ins');
    adElement.className = 'adsbygoogle';
    adElement.style.display = 'block';
    adElement.setAttribute('data-ad-client', PUBLISHER_ID);
    adElement.setAttribute('data-ad-slot', slotId);
    adElement.setAttribute('data-ad-format', format);
    adElement.setAttribute('data-full-width-responsive', 'true');
    
    container.appendChild(adElement);
    
    // 触发广告加载
    if (typeof adsbygoogle !== 'undefined') {
      adsbygoogle.push({});
    }
  }

  /**
   * 初始化全站广告
   */
  function init() {
    // 延迟加载，避免影响页面性能
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(loadAutoAdsScript, 1000);
      });
    } else {
      setTimeout(loadAutoAdsScript, 1000);
    }
  }

  /**
   * 检查广告是否被屏蔽
   */
  function checkAdBlocker() {
    return new Promise((resolve) => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      document.body.appendChild(testAd);
      
      setTimeout(() => {
        const isBlocked = testAd.offsetHeight === 0;
        document.body.removeChild(testAd);
        resolve(isBlocked);
      }, 100);
    });
  }

  return {
    init,
    insertManualAd,
    checkAdBlocker,
    CONFIG
  };
})();

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  AdSenseGlobal.init();
  
  // 可选：检测广告屏蔽器
  AdSenseGlobal.checkAdBlocker().then((blocked) => {
    if (blocked) {
      console.log('[AdSense] Ad blocker detected');
      // 可以在这里显示提示用户关闭广告屏蔽器的消息
    }
  });
});
