<script>
  import { _, locale } from '../lib/i18n.js';
  import { 
    filters, 
    setReservation, 
    toggleWomen,
    setParty,
    setGeography,
    partyList,
    GEOGRAPHY_REGIONS
  } from '../stores/constituencyStore.js';
  
  let activeReservation = $derived($filters.reservation);
  let activeWomen = $derived($filters.women);
  let activeParty = $derived($filters.party);
  let activeGeography = $derived($filters.geography);
  let parties = $derived($partyList);
  let currentLang = $derived($locale);
  
  const regions = Object.entries(GEOGRAPHY_REGIONS);

  let currentCategory = $derived.by(() => {
    if (activeWomen) return 'women';
    if (activeReservation === 'SC') return 'SC';
    if (activeReservation === 'ST') return 'ST';
    return 'all';
  });

  function handleCategoryClick(category) {
    if (category === 'all') {
      setReservation('all');
      if (activeWomen) toggleWomen();
    } else if (category === 'SC') {
      setReservation('SC');
      if (activeWomen) toggleWomen();
    } else if (category === 'ST') {
      setReservation('ST');
      if (activeWomen) toggleWomen();
    } else if (category === 'women') {
      setReservation('all');
      if (!activeWomen) toggleWomen();
    }
  }
  
  function handlePartyClick(party) {
    setParty(party === activeParty ? 'all' : party);
  }

  function handleGeographyClick(value) {
    setGeography(activeGeography === value ? 'all' : value);
  }

  function isRegionActive(regionKey) {
    return activeGeography === regionKey;
  }

  function isDistrictActive(district) {
    return activeGeography === district;
  }

  function getRegionLabel(region) {
    return currentLang === 'ml' ? region.malayalam : region.name;
  }
</script>

<div class="filter-bar" aria-label={$_('filters.title')}>
  <fieldset class="filter-group">
    <legend class="filter-label">{$_('filters.category')}</legend>
    <div class="filter-row">
      <button 
        class="filter-btn"
        class:active={currentCategory === 'all'}
        onclick={() => handleCategoryClick('all')}
        aria-pressed={currentCategory === 'all'}
      >
        <span>{$_('filters.all')}</span>
      </button>
      <button 
        class="filter-btn sc"
        class:active={currentCategory === 'SC'}
        onclick={() => handleCategoryClick('SC')}
        aria-pressed={currentCategory === 'SC'}
      >
        <span>{$_('map.scReserved')}</span>
      </button>
      <button 
        class="filter-btn st"
        class:active={currentCategory === 'ST'}
        onclick={() => handleCategoryClick('ST')}
        aria-pressed={currentCategory === 'ST'}
      >
        <span>{$_('map.stReserved')}</span>
      </button>
      <button 
        class="filter-btn female"
        class:active={currentCategory === 'women'}
        onclick={() => handleCategoryClick('women')}
        aria-pressed={currentCategory === 'women'}
        aria-label={$_('filters.womenLabel')}
      >
        <span aria-hidden="true">♀</span> <span>{$_('filters.women')}</span>
      </button>
    </div>
  </fieldset>

  <fieldset class="filter-group">
    <legend class="filter-label">{$_('filters.party')}</legend>
    <div class="filter-row">
      <button 
        class="filter-btn"
        class:active={activeParty === 'all'}
        onclick={() => setParty('all')}
        aria-pressed={activeParty === 'all'}
      >
        <span>{$_('filters.all')}</span>
      </button>
      {#each parties as party}
        <button 
          class="filter-btn party-btn"
          class:active={activeParty === party.party}
          onclick={() => handlePartyClick(party.party)}
          aria-pressed={activeParty === party.party}
        >
          {party.party}
        </button>
      {/each}
    </div>
  </fieldset>

  <fieldset class="filter-group">
    <legend class="filter-label">{$_('filters.geography')}</legend>
    <div class="geo-regions">
      <button 
        class="filter-btn"
        class:active={activeGeography === 'all'}
        onclick={() => handleGeographyClick('all')}
        aria-pressed={activeGeography === 'all'}
      >
        {$_('filters.all')}
      </button>
      {#each regions as [key, region]}
        <div class="geo-region">
          <button 
            class="region-btn"
            class:active={isRegionActive(key)}
            onclick={() => handleGeographyClick(key)}
            aria-pressed={isRegionActive(key)}
          >
            {getRegionLabel(region)}
          </button>
          <div class="region-districts">
            {#each region.districts as district}
              <button 
                class="district-btn"
                class:active={isDistrictActive(district)}
                onclick={() => handleGeographyClick(district)}
                aria-pressed={isDistrictActive(district)}
              >
                {$_(`districts.${district}`)}
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </fieldset>
</div>

<style>
  .filter-bar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    border: none;
    padding: 0;
    margin: 0;
    min-width: 0;
  }

  .filter-label {
    display: block;
    margin: 0;
    padding: 0;
    font-family: 'Manjari', monospace;
    font-size: var(--fs-sm);
    letter-spacing: 0.08em;
    color: var(--muted);
    text-transform: uppercase;
    float: left;
    width: 100%;
  }

  .filter-label::after {
    content: "";
    display: table;
    clear: both;
  }

  .filter-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    align-items: center;
    max-height: 60px;
    overflow-y: auto;
  }

  .geo-regions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 4px;
  }

  .geo-regions > .filter-btn {
    grid-column: 1 / -1;
  }

  .geo-region {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .region-btn {
    padding: 6px 10px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--muted);
    font-family: 'Manjari', monospace;
    font-size: var(--fs-sm);
    cursor: pointer;
    transition: all 0.15s;
  }

  .region-btn:hover {
    border-color: var(--gold-mid);
    color: var(--text-soft);
  }

  .region-btn.active {
    background: var(--gold-light);
    border-color: var(--gold-mid);
    color: var(--gold);
  }

  .region-districts {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .district-btn {
    max-width: 150px;
    padding: 4px 6px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 3px;
    color: var(--muted);
    font-family: 'Manjari', monospace;
    font-size: var(--fs-sm);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .district-btn:hover {
    border-color: var(--gold-mid);
    color: var(--text-soft);
  }

  .district-btn.active {
    background: var(--gold-light);
    border-color: var(--gold-mid);
    color: var(--gold);
  }

  .filter-btn {
    padding: 6px 10px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--muted);
    font-family: 'Manjari', monospace;
    font-size: var(--fs-sm);
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

  .filter-btn.sc.active {
    background: var(--sc-bg);
    border-color: var(--sc-color);
    color: var(--sc-color);
  }

  .filter-btn.st.active {
    background: var(--st-bg);
    border-color: var(--st-color);
    color: var(--st-color);
  }

  .filter-btn.female.active {
    background: #fce4ec;
    border-color: #EC4899;
    color: #EC4899;
  }

  @media (max-width: 640px) {
    .geo-regions {
      grid-template-columns: 1fr;
    }
  }

</style>
