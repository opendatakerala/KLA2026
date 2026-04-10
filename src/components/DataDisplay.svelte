<script>
  import { _ } from '../lib/i18n.js';
  import { initRouter } from '../stores/routerStore.js';
  import { disclaimerDismissed } from '../stores/uiStore.js';
  import Grid from './Grid.svelte';
  import MapView from './MapView.svelte';
  import SortBar from './SortBar.svelte';

  let viewMode = $state('grid');

  function setView(mode) {
    viewMode = mode;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('viewPreference', mode);
    }
  }

  $effect(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('viewPreference');
      if (saved === 'grid' || saved === 'map') {
        viewMode = saved;
      }
    }
  });
  
  $effect(() => {
    if ($disclaimerDismissed) {
      setTimeout(() => initRouter(), 0);
    }
  });
</script>

<div class="data-display">
  <div class="view-tabs" role="tablist" aria-label={$_('header.viewSelection')}>
    <button 
      id="view-grid-tab"
      class="view-tab" 
      class:active={viewMode === 'grid'}
      role="tab"
      aria-selected={viewMode === 'grid'}
      aria-controls="view-content"
      onclick={() => setView('grid')}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="16" height="14" rx="2"/><line x1="2" y1="8" x2="18" y2="8"/><line x1="2" y1="13" x2="18" y2="13"/><line x1="7" y1="8" x2="7" y2="17"/></svg>
      <span>{$_('header.table')}</span>
    </button>
    <button 
      id="view-map-tab"
      class="view-tab" 
      class:active={viewMode === 'map'}
      role="tab"
      aria-selected={viewMode === 'map'}
      aria-controls="view-content"
      onclick={() => setView('map')}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 5l5-2 4 2 5-2v12l-5 2-4-2-5 2V5z"/><line x1="8" y1="3" x2="8" y2="17"/><line x1="12" y1="5" x2="12" y2="19"/></svg>
      <span>{$_('header.map')}</span>
    </button>
  </div>

  <div id="view-content" role="tabpanel" aria-labelledby={viewMode === 'grid' ? 'view-grid-tab' : 'view-map-tab'} tabindex="0">
    {#if viewMode === 'grid'}
      <SortBar />
      <Grid />
    {:else}
      <MapView />
    {/if}
  </div>
</div>

<style>
  .data-display {
    margin-bottom: 40px;
  }

  .view-tabs {
    display: flex;
    gap: 2px;
    background: var(--bg2);
    border-radius: 6px;
    padding: 2px;
    margin-bottom: 16px;
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
    font-family: 'Manjari', monospace;
    font-size: var(--fs-sm);
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
</style>