/**
 * app.js - Main Application Logic
 * Handles theme toggle, language switch, search, sidebar filtering,
 * mobile menu, and back-to-top functionality.
 * Uses IIFE pattern for encapsulation.
 */
const App = (() => {
  'use strict';

  // ========== Constants ==========
  const THEME_STORAGE_KEY = 'toolbox-theme';
  const DEBOUNCE_DELAY = 300;
  const SCROLL_THRESHOLD = 300;
  const MOBILE_BREAKPOINT = 768;

  // ========== State ==========
  let currentCategory = 'all';
  let searchQuery = '';

  // ========== DOM Cache ==========
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // ========== Initialization ==========

  /**
   * Application entry point, called on DOMContentLoaded
   */
  function init() {
    initTheme();
    initI18n();
    initSearch();
    initSidebar();
    initMobileMenu();
    initBackToTop();
  }

  // ========== Theme Toggle ==========

  /**
   * Initialize theme: read from localStorage, apply dark class to <html>
   */
  function initTheme() {
    const savedTheme = getStoredTheme();
    applyTheme(savedTheme);

    // Bind theme toggle button
    const themeToggle = $('#themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    }
  }

  /**
   * Get stored theme preference from localStorage
   * Falls back to system preference, then 'light'
   * @returns {'dark'|'light'} theme value
   */
  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch (e) {
      // localStorage unavailable, silent fail
    }

    // Detect system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Apply theme to <html> element and update toggle button
   * @param {'dark'|'light'} theme - theme value
   */
  function applyTheme(theme) {
    const html = document.documentElement;

    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Update theme toggle button aria-label and icon visibility
    const themeToggle = $('#themeToggle');
    if (themeToggle) {
      const isDark = theme === 'dark';
      themeToggle.setAttribute('aria-label', isDark
        ? (typeof I18n !== 'undefined' ? I18n.t('theme.light') : 'Light Mode')
        : (typeof I18n !== 'undefined' ? I18n.t('theme.dark') : 'Dark Mode')
      );

      // Toggle icon visibility (light icon shown in dark mode, dark icon in light mode)
      const lightIcon = themeToggle.querySelector('.theme-icon-light');
      const darkIcon = themeToggle.querySelector('.theme-icon-dark');
      if (lightIcon) lightIcon.style.display = isDark ? 'none' : '';
      if (darkIcon) darkIcon.style.display = isDark ? '' : 'none';
    }

    // Update meta theme-color if present
    const metaThemeColor = $('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0B0F1A' : '#ffffff');
    }
  }

  /**
   * Toggle between dark and light themes
   */
  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';

    applyTheme(newTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      // silent fail
    }
  }

  // ========== Language Toggle ==========

  /**
   * Initialize i18n module and bind language toggle button
   */
  function initI18n() {
    if (typeof I18n !== 'undefined' && typeof I18n.init === 'function') {
      I18n.init();
    }

    // Support both homepage (#langToggle) and tool pages (.lang-btn)
    const langToggle = $('#langToggle') || $('.lang-btn');

    if (langToggle) {
      langToggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof I18n !== 'undefined' && typeof I18n.setLang === 'function' && typeof I18n.getLang === 'function') {
          const currentLang = I18n.getLang();
          I18n.setLang(currentLang === 'en' ? 'zh' : 'en');
        }
        // Update button text to show current language
        updateLangLabel();
      });

      // Set initial label
      updateLangLabel();
    }

    // Also bind theme toggle for tool pages
    const themeToggle = $('#themeToggle') || $('.theme-btn');
    if (themeToggle) {
      themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    }
  }

  /**
   * Update language toggle button text to reflect current language
   */
  function updateLangLabel() {
    // Support both homepage (#langToggle) and tool pages (.lang-btn with .lang-label span)
    const langToggle = $('#langToggle') || $('.lang-btn');

    if (!langToggle) return;

    const currentLang = (typeof I18n !== 'undefined' && typeof I18n.getLang === 'function')
      ? I18n.getLang()
      : 'en';

    // Check for .lang-label span inside button (tool pages)
    const label = langToggle.querySelector('.lang-label');
    if (label) {
      label.textContent = currentLang === 'zh' ? 'EN' : '中文';
    } else {
      // Direct text content (homepage)
      langToggle.textContent = currentLang === 'zh' ? 'EN' : '中文';
    }
  }

  // ========== Search ==========

  /**
   * Initialize search with debounced input handler
   */
  function initSearch() {
    const searchInput = $('#searchInput');
    if (!searchInput) return;

    // Debounced search handler
    const debouncedSearch = (typeof Utils !== 'undefined' && typeof Utils.debounce === 'function')
      ? Utils.debounce((query) => {
          searchQuery = query.trim().toLowerCase();
          filterToolCards();
        }, DEBOUNCE_DELAY)
      : (query) => {
          searchQuery = query.trim().toLowerCase();
          filterToolCards();
        };

    searchInput.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });

    // Clear search on Escape
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchQuery = '';
        filterToolCards();
        searchInput.blur();
      }
    });

    // Focus search on Ctrl/Cmd + K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  /**
   * Filter tool cards based on current search query and active category
   */
  function filterToolCards() {
    const cards = $$('.tools-grid .tool-card');
    let visibleCount = 0;

    cards.forEach(card => {
      // Read data attributes for matching
      const nameEn = (card.getAttribute('data-name-en') || '').toLowerCase();
      const nameZh = (card.getAttribute('data-name-zh') || '').toLowerCase();
      const category = (card.getAttribute('data-category') || '').toLowerCase();

      // Category filter
      const categoryMatch = currentCategory === 'all' || category === currentCategory;

      // Search filter (match against both English and Chinese names)
      const searchMatch = !searchQuery
        || nameEn.includes(searchQuery)
        || nameZh.includes(searchQuery);

      const isVisible = categoryMatch && searchMatch;

      card.style.display = isVisible ? '' : 'none';

      if (isVisible) {
        visibleCount++;
      }
    });

    // Show/hide no-results message
    updateNoResults(visibleCount);
  }

  /**
   * Toggle no-results element visibility
   * @param {number} count - number of visible cards
   */
  function updateNoResults(count) {
    const noResults = $('#noResults') || $('[data-no-results]');
    if (noResults) {
      noResults.style.display = count === 0 ? '' : 'none';
    }
  }

  // ========== Sidebar Category Filter ==========

  /**
   * Initialize sidebar category click handlers
   */
  function initSidebar() {
    const categoryItems = $$('.sidebar-item[data-category]');

    categoryItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const category = item.getAttribute('data-category');
        setActiveCategory(category);
      });
    });
  }

  /**
   * Set the active category and re-filter cards
   * @param {string} category - category identifier
   */
  function setActiveCategory(category) {
    currentCategory = category;

    // Update active state on sidebar items
    $$('.sidebar-item[data-category]').forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      item.classList.toggle('active', itemCategory === category);
    });

    // Re-filter cards (combines with search)
    filterToolCards();

    // Auto-close mobile sidebar after selecting a category
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      closeMobileMenu();
    }
  }

  // ========== Mobile Menu ==========

  /**
   * Initialize mobile hamburger menu and overlay
   */
  function initMobileMenu() {
    const hamburger = $('#hamburgerBtn');
    const overlay = $('#sidebarOverlay');

    if (hamburger) {
      hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMobileMenu();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', closeMobileMenu);
    }

    // Auto-close mobile menu on window resize past breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth >= MOBILE_BREAKPOINT) {
        closeMobileMenu();
      }
    });
  }

  /**
   * Toggle mobile sidebar open/close state
   */
  function toggleMobileMenu() {
    const sidebar = $('#sidebar');
    const overlay = $('#sidebarOverlay');
    const hamburger = $('#hamburgerBtn');

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
   * Close mobile sidebar and reset overlay
   */
  function closeMobileMenu() {
    const sidebar = $('#sidebar');
    const overlay = $('#sidebarOverlay');
    const hamburger = $('#hamburgerBtn');

    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
    if (hamburger) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  // ========== Back to Top ==========

  /**
   * Initialize back-to-top button visibility on scroll
   */
  function initBackToTop() {
    const backToTop = $('#backToTop') || $('[data-back-to-top]');
    if (!backToTop) return;

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    // Smooth scroll to top on click
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========== DOMContentLoaded Binding ==========

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready (e.g. script loaded at end of body)
    init();
  }

  // ========== Public API ==========
  return {
    init,
    initTheme,
    toggleTheme,
    filterToolCards,
    setActiveCategory,
    toggleMobileMenu,
    closeMobileMenu
  };
})();
