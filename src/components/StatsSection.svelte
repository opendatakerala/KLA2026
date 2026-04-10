<script>
  import { onMount } from 'svelte';
  import { _ } from '../lib/i18n.js';
  import StatsBar from './StatsBar.svelte';
  import PartyDistribution from './charts/PartyDistribution.svelte';
  import GenderDistribution from './charts/GenderDistribution.svelte';
  import AgeDistribution from './charts/AgeDistribution.svelte';
  import DummyDistribution from './charts/DummyDistribution.svelte';
  import EducationDistribution from './charts/EducationDistribution.svelte';
  import SymbolDistribution from './charts/SymbolDistribution.svelte';

  let collapsed = true;
  let activeTab = '';

  function handleTabClick(stat) {
    if (activeTab === stat && !collapsed) {
      collapsed = true;
      activeTab = '';
    } else {
      activeTab = stat;
      collapsed = false;
    }

    setTimeout(() => {
      window.dispatchEvent(new Event('stats-tab-shown'));
    }, 10);
  }
</script>

<div class="stats-section" class:collapsed id="stats-section">
  <StatsBar />
  <div class="stats-tabs" role="tablist" aria-label={$_('stats.tabsLabel')}>
    <button 
      id="tab-party"
      class="stats-tab" 
      class:active={activeTab === 'candidates-by-party'}
      role="tab"
      aria-selected={activeTab === 'candidates-by-party'}
      aria-controls="panel-party"
      onclick={() => handleTabClick('candidates-by-party')}
    >
      <span>{$_('stats.partyDistribution')}</span>
    </button>
    <button 
      id="tab-gender"
      class="stats-tab"
      class:active={activeTab === 'gender-distribution'}
      role="tab"
      aria-selected={activeTab === 'gender-distribution'}
      aria-controls="panel-gender"
      onclick={() => handleTabClick('gender-distribution')}
    >
      <span>{$_('stats.genderDistribution')}</span>
    </button>
    <button 
      id="tab-age"
      class="stats-tab"
      class:active={activeTab === 'age-distribution'}
      role="tab"
      aria-selected={activeTab === 'age-distribution'}
      aria-controls="panel-age"
      onclick={() => handleTabClick('age-distribution')}
    >
      <span>{$_('stats.ageDistribution')}</span>
    </button>
    <button 
      id="tab-dummy"
      class="stats-tab"
      class:active={activeTab === 'dummy-distribution'}
      role="tab"
      aria-selected={activeTab === 'dummy-distribution'}
      aria-controls="panel-dummy"
      onclick={() => handleTabClick('dummy-distribution')}
    >
      <span>{$_('stats.dummyDistribution')}</span>
    </button>
    <button 
      id="tab-symbol"
      class="stats-tab"
      class:active={activeTab === 'symbol-distribution'}
      role="tab"
      aria-selected={activeTab === 'symbol-distribution'}
      aria-controls="panel-symbol"
      onclick={() => handleTabClick('symbol-distribution')}
    >
      <span>{$_('stats.symbolDistribution')}</span>
    </button>
    <button 
      id="tab-education"
      class="stats-tab"
      class:active={activeTab === 'education-distribution'}
      role="tab"
      aria-selected={activeTab === 'education-distribution'}
      aria-controls="panel-education"
      onclick={() => handleTabClick('education-distribution')}
    >
      <span>{$_('stats.educationDistribution')}</span>
      <span class="experimental-badge">{$_('stats.experimental')}</span>
    </button>
  </div>

  <div class="stats-content">
    <div 
      id="panel-party"
      class="stats-panel" 
      class:active={activeTab === 'candidates-by-party'}
      role="tabpanel"
      aria-labelledby="tab-party"
      tabindex="0"
    >
      <PartyDistribution isActive={activeTab === 'candidates-by-party'} />
    </div>

    <div 
      id="panel-gender"
      class="stats-panel" 
      class:active={activeTab === 'gender-distribution'}
      role="tabpanel"
      aria-labelledby="tab-gender"
      tabindex="0"
    >
      <GenderDistribution isActive={activeTab === 'gender-distribution'} />
    </div>

    <div 
      id="panel-age"
      class="stats-panel" 
      class:active={activeTab === 'age-distribution'}
      role="tabpanel"
      aria-labelledby="tab-age"
      tabindex="0"
    >
      <AgeDistribution isActive={activeTab === 'age-distribution'} />
    </div>

    <div 
      id="panel-dummy"
      class="stats-panel" 
      class:active={activeTab === 'dummy-distribution'}
      role="tabpanel"
      aria-labelledby="tab-dummy"
      tabindex="0"
    >
      <DummyDistribution isActive={activeTab === 'dummy-distribution'} />
    </div>

    <div 
      id="panel-symbol"
      class="stats-panel" 
      class:active={activeTab === 'symbol-distribution'}
      role="tabpanel"
      aria-labelledby="tab-symbol"
      tabindex="0"
    >
      <SymbolDistribution isActive={activeTab === 'symbol-distribution'} />
    </div>

    <div 
      id="panel-education"
      class="stats-panel" 
      class:active={activeTab === 'education-distribution'}
      role="tabpanel"
      aria-labelledby="tab-education"
      tabindex="0"
    >
      <EducationDistribution isActive={activeTab === 'education-distribution'} />
    </div>
  </div>
</div>

<style>
  .stats-section {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 24px;
    overflow: hidden;
  }

  .stats-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--card2);
  }

  .stats-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-family: 'Manjari', monospace;
    font-size: var(--fs-sm);
    letter-spacing: 0.04em;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .stats-tab:hover:not([disabled]) {
    border-color: var(--gold-mid);
    color: var(--text-soft);
  }

  .stats-tab.active {
    background: var(--gold-light);
    border-color: var(--gold-mid);
    color: var(--gold);
  }

  .experimental-badge {
    font-size: 9px;
    padding: 2px 6px;
    background: #FEF3C7;
    color: #B45309;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stats-content {
    padding: 20px;
    min-height: 380px;
  }

  .stats-section.collapsed .stats-content {
    display: none;
  }

  .stats-panel {
    display: none;
  }

  .stats-panel.active {
    display: block;
  }
</style>
