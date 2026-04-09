<script>
  import { onMount } from 'svelte';
  import * as echarts from 'echarts/core';
  import { LineChart } from 'echarts/charts';
  import {
    TooltipComponent,
    GridComponent
  } from 'echarts/components';
  import { SVGRenderer } from 'echarts/renderers';
  import { _ } from '../../lib/i18n.js';

  echarts.use([
    LineChart,
    GridComponent,
    TooltipComponent,
    SVGRenderer
  ]);

  let { data = null, loading = false, error = false } = $props();

  const TIME_LABELS = ['Start', '9 AM', '11 AM', '1 PM', '3 PM', '5 PM', 'Close'];
  const DATA_KEYS = ['vt_9am', 'vt_11am', 'vt_1pm', 'vt_3pm', 'vt_5pm', 'vt_close_of_poll'];

  let chartContainer = $state(null);
  let chart = null;

  let hasData = $derived(data && Object.keys(data).length > 0);

  $effect(() => {
    if (chartContainer && hasData) {
      renderChart();
    }
  });

  onMount(() => {
    return () => { if (chart) chart.dispose(); };
  });

  function renderChart() {
    if (!chartContainer || !data) return;

    if (chart) {
      chart.dispose();
      chart = null;
    }
    chart = echarts.init(chartContainer, null, { renderer: 'svg' });

    const values = [0, ...DATA_KEYS.map(key => {
      const val = parseFloat(data[key]);
      return val === 0 ? null : val;
    })];

    chart.setOption({
      tooltip: {
        trigger: 'axis',
        confine: true,
        formatter: (params) => {
          const p = params[0];
          const val = p.value;
          if (val == null || val === '') {
            return `<strong>${p.name}</strong><br/>${$_('charts.turnoutDataNotAvailable')}`;
          }
          return `<strong>${p.name}</strong><br/>${val}%`;
        }
      },
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: {
        type: 'category',
        data: TIME_LABELS,
        axisLabel: { fontWeight: 600 }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: { formatter: (v) => v + '%' }
      },
      series: [{
        type: 'line',
        data: values,
        smooth: true,
        itemStyle: { color: '#EAB308' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(234, 179, 8, 0.3)' },
            { offset: 1, color: 'rgba(234, 179, 8, 0.05)' }
          ])
        },
        connectNulls: true
      }]
    });
  }
</script>

{#if loading}
  <div class="turnout-chart">
    <div class="chart-label">{$_('charts.voterTurnout')}</div>
    <div class="loading-box">
      <span class="loading-text">{$_('charts.loading')}</span>
    </div>
  </div>
{:else if error}
  <div class="turnout-chart">
    <div class="chart-label">{$_('charts.voterTurnout')}</div>
    <div class="error-box">
      <span class="error-text">{$_('charts.failedToLoad')}</span>
    </div>
  </div>
{:else if hasData}
  <div class="turnout-chart">
    <div class="chart-label">{$_('charts.voterTurnout')}</div>
    <div class="chart-view" bind:this={chartContainer}></div>
  </div>
{/if}

<style>
  .turnout-chart {
    margin-bottom: 24px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
  }

  .chart-label {
    font-family: 'Manjari', monospace;
    font-size: var(--fs-xs);
    letter-spacing: 0.08em;
    color: var(--muted);
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .chart-view {
    width: 100%;
    height: 180px;
  }

  .loading-box, .error-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    background: var(--card2);
    border: 1px dashed var(--border);
    border-radius: 8px;
  }

  .loading-text, .error-text {
    font-family: 'Manjari', monospace;
    font-size: var(--fs-xs);
    color: var(--muted);
  }
</style>