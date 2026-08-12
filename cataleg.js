<!-- Estructura del catàleg -->
<div class="anem-catalog-container">
  <div class="anem-controls-bar">
    <div class="anem-search-row">
      <div class="anem-search-box">
        <input type="text" id="anemSearchInput" placeholder="Cerca per títol, autor, frase, sinopsi o ISBN...">
      </div>
      <button type="button" id="anemViewOrderBtn" class="anem-btn-cart">Veure comanda <span id="anemCartCount">0</span></button>
    </div>
    
    <div class="anem-buttons-row">
      <span class="anem-filter-label">Filtra per:</span>
      <button type="button" id="anemNovetatsBtn" class="anem-btn-filter">Novetats</button>
      <button type="button" id="anemDestacatsBtn" class="anem-btn-filter">Destacats</button>
      <button type="button" id="anemDisponiblesBtn" class="anem-btn-filter">Disponibles</button>
    </div>

    <div class="anem-dropdowns-row">
      <div class="anem-filter-box">
        <select id="anemEditorialFilter"><option value="">Totes les editorials</option></select>
      </div>
      <div class="anem-filter-box">
        <select id="anemCollectionFilter"><option value="">Totes les col·leccions</option></select>
      </div>
      <div class="anem-filter-box">
        <select id="anemLanguageFilter"><option value="">Tots els idiomes</option></select>
      </div>
      <div class="anem-sort-box">
        <select id="anemSortSelect">
          <option value="">Ordre predeterminat</option>
          <option value="titol">Títol (A-Z)</option>
          <option value="autor">Autor (A-Z)</option>
          <option value="any">Any de publicació</option>
        </select>
      </div>
    </div>
  </div>

  <div id="anemCatalogGrid" class="anem-llibres-llista">
    <p style="text-align:center; padding:40px; color:#666;">Carregant el catàleg...</p>
  </div>
</div>

<!-- Estils CSS del catàleg -->
<style>
  /* Enganxa aquí el contingut que hi ha entre <style> i </style> del teu document */
</style>

<!-- Crida al script allotjat a GitHub -->
<script src="https://cdn.jsdelivr.net/gh/anemeditors/webanem@main/cataleg.js?v=1.0"></script>
