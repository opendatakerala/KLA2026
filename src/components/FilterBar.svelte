<script>
  import { 
    filters, 
    setAlliance, 
    setReservation, 
    toggleWomen,
    setParty,
    partyList,
    clearFilters
  } from '../stores/constituencyStore.js';
  
  $: activeAlliance = $filters.alliance;
  $: activeReservation = $filters.reservation;
  $: activeWomen = $filters.women;
  $: activeParty = $filters.party;
  $: parties = $partyList;
  
  function handleAllianceClick(alliance) {
    setAlliance(alliance === activeAlliance ? 'all' : alliance);
  }
  
  function handleReservationClick(reservation) {
    setReservation(reservation === activeReservation ? 'all' : reservation);
  }
  
  function handlePartyChange(e) {
    setParty(e.target.value);
  }
</script>

<div class="filter-bar">
  <div class="filter-row">
    <button 
      class="filter-btn" 
      class:active={activeAlliance === 'all'}
      on:click={() => setAlliance('all')}
    >
      <span data-i18n="filters.all">All</span>
    </button>
    <button 
      class="filter-btn ldf"
      class:active={activeAlliance === 'LDF'}
      on:click={() => handleAllianceClick('LDF')}
    >
      LDF
    </button>
    <button 
      class="filter-btn udf"
      class:active={activeAlliance === 'UDF'}
      on:click={() => handleAllianceClick('UDF')}
    >
      UDF
    </button>
    <button 
      class="filter-btn nda"
      class:active={activeAlliance === 'NDA'}
      on:click={() => handleAllianceClick('NDA')}
    >
      NDA
    </button>
  </div>
  
  <div class="filter-row">
    <button 
      class="filter-btn"
      class:active={activeReservation === 'SC'}
      on:click={() => handleReservationClick('SC')}
    >
      <span data-i18n="filters.sc">SC Reserved</span>
    </button>
    <button 
      class="filter-btn"
      class:active={activeReservation === 'ST'}
      on:click={() => handleReservationClick('ST')}
    >
      <span data-i18n="filters.st">ST Reserved</span>
    </button>
    <button 
      class="filter-btn female"
      class:active={activeWomen}
      on:click={toggleWomen}
    >
      ♀ <span data-i18n="filters.women">Women</span>
    </button>
  </div>
  
  <div class="filter-row">
    <select 
      class="party-select"
      bind:value={activeParty}
      on:change={handlePartyChange}
    >
      <option value="all">All Parties</option>
      {#each parties as party}
        <option value={party.party}>{party.party} ({party.count})</option>
      {/each}
    </select>
    
    {#if activeAlliance !== 'all' || activeReservation !== 'all' || activeWomen || activeParty !== 'all' || $filters.search}
      <button class="clear-filters-btn" on:click={clearFilters}>
        <span data-i18n="filters.clear">Clear Filters</span>
      </button>
    {/if}
  </div>
</div>

<style>
  .filter-bar {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .filter-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    align-items: center;
  }

  .filter-btn {
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

  .filter-btn:hover {
    border-color: var(--gold-mid);
    color: var(--text-soft);
  }

  .filter-btn.active {
    background: var(--gold-light);
    border-color: var(--gold-mid);
    color: var(--gold);
  }

  .filter-btn.ldf.active {
    background: #ffebee;
    border-color: #EE0000;
    color: #EE0000;
  }

  .filter-btn.udf.active {
    background: #e3f2fd;
    border-color: #0078FF;
    color: #0078FF;
  }

  .filter-btn.nda.active {
    background: #fff3e0;
    border-color: #FF9933;
    color: #FF9933;
  }

  .filter-btn.female.active {
    background: #fce4ec;
    border-color: #EC4899;
    color: #EC4899;
  }

  .party-select {
    padding: 6px 10px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    min-width: 150px;
  }

  .party-select:focus {
    outline: none;
    border-color: var(--gold-mid);
  }

  .clear-filters-btn {
    padding: 6px 10px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .clear-filters-btn:hover {
    background: var(--card2);
    color: var(--text);
  }
</style>
