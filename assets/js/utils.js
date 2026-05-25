/**
 * utils.js - 工具函数库
 * 提供通用的辅助函数
 */
const Utils = (() => {
  'use strict';

  /**
   * 复制文本到剪贴板，带 toast 提示
   * @param {string} text - 要复制的文本
   * @param {string} [successMsg] - 成功提示消息，默认使用 i18n 翻译
   * @returns {Promise<boolean>} 是否复制成功
   */
  async function copyToClipboard(text, successMsg) {
    if (!text && text !== '') {
      showToast(typeof I18n !== 'undefined' ? I18n.t('toast.inputRequired') : 'Please enter content', 'error');
      return false;
    }

    try {
      // 优先使用现代 Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // 回退方案：使用 execCommand
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      const msg = successMsg || (typeof I18n !== 'undefined' ? I18n.t('toast.copied') : 'Copied to clipboard');
      showToast(msg, 'success');
      return true;
    } catch (error) {
      console.error('[Utils] Copy failed:', error);
      showToast(typeof I18n !== 'undefined' ? I18n.t('toast.error') : 'Copy failed', 'error');
      return false;
    }
  }

  /**
   * 下载文件
   * @param {string|Blob} content - 文件内容（字符串或 Blob）
   * @param {string} filename - 文件名
   * @param {string} [type='text/plain'] - MIME 类型
   */
  function downloadFile(content, filename, type = 'text/plain') {
    try {
      let blob;

      if (content instanceof Blob) {
        blob = content;
      } else {
        blob = new Blob([content], { type });
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      // 清理
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);

      showToast(typeof I18n !== 'undefined' ? I18n.t('toast.downloadSuccess') : 'Download successful', 'success');
    } catch (error) {
      console.error('[Utils] Download failed:', error);
      showToast(typeof I18n !== 'undefined' ? I18n.t('toast.error') : 'Download failed', 'error');
    }
  }

  /**
   * 显示 Toast 提示消息
   * @param {string} message - 提示文本
   * @param {'success'|'error'|'info'} [type='info'] - 提示类型
   * @param {number} [duration=3000] - 显示时长（毫秒）
   */
  function showToast(message, type = 'info', duration = 3000) {
    // 确保 toast 容器存在
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // 图标映射
    const icons = {
      success: '\u2713',
      error: '\u2717',
      info: '\u2139'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${escapeHtml(message)}</span>
    `;

    // 基础样式
    toast.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      line-height: 1.4;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      pointer-events: auto;
      transform: translateX(100%);
      opacity: 0;
      transition: transform 0.3s ease, opacity 0.3s ease;
      max-width: 360px;
      word-break: break-word;
    `;

    // 类型颜色
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      info: '#3b82f6'
    };
    toast.style.backgroundColor = colors[type] || colors.info;

    container.appendChild(toast);

    // 触发入场动画
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });

    // 自动消失
    const timer = setTimeout(() => {
      removeToast(toast);
    }, duration);

    // 鼠标悬停暂停消失
    toast.addEventListener('mouseenter', () => {
      clearTimeout(timer);
    });

    toast.addEventListener('mouseleave', () => {
      setTimeout(() => {
        removeToast(toast);
      }, 1000);
    });
  }

  /**
   * 移除 toast 元素
   * @param {HTMLElement} toast - toast DOM 元素
   */
  function removeToast(toast) {
    if (!toast || !toast.parentNode) return;

    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  /**
   * 格式化文件大小
   * @param {number} bytes - 字节数
   * @param {number} [decimals=2] - 小数位数
   * @returns {string} 格式化后的字符串，如 "1.5 MB"
   */
  function formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';
    if (bytes < 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const index = Math.min(i, units.length - 1);

    return parseFloat((bytes / Math.pow(k, index)).toFixed(decimals)) + ' ' + units[index];
  }

  /**
   * 防抖函数
   * @param {Function} fn - 要防抖的函数
   * @param {number} delay - 延迟时间（毫秒）
   * @returns {Function} 防抖后的函数
   */
  function debounce(fn, delay) {
    let timer = null;

    function debounced(...args) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }

    // 提供取消方法
    debounced.cancel = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    return debounced;
  }

  /**
   * 生成唯一 ID
   * @param {string} [prefix=''] - ID 前缀
   * @returns {string} 唯一标识符
   */
  function generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return prefix ? `${prefix}_${timestamp}${randomPart}` : `${timestamp}${randomPart}`;
  }

  /**
   * HTML 转义，防止 XSS 攻击
   * @param {string} str - 要转义的字符串
   * @returns {string} 转义后的安全字符串
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
      '/': '&#x2F;',
      '`': '&#x60;'
    };
    return str.replace(/[&<>"'`/]/g, char => map[char]);
  }

  // 公开 API
  return {
    copyToClipboard,
    downloadFile,
    showToast,
    formatFileSize,
    debounce,
    generateId,
    escapeHtml
  };
})();
