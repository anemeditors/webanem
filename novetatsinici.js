(function() {
  // 1. DISSENY I ESTILS CSS
  const css = `
    .inici-grid-4col { display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 2%; margin-top: 40px; }
    .llibre-general { width: 23.5%; text-align: center; margin-bottom: 50px !important; box-sizing: border-box; }
    .llibre-general img { height: 230px; width: auto; max-width: 100%; object-fit: contain; margin: 0 auto 15px auto; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); display: block; }
    .llibre-general img:hover { transform: scale(1.05); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25); }
    .llibre-general a.titol { display: block; font-weight: bold; color: red; text-decoration: none; margin: 0 0 3px 0; line-height: 1.2; }
    .llibre-general .autor { font-size: 0.9em; color: #555; margin-bottom: 3px; line-height: 1.2; }
    .llibre-general .preu { font-size: 0.95em; font-weight: bold; color: #333; margin-bottom: 10px; }
    .botons-compra { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
    .btn-extern { display: inline-block; padding: 5px 10px; font-size: 0.75em; font-weight: bold; text-decoration: none !important; border-radius: 3px; transition: background-color 0.2s; line-height: 1.2; }
    .btn-todostuslibros { background-color: #2b2b2b; color: #ffffff !important; }
    .btn-amazon { background-color: #e47911; color: #ffffff !important; }
    @media (max-width: 768px) { .llibre-general { width: 48%; margin-bottom: 40px !important; } }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // 2. LECTURA SENSE FILTRES
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQESjqxo632pyAya7JVHONT0tCGm6XSLnHE1ft4dwY7uIRCUKSiXac8tOj1hYVEkmW-1E7KkPgYv-DR/pub?output=csv';

  function parseCSV(text) {
    let r = [], q = false, row = [''];
    for (let i = 0; i < text.length; i++) {
      let c = text[i], next = text[i+1];
      if (c === '"') {
        if (q && next === '"') { row[row.length - 1] += '"'; i++; }
        else { q = !q; }
      } else if (c === ',' && !q) {
        row.push('');
      } else if ((c === '\r' || c === '\n') && !q) {
        if (c === '\r' && next === '\n') { i++; }
        r.push(row); row = [''];
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== '') r.push(row);
    return r;
  }

  function norm(str) {
    return (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
  }

  async function carregarDades() {
    const secGeneral = document.getElementById('seccio-general');
    if (!secGeneral) return;

    try {
      const res = await fetch(CSV_URL);
      const text = await res.text();
      const rows = parseCSV(text);

      if (rows.length < 2) return;

      const headers = rows[0].map(h => norm(h));

      const idxTitol = headers.indexOf('titol');
      const idxAutor = headers.indexOf('autor');
      const idxPreu = headers.indexOf('pvp');
      const idxImg = headers.indexOf('coberta');
      const idxLink = headers.indexOf('url llibre');
      const idxTTL = headers.indexOf('todostuslibros');
      const idxAmz = headers.indexOf('amazon');

      let hGeneral = '';

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const titol = idxTitol !== -1 && row[idxTitol] ? row[idxTitol].trim() : '';
        if (!titol) continue;

        const autor = idxAutor !== -1 && row[idxAutor] ? row[idxAutor].trim() : '';
        const preuRaw = idxPreu !== -1 && row[idxPreu] ? row[idxPreu].trim() : '';
        const img = idxImg !== -1 && row[idxImg] ? row[idxImg].trim() : '';
        const link = idxLink !== -1 && row[idxLink] ? row[idxLink].trim() : '#';
        const urlTTL = idxTTL !== -1 && row[idxTTL] ? row[idxTTL].trim() : '';
        const urlAmz = idxAmz !== -1 && row[idxAmz] ? row[idxAmz].trim() : '';

        const preu = preuRaw && !preuRaw.includes('€') ? preuRaw + ' €' : preuRaw;
        
        let botons = '';
        if (urlTTL || urlAmz) {
          botons = '<div class="botons-compra">';
          if (urlTTL) botons += `<a class="btn-extern btn-todostuslibros" href="${urlTTL}" target="_blank">Todostuslibros</a>`;
          if (urlAmz) botons += `<a class="btn-extern btn-amazon" href="${urlAmz}" target="_blank">Amazon</a>`;
          botons += '</div>';
        }

        hGeneral += `
          <div class="llibre-general">
            <a href="${link}"><img src="${img}" alt="${titol}"></a>
            <a class="titol" href="${link}">${titol.toUpperCase()}</a>
            <div class="autor">${autor}</div>
            <div class="preu">${preu}</div>
            ${botons}
          </div>`;
      }

      secGeneral.innerHTML = hGeneral;

    } catch (e) {
      console.error(e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarDades);
  } else {
    carregarDades();
  }
})();
