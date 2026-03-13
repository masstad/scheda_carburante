// js/format.js
(function () {
  'use strict';

  function toNumberIt(value) {
    if (value === null || value === undefined || value === '') return NaN;
    if (typeof value === 'number') return value;

    let s = String(value);

    // normalizza spazi (anche NBSP) e trim
    s = s.replace(/\u00A0/g, ' ').trim();

    // tieni solo cifre, separatori e segno meno
    s = s.replace(/[^\d.,-]/g, '');

    // se ci sono più '-' tieni solo il primo all'inizio
    s = s.replace(/(?!^)-/g, '');

    // rimuovi separatori migliaia: punto e spazi
    s = s.replace(/\./g, '').replace(/\s/g, '');

    // virgola decimale -> punto
    s = s.replace(/,/g, '.');

    const n = parseFloat(s);
    return Number.isFinite(n) ? n : NaN;
  }

  // Numero intero con separatore migliaia (.)
  window.formatIntIt = function (value) {
    const n = toNumberIt(value);
    if (!Number.isFinite(n)) return String(value ?? '');
    return new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 }).format(n);
  };

  // Euro con migliaia + decimali (es: 1.200,00)
  window.formatEuroIt = function (value, decimals) {
    if (decimals === undefined) decimals = 2;
    const n = toNumberIt(value);
    if (!Number.isFinite(n)) return String(value ?? '');

    const fixed = n.toFixed(decimals); // "1200.00"
    const parts = fixed.split('.');
    let intPart = parts[0];
    const decPart = parts[1] || '';

    // aggiunge separatore migliaia "."
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return decimals > 0 ? `${intPart},${decPart}` : intPart;
  };
})();
