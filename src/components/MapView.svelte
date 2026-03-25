<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import mapSvgText from '../data/kla-map.svg?raw';
  import { filteredConstituencies, openModal } from '../stores/constituencyStore.js';
  import Modal from './Modal.svelte';

  export let data = [];

  let mapSvg = null;
  
  $: filteredData = $filteredConstituencies;

  function initMap() {
    const container = document.getElementById('kerala-map');
    if (!container) return;

    container.innerHTML = mapSvgText;
    
    mapSvg = d3.select(container).select('svg');
    
    const tooltip = document.getElementById('map-tooltip');

    mapSvg.selectAll('path')
      .each(function() {
        const path = d3.select(this);
        const qid = path.attr('id');
        const row = data.find(x => x.Constituency_Wikidata === qid);
        
        if (row) {
          path
            .attr('id', 'c' + row.constituency_Number)
            .attr('data-num', row.constituency_Number)
            .attr('class', 'const-path');
        }
        
        path.style('cursor', 'pointer');
      })
      .on('mouseenter', function(event) {
        const path = d3.select(this);
        const qid = path.attr('id');
        const row = data.find(x => x.Constituency_Wikidata === qid);
        const name = row ? row.constituency_Name : (path.attr('data-name') || '');
        const num = row ? row.constituency_Number : '';
        
        const candidates = row?.candidates || [];
        const ldfCandidate = candidates.find(c => c.alliance === 'LDF' && c.name);
        const udfCandidate = candidates.find(c => c.alliance === 'UDF' && c.name);
        const ndaCandidate = candidates.find(c => c.alliance === 'NDA' && c.name);
        
        const al = ldfCandidate ? 'LDF' : udfCandidate ? 'UDF' : ndaCandidate ? 'NDA' : '';
        
        if (tooltip) {
          tooltip.textContent = (num ? '#' + num + ' ' : '') + name + (al ? ' · ' + al : '');
          tooltip.style.display = 'block';
        }
      })
      .on('mousemove', function(event) {
        if (tooltip) {
          tooltip.style.left = (event.clientX + 14) + 'px';
          tooltip.style.top = (event.clientY - 8) + 'px';
        }
      })
      .on('mouseleave', function() {
        if (tooltip) tooltip.style.display = 'none';
      })
      .on('click', function() {
        const path = d3.select(this);
        const qid = path.attr('id');
        const row = data.find(x => x.Constituency_Wikidata === qid);
        if (row) openModal(row);
      });
  }

  function updateMapHighlight() {
    if (!mapSvg) return;

    const filteredIds = new Set(filteredData.map(c => c.constituency_Wikidata));
    
    mapSvg.selectAll('.const-path').each(function() {
      const path = d3.select(this);
      const qid = path.attr('id');
      const row = data.find(x => x.Constituency_Wikidata === qid);
      
      if (row && filteredIds.has(row.constituency_Wikidata)) {
        path.style('opacity', 1);
      } else {
        path.style('opacity', 0.15);
      }
    });
  }

  $: if (mapSvg && filteredData) {
    updateMapHighlight();
  }

  onMount(() => {
    initMap();
  });
</script>

<div class="map-view" id="map-view">
  <div class="map-container" id="map-container">
    <div id="kerala-map"></div>
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
</div>

<Modal />

<style>
  .map-view {
    margin-bottom: 24px;
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
