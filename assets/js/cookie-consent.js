/**
 * Cookie Consent Banner - GDPR / CCPA 合规
 * Required for Google AdSense approval
 */
(function() {
  'use strict';
  
  const CONSENT_KEY = 'useeasytool_cookie_consent';
  const CONSENT_DATE_KEY = 'useeasytool_consent_date';
  
  // 检查是否已同意
  function hasConsent() {
    return localStorage.getItem(CONSENT_KEY) !== null;
  }
  
  // 获取保存的同意选项
  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem(CONSENT_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }
  
  // 保存同意
  function saveConsent(consent) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    localStorage.setItem(CONSENT_DATE_KEY, new Date().toISOString());
  }
  
  // 创建横幅 HTML
  function createBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.className = 'cookie-consent-banner';
    banner.innerHTML = `
      <div class="cookie-consent-content">
        <div class="cookie-consent-text">
          <p>We use cookies to enhance your experience, serve personalized ads, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
            <a href="privacy.html" class="cookie-consent-link">Learn more</a>
          </p>
        </div>
        <div class="cookie-consent-actions">
          <button class="cookie-btn cookie-btn-manage" id="cookieManageBtn">Manage</button>
          <button class="cookie-btn cookie-btn-necessary" id="cookieNecessaryBtn">Necessary Only</button>
          <button class="cookie-btn cookie-btn-accept" id="cookieAcceptBtn">Accept All</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
    
    // 绑定事件
    document.getElementById('cookieAcceptBtn').addEventListener('click', function() {
      saveConsent({ necessary: true, analytics: true, advertising: true });
      hideBanner();
      loadAdSense();
    });
    
    document.getElementById('cookieNecessaryBtn').addEventListener('click', function() {
      saveConsent({ necessary: true, analytics: false, advertising: false });
      hideBanner();
    });
    
    document.getElementById('cookieManageBtn').addEventListener('click', function() {
      showManageModal();
    });
  }
  
  function hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.style.opacity = '0';
      setTimeout(() => banner.remove(), 300);
    }
  }
  
  function showManageModal() {
    const modal = document.createElement('div');
    modal.id = 'cookie-manage-modal';
    modal.className = 'cookie-manage-modal';
    modal.innerHTML = `
      <div class="cookie-manage-overlay"></div>
      <div class="cookie-manage-dialog">
        <h3>Cookie Preferences</h3>
        <div class="cookie-option">
          <label>
            <input type="checkbox" checked disabled>
            <span>Necessary Cookies</span>
            <small>Required for the website to function properly.</small>
          </label>
        </div>
        <div class="cookie-option">
          <label>
            <input type="checkbox" id="cookieAnalytics" checked>
            <span>Analytics Cookies</span>
            <small>Help us understand how visitors interact with our website.</small>
          </label>
        </div>
        <div class="cookie-option">
          <label>
            <input type="checkbox" id="cookieAdvertising" checked>
            <span>Advertising Cookies</span>
            <small>Used to deliver personalized advertisements.</small>
          </label>
        </div>
        <div class="cookie-manage-actions">
          <button class="cookie-btn cookie-btn-necessary" id="cookieSavePrefs">Save Preferences</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('cookieSavePrefs').addEventListener('click', function() {
      const analytics = document.getElementById('cookieAnalytics').checked;
      const advertising = document.getElementById('cookieAdvertising').checked;
      saveConsent({ necessary: true, analytics, advertising });
      hideBanner();
      modal.remove();
      if (advertising) loadAdSense();
    });
    
    modal.querySelector('.cookie-manage-overlay').addEventListener('click', function() {
      modal.remove();
    });
  }
  
  function loadAdSense() {
    // 触发 AdSense 加载（如果存在 adsense-global.js）
    if (window.AdSenseGlobal && typeof window.AdSenseGlobal.init === 'function') {
      window.AdSenseGlobal.init();
    }
    // 触发自定义事件
    window.dispatchEvent(new Event('cookie-consent-granted'));
  }
  
  // 初始化
  function init() {
    if (hasConsent()) {
      const consent = getConsent();
      if (consent.advertising) {
        loadAdSense();
      }
      return;
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBanner);
    } else {
      createBanner();
    }
  }
  
  init();
})();
