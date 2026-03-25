<script>
  export let stats = { ldf: 0, udf: 0, nda: 0, sc: 0, st: 0 };
</script>

<div class="stats-row">
  <div class="stat-cell ldf">
    <div class="stat-n" id="stat-ldf">{stats.ldf}</div>
    <div class="stat-label" data-i18n="stats.ldf">LDF Candidates</div>
  </div>
  <div class="stat-cell udf">
    <div class="stat-n" id="stat-udf">{stats.udf}</div>
    <div class="stat-label" data-i18n="stats.udf">UDF Candidates</div>
  </div>
  <div class="stat-cell nda">
    <div class="stat-n" id="stat-nda">{stats.nda}</div>
    <div class="stat-label" data-i18n="stats.nda">NDA Candidates</div>
  </div>
  <div class="stat-cell sc">
    <div class="stat-n" id="stat-sc">{stats.sc}</div>
    <div class="stat-label" data-i18n="stats.sc">SC Reserved</div>
  </div>
  <div class="stat-cell st">
    <div class="stat-n" id="stat-st">{stats.st}</div>
    <div class="stat-label" data-i18n="stats.st">ST Reserved</div>
  </div>
</div>

<style>
  .stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 10px;
    margin-bottom: 28px;
  }

  .stat-cell {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 16px 14px;
    position: relative;
    overflow: hidden;
  }

  .stat-cell::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
  }

  .stat-cell.ldf::before { background: var(--ldf); }
  .stat-cell.udf::before { background: var(--udf); }
  .stat-cell.nda::before { background: var(--nda); }
  .stat-cell.sc::before { background: var(--sc-color); }
  .stat-cell.st::before { background: var(--st-color); }

  .stat-n {
    font-family: 'Inter', sans-serif;
    font-size: 34px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 6px;
  }

  .stat-cell.ldf .stat-n { color: var(--ldf); }
  .stat-cell.udf .stat-n { color: var(--udf); }
  .stat-cell.nda .stat-n { color: var(--nda); }
  .stat-cell.sc .stat-n { color: var(--sc-color); }
  .stat-cell.st .stat-n { color: var(--st-color); }

  .stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
  }
</style>
