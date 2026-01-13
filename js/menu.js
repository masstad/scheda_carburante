/* =====================================================
   menu.js — AUTO-INJECTION (IDENTICO a index.html)
   ===================================================== */

(function () {
  'use strict';

  // Evita doppia inizializzazione
  if (window.__MENU_AUTO_INIT__) return;
  window.__MENU_AUTO_INIT__ = true;

  /* =========================
     CSS (copiato da index.html)
     + 2 FIX:
       - .menu-btn.menu-fixed per pagine senza topbar grid
       - hide #menuBtn quando drawer/frame aperti
     ========================= */
  const CSS = `
  /* Drawer look&feel (come index.html) */
  #drawer{
    position:fixed; inset:0 35% 0 0; max-width:280px;
    transform:translateX(-105%); transition:transform .2s ease; z-index:9998; padding:16px;
    background: var(--surface);
    border-right: 1px solid var(--border);
  }
  #drawer a, #drawer button.linklike{
    text-decoration: none;
    color: inherit;
    display: inline-block;
    padding: 8px 0;
    background: none;
    border: none;
    font: inherit;
    cursor: pointer;
    text-align: left;
    width: 100%;
  }
  #drawer hr{ border:0; border-top:1px solid var(--divider); margin:10px 0; }
  #drawerClose{
    position: absolute;
    left: 12px; bottom: 12px;
    width: 44px; height: 44px;
    display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid var(--border); border-radius: 999px;
    background: var(--surface); color: var(--text); font-size: 18px;
    cursor: pointer; box-shadow: var(--shadow);
  }
  #drawerClose:active{ transform: translateY(1px); }
  #drawerClose:focus-visible{ outline: 2px solid #2684ff; outline-offset: 2px; }

  /* Backdrop */
  #backdrop{ position:fixed; inset:0; background:rgba(0,0,0,.15); display:none; z-index:9997; }

  /* FAB hamburger in basso (identico) */
  .fab-menu{
    position: fixed;
    left: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom));
    width: 48px; height: 48px;
    display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid var(--border); border-radius: 999px; background: var(--surface);
    color: var(--text);
    font-size: 22px; line-height: 1; cursor: pointer;
    box-shadow: var(--shadow);
    z-index: 10000;
    transition: opacity .15s ease, transform .15s ease;
  }
  .fab-menu:active{ transform: translateY(1px); }
  .fab-menu:focus-visible{ outline: 2px solid #2684ff; outline-offset: 2px; }
  body.drawer-open .fab-menu, body.frame-open .fab-menu{
    opacity: 0; pointer-events: none; transform: translateY(8px);
  }

  /* MENU BUTTON (come index.html) */
  .menu-btn{
    background:none;
    border:none;
    font-size:22px;
    line-height:1;
    padding:8px 12px;
    cursor:pointer;
    color: var(--text);
  }

  /* FIX #1: quando non posso inserirlo nella topbar grid, lo rendo fixed
     ma con lo stesso look della .menu-btn (niente cerchio). */
  .menu-btn.menu-fixed{
    position: fixed;
    top: calc(8px + env(safe-area-inset-top));
    left: 8px;
    z-index: 10000;
  }

  /* FIX #2: quando il drawer è aperto, il bottone top-left deve sparire
     (come in index.html: non deve restare visibile sopra il drawer). */
  body.drawer-open #menuBtn,
  body.frame-open  #menuBtn{
    opacity: 0;
    pointer-events: none;
  }
  `;

  function injectCssOnce() {
    if (document.getElementById('menuAutoCss')) return;
    const st = document.createElement('style');
    st.id = 'menuAutoCss';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* =========================
     MARKUP (identico a index.html)
     ========================= */
  const MENU_HTML = `
    <nav id="drawer">
      <h3 style="margin-top:0;">Menu</h3>
      <ul style="list-style:none;padding:0;margin:0;">
         <li><a id="goHome" href="#">Home</a></li>
         <hr>
         <li><a id="goRifornimento" href="#">Rifornimento</a></li>
         <hr>
        <li><a id="goLista" href="#">Lista movimenti</a></li>
        <hr>
        <li><a id="goScheda" href="#">Scheda carburante</a></li>
        <hr>
        <li><a id="goForecast" href="#">Forecast Km</a></li>
        <hr>
        <li><a id="goImpianti" href="#">Impianti vicini</a></li>
        <hr>
        <li><a id="goImpiantiPreferiti" href="#">Impianti preferiti</a></li>
        <hr>
        <li><button id="themeToggle" class="linklike" type="button">🌙 Tema scuro</button></li>
      </ul>
      <button id="drawerClose" aria-label="Chiudi menu" title="Chiudi">←</button>
    </nav>
    <div id="backdrop"></div>
    <button id="menuBtnBottom" class="fab-menu" aria-label="Apri menu" title="Menu">☰</button>

    <iframe id="pageFrame" style="
      position:fixed; inset:0; width:100vw; height:100vh; border:0;
      display:none; background:var(--bg); z-index:9999;
    "></iframe>
  `;

  function injectMarkupOnce() {
    if (document.getElementById('drawer')) return;

    const root = document.createElement('div');
    root.id = 'menuAutoRoot';
    root.innerHTML = MENU_HTML;
    document.body.insertBefore(root, document.body.firstChild);
  }

  /* =========================
     Bottone top-left IDENTICO
     - se topbar grid: dentro topbar
     - altrimenti: fixed (stesso look)
     ========================= */
  function ensureTopLeftButton() {
    let btn = document.getElementById('menuBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'menuBtn';
      btn.className = 'menu-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Apri menu');
      btn.textContent = '☰';
    }

    // Se la pagina ha topbar come index (grid), lo metto lì
    const topbar = document.querySelector('header.topbar, .topbar');
    let placedInGridTopbar = false;

    if (topbar) {
      try {
        const cs = window.getComputedStyle(topbar);
        if (cs.display === 'grid') {
          // identico a index: prima colonna
          btn.classList.remove('menu-fixed');
          if (!btn.parentElement || btn.parentElement !== topbar) {
            topbar.insertBefore(btn, topbar.firstChild);
          }
          placedInGridTopbar = true;
        }
      } catch (_e) {}
    }

    // Altrimenti: fixed top-left
    if (!placedInGridTopbar) {
      btn.classList.add('menu-fixed');
      if (!btn.parentElement || btn.parentElement !== document.body) {
        document.body.insertBefore(btn, document.body.firstChild);
      }
    }
  }

  /* =========================
     Drawer + Theme + Frame (logica di index.html)
     ========================= */
  function setupLogic() {
    const btn = document.getElementById('menuBtn');
    const btnBottom = document.getElementById('menuBtnBottom');
    const drawer = document.getElementById('drawer');
    const backdrop = document.getElementById('backdrop');
    const drawerClose = document.getElementById('drawerClose');
    const frame = document.getElementById('pageFrame');

    function updateThemeToggleLabel() {
      const el = document.getElementById('themeToggle');
      if (!el) return;
      const t = document.documentElement.getAttribute('data-theme') || 'light';
      el.textContent = t === 'dark' ? '☀️ Tema chiaro' : '🌙 Tema scuro';
    }

    function setTheme(t) {
      document.documentElement.setAttribute('data-theme', t);
      try {
        localStorage.setItem('theme', t);
      } catch (_e) {}
      updateThemeToggleLabel();
      try {
        frame?.contentWindow?.postMessage(`theme:${t}`, '*');
      } catch (_e) {}
    }

    updateThemeToggleLabel();

    const openDrawer = () => {
      drawer.style.transform = 'translateX(0)';
      backdrop.style.display = 'block';
      document.body.classList.add('drawer-open');
    };

    const closeDrawer = () => {
      drawer.style.transform = 'translateX(-105%)';
      backdrop.style.display = 'none';
      document.body.classList.remove('drawer-open');
    };

    if (btn) btn.addEventListener('click', openDrawer);
    if (btnBottom) btnBottom.addEventListener('click', openDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const curr = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(curr === 'dark' ? 'light' : 'dark');
      });
    }

    // Nav full-screen (come index.html)
    const pad2 = n => String(n).padStart(2, '0');
    const d = new Date(document.lastModified);
    const vIndex = isNaN(d)
      ? 'dev'
      : `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}-${pad2(
          d.getHours()
        )}:${pad2(d.getMinutes())}`;

    const urlHome = `index.html?v=${encodeURIComponent(vIndex)}`;
    const urlRifornimento = `add_rifornimento.html?v=${encodeURIComponent(vIndex)}`;
    const urlLista = `lista.html?v=${encodeURIComponent(vIndex)}`;
    const urlScheda = `scheda_carburante.html?v=${encodeURIComponent(vIndex)}`;
    const urlForecast = `forecast_km.html?v=${encodeURIComponent(vIndex)}`;
    const urlImpianti = `impianti_vicini.html?v=${encodeURIComponent(vIndex)}`;
    const urlImpiantiPreferiti = `impianti_preferiti.html?v=${encodeURIComponent(vIndex)}`;

    function openFrame(url) {
      closeDrawer();
      frame.src = url;
      frame.style.display = 'block';
      document.body.classList.add('frame-open');
      // identico a index: push #lista (non cambiamo logica)
      history.pushState({ page: 'lista' }, '', '#lista');
    }

    function closeFrame() {
      frame.style.display = 'none';
      frame.src = 'about:blank';
      document.body.classList.remove('frame-open');
      if (location.hash === '#lista' || location.hash === '#scheda') {
        history.back();
      }
    }

    const linkHome = document.getElementById('goHome');
    const linkRifornimento = document.getElementById('goRifornimento');
    const linkLista = document.getElementById('goLista');
    const linkScheda = document.getElementById('goScheda');
    const linkForecast = document.getElementById('goForecast');
    const linkImpianti = document.getElementById('goImpianti');
    const linkImpiantiPreferiti = document.getElementById('goImpiantiPreferiti');

    if (linkHome) {
      linkHome.href = urlHome;
      linkHome.addEventListener('click', e => {
        e.preventDefault();
        openFrame(urlHome);
      });
    }
    if (linkRifornimento) {
      linkRifornimento.href = urlRifornimento;
      linkRifornimento.addEventListener('click', e => {
        e.preventDefault();
        openFrame(urlRifornimento);
      });
    }
    if (linkLista) {
      linkLista.href = urlLista;
      linkLista.addEventListener('click', e => {
        e.preventDefault();
        openFrame(urlLista);
      });
    }
    if (linkScheda) {
      linkScheda.href = urlScheda;
      linkScheda.addEventListener('click', e => {
        e.preventDefault();
        openFrame(urlScheda);
      });
    }
    if (linkForecast) {
      linkForecast.href = urlForecast;
      linkForecast.addEventListener('click', e => {
        e.preventDefault();
        openFrame(urlForecast);
      });
    }
    if (linkImpianti) {
      linkImpianti.href = urlImpianti;
      linkImpianti.addEventListener('click', e => {
        e.preventDefault();
        openFrame(urlImpianti);
      });
    }
    if (linkImpiantiPreferiti) {
      linkImpiantiPreferiti.href = urlImpiantiPreferiti;
      linkImpiantiPreferiti.addEventListener('click', e => {
        e.preventDefault();
        openFrame(urlImpiantiPreferiti);
      });
    }

    window.addEventListener('popstate', () => {
      if (frame.style.display === 'block') {
        frame.style.display = 'none';
        frame.src = 'about:blank';
        document.body.classList.remove('frame-open');
      }
    });

    window.addEventListener('message', ev => {
      if (ev && ev.data === 'close-lista') closeFrame();
      if (typeof ev?.data === 'string' && ev.data.startsWith('theme:')) {
        const t = ev.data.split(':')[1];
        if (t === 'dark' || t === 'light') setTheme(t);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectCssOnce();
    injectMarkupOnce();
    ensureTopLeftButton();
    setupLogic();
  });
})();
