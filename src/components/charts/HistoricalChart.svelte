<script>
  import { onMount } from 'svelte';
  
  export let seriesData = [];
  
  const STORAGE_KEY = 'historicalViewMode';
  const COLORS = {
    LDF: '#D94040',
    UDF: '#1565C0',
    NDA: '#E07828',
    Others: '#33AA55'
  };
  
  let currentView = 'bars';
  let chart = null;
  let chartContainer;
  let barsContent = '';
  
  onMount(() => {
    currentView = localStorage.getItem(STORAGE_KEY) || 'bars';
    
    return () => {
      if (chart) chart.dispose();
    };
  });
  
  $: if (seriesData.length > 0) {
    render();
  }
  
  function setView(view) {
    currentView = view;
    localStorage.setItem(STORAGE_KEY, view);
    render();
  }
  
  function render() {
    if (seriesData.length === 0) return;
    
    if (chart) {
      chart.dispose();
      chart = null;
    }
    
    if (currentView === 'bars') {
      renderBars();
    } else if (currentView === 'line') {
      renderLine();
    } else if (currentView === 'stacked') {
      renderStacked();
    }
  }
  
  function renderBars() {
    let html = '<div class="modal-historical">';
    seriesData.forEach(d => {
      html += `<div class="historical-year"><div class="historical-year-label">${d.year}</div>`;
      ['LDF', 'UDF', 'NDA', 'Others'].forEach(al => {
        if (d.allianceVotes[al] > 0) {
          const pct = d.totalVotes > 0 ? ((d.allianceVotes[al] / d.totalVotes) * 100).toFixed(1) : 0;
          html += `<div class="historical-bar"><span class="historical-alliance ${al}">${al}</span><div class="historical-bar-track"><div class="historical-bar-fill" style="width:${pct}%;background:${COLORS[al]}"></div></div><span class="historical-pct">${pct}%</span></div>`;
        }
      });
      html += '</div>';
    });
    html += '</div>';
    barsContent = html;
  }
  
  async function renderLine() {
    barsContent = '';
    if (!chartContainer) return;
    
    const echarts = await import('echarts');
    
    chart = echarts.init(chartContainer, null, { renderer: 'svg' });
    
    const series = ['LDF', 'UDF', 'NDA', 'Others'].map(alliance => ({
      name: alliance,
      type: 'line',
      data: seriesData.map(d => {
        const pct = d.totalVotes > 0 ? (d.allianceVotes[alliance] / d.totalVotes) * 100 : 0;
        return parseFloat(pct.toFixed(1));
      }),
      smooth: true,
      itemStyle: { color: COLORS[alliance] },
      lineStyle: { width: 2 },
      symbol: 'circle',
      symbolSize: 8
    }));
    
    const option = {
      tooltip: { trigger: 'axis' },
      legend: { data: ['LDF', 'UDF', 'NDA', 'Others'], bottom: 0 },
      grid: { left: 40, right: 20, top: 20, bottom: 50 },
      xAxis: { type: 'category', data: seriesData.map(d => d.year) },
      yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
      series
    };
    
    chart.setOption(option);
  }
  
  async function renderStacked() {
    barsContent = '';
    if (!chartContainer) return;
    
    const echarts = await import('echarts');
    
    chart = echarts.init(chartContainer, null, { renderer: 'svg' });
    
    const series = ['LDF', 'UDF', 'NDA', 'Others']
      .filter(alliance => seriesData.some(d => d.allianceVotes[alliance] > 0))
      .map(alliance => ({
        name: alliance,
        type: 'bar',
        stack: 'total',
        data: seriesData.map(d => {
          const pct = d.totalVotes > 0 ? (d.allianceVotes[alliance] / d.totalVotes) * 100 : 0;
          return parseFloat(pct.toFixed(1));
        }),
        itemStyle: { color: COLORS[alliance] }
      }));
    
    const option = {
      tooltip: { trigger: 'axis' },
      legend: { data: series.map(s => s.name), bottom: 0 },
      grid: { left: 40, right: 20, top: 20, bottom: 50 },
      xAxis: { type: 'category', data: seriesData.map(d => d.year) },
      yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
      series
    };
    
    chart.setOption(option);
  }
</script>

{#if seriesData.length > 0}
  <div class="historical-chart-container">
    <div class="historical-switcher">
      <button 
        class="hist-switch-btn" 
        class:active={currentView === 'bars'}
        on:click={() => setView('bars')}
      >
        Bars
      </button>
      <button 
        class="hist-switch-btn" 
        class:active={currentView === 'line'}
        on:click={() => setView('line')}
      >
        Line
      </button>
      <button 
        class="hist-switch-btn" 
        class:active={currentView === 'stacked'}
        on:click={() => setView('stacked')}
      >
        Stacked
      </button>
    </div>
    {#if currentView === 'bars'}
      <div class="historical-content">
        {@html barsContent}
      </div>
    {:else}
      <div class="historical-chart" bind:this={chartContainer}></div>
    {/if}
  </div>
{/if}

<style>
  .historical-chart-container {
    margin-top: 24px;
  }

  .historical-switcher {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .hist-switch-btn {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    padding: 6px 12px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.18s;
  }

  .hist-switch-btn:hover {
    border-color: var(--text);
    color: var(--text);
  }

  .hist-switch-btn.active {
    background: var(--text);
    color: var(--card);
    border-color: var(--text);
  }

  .historical-chart {
    width: 100%;
    height: 250px;
  }

  .historical-content :global(.modal-historical) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .historical-content :global(.historical-year) {
    margin-bottom: 8px;
  }

  .historical-content :global(.historical-year-label) {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .historical-content :global(.historical-bar) {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .historical-content :global(.historical-alliance) {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    width: 32px;
  }

  .historical-content :global(.historical-alliance.LDF) { color: #D94040; }
  .historical-content :global(.historical-alliance.UDF) { color: #1565C0; }
  .historical-content :global(.historical-alliance.NDA) { color: #E07828; }
  .historical-content :global(.historical-alliance.Others) { color: #33AA55; }

  .historical-content :global(.historical-bar-track) {
    flex: 1;
    height: 6px;
    background: var(--card2);
    border-radius: 3px;
    overflow: hidden;
  }

  .historical-content :global(.historical-bar-fill) {
    height: 100%;
    border-radius: 3px;
  }

  .historical-content :global(.historical-pct) {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    width: 36px;
    text-align: right;
  }
</style>