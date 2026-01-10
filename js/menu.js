/* menu.auto.v2.js
   Auto-injection Drawer + FAB menu (replica di index.html)
   Uso: aggiungi SOLO questa riga in ogni pagina (in <head>):
     <script src="menu.auto.v2.js" defer></script>
*/
(function(){
  'use strict';

  const MENU_HTML = `
  <!-- Drawer identico a index.html -->
  <nav id="drawer">
    <h3 style="margin-top:0;">Menu</h3>
    <ul style="list-style:none;padding:0;margin:0;">
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

  <!-- Overlay pagina secondaria -->
  <iframe id="pageFrame" style="
    position:fixed; inset:0; width:100vw; height:100vh; border:0;
    display:none; background:var(--bg); z-index:9999;
  "></iframe>
  `;

  const MENU_CSS = `
  /* === Menu injected (da index.html) === */
  .menu-btn{
    position: fixed;
    top: calc(12px + env(safe-area-inset-top));
    left: 12px;
    width: 44px;
    height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    font-size: 22px;
    line-height: 1;
    padding: 0;
    cursor: pointer;
    color: var(--text);
    box-shadow: var(--shadow);
    z-index: 10000;
  }
  #drawer{
    position:fixed; inset:0 35% 0 0; max-width:280px;
    transform:translateX(-105%); transition:transform .2s ease; z-index:9998; padding:16px;
    background: var(--surface);
    border-right: 1px solid var(--border);
  }
  #drawerClose{
    position: absolute;
    left: 12px; bottom: 12px;
    width: 44px; height: 44px;
    display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid var(--border); border-radius: 999px;
    background: var(--surface); color: var(--text); font-size: 18px;
    cursor: pointer; box-shadow: var(--shadow);
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
  #backdrop{ position:fixed; inset:0; background:rgba(0,0,0,.15); display:none; z-index:9997; }
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
  `;

  function injectCssOnce(){
    if (document.getElementById('menuAutoCss')) return;
    const st = document.createElement('style');
    st.id = 'menuAutoCss';
    st.textContent = MENU_CSS;
    document.head.appendChild(st);
  }

  function ensureTopLeftButton(){
    // Se esiste gi\u00e0, non fare nulla
    if (document.getElementById('menuBtn')) return;

    // Inietta SEMPRE nel body con position:fixed
    // (evita che layout centrati/flex dell'header lo spostino al centro)
    const btn = document.createElement('button');
    btn.id = 'menuBtn';
    btn.className = 'menu-btn';
    btn.setAttribute('aria-label', 'Apri menu');
    btn.title = 'Menu';
    btn.type = 'button';
    btn.textContent = '\u2630';

    // Inserisci molto in alto nel DOM (prima di tutto)
    document.body.insertBefore(btn, document.body.firstChild);
  }

  function injectMenuMarkupOnce(){
    // Se già presente, non duplicare
    if (document.getElementById('drawer')) return;

    const wrap = document.createElement('div');
    wrap.id = 'menuAutoRoot';
    wrap.innerHTML = MENU_HTML;

    // Inserisco a inizio body per avere z-index coerenti, ma dopo eventuali header già renderizzati
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  function setupDrawerAndTheme(){
    const btn = document.getElementById('menuBtn');
    const btnBottom = document.getElementById('menuBtnBottom');
    const drawer = document.getElementById('drawer');
    const backdrop = document.getElementById('backdrop');
    const closeBtn = document.getElementById('drawerClose');
    const frame = document.getElementById('pageFrame');

    if (!drawer || !backdrop) return;

    function updateThemeToggleLabel(){
      const el = document.getElementById('themeToggle');
      if(!el) return;
      const t = document.documentElement.getAttribute('data-theme') || 'light';
      el.textContent = (t === 'dark') ? '☀️ Tema chiaro' : '🌙 Tema scuro';
    }

    function setTheme(t){
      document.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem('theme', t); } catch(e){}
      updateThemeToggleLabel();
      // Propaga al frame se aperto
      try{ frame?.contentWindow?.postMessage(`theme:${t}`, '*'); }catch(e){}
    }

    function openDrawer(){
      drawer.style.transform = 'translateX(0)';
      backdrop.style.display = 'block';
      document.body.classList.add('drawer-open');
    }
    function closeDrawer(){
      drawer.style.transform = 'translateX(-105%)';
      backdrop.style.display = 'none';
      document.body.classList.remove('drawer-open');
    }

    if (btn) btn.addEventListener('click', openDrawer);
    if (btnBottom) btnBottom.addEventListener('click', openDrawer);
    backdrop.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    // Toggle tema
    const tgl = document.getElementById('themeToggle');
    if (tgl){
      updateThemeToggleLabel();
      tgl.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(cur === 'dark' ? 'light' : 'dark');
      });
    }

    // Segui cambio preferenza sistema solo se non c'è tema salvato
    try {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      mql.addEventListener?.('change', (e) => {
        const saved = localStorage.getItem('theme');
        if (!saved) setTheme(e.matches ? 'dark' : 'light');
      });
    } catch(e){}

    // NAV con iframe full-screen (stesso approccio di index.html)
    const pad2 = n => String(n).padStart(2,'0');
    const d = new Date(document.lastModified);
    const vIndex = isNaN(d) ? 'dev'
      : `${d.getFullYear()}.${pad2(d.getMonth()+1)}.${pad2(d.getDate())}-${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

    const urlLista = `lista.html?v=${encodeURIComponent(vIndex)}`;
    const urlScheda = `scheda_carburante.html?v=${encodeURIComponent(vIndex)}`;
    const urlForecast = `forecast_km.html?v=${encodeURIComponent(vIndex)}`;
    const urlImpianti = `impianti_vicini.html?v=${encodeURIComponent(vIndex)}`;
    const urlImpiantiPreferiti = `impianti_preferiti.html?v=${encodeURIComponent(vIndex)}`;

    function openFrame(url, hashName){
      if (!frame) return;
      closeDrawer();
      frame.src = url;
      frame.style.display = 'block';
      document.body.classList.add('frame-open');
      if (hashName) history.pushState({page:hashName}, '', `#${hashName}`);
    }

    function closeFrame(){
      if (!frame) return;
      frame.style.display = 'none';
      frame.src = 'about:blank';
      document.body.classList.remove('frame-open');
      // evita di "sporcare" history se siamo su hash di frame
      const h = location.hash;
      if (h === '#lista' || h === '#scheda' || h === '#forecast' || h === '#impianti' || h === '#impianti-preferiti') {
        history.back();
      }
    }

    // Link handlers
    const linkLista = document.getElementById('goLista');
    const linkScheda = document.getElementById('goScheda');
    const linkForecast = document.getElementById('goForecast');
    const linkImpianti = document.getElementById('goImpianti');
    const linkImpiantiPreferiti = document.getElementById('goImpiantiPreferiti');

    if (linkLista){
      linkLista.href = urlLista;
      linkLista.addEventListener('click', (e)=>{ e.preventDefault(); openFrame(urlLista, 'lista'); });
    }
    if (linkScheda){
      linkScheda.href = urlScheda;
      linkScheda.addEventListener('click', (e)=>{ e.preventDefault(); openFrame(urlScheda, 'scheda'); });
    }
    if (linkForecast){
      linkForecast.href = urlForecast;
      linkForecast.addEventListener('click', (e)=>{ e.preventDefault(); openFrame(urlForecast, 'forecast'); });
    }
    if (linkImpianti){
      linkImpianti.href = urlImpianti;
      linkImpianti.addEventListener('click', (e)=>{ e.preventDefault(); openFrame(urlImpianti, 'impianti'); });
    }
    if (linkImpiantiPreferiti){
      linkImpiantiPreferiti.href = urlImpiantiPreferiti;
      linkImpiantiPreferiti.addEventListener('click', (e)=>{ e.preventDefault(); openFrame(urlImpiantiPreferiti, 'impianti-preferiti'); });
    }

    // Chiudi frame con back
    window.addEventListener('popstate', () => {
      if (frame && frame.style.display === 'block') {
        frame.style.display = 'none';
        frame.src = 'about:blank';
        document.body.classList.remove('frame-open');
      }
    });

    // Permetti alle pagine dentro iframe di chiudere
    window.addEventListener('message', (ev) => {
      if (!ev) return;
      if (ev.data === 'close-lista' || ev.data === 'close-frame') closeFrame();
      // Supporto: ricevi comando tema da parent/child
      if (typeof ev.data === 'string' && ev.data.startsWith('theme:')){
        const t = ev.data.split(':')[1];
        if (t === 'dark' || t === 'light') setTheme(t);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectCssOnce();
    ensureTopLeftButton();
    injectMenuMarkupOnce();
    setupDrawerAndTheme();
  });
})();
