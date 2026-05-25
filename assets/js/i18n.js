/**
 * i18n.js - 国际化模块
 * 加载翻译文件，提供翻译函数，支持自动翻译 DOM 元素
 */
const I18n = (() => {
  'use strict';

  const STORAGE_KEY = 'toolbox-lang';
  const DEFAULT_LANG = 'zh';
  const SUPPORTED_LANGS = ['en', 'zh'];

  let currentLang = DEFAULT_LANG;
  let translations = {};
  let listeners = [];

  /**
   * 获取翻译文件的基础路径
   * 自动根据当前脚本位置推断 locales 目录
   */
  function getBasePath() {
    const script = document.querySelector('script[src*="i18n.js"]');
    if (script) {
      const src = script.getAttribute('src');
      return src.substring(0, src.lastIndexOf('/assets/js/')) + '/locales';
    }
    return './locales';
  }

  /**
   * 加载指定语言的翻译文件
   * @param {string} lang - 语言代码
   * @returns {Promise<Object>} 翻译对象
   */
  async function loadTranslations(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
      console.warn(`[i18n] Unsupported language: ${lang}, falling back to ${DEFAULT_LANG}`);
      lang = DEFAULT_LANG;
    }

    try {
      const basePath = getBasePath();
      const response = await fetch(`${basePath}/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang}.json: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[i18n] Error loading translations for "${lang}":`, error);
      return {};
    }
  }

  /**
   * 根据点分隔的 key 从对象中获取嵌套值
   * @param {Object} obj - 源对象
   * @param {string} path - 点分隔路径，如 "nav.home"
   * @returns {string} 对应的翻译文本，未找到则返回 key 本身
   */
  function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : undefined;
    }, obj);
  }

  /**
   * 获取翻译文本
   * @param {string} key - 翻译键，支持点分隔路径如 "nav.home"
   * @param {Object} params - 可选的插值参数，如 { name: 'World' }
   * @returns {string} 翻译后的文本
   *
   * @example
   * t('nav.home')  // => '首页'
   * t('greeting', { name: 'World' })  // => 'Hello, World!'
   */
  function t(key, params = {}) {
    let text = getNestedValue(translations, key);

    if (text === undefined) {
      // 尝试从回退语言获取
      if (currentLang !== DEFAULT_LANG) {
        text = getNestedValue(translations, key);
      }
      // 仍然未找到则返回 key
      if (text === undefined) {
        console.warn(`[i18n] Missing translation for key: "${key}"`);
        return key;
      }
    }

    // 参数插值: {{param}}
    if (typeof text === 'string' && Object.keys(params).length > 0) {
      text = text.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    return text;
  }

  /**
   * 切换语言
   * @param {string} lang - 目标语言代码
   * @returns {Promise<void>}
   */
  async function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
      console.warn(`[i18n] Unsupported language: ${lang}`);
      return;
    }

    if (lang === currentLang && Object.keys(translations).length > 0) {
      return;
    }

    translations = await loadTranslations(lang);
    currentLang = lang;

    // 保存语言偏好
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // localStorage 不可用时静默失败
    }

    // 更新 HTML lang 属性
    document.documentElement.lang = lang;

    // 自动翻译所有带 data-i18n 属性的元素
    translatePage();

    // 更新语言切换按钮状态
    updateLangSwitcher();

    // 通知所有监听器
    listeners.forEach(fn => fn(lang));
  }

  /**
   * 获取当前语言
   * @returns {string} 当前语言代码
   */
  function getLang() {
    return currentLang;
  }

  /**
   * 获取支持的语言列表
   * @returns {string[]} 支持的语言代码数组
   */
  function getSupportedLangs() {
    return [...SUPPORTED_LANGS];
  }

  /**
   * 自动翻译页面中所有带 data-i18n 相关属性的元素
   */
  function translatePage() {
    // 翻译文本内容
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = t(key);
      if (text !== key) {
        el.textContent = text;
      }
    });

    // 翻译 placeholder 属性
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = t(key);
      if (text !== key) {
        el.placeholder = text;
      }
    });

    // 翻译 title 属性
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const text = t(key);
      if (text !== key) {
        el.title = text;
      }
    });

    // 翻译 aria-label 属性
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const text = t(key);
      if (text !== key) {
        el.setAttribute('aria-label', text);
      }
    });

    // 更新页面标题
    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      const key = titleEl.getAttribute('data-i18n');
      const text = t(key);
      if (text !== key) {
        document.title = text;
      }
    }
  }

  /**
   * 更新语言切换按钮的显示状态
   */
  function updateLangSwitcher() {
    document.querySelectorAll('[data-lang-switch]').forEach(btn => {
      const targetLang = btn.getAttribute('data-lang-switch');
      // 高亮当前语言按钮
      btn.classList.toggle('active', targetLang === currentLang);
      btn.setAttribute('aria-pressed', targetLang === currentLang);
    });
  }

  /**
   * 注册语言变更监听器
   * @param {Function} callback - 回调函数，接收当前语言代码作为参数
   * @returns {Function} 取消监听的函数
   */
  function onLangChange(callback) {
    if (typeof callback === 'function') {
      listeners.push(callback);
    }
    return () => {
      listeners = listeners.filter(fn => fn !== callback);
    };
  }

  /**
   * 初始化 i18n 模块
   * 自动检测并应用保存的语言偏好
   * @param {string} [fallbackLang] - 可选的回退语言
   * @returns {Promise<string>} 初始化完成后的当前语言代码
   */
  async function init(fallbackLang) {
    let savedLang = DEFAULT_LANG;

    // 1. 尝试从 localStorage 读取
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGS.includes(stored)) {
        savedLang = stored;
      }
    } catch (e) {
      // localStorage 不可用
    }

    // 2. 尝试从浏览器语言设置检测
    if (!localStorage.getItem(STORAGE_KEY)) {
      const browserLang = navigator.language || navigator.userLanguage || '';
      const shortLang = browserLang.split('-')[0].toLowerCase();
      if (SUPPORTED_LANGS.includes(shortLang)) {
        savedLang = shortLang;
      }
    }

    // 3. 使用传入的回退语言
    if (fallbackLang && SUPPORTED_LANGS.includes(fallbackLang)) {
      savedLang = fallbackLang;
    }

    // 加载翻译并应用
    await setLang(savedLang);

    // 绑定语言切换按钮事件
    document.querySelectorAll('[data-lang-switch]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetLang = btn.getAttribute('data-lang-switch');
        setLang(targetLang);
      });
    });

    return currentLang;
  }

  // 公开 API
  return {
    t,
    setLang,
    getLang,
    getSupportedLangs,
    init,
    translatePage,
    onLangChange
  };
})();
