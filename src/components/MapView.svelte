<script>
  import MapController from './MapController.svelte';
  import Modal from './Modal.svelte';

  export let data = [];
</script>

<div class="map-view" id="map-view">
  <div class="map-outer">
    <div class="map-container" id="map-container">
      <div id="kerala-map"></div>
      <div class="map-mode-row">
        <button class="map-mode-btn all active" data-mode="alliance" data-i18n="map.all">All</button>
        <button class="map-mode-btn ldf" data-mode="ldf">LDF</button>
        <button class="map-mode-btn udf" data-mode="udf">UDF</button>
        <button class="map-mode-btn nda" data-mode="nda">NDA</button>
      </div>
      <div class="map-legend" id="map-legend">
        <div class="map-legend-title" data-i18n="map.alliance">Alliance</div>
        <div class="map-legend-item"><div class="map-legend-dot" style="background:#EE0000;border:1.5px solid #c00;"></div>LDF</div>
        <div class="map-legend-item"><div class="map-legend-dot" style="background:#0078FF;border:1.5px solid #005ecc;"></div>UDF</div>
        <div class="map-legend-item"><div class="map-legend-dot" style="background:#FF9933;border:1.5px solid #e07000;"></div>NDA</div>
        <div style="margin-top:4px;border-top:1px solid var(--border);padding-top:6px;">
          <div class="map-legend-item"><div class="map-legend-dot" style="background:var(--sc-bg);border:1.5px solid var(--sc-color);"></div><span data-i18n="map.scReserved">SC Reserved</span></div>
          <div class="map-legend-item"><div class="map-legend-dot" style="background:var(--st-bg);border:1.5px solid var(--st-color);"></div><span data-i18n="map.stReserved">ST Reserved</span></div>
        </div>
      </div>
      <div class="map-tooltip" id="map-tooltip"></div>
    </div>
    <MapController {data} />
  </div>
</div>

<Modal />

<style>
  .map-view {
    display: none;
  }

  .map-view:not([style*="display: none"]) {
    display: block;
  }

  .map-outer {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 900px) {
    .map-outer {
      grid-template-columns: 1fr;
    }
  }

  .map-container {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    position: relative;
    min-height: 500px;
  }

  #kerala-map {
    width: 100%;
    height: auto;
  }

  #kerala-map :global(svg) {
    width: 100%;
    height: auto;
  }

  #kerala-map :global(path) {
    transition: opacity 0.2s, fill 0.2s;
  }

  .map-mode-row {
    display: flex;
    gap: 4px;
    margin-top: 12px;
  }

  .map-mode-btn {
    padding: 6px 12px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .map-mode-btn:hover {
    border-color: var(--gold-mid);
    color: var(--text-soft);
  }

  .map-mode-btn.active {
    background: var(--gold-light);
    border-color: var(--gold-mid);
    color: var(--gold);
  }

  .map-mode-btn.ldf.active {
    background: #ffebee;
    border-color: #EE0000;
    color: #EE0000;
  }

  .map-mode-btn.udf.active {
    background: #e3f2fd;
    border-color: #0078FF;
    color: #0078FF;
  }

  .map-mode-btn.nda.active {
    background: #fff3e0;
    border-color: #FF9933;
    color: #FF9933;
  }

  .map-legend {
    position: absolute;
    top: 16px;
    right: 16px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px;
    font-size: 11px;
  }

  .map-legend-title {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .map-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-size: 11px;
  }

  .map-legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .map-tooltip {
    position: fixed;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 6px 10px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    pointer-events: none;
    display: none;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
</style>
