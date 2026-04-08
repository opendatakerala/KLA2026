<script>
  import { onMount } from 'svelte';
  import { getCandidateSymbol } from '../../lib/symbols.js';
  import symbolData from '../../data/symbol-distribution.json';

  const { isActive = false } = $props();

  const minImageSize = 80;
  const maxImageSize = 300;

  let symbols = $state([]);
  let loaded = $state(false);

  $effect(() => {
    if (isActive && !loaded) {
      loadSymbols();
    }
  });

  async function loadSymbols() {
    const entries = Object.entries(symbolData);
    const maxCount = Math.max(...entries.map(([, count]) => count), 1);
    const minCount = Math.min(...entries.map(([, count]) => count), 0);

    const items = await Promise.all(
      entries.map(async ([symbol, count], index) => {
        const src = await getCandidateSymbol(symbol);
        return {
          id: index,
          name: symbol,
          imageUrl: src,
          count,
          size: getSize(count, minCount, maxCount)
        };
      })
    );

    symbols = items;
    loaded = true;
  }

  function getSize(count, minCount, maxCount) {
    if (maxCount === minCount) return (minImageSize + maxImageSize) / 2;
    const scale = (count - minCount) / (maxCount - minCount);
    return minImageSize + (scale * (maxImageSize - minImageSize));
  }
</script>

<div class="symbol-cloud">
  {#if loaded}
    {#each symbols as item (item.id)}
      <div class="symbol-wrapper" style="--size: {item.size}px;">
        {#if item.imageUrl}
          <img src={item.imageUrl} alt={item.name} loading="lazy" />
        {:else}
          <span class="fallback">{item.name.slice(0, 2)}</span>
        {/if}
        
        <span class="tooltip">
          <strong>{item.name}</strong><br/>
          Used {item.count} times
        </span>
      </div>
    {/each}
  {:else}
    <div class="loading">Loading symbols...</div>
  {/if}
</div>

<style>
  .symbol-cloud {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    gap: 12px;
    padding: 2rem;
    background-color: var(--card);
    border-radius: 12px;
    margin: 0 auto;
    min-height: 400px;
  }

  .symbol-wrapper {
    position: relative;
    width: var(--size);
    height: var(--size);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
  }

  .symbol-wrapper:hover {
    transform: scale(1.15);
    z-index: 10;
  }

  .symbol-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .fallback {
    font-family: 'Manjari', sans-serif;
    font-size: 12px;
    color: var(--muted);
  }

  .tooltip {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(15, 23, 42, 0.95);
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.875rem;
    text-align: center;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, transform 0.2s ease;
    pointer-events: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: rgba(15, 23, 42, 0.95) transparent transparent transparent;
  }

  .symbol-wrapper:hover .tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-4px);
  }

  .loading {
    font-family: 'Manjari', sans-serif;
    color: var(--muted);
  }
</style>