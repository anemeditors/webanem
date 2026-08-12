(function() {
  // 1. INJECCIÓ D'ESTILS CSS
  const css = `
    .inici-grid-2col { display: flex; flex-wrap: wrap; justify-content: space-between; margin-top: 40px; }
    .inici-grid-4col { display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 2%; margin-top: 40px; }
    
    .card-destacada { width: 47%; text-align: center; animation: fadeUp 0.8s ease; box-sizing: border-box; margin-bottom: 70px !important; padding-left: 15px; }
    .card-destacada .wrapper-coberta { position: relative; display: inline-block; margin-bottom: 20px; }
    .card-destacada img { height: 360px; width: auto; max-width: 100%; object-fit: contain; box-shadow: 0 8px 16px rgba(0,0,0,0.25); transition: transform 0.3s, box-shadow 0.3s; display: block; margin: 0 auto; }
    .card-destacada img:hover { transform: scale(1.05) rotate(1deg); box-shadow: 0 14px 28px rgba(0,0,0,0.35); }
    
    .badge-destacat { position: absolute; top: 0; left: 0; transform: translateX(-100%); margin-left: -8px; color: white; font-size: 0.75em; padding: 4px 8px; font-weight: bold; border-radius: 3px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); text-transform: uppercase; white-space: nowrap; z-index: 2; }
    .badge-novetat { background-color: crimson; }
    .badge-destacat-color { background-color: #2e7d32; }
    
    .card-destacada a.titol { display: block; font-weight: bold; color: #c00; text-decoration: none; margin: 0 0 4px 0; font-size: 1.2em; line-height: 1.2; }
    .card-destacada .autor { font-size: 1em; color: #555; margin-bottom: 4px; line-height: 1.2; }
    .card-destacada .preu { font-size: 1.1em; font-weight: bold; color: #333; margin-bottom: 12px; }
    
    .llibre-general { width: 23.5%; text-align: center; margin-bottom: 50px !important; box-sizing: border-box; }
    .llibre-general img { height: 230px; width: auto; max-width: 100%; object-fit: contain; margin: 0 auto 15px auto; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); display: block; }
    .llibre-general img:hover { transform: scale(1.05); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25); }
    .llibre-general a.titol { display: block; font-weight: bold; color: red; text-decoration: none; margin: 0 0 3px 0; line-height: 1.2; }
    .llibre-general .autor { font-size: 0.9em; color: #555; margin-bottom: 3px; line-height: 1.2; }
    .llibre-general .preu { font-size: 0.95em; font-weight: bold; color: #333; margin-bottom: 10px; }
    
    .botons-compra { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
    .btn-extern { display: inline-block; padding: 5px 10px; font-size: 0.75em; font-weight: bold; text-decoration: none !important; border-radius: 3px; transition: background-color 0.2s, transform 0.1s; letter-spacing: 0.3px; line-height: 1.2; }
    .btn-extern:hover { transform: translateY(-1px); }
    .btn-todostuslibros { background-color: #2b2b2b; color: #ffffff !important; }
    .btn-todostuslibros:hover { background-color: #000000; }
    .btn-amazon { background-color: #e47911; color: #ffffff !important; }
    .btn-amazon:hover { background-color: #d06900; }
    
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 768px) {
      .card-destacada { width: 100%; margin-bottom: 60px !important; padding-left: 0; }
      .llibre-general { width: 48%; margin-bottom: 40px !important; }
      .card-destacada img { height: 300px; }
      .badge-destacat { position: relative; transform: none; margin-left: 0; margin-bottom: 8px; display: inline-block; }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // 2. PARSER I PROCESSAMENT
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQESjqxo632pyAya7JVHONT0tCGm6XSLnHE1ft4dwY7uIRCUKSiXac8tOj1hYVEkmW-1E7KkPgYv-DR/pub?output=csv';

  function parseCSV(text) {
    let p = '', c = '', r = [];
    let q = false;
    let row = [''];
    for (let i = 0; i < text.length; i++) {
      c = text[i];
      let next = text[i+1];
      if (c === '"') {
        if (q && next === '"') { row[row.length - 1] += '"'; i++; }
        else { q = !q; }
      } else if (c === ',' && !q) {
        row.push('');
      } else if ((c === '\r' || c === '\n') && !q) {
        if (c === '\r' && next === '\n') { i++; }
        r.push(row);
        row = [''];
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

  function trobarIndex(headers, possibles) {
    return headers.findIndex(h => possibles.some(p => norm(h).includes(p)));
  }

  function generarBotons(ttl, amz) {
    if (!ttl && !amz) return '';
    let h = '<div class="botons-compra">';
    if (ttl) h += `<a class="btn-extern btn-todostuslibros" href="${ttl}" target="_blank" rel="noopener">Todostuslibros</a>`;
    if (amz) h += `<a class="btn-extern btn-amazon" href="${amz}" target="_blank" rel="noopener">Amazon</a>`;
    h += '</div>';
    return h;
  }

  async function carregarDades() {
    const secNovetats = document.getElementById('seccio-novetats');
    const secDestacats = document.getElementById('seccio-destacats');
    const secGeneral = document.getElementById('seccio-general');

    if (!secNovetats || !secDestacats || !secGeneral) return;

    try {
      const res = await fetch(CSV_URL);
      const text = await res.text();
      const rows = parseCSV(text);

      if (rows.length < 2) return;

      const headers = rows[0];

      // Reconeixement ultra flexible de columnes
      const idxTitol = trobarIndex(headers, ['titol', 'titulo', 'title']);
      const idxAutor = trobarIndex(headers, ['autor', 'author']);
      const idxPreu = trobarIndex(headers, ['pvp', 'preu', 'precio', 'price']);
      const idxInici = trobarIndex(headers, ['inici', 'inicio', 'estat', 'estado']);
      const idxImg = trobarIndex(headers, ['coberta', 'portada', 'imatge', 'imagen', 'url']);
      const idxLink = trobarIndex(headers, ['link', 'enllac', 'fitxa', 'url llibre', 'web']);
      const idxTTL = trobarIndex(headers, ['todostuslibros', 'ttl']);
      const idxAmz = trobarIndex(headers, ['amazon', 'amz']);

      let hNovetats = '', hDestacats = '', hGeneral = '';

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        
        // Si la fila és buida, ignora-la
        if (!row || row.length === 0) continue;

        const titol = idxTitol !== -1 && row[idxTitol] ? row[idxTitol].trim() : (row[0] || '').trim();
        if (!titol) continue;

        const autor = idxAutor !== -1 && row[idxAutor] ? row[idxAutor].trim() : '';
        const preuRaw = idxPreu !== -1 && row[idxPreu] ? row[idxPreu].trim() : '';
        const img = idxImg !== -1 && row[idxImg] ? row[idxImg].trim() : '';
        const link = idxLink !== -1 && row[idxLink] ? row[idxLink].trim() : '#';
        const urlTTL = idxTTL !== -1 && row[idxTTL] ? row[idxTTL].trim() : '';
        const urlAmz = idxAmz !== -1 && row[idxAmz] ? row[idxAmz].trim() : '';
        const estat = idxInici !== -1 && row[idxInici] ? row[idxInici].trim() : '';

        const preu = preuRaw && !preuRaw.includes('€') ? preuRaw + ' €' : preuRaw;
        const botons = generarBotons(urlTTL, urlAmz);
        const estatNorm = norm(estat);

        if (estatNorm.includes('novetat')) {
          hNovetats += `
            <div class="card-destacada">
              <div class="wrapper-coberta">
                <span class="badge-destacat badge-novetat">NOVETAT</span>
                <a href="${link}"><img src="${img}" alt="${titol}"></a>
              </div>
              <a class="titol" href="${link}"><b>${titol.toUpperCase()}</b></a>
              <div class="autor">${autor}</div>
              <div class="preu">${preu}</div>
              ${botons}
            </div>`;
        } else if (estatNorm.includes('destacat')) {
          hDestacats += `
            <div class="card-destacada">
              <div class="wrapper-coberta">
                <span class="badge-destacat badge-destacat-color">DESTACAT</span>
                <a href="${link}"><img src="${img}" alt="${titol}"></a>
              </div>
              <a class="titol" href="${link}"><b>${titol.toUpperCase()}</b></a>
              <div class="autor">${autor}</div>
              <div class="preu">${preu}</div>
              ${botons}
            </div>`;
        } else {
          // Si no és novetat ni destacat (o la columna no existeix), ho posa a la graella general
          hGeneral += `
            <div class="llibre-general">
              <a href="${link}"><img src="${img}" alt="${titol}"></a>
              <a class="titol" href="${link}">${titol.toUpperCase()}</a>
              <div class="autor">${autor}</div>
              <div class="preu">${preu}</div>
              ${botons}
            </div>`;
        }
      }

      secNovetats.innerHTML = hNovetats;
      secDestacats.innerHTML = hDestacats;
      secGeneral.innerHTML = hGeneral;

    } catch (e) {
      console.error('Error al script:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarDades);
  } else {
    carregarDades();
  }
})();
