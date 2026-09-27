/**
 * @file
 * Shared header: search panel, menu drawer and AR/EN toggle.
 */
(function (Drupal, once) {
  'use strict';

  // The language toggle only swaps the header/footer chrome strings and the
  // page direction; menu titles come from Drupal and are not translated here.
  var copy = {
    en: {
      search: 'Search',
      searchPlaceholder: 'Search',
      menu: 'Open menu',
      close: 'Close menu',
      quickLinks: 'Quick LINKS',
      copyright: '© ' + new Date().getFullYear() + ' Sultan Qaboos University. All Rights Reserved.'
    },
    ar: {
      search: 'بحث',
      searchPlaceholder: 'بحث',
      menu: 'فتح القائمة',
      close: 'إغلاق القائمة',
      quickLinks: 'روابط سريعة',
      copyright: '© ' + new Date().getFullYear() + ' جامعة السلطان قابوس. جميع الحقوق محفوظة.'
    }
  };
  var storageKey = 'squ-lang';

  Drupal.behaviors.squChrome = {
    attach: function (context) {
      once('squ-chrome', '[data-squ-header]', context).forEach(function (header) {
        var searchToggle = header.querySelector('#squ-search-toggle');
        var searchPanel = header.querySelector('#squ-search-panel');
        var searchForm = header.querySelector('#squ-search-form');
        var searchInput = header.querySelector('#squ-search-input');
        var menuToggle = header.querySelector('#squ-menu-toggle');
        var langToggle = header.querySelector('#squ-lang-toggle');
        var langLabel = header.querySelector('#squ-lang-label');
        var drawer = document.getElementById('squ-drawer');
        var backdrop = document.getElementById('squ-backdrop');
        var drawerClose = document.getElementById('squ-drawer-close');
        var root = document.documentElement;
        var lang = 'en';

        try {
          lang = window.localStorage.getItem(storageKey) === 'ar' ? 'ar' : 'en';
        }
        catch (e) {
          // Storage can be blocked; fall back to English.
        }

        function applyLang() {
          var strings = copy[lang];
          root.lang = lang;
          root.dir = lang === 'ar' ? 'rtl' : 'ltr';
          document.querySelectorAll('.squ-site-header [data-i18n], .squ-drawer [data-i18n], .squ-site-footer [data-i18n]').forEach(function (el) {
            var value = strings[el.dataset.i18n];
            if (value) {
              el.textContent = value;
            }
          });
          document.querySelectorAll('.squ-site-header [data-i18n-placeholder]').forEach(function (el) {
            var value = strings[el.dataset.i18nPlaceholder];
            if (value) {
              el.placeholder = value;
              el.setAttribute('aria-label', value);
            }
          });
          searchToggle.setAttribute('aria-label', strings.search);
          menuToggle.setAttribute('aria-label', strings.menu);
          if (drawerClose) {
            drawerClose.setAttribute('aria-label', strings.close);
          }
          langLabel.textContent = lang === 'ar' ? 'EN' : 'AR';
          langToggle.setAttribute('aria-label', lang === 'ar' ? 'English' : 'العربية');
        }

        function setSearch(open) {
          searchPanel.hidden = !open;
          searchToggle.setAttribute('aria-expanded', String(open));
          if (open) {
            searchInput.focus();
          }
        }

        function setMenu(open) {
          if (!drawer) {
            return;
          }
          drawer.classList.toggle('open', open);
          drawer.inert = !open;
          drawer.setAttribute('aria-hidden', String(!open));
          menuToggle.setAttribute('aria-expanded', String(open));
          backdrop.hidden = !open;
          document.body.style.overflow = open ? 'hidden' : '';
          if (open) {
            drawerClose.focus();
          }
          else if (drawer.contains(document.activeElement)) {
            menuToggle.focus();
          }
        }

        searchToggle.addEventListener('click', function () {
          setSearch(searchPanel.hidden);
        });
        searchForm.addEventListener('submit', function (event) {
          if (!searchForm.getAttribute('action') || !searchInput.value.trim()) {
            event.preventDefault();
          }
        });

        menuToggle.addEventListener('click', function () {
          setMenu(!drawer.classList.contains('open'));
        });
        if (drawerClose) {
          drawerClose.addEventListener('click', function () {
            setMenu(false);
          });
        }
        if (backdrop) {
          backdrop.addEventListener('click', function () {
            setMenu(false);
          });
        }
        if (drawer) {
          drawer.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
              setMenu(false);
            });
          });
        }

        langToggle.addEventListener('click', function () {
          lang = lang === 'en' ? 'ar' : 'en';
          try {
            window.localStorage.setItem(storageKey, lang);
          }
          catch (e) {
            // Ignore; the choice just won't persist across pages.
          }
          applyLang();
        });

        document.addEventListener('keydown', function (event) {
          if (event.key === 'Escape') {
            setSearch(false);
            setMenu(false);
          }
        });

        if (lang === 'ar') {
          applyLang();
        }
      });
    }
  };
})(Drupal, once);
