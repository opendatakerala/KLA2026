<script>
  import { onMount } from 'svelte';
  import * as echarts from 'echarts';
  import ageData from '../../data/age-distribution.json';
  import { _ } from '../../lib/i18n.js';

  const { isActive = false } = $props();

  const TABS = ['overall', 'alliance', 'party', 'district'];
  const TAB_LABELS = {
    overall: 'Overall',
    alliance: 'Alliance',
    party: 'Party',
    district: 'District'
  };

  let tabsWithFloat = $derived(activeTab !== 'overall' 
    ? TABS.filter(t => t !== activeTab).concat([activeTab])
    : TABS);

  const ALLIANCES = ['LDF', 'UDF', 'NDA', 'Others'];
  const ALLIANCE_COLORS = {
    LDF: '#E53935',
    UDF: '#1E88E5',
    NDA: '#FB8C00',
    Others: '#757575'
  };

  const AGE_BINS = ['20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80+'];
  const AGE_COLORS = {
    '20-29': '#22D3EE',
    '30-39': '#34D399',
    '40-49': '#A3E635',
    '50-59': '#FACC15',
    '60-69': '#FB923C',
    '70-79': '#F87171',
    '80+': '#C084FC'
  };

  let activeTab = $state('overall');
  let activeFilter = $state('overall');
  let prevTab = $state('overall');
  let chartContainer = $state(null);
  let chart = $state(null);
  let resizeObserver = $state(null);
  let needsClear = $state(false);

  function getCurrentData(tab, filter) {
    if (tab === 'overall') {
      return ageData.overall;
    } else if (tab === 'alliance') {
      return ageData.byAlliance[filter] || {};
    } else if (tab === 'party') {
      return ageData.byParty[filter] || {};
    } else if (tab === 'district') {
      return ageData.byDistrict[filter] || {};
    }
    return ageData.overall;
  }

  function getCompareData() {
    const result = {};
    AGE_BINS.forEach(bin => {
      result[bin] = {
        LDF: ageData.byAlliance['LDF']?.[bin] || 0,
        UDF: ageData.byAlliance['UDF']?.[bin] || 0,
        NDA: ageData.byAlliance['NDA']?.[bin] || 0
      };
    });
    return result;
  }

  function setTab(tab) {
    const wasOverall = activeTab === 'overall';
    const isOverall = tab === 'overall';
    if (wasOverall !== isOverall) {
      needsClear = true;
    }
    activeTab = tab;
    if (tab === 'overall') {
      activeFilter = 'overall';
    } else if (tab === 'alliance') {
      activeFilter = 'LDF';
    } else if (tab === 'party') {
      activeFilter = Object.keys(ageData.byParty)[0] || '';
    } else if (tab === 'district') {
      activeFilter = Object.keys(ageData.byDistrict)[0] || '';
    }
  }

  function getFilterOptions(tab) {
    if (tab === 'alliance') {
      return ALLIANCES;
    } else if (tab === 'party') {
      return Object.keys(ageData.byParty);
    } else if (tab === 'district') {
      return Object.keys(ageData.byDistrict);
    }
    return [];
  }

  function calculateTotal(data) {
    return Object.values(data).reduce((sum, val) => sum + val, 0);
  }

  function renderChart() {
    if (!chartContainer || !chart) return;

    if (needsClear) {
      chart.clear();
      needsClear = false;
    }

    if (activeTab === 'overall') {
      const compareData = getCompareData();
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: {
          data: ['LDF', 'UDF', 'NDA'],
          top: 0,
          textStyle: { fontFamily: 'DM Mono', fontSize: 11 }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 40,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: AGE_BINS,
          axisLabel: { fontFamily: 'DM Mono', fontSize: 11 }
        },
        yAxis: {
          type: 'value',
          axisLabel: { fontFamily: 'DM Mono', fontSize: 11 }
        },
        series: [
          {
            name: 'LDF',
            type: 'bar',
            data: AGE_BINS.map(bin => compareData[bin].LDF),
            itemStyle: { color: ALLIANCE_COLORS.LDF }
          },
          {
            name: 'UDF',
            type: 'bar',
            data: AGE_BINS.map(bin => compareData[bin].UDF),
            itemStyle: { color: ALLIANCE_COLORS.UDF }
          },
          {
            name: 'NDA',
            type: 'bar',
            data: AGE_BINS.map(bin => compareData[bin].NDA),
            itemStyle: { color: ALLIANCE_COLORS.NDA }
          }
        ]
      };
      chart.setOption(option);
    } else {
      const currentData = getCurrentData(activeTab, activeFilter);
      const total = calculateTotal(currentData);
      
      const seriesData = AGE_BINS.map(bin => ({
        name: bin,
        value: currentData[bin] || 0,
        itemStyle: { color: AGE_COLORS[bin] }
      }));

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params) => {
            const p = params[0];
            const pct = total > 0 ? ((p.value / total) * 100).toFixed(1) : 0;
            return `${p.name}<br/>Count: ${p.value} (${pct}%)`;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 10,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: AGE_BINS,
          axisLabel: { fontFamily: 'DM Mono', fontSize: 11 }
        },
        yAxis: {
          type: 'value',
          axisLabel: { fontFamily: 'DM Mono', fontSize: 11 }
        },
        series: [{
          type: 'bar',
          data: seriesData,
          barWidth: '60%'
        }]
      };
      chart.setOption(option);
    }
  }

  function initChart() {
    if (!chartContainer) return;
    
    if (!chart) {
      chart = echarts.init(chartContainer, null, { renderer: 'svg' });
    }

    resizeObserver = new ResizeObserver(() => {
      if (chart) chart.resize();
    });
    resizeObserver.observe(chartContainer);

    renderChart();
  }

  function disposeChart() {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (chart) {
      chart.dispose();
      chart = null;
    }
  }

  $effect(() => {
    if (isActive) {
      setTimeout(() => initChart(), 50);
    }
    return () => disposeChart();
  });

  $effect(() => {
    if (chart && activeTab) {
      renderChart();
    }
  });
</script>

<div class="age-dist">
  <div class="tab-bar">
    <div class="tabs">
      {#each tabsWithFloat as tab}
        <button 
          class="tab-btn" 
          class:active={activeTab === tab}
          onclick={() => setTab(tab)}
        >
          {TAB_LABELS[tab]}
        </button>
      {/each}
    </div>
    {#if activeTab !== 'overall'}
      <select 
        class="filter-select"
        bind:value={activeFilter}
      >
        {#each getFilterOptions(activeTab) as opt}
          <option value={opt}>{opt}</option>
        {/each}
      </select>
    {/if}
  </div>

  <div class="chart-container" bind:this={chartContainer}></div>
</div>

<style>
  .age-dist {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .tab-bar {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .tabs {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    position: relative;
  }

  .tab-btn {
    padding: 8px 16px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .tab-btn:hover {
    border-color: var(--gold-mid);
    color: var(--text-soft);
  }

  .tab-btn.active {
    background: var(--gold-light);
    border-color: var(--gold-mid);
    color: var(--gold);
  }

  .filter-select {
    padding: 8px 12px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: var(--text);
    min-width: 150px;
    cursor: pointer;
  }

  .chart-container {
    width: 100%;
    height: 320px;
  }
</style>
