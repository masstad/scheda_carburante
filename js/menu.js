/* ===========================
   MENU AUTO-INJECTION (FIXED)
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  // evita doppia inizializzazione
  if (document.getElementById('menuBtnTop')) return;

  /* ========= BOTTONE TOP LEFT ========= */
  const menuBtnTop = document.createElement('button');
  menuBtnTop.id = 'menuBtnTop';
  menuBtnTop.setAttribute('aria-label', 'Apri menu');
  menuBtnTop.innerHTML = '&#9776;';

  Object.assign(menuBtnTop.style, {
    position: 'fixed',
    top: '14px',
    left: '14px',
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '22px',
    cursor: 'pointer',
    zIndex: '10000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  document.body.appendChild(menuBtnTop);

  /* ========= BOTTONE BOTTOM LEFT ========= */
  const menuBtnBottom = document.createElement('button');
  menuBtnBottom.id = 'menuBtnBottom';
  menuBtnBottom.setAttribute('aria-label', 'Apri menu');
  menuBtnBottom.innerHTML = '&#9776;';

  Object.assign(menuBtnBottom.style, {
    position: 'fixed',
    bottom: '16px',
    left: '16px',
    width: '48px',
    height: '48px',
    borderRadius: '999px',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '22px',
    cursor: 'pointer',
    zIndex: '10000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  document.body.appendChild(menuBtnBottom);

  /* ========= DRAWER ========= */
  const drawer = document.createElement('nav');
  drawer.id = 'drawerMenu';

  Object.assign(drawer.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    height: '100%',
    width: '260px',
    background: 'var(--surface)',
    borderRight: '1px solid var(--border)',
    transform: 'translateX(-100%)',
    transition: 'transform .25s ease',
    zIndex: '10001',
    padding: '16px'
  });

  drawer.innerHTML = `
    <h3 style="margin-top:0">Menu</h3>
    <a href="index.html" class="btn" style="width:100%; margin-bottom:8px;">Home</a>
    <a href="impianti_vicini.html" class="btn" style="width:100%; margin-bottom:8px;">Impianti vicini</a>
    <a href="impianti_preferiti.html" class="btn" style="width:100%; margin-bottom:8px;">Preferiti</a>
  `;

  document.body.appendChild(drawer);

  /* ========= BACKDROP ========= */
  const backdrop = document.createElement('div');
  Object.assign(backdrop.style, {
    position: 'fixed',
    inset: '0',
    background: 'rgba(0,0,0,.35)',
    opacity: '0',
    pointerEvents: 'none',
    transition: 'opacity .25s ease',
    zIndex: '10000'
  });
  document.body.appendChild(backdrop);

  /* ========= LOGICA ========= */
  function openMenu() {
    drawer.style.transform = 'translateX(0)';
    backdrop.style.opacity = '1';
    backdrop.style.pointerEvents = 'auto';
  }

  function closeMenu() {
    drawer.style.transform = 'translateX(-100%)';
    backdrop.style.opacity = '0';
    backdrop.style.pointerEvents = 'none';
  }

  menuBtnTop.onclick = openMenu;
  menuBtnBottom.onclick = openMenu;
  backdrop.onclick = closeMenu;

});
