# AGENTS.md - Guidelines for AI Coding Agents

This document provides guidelines for AI agents working on the KLA (Kerala Legislative Assembly Election 2026) codebase.

## Project Overview

- **Tech Stack**: Astro, Svelte 5, Nanostores (state management), ECharts (charts)
- **Build System**: Vite (via Astro)
- **No tests configured** - Do not add tests unless explicitly requested

## Build Commands

```bash
# Development
npm run dev          # Start dev server
npm run start        # Alias for dev

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Astro
npm run astro        # Run astro CLI
```

## Data Generation Scripts

```bash
# Run individual data generation script
node scripts/index.js --script constituencies

# Run all scripts
node scripts/index.js --all

# Available scripts: constituencies, historical-comparison, candidates-by-party, 
# gender-distribution, education-distribution, criminal-cases, assets-distribution, kla-map-svg
```

## Code Style Guidelines

### General Principles
- Keep code concise and focused - avoid unnecessary abstractions
- Use existing patterns in the codebase
- Prioritize readability over cleverness
- NO comments unless explicitly requested by user

### Svelte Components (.svelte)
- Use Svelte 5 runes (`$state`, `$derived`, `$effect`) for reactive state
- Component styles should be in `<style>` block scoped to the component
- Use semantic HTML elements
- Prefer `#each` blocks over manual HTML string construction
- Avoid `{@html}` - use proper Svelte templates instead
- Access stores directly with `$storeName` syntax

### JavaScript (.js)
- Use ES modules (`import`/`export`)
- Use named exports for functions
- Prefer `const` over `let` - use only when mutation is necessary

### Naming Conventions
- **Files**: kebab-case (e.g., `constituencyStore.js`, `DataExplorer.svelte`)
- **Components**: PascalCase (e.g., `FilterBar.svelte`)
- **Functions**: camelCase (e.g., `setSearch`, `getHistoricalData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `COLORS`, `ALLIANCES`)
- **CSS Classes**: kebab-case (e.g., `.filter-btn`, `.active-tag`)
- **JSON Keys**: lowercase (e.g., `number`, `name`, `district`, `qid`)

### Store Patterns
- Use Nanostores (`atom`, `computed`)
- Initialize stores at module level with data
- Keep stores focused - one store per domain (constituencyStore, historicalStore)

### Data Handling
- JSON data lives in `src/data/`
- Data generation scripts in `scripts/`
- Use consistent keys: `number`, `name`, `district`, `qid` (not verbose names)
- Sort data in ascending order by default (e.g., years 2014 → 2019 → 2024)

### Component Architecture
- Components should be self-contained with their styles
- Avoid prop drilling - use stores when data is needed globally
- Extract related code into focused components (e.g., DataDisplay, DataExplorer)
- Put components in `src/components/`, charts in `src/components/charts/`
- Put stores in `src/stores/`

### CSS Guidelines
- Use CSS variables from `global.css` for colors (e.g., `var(--gold)`, `var(--border)`)
- Avoid hardcoding colors - use the defined variables
- Use `DM Mono` for monospace text, `Inter` for sans-serif
- Keep styles scoped to components when possible

### Error Handling
- Check for null/undefined before accessing properties
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Handle missing data gracefully in templates

## Important Patterns

### Accessing Store Data in Components
```svelte
<script>
  import { filteredConstituencies } from '../stores/constituencyStore.js';
  
  $: data = $filteredConstituencies;
</script>
```

### Reactive Statements
```svelte
<script>
  $: qid = $selectedConstituency?.qid;
  $: seriesData = qid ? getHistoricalData(qid) : [];
</script>
```

### Conditional Rendering
```svelte
{#if condition}
  <div>Content</div>
{:else}
  <div>Alternative</div>
{/if}
```

### Iterating with #each
```svelte
{#each items as item}
  <div>{item.name}</div>
{/each}
```

## Common Issues to Avoid

1. **Don't use `document.getElementById`** - Use Svelte bindings (`bind:this`) or reactive statements
2. **Don't craft HTML strings** - Use Svelte templates with `#each`
3. **Don't pass data via props when store would be better** - Access stores directly
4. **Don't mix data concerns** - Keep constituency data in one store, historical in another
5. **Don't forget to update reactive statements** - When using stores, ensure proper `$:` declarations

## File Structure

```
src/
├── components/          # Svelte components
│   ├── charts/          # Chart components
│   ├── *.svelte
├── data/                # JSON data files
├── lib/                 # Utilities (i18n, constants)
├── stores/              # Nanostores
└── styles/              # Global CSS
scripts/                 # Data generation scripts
```
