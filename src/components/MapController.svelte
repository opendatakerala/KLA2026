<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import mapSvgText from '../data/kla-map.svg?raw';
  import { 
    filteredConstituencies, 
    openModal, 
    constituencies,
    filters,
    setParty,
    setDistrict,
    toggleWomen,
    clearFilters,
    partyList,
    districtList
  } from '../stores/constituencyStore.js';

  export let data = [];

  $: {
    constituencies.set(data);
  }

  let mapSvg = null;
  
  $: filteredData = $filteredConstituencies;
  $: partyOptions = $partyList;
  $: districtOptions = $districtList;
  $: activeFilters = $filters;

  function getPartiesForRow(row) {
    const parties = [];
    (row.candidates || []).forEach(c => {
      if (c.name && c.party) parties.push(c.party);
    });
    return parties;
  }

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

  function handlePartyChange(e) {
    setParty(e.target.value);
  }

  function handleDistrictChange(e) {
    setDistrict(e.target.value);
  }

  function handleWomenToggle() {
    toggleWomen();
  }

  function handleClear() {
    clearFilters();
  }

  onMount(() => {
    initMap();
  });
</script>

<div class="map-panel">
  <div class="map-panel-header">
    <div class="map-panel-header-row">
      <button 
        class="map-women-btn" 
        class:active={activeFilters.women}
        on:click={handleWomenToggle}
      >
        <span>♀</span> <span data-i18n="map.women">Women</span>
      </button>
      <button class="map-clear-btn" on:click={handleClear}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
        <span data-i18n="map.clear">Clear</span>
      </button>
    </div>
  </div>
  <div class="map-panel-body" id="panel-body">
    <div class="map-panel-section-label" data-i18n="map.party">Party</div>
    <select class="party-select" on:change={handlePartyChange} value={activeFilters.party}>
      <option value="all">All Parties ({data.length})</option>
      {#each partyOptions as party}
        <option value={party.party}>{party.party} ({party.count})</option>
      {/each}
    </select>
    
    <div class="map-panel-section-label" data-i18n="map.district">District</div>
    <select class="dist-select" on:change={handleDistrictChange} value={activeFilters.district}>
      <option value="all">All Kerala ({data.length})</option>
      {#each districtOptions as district}
        <option value={district}>{district}</option>
      {/each}
    </select>
    
    <div class="const-detail" id="const-detail"></div>
  </div>
</div>

<style>
  .map-panel {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  .map-panel-header {
    padding: 12px;
    border-bottom: 1px solid var(--border);
    background: var(--card2);
  }

  .map-panel-header-row {
    display: flex;
    gap: 8px;
  }

  .map-women-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .map-women-btn:hover {
    border-color: var(--gold-mid);
    color: var(--text-soft);
  }

  .map-women-btn.active {
    background: #fce4ec;
    border-color: #EC4899;
    color: #EC4899;
  }

  .map-clear-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .map-clear-btn:hover {
    background: var(--card);
    color: var(--text);
  }

  .map-panel-body {
    padding: 12px;
  }

  .map-panel-section-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--muted);
    text-transform: uppercase;
    margin-top: 12px;
    margin-bottom: 6px;
  }

  .map-panel-section-label:first-child {
    margin-top: 0;
  }

  .party-select,
  .dist-select {
    width: 100%;
    padding: 8px 10px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    cursor: pointer;
  }

  .party-select:focus,
  .dist-select:focus {
    outline: none;
    border-color: var(--gold-mid);
  }
</style>
