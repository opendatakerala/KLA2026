<script>
  import { _, locale } from '../lib/i18n.js';
  import { filters, setSort, SORT_FIELDS } from '../stores/constituencyStore.js';

  let activeSort = $derived($filters.sort || { field: 'fightIndex', direction: 'desc' });
  let currentLang = $derived($locale);

  const sortFields = Object.entries(SORT_FIELDS);

  function handleFieldChange(field) {
    const config = SORT_FIELDS[field];
    setSort(field, config.defaultDirection);
  }

  function toggleDirection() {
    setSort(activeSort.field, activeSort.direction === 'asc' ? 'desc' : 'asc');
  }
</script>

<div class="sort-bar">
  <div class="sort-label">{$_('sort.sortBy')}</div>
  <div class="sort-controls">
    <select 
      class="sort-select"
      value={activeSort.field}
      onchange={(e) => handleFieldChange(e.target.value)}
    >
      {#each sortFields as [key, config]}
        <option value={key}>{$_(config.labelKey)}</option>
      {/each}
    </select>
    
    <button 
      class="direction-btn"
      onclick={toggleDirection}
      title={activeSort.direction === 'asc' ? $_('sort.ascending') : $_('sort.descending')}
    >
      {#if activeSort.direction === 'asc'}
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 12V4M8 4L4 8M8 4L12 8"/>
        </svg>
      {:else}
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 4V12M8 12L4 8M8 12L12 8"/>
        </svg>
      {/if}
    </button>
  </div>
</div>

<style>
  .sort-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
  }

  .sort-label {
    font-family: 'Manjari', monospace;
    font-size: var(--fs-sm);
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  .sort-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sort-select {
    padding: 6px 10px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text);
    font-family: 'Manjari', monospace;
    font-size: var(--fs-sm);
    cursor: pointer;
    transition: all 0.15s;
  }

  .sort-select:hover {
    border-color: var(--gold-mid);
  }

  .sort-select:focus {
    outline: none;
    border-color: var(--gold);
  }

  .direction-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
  }

  .direction-btn:hover {
    border-color: var(--gold-mid);
    color: var(--gold);
  }

  .direction-btn svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 640px) {
    .sort-bar {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
</style>
