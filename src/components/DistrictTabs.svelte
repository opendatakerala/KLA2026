<script>
  import { filters, setDistrict, districtList } from '../stores/constituencyStore.js';
  
  $: activeDistrict = $filters.district;
  $: districts = $districtList;
</script>

<div class="district-tabs">
  <div class="section-title" data-i18n="browse.title">Browse by District</div>
  <div class="tabs" id="district-tabs">
    <button 
      class="tab" 
      class:active={activeDistrict === 'all'}
      on:click={() => setDistrict('all')}
    >
      <span data-i18n="browse.allDistricts">All Districts</span>
    </button>
    {#each districts as district}
      <button 
        class="tab" 
        class:active={activeDistrict === district}
        on:click={() => setDistrict(district)}
      >
        {district}
      </button>
    {/each}
  </div>
</div>

<style>
  .district-tabs {
    margin-top: 12px;
  }

  .section-title {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--muted);
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  .tabs {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .tab {
    padding: 6px 12px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .tab:hover {
    border-color: var(--gold-mid);
    color: var(--text-soft);
  }

  .tab.active {
    background: var(--gold-light);
    border-color: var(--gold-mid);
    color: var(--gold);
  }
</style>
