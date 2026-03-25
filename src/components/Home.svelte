<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
  import Disclaimer from './Disclaimer.svelte';
  import MapView from './MapView.svelte';
  import StatsSection from './StatsSection.svelte';
  import SearchBar from './SearchBar.svelte';
  import FilterBar from './FilterBar.svelte';
  import DistrictTabs from './DistrictTabs.svelte';
  import Grid from './Grid.svelte';
  import Modal from './Modal.svelte';
  import { initLanguage } from '../lib/i18n.js';
  import { 
    constituencies, 
    filters, 
    clearFilters 
  } from '../stores/constituencyStore.js';

  import constituencyData from '../data/constituencies.json';

  const stats = {
    ldf: constituencyData.filter(c => c.candidates.some(x => x.alliance === 'LDF' && x.name)).length,
    udf: constituencyData.filter(c => c.candidates.some(x => x.alliance === 'UDF' && x.name)).length,
    nda: constituencyData.filter(c => c.candidates.some(x => x.alliance === 'NDA' && x.name)).length,
    sc: constituencyData.filter(c => c.reservation === 'SC').length,
    st: constituencyData.filter(c => c.reservation === 'ST').length,
  };

  let viewMode = 'grid';

  $: {
    constituencies.set(constituencyData);
  }

  function setView(mode) {
    viewMode = mode;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('viewPreference', mode);
    }
  }

  onMount(() => {
    initLanguage();
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('viewPreference');
      if (saved === 'grid' || saved === 'map') {
        viewMode = saved;
      }
    }
  });
</script>

<Header totalCandidates="—" />

<div class="container">
  <StatsSection {stats} />
  
  <div class="data-explorer" id="data-explorer">
    <div class="explorer-toolbar">
      <div class="toolbar-left">
        <SearchBar />
      </div>
      <div class="toolbar-right">
        <div class="view-tabs">
          <button 
            class="view-tab" 
            class:active={viewMode === 'grid'}
            on:click={() => setView('grid')}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="16" height="14" rx="2"/><line x1="2" y1="8" x2="18" y2="8"/><line x1="2" y1="13" x2="18" y2="13"/><line x1="7" y1="8" x2="7" y2="17"/></svg>
            <span data-i18n="header.table">Table</span>
          </button>
          <button 
            class="view-tab" 
            class:active={viewMode === 'map'}
            on:click={() => setView('map')}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 5l5-2 4 2 5-2v12l-5 2-4-2-5 2V5z"/><line x1="8" y1="3" x2="8" y2="17"/><line x1="12" y1="5" x2="12" y2="19"/></svg>
            <span data-i18n="header.map">Map</span>
          </button>
        </div>
        <button class="clear-btn" on:click={clearFilters}>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 3l14 14M17 3L3 17"/></svg>
          <span data-i18n="header.clear">Clear</span>
        </button>
      </div>
    </div>

    <div class="explorer-filters">
      <FilterBar />
    </div>

    <DistrictTabs />

    {#if viewMode === 'grid'}
      <Grid data={constituencyData} total={constituencyData.length} />
    {:else}
      <MapView data={constituencyData} />
    {/if}
  </div>
</div>

<Footer />
<Disclaimer />
<Modal />

<style>
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .data-explorer {
    margin-bottom: 40px;
  }

  .explorer-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
  }

  .toolbar-left {
    display: flex;
    gap: 8px;
  }

  .toolbar-right {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .view-tabs {
    display: flex;
    gap: 2px;
    background: var(--bg2);
    border-radius: 6px;
    padding: 2px;
  }

  .view-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .view-tab svg {
    width: 16px;
    height: 16px;
  }

  .view-tab:hover {
    color: var(--text);
    background: var(--card);
  }

  .view-tab.active {
    background: var(--card);
    color: var(--gold);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .clear-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .clear-btn:hover {
    background: var(--card2);
    color: var(--text);
  }

  .explorer-filters {
    margin-bottom: 12px;
  }
</style>
