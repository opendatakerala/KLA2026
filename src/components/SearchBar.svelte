<script>
  import { filters, setSearch } from '../stores/constituencyStore.js';
  
  let searchValue = '';
  
  $: searchValue = $filters.search;
  
  function handleSearch() {
    setSearch(searchValue);
  }
  
  function handleClear() {
    searchValue = '';
    setSearch('');
  }
</script>

<div class="search-row">
  <div class="search-input-wrapper">
    <input 
      type="text" 
      id="search" 
      class="search-input" 
      placeholder="Search constituency, candidate…"
      data-i18n-placeholder="header.searchPlaceholder"
      bind:value={searchValue}
      on:keydown={(e) => e.key === 'Enter' && handleSearch()}
    />
    <button class="search-btn" id="search-btn" on:click={handleSearch}>
      <span data-i18n="header.search">Search</span>
    </button>
  </div>
  <button class="clear-btn" id="clear-btn" on:click={handleClear}>
    <span data-i18n="header.clear">Clear</span>
  </button>
</div>

<style>
  .search-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .search-input-wrapper {
    display: flex;
    flex: 1;
    max-width: 400px;
    position: relative;
  }

  .search-input {
    flex: 1;
    padding: 8px 12px;
    padding-right: 50px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    font-size: 14px;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--gold-mid);
  }

  .search-btn {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    padding: 4px 10px;
    background: var(--card2);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .search-btn:hover {
    background: var(--card);
    color: var(--text);
  }

  .clear-btn {
    padding: 8px 12px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .clear-btn:hover {
    background: var(--card2);
    color: var(--text);
  }
</style>
