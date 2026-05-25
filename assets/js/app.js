/**
 * app.js - 主应用逻辑
 * 负责 DOMContentLoaded 初始化、主题切换、搜索、侧边栏、移动端菜单等核心功能
 */
const App = (() => {
  'use strict';

  // ========== 常量 ==========
  const THEME_STORAGE_KEY = 'toolbox-theme';
  const SIDEBAR_STORAGE_KEY = 'toolbox-sidebar-collapsed';

  // ========== 状态 ==========
  let currentCategory = 'all';
  let searchQuery = '';

  // ========== 初始化 ==========

  /**
   * 应用入口：DOMContentLoaded 时调用
   */
  async function init() {
    initTheme();
    await initI18n();
    initSearch();
    initSidebar();
    initMobileMenu();
    initToolCards();
    generateBreadcrumb();
    initScrollEffects();
  }

  // ========== 国际化 ==========

  /**
   * 初始化国际化模块
   */
  async function initI18n() {
    if (typeof I18n !== 'undefined') {
      await I18n.init();
    }
  }

  // ========== 主题切换 ==========

  /**
   * 初始化主题：读取 localStorage，应用 dark 类
   */
  function initTheme() {
    const savedTheme = getStoredTheme();
    applyTheme(savedTheme);

    // 绑定主题切换按钮
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    });
  }

  /**
   * 获取存储的主题偏好
   * @returns {'dark'|'light'} 主题值
   */
  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch (e) {
      // localStorage 不可用
    }

    // 检测系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * 应用主题到页面
   * @param {'dark'|'light'} theme - 主题值
   */
  function applyTheme(theme) {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 更新主题切换按钮状态
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-label', isDark
        ? (typeof I18n !== 'undefined' ? I18n.t('theme.light') : 'Light Mode')
        : (typeof I18n !== 'undefined' ? I18n.t('theme.dark') : 'Dark Mode')
      );
      btn.classList.toggle('active', isDark);
    });

    // 更新 meta theme-color（如果有）
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a2e' : '#ffffff');
    }
  }

  /**
   * 切换主题
   */
  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';

    applyTheme(newTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      // 静默失败
    }
  }

  // ========== 搜索功能 ==========

  /**
   * 初始化搜索功能
   */
  function initSearch() {
    const searchInput = document.querySelector('[data-search-input]');
    if (!searchInput) return;

    // 使用防抖处理搜索输入
    const debouncedSearch = Utils.debounce((query) => {
      searchQuery = query.trim().toLowerCase();
      filterToolCards();
    }, 300);

    searchInput.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });

    // 支持 Esc 清空搜索
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchQuery = '';
        filterToolCards();
        searchInput.blur();
      }
    });

    // 支持 Ctrl/Cmd + K 聚焦搜索框
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  /**
   * 根据搜索关键词和分类筛选工具卡片
   */
  function filterToolCards() {
    const cards = document.querySelectorAll('[data-tool-card]');
    let visibleCount = 0;

    cards.forEach(card => {
      const title = (card.getAttribute('data-tool-title') || '').toLowerCase();
      const description = (card.getAttribute('data-tool-desc') || '').toLowerCase();
      const category = (card.getAttribute('data-tool-category') || '').toLowerCase();
      const keywords = (card.getAttribute('data-tool-keywords') || '').toLowerCase();

      // 分类筛选
      const categoryMatch = currentCategory === 'all' || category === currentCategory;

      // 搜索匹配（支持中英文）
      const searchMatch = !searchQuery
        || title.includes(searchQuery)
        || description.includes(searchQuery)
        || keywords.includes(searchQuery);

      const isVisible = categoryMatch && searchMatch;

      card.style.display = isVisible ? '' : 'none';
      card.classList.toggle('hidden', !isVisible);

      if (isVisible) {
        visibleCount++;
      }
    });

    // 显示/隐藏无结果提示
    updateNoResults(visibleCount);
  }

  /**
   * 更新无搜索结果提示
   * @param {number} count - 可见卡片数量
   */
  function updateNoResults(count) {
    const noResults = document.querySelector('[data-no-results]');
    if (noResults) {
      noResults.style.display = count === 0 ? '' : 'none';
    }
  }

  // ========== 侧边栏分类筛选 ==========

  /**
   * 初始化侧边栏分类筛选功能
   */
  function initSidebar() {
    const categoryBtns = document.querySelectorAll('[data-category]');

    categoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const category = btn.getAttribute('data-category');
        setActiveCategory(category);
      });
    });

    // 恢复侧边栏折叠状态
    restoreSidebarState();

    // 侧边栏折叠/展开
    const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', toggleSidebar);
    }
  }

  /**
   * 设置当前活跃的分类
   * @param {string} category - 分类标识
   */
  function setActiveCategory(category) {
    currentCategory = category;

    // 更新按钮高亮状态
    document.querySelectorAll('[data-category]').forEach(btn => {
      const btnCategory = btn.getAttribute('data-category');
      btn.classList.toggle('active', btnCategory === category);
    });

    // 筛选卡片
    filterToolCards();

    // 移动端自动关闭侧边栏
    if (window.innerWidth < 768) {
      closeMobileMenu();
    }
  }

  /**
   * 切换侧边栏折叠状态
   */
  function toggleSidebar() {
    const sidebar = document.querySelector('[data-sidebar]');
    if (!sidebar) return;

    const isCollapsed = sidebar.classList.toggle('collapsed');

    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, isCollapsed ? 'true' : 'false');
    } catch (e) {
      // 静默失败
    }
  }

  /**
   * 恢复侧边栏折叠状态
   */
  function restoreSidebarState() {
    try {
      const isCollapsed = localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
      const sidebar = document.querySelector('[data-sidebar]');
      if (sidebar && isCollapsed) {
        sidebar.classList.add('collapsed');
      }
    } catch (e) {
      // 静默失败
    }
  }

  // ========== 移动端汉堡菜单 ==========

  /**
   * 初始化移动端汉堡菜单
   */
  function initMobileMenu() {
    const hamburger = document.querySelector('[data-mobile-menu-toggle]');
    const overlay = document.querySelector('[data-mobile-overlay]');

    if (hamburger) {
      hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMobileMenu();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', closeMobileMenu);
    }

    // 窗口大小变化时自动关闭移动菜单
    window.addEventListener('resize', Utils.debounce(() => {
      if (window.innerWidth >= 768) {
        closeMobileMenu();
      }
    }, 150));
  }

  /**
   * 切换移动端菜单
   */
  function toggleMobileMenu() {
    const sidebar = document.querySelector('[data-sidebar]');
    const overlay = document.querySelector('[data-mobile-overlay]');
    const hamburger = document.querySelector('[data-mobile-menu-toggle]');

    if (!sidebar) return;

    const isOpen = sidebar.classList.contains('mobile-open');

    if (isOpen) {
      closeMobileMenu();
    } else {
      sidebar.classList.add('mobile-open');
      if (overlay) overlay.classList.add('active');
      if (hamburger) {
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * 关闭移动端菜单
   */
  function closeMobileMenu() {
    const sidebar = document.querySelector('[data-sidebar]');
    const overlay = document.querySelector('[data-mobile-overlay]');
    const hamburger = document.querySelector('[data-mobile-menu-toggle]');

    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
    if (hamburger) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  // ========== 工具卡片 ==========

  /**
   * 初始化工具卡片点击跳转
   */
  function initToolCards() {
    document.querySelectorAll('[data-tool-card]').forEach(card => {
      card.addEventListener('click', (e) => {
        // 避免点击内部链接或按钮时触发跳转
        if (e.target.closest('a') || e.target.closest('button')) {
          return;
        }

        const url = card.getAttribute('data-tool-url');
        if (url) {
          window.location.href = url;
        }
      });

      // 键盘可访问性
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'link');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // ========== 面包屑导航 ==========

  /**
   * 根据当前页面路径生成面包屑导航
   */
  function generateBreadcrumb() {
    const breadcrumbContainer = document.querySelector('[data-breadcrumb]');
    if (!breadcrumbContainer) return;

    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);

    // 移除末尾的 .html 后缀
    const cleanParts = parts.map(p => p.replace(/\.html?$/, ''));

    const crumbs = [];

    // 首页
    crumbs.push({
      label: typeof I18n !== 'undefined' ? I18n.t('breadcrumb.home') : 'Home',
      href: getBaseHref()
    });

    // 构建路径层级
    let accumulatedPath = getBaseHref();
    cleanParts.forEach((part, index) => {
      accumulatedPath += part + '/';
      const isLast = index === cleanParts.length - 1;

      // 尝试从 data 属性获取友好的面包屑名称
      const friendlyName = getBreadcrumbName(part);

      crumbs.push({
        label: friendlyName || part,
        href: isLast ? null : accumulatedPath,
        isLast
      });
    });

    // 渲染面包屑
    renderBreadcrumb(breadcrumbContainer, crumbs);
  }

  /**
   * 获取基础路径
   * @returns {string}
   */
  function getBaseHref() {
    const base = document.querySelector('base');
    if (base) return base.getAttribute('href') || '/';
    return '/';
  }

  /**
   * 获取面包屑的友好名称
   * @param {string} slug - URL 路径片段
   * @returns {string|null} 友好名称
   */
  function getBreadcrumbName(slug) {
    // 尝试从页面 data 属性获取
    const pageNameEl = document.querySelector(`[data-page-name="${slug}"]`);
    if (pageNameEl) {
      return pageNameEl.textContent.trim();
    }

    // 尝试从页面 title 获取
    const title = document.title;
    if (title) {
      return title;
    }

    return null;
  }

  /**
   * 渲染面包屑导航
   * @param {HTMLElement} container - 面包屑容器
   * @param {Array<{label: string, href: string|null, isLast?: boolean}>} crumbs - 面包屑数据
   */
  function renderBreadcrumb(container, crumbs) {
    container.innerHTML = '';

    crumbs.forEach((crumb, index) => {
      // 分隔符
      if (index > 0) {
        const separator = document.createElement('span');
        separator.className = 'breadcrumb-separator';
        separator.setAttribute('aria-hidden', 'true');
        separator.textContent = '/';
        container.appendChild(separator);
      }

      if (crumb.isLast) {
        // 当前页（不可点击）
        const span = document.createElement('span');
        span.className = 'breadcrumb-item active';
        span.setAttribute('aria-current', 'page');
        span.textContent = crumb.label;
        container.appendChild(span);
      } else {
        // 链接
        const link = document.createElement('a');
        link.className = 'breadcrumb-item';
        link.href = crumb.href;
        link.textContent = crumb.label;
        container.appendChild(link);
      }
    });
  }

  // ========== 滚动效果 ==========

  /**
   * 初始化滚动相关效果
   */
  function initScrollEffects() {
    // 滚动时自动隐藏/显示头部
    let lastScrollY = 0;
    const header = document.querySelector('[data-header]');

    if (header) {
      window.addEventListener('scroll', Utils.debounce(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          header.classList.add('header-hidden');
        } else {
          header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
      }, 10), { passive: true });
    }

    // 回到顶部按钮
    const backToTop = document.querySelector('[data-back-to-top]');
    if (backToTop) {
      window.addEventListener('scroll', Utils.debounce(() => {
        if (window.scrollY > 300) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }, 50), { passive: true });

      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ========== DOMContentLoaded 绑定 ==========

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM 已就绪（例如脚本在 body 末尾加载）
    init();
  }

  // 公开 API（供外部调用）
  return {
    init,
    initTheme,
    toggleTheme,
    filterToolCards,
    setActiveCategory,
    generateBreadcrumb,
    toggleMobileMenu,
    closeMobileMenu
  };
})();
