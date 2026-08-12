(function() {
  // 1. INJECTAR ESTILS CSS
  const styles = `
    .inici-grid-2col {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 40px;
    }
    .inici-grid-4col {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 2%;
      margin-top: 40px;
    }
    .card-destacada {
      width: 47%; 
      text-align: center;
      animation: fadeUp 0.8s ease;
      box-sizing: border-box;
      margin-bottom: 70px !important; 
      padding-left: 15px; 
    }
    .card-destacada .wrapper-coberta {
      position: relative;
      display: inline-block;
      margin-bottom: 20px;
    }
    .card-destacada img {
      height: 360px;
      width: auto;
      max-width: 100%;
      object-fit: contain;
      box-shadow: 0 8px 16px rgba(0,0,0,0.25);
      transition: transform 0.3s, box-shadow 0.3s;
      border-radius: 0;
      display: block;
      margin: 0 auto;
    }
    .card-destacada img:hover {
      transform: scale(1.05) rotate(1deg);
      box-shadow: 0 14px 28px rgba(0,0,0,0.35);
    }
    .badge-destacat {
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(-100%);
      margin-left: -8px;
      color: white;
      font-size: 0.75em;
      padding: 4px 8px;
      font-weight: bold;
      border-radius: 3px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      text-transform: uppercase;
      white-space: nowrap;
      z-index: 2;
    }
    .badge-novetat { background-color: crimson; }
    .badge-destacat-color { background-color: #2e7d32; }
    .card-destacada a.titol {
      display: block;
      font-weight: bold;
      color: #c00;
      text-decoration: none;
      margin: 0 0 4px 0;
      font-size: 1.2em;
      line-height: 1.2;
    }
    .card-destacada .autor {
      font-size: 1em;
      color: #555;
      margin-bottom: 4px;
      line-height: 1.2;
    }
    .card-destacada .preu {
      font-size: 1.1em;
      font-weight: bold;
      color: #333;
      margin-bottom: 12px;
    }
    .llibre-general {
      width: 23.5%;
      text-align: center;
      margin-bottom: 50px !important; 
      box-sizing: border-box;
    }
    .llibre-general img {
      height: 230px; 
      width: auto;
      max-width: 100%;
      object-fit: contain;
      margin: 0 auto 15px auto; 
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      display: block;
    }
    .llibre-general img:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
    }
    .llibre-general a.titol {
      display: block;
      font-weight: bold;
      color: red;
      text-decoration: none;
      margin: 0 0 3px 0;
      line-height: 1.2;
    }
    .llibre-general .autor {
      font-size: 0.9em;
      color: #555;
      margin-bottom: 3px;
      line-height: 1.2;
    }
    .llibre-general .preu {
      font-size: 0.95em;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
    .botons-compra {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .btn-extern {
      display: inline-block;
      padding: 5px 10px;
      font-size: 0.75em;
      font-weight: bold;
      text-decoration: none !important;
      border-radius: 3px;
      transition: background-color 0.2s, transform 0.1s;
      letter-spacing: 0.3px;
      line-height: 1.2;
    }
    .btn-extern:hover { transform: translateY(-1px); }
    .btn-todostuslibros { background-color: #2b2b2b; color: #ffffff !important; }
    .btn-todostuslibros:hover { background-color: #000000; }
    .btn-amazon { background-color: #e47911; color: #ffffff !important; }
    .btn-amazon:hover { background-color: #d06900; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 768px) {
      .card-destacada { width: 100%; margin-bottom: 60px !important; padding-left: 0; }
      .llibre-general { width: 48%; margin-bottom: 40px !important; }
      .card-destacada img { height: 300px; }
      .badge-destacat {
        position: relative;
        transform: none;
        margin-left: 0;
        margin-bottom: 8px;
        display: inline-block;
      }
    }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // 2. LÒGICA I RENDERING DE LES SECCIONS
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

  function generarBotonsCompra(urlTTL, urlAmazon) {
    let html = '';
    if (urlTTL || urlAmazon) {
      html += '<div class="botons-compra">';
      if (urlTTL) {
        html += `<a class="btn-extern btn-todostuslibros" href="${urlTTL}" target="_blank" rel="noopener noreferrer">Todostuslibros</a>`;
      }
      if (urlAmazon) {
        html += `<a class="btn-extern btn-amazon" href="${urlAmazon}" target="_blank" rel="noopener noreferrer">Amazon</a>`;
      }
      html += '</div>';
    }
    return html;
  }

  async function carregarIniciWeb() {
    const secNovetats = document.getElementById('seccio-novetats');
    const secDestacats = document.getElementById('seccio-destacats');
    const secGeneral = document.getElementById('seccio-general');

    if (!secNovetats || !secDestacats || !secGeneral) return;

    try {
      const response = await fetch(CSV_URL);
      const csvText = await response.text();
      const rows = parseCSV(csvText);

      if (rows.length < 2) return;

      const headers = rows[0].map(h => h.trim().toUpperCase());

      const idxTitol = headers.indexOf('TÍTOL');
      const idxAutor = headers.indexOf('AUTOR');
      const idxPreu = headers.indexOf('PVP');
      const idxInici = headers.indexOf('INICI WEB');
      
      let idxImatge = headers.indexOf('COBERTA') !== -1 ? headers.indexOf('COBERTA') : headers.indexOf('URL COBERTA');
      let idxLink = headers.indexOf('URL LLIBRE') !== -1 ? headers.indexOf('URL LLIBRE') : (headers.indexOf('URL FITXA') !== -1 ? headers.indexOf('URL FITXA') : headers.indexOf('URL'));

      let idxTTL = headers.indexOf('TODOSTUSLIBROS');
      if (idxTTL === -1) idxTTL = headers.indexOf('TODOS TUS LIBROS');

      let idxAmazon = headers.indexOf('AMAZON');

      let htmlNovetats = '';
      let htmlDestacats = '';
      let htmlGeneral = '';

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        
        const titol = row[idxTitol] ? row[idxTitol].trim() : '';
        const autor = (idxAutor !== -1 && row[idxAutor]) ? row[idxAutor].trim() : '';
        const preuRaw = (idxPreu !== -1 && row[idxPreu]) ? row[idxPreu].trim() : '';
        const imgUrl = (idxImatge !== -1 && row[idxImatge]) ? row[idxImatge].trim() : '';
        const estatInici = (idxInici !== -1 && row[idxInici]) ? row[idxInici].trim() : '';
        const linkUrl = (idxLink !== -1 && row[idxLink]) ? row[idxLink].trim() : '#';

        const urlTTL = (idxTTL !== -1 && row[idxTTL]) ? row[idxTTL].trim() : '';
        const urlAmazon = (idxAmazon !== -1 && row[idxAmazon]) ? row[idxAmazon].trim() : '';

        if (!titol || !estatInici || estatInici === 'No es mostra') continue;
        let preuFormatted = preuRaw && !preuRaw.includes('€') ? preuRaw + ' €' : preuRaw;

        const htmlBotons = generarBotonsCompra(urlTTL, urlAmazon);

        if (estatInici === 'Novetat') {
          htmlNovetats += `
            <div class="card-destacada">
              <div class="wrapper-coberta">
                <span class="badge-destacat badge-novetat">NOVETAT</span>
                <a href="${linkUrl}"><img src="${imgUrl}" alt="${titol}"></a>
              </div>
              <a class="titol" href="${linkUrl}"><b>${titol.toUpperCase()}</b></a>
              <div class="autor">${autor}</div>
              <div class="preu">${preuFormatted}</div>
              ${htmlBotons}
            </div>`;
        } 
        else if (estatInici === 'Destacat') {
          htmlDestacats += `
            <div class="card-destacada">
              <div class="wrapper-coberta">
                <span class="badge-destacat badge-destacat-color">DESTACAT</span>
                <a href="${linkUrl}"><img src="${imgUrl}" alt="${titol}"></a>
              </div>
              <a class="titol" href="${linkUrl}"><b>${titol.toUpperCase()}</b></a>
              <div class="autor">${autor}</div>
              <div class="preu">${preuFormatted}</div>
              ${htmlBotons}
            </div>`;
        } 
        else if (estatInici === 'General') {
          htmlGeneral += `
            <div class="llibre-general">
              <a href="${linkUrl}"><img src="${imgUrl}" alt="${titol}"></a>
              <a class="titol" href="${linkUrl}">${titol.toUpperCase()}</a>
              <div class="autor">${autor}</div>
              <div class="preu">${preuFormatted}</div>
              ${htmlBotons}
            </div>`;
        }
      }

      secNovetats.innerHTML = htmlNovetats;
      secDestacats.innerHTML = htmlDestacats;
      secGeneral.innerHTML = htmlGeneral;

    } catch (e) { 
      console.error('Error carregant dades:', e); 
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarIniciWeb);
  } else {
    carregarIniciWeb();
  }
})();
