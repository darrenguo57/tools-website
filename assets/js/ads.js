/**
 * ads.js - Google AdSense 广告管理
 * 
 * 使用方法：
 * 1. 将下面的 'YOUR-PUBLISHER-ID' 替换为你的实际 ID
 * 2. 在需要显示广告的位置添加：<div class="ad-container" data-ad="slot-name"></div>
 * 3. 调用 Ads.init() 初始化广告
 */

const Ads = (() => {
  'use strict';

  // Google AdSense 发布商 ID
  const PUBLISHER_ID = '5246764554303000';
  const ADSENSE_SCRIPT = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${PUBLISHER_ID}`;

  let adsLoaded = false;

  /**
   * 加载 AdSense 脚本（只加载一次）
   */
  function loadAdsenseScript() {
    if (adsLoaded) return;
    
    // 检查是否已存在脚本
    if (document.querySelector(`script[src*="googlesyndication"]`)) {
      adsLoaded = true;
      return;
    }

    const script = document.createElement('script');
    script.src = ADSENSE_SCRIPT;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    adsLoaded = true;
  }

  /**
   * 初始化广告
   */
  function init() {
    // 只有在有广告容器时才加载
    const adContainers = document.querySelectorAll('.ad-container');
    if (adContainers.length > 0) {
      loadAdsenseScript();
      // 延迟触发广告加载
      setTimeout(() => {
        refreshAds();
      }, 100);
    }
  }

  /**
   * 刷新所有广告
   */
  function refreshAds() {
    if (typeof adsbygoogle !== 'undefined') {
      adsbygoogle.push({});
    }
  }

  /**
   * 加载特定广告位
   */
  function loadAd(slotName, slotId) {
    loadAdsenseScript();
    
    // 创建广告元素
    const container = document.querySelector(`[data-ad="${slotName}"]`);
    if (!container) return;

    const adDiv = document.createElement('ins');
    adDiv.className = 'adsbygoogle';
    adDiv.setAttribute('data-ad-client', `ca-pub-${PUBLISHER_ID}`);
    adDiv.setAttribute('data-ad-slot', slotId);
    adDiv.setAttribute('data-ad-format', 'auto');
    adDiv.setAttribute('data-full-width-responsive', 'true');
    
    container.appendChild(adDiv);
    
    if (typeof adsbygoogle !== 'undefined') {
      adsbygoogle.push({});
    }
  }

  return {
    init,
    refreshAds,
    loadAd,
    loadScript: loadAdsenseScript
  };
})();

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  Ads.init();
});
