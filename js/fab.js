(function () {
  // Non mostrare il + sulla pagina di inserimento
  const path = (location.pathname || '').toLowerCase();
  if (path.endsWith('/add_rifornimento.html') || path.endsWith('add_rifornimento.html')) return;

  // Se già presente (magari in una pagina l'hai messo a mano) non duplicare
  if (document.getElementById('fabAddRefuel')) return;

  // Crea il bottone
  const btn = document.createElement('button');
  btn.id = 'fabAddRefuel';
  btn.className = 'fab-add';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Inserisci rifornimento');
  btn.title = 'Inserisci rifornimento';
  btn.textContent = '+';

  document.body.appendChild(btn);

  function getSelectedAutoIdSafe() {
    try { return localStorage.getItem('selectedAutoId') || ''; }
    catch (e) { return ''; }
  }

  btn.addEventListener('click', function () {
    const idAuto = getSelectedAutoIdSafe();
    let url = 'add_rifornimento.html';
    if (idAuto) url += '?id_auto=' + encodeURIComponent(idAuto);
    location.href = url;
  });
})();
