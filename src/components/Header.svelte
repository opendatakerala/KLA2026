<script>
  export let totalCandidates = '—';
</script>

<header>
  <div class="header-stripe"></div>
  <div class="header-inner">
    <div class="header-logo-wrap">
      <img class="header-logo" src="https://opendatakerala.org/LSG2025/assets/logo-DnFodOdy.png" alt="OpenDataKerala Logo" />
    </div>
    <div class="header-title">
      <div class="header-eyebrow" data-i18n="site.title">Kerala Legislative Assembly</div>
      <h1>Election <em>2026</em></h1>
      <div class="header-tagline">
        <span data-i18n="site.tagline">Candidate list across all 140 constituencies · 14 districts</span>
        <span>&nbsp;&bull; <span data-i18n="site.initiative">an OpenDataKerala Community Initiative</span></span>
      </div>
    </div>
    <div class="header-right">
      <div class="header-stats">
        <div class="hstat">
          <div class="hstat-num">140</div>
          <div class="hstat-label" data-i18n="header.seats">Seats</div>
        </div>
        <div class="hstat">
          <div class="hstat-num" id="total-candidates">{totalCandidates}</div>
          <div class="hstat-label" data-i18n="header.announcedCandidates">Announced Candidates *</div>
        </div>
      </div>
      <div class="lang-switcher" id="lang-switcher">
        <button class="lang-btn active" data-lang="en">EN</button>
        <button class="lang-btn" data-lang="ml">മല</button>
      </div>
    </div>
  </div>
</header>

<style>
  header {
    background: #fff;
    border-bottom: 1px solid var(--border);
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  }

  .header-stripe {
    height: 4px;
    background: linear-gradient(90deg, var(--ldf) 25%, var(--udf) 25% 50%, var(--nda) 50% 75%, var(--others) 75%);
  }

  .header-inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px 32px 18px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 20px;
  }

  .header-logo-wrap { display: flex; align-items: center; flex-shrink: 0; }
  .header-logo { width: 60px; height: 60px; object-fit: contain; border-radius: 10px; }

  .header-title { flex: 1; }

  .header-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    color: #000;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 4px;
    display: flex; align-items: center; gap: 10px;
  }

  .header-eyebrow::before {
    content: '';
    display: inline-block;
    width: 16px; height: 2px;
    background: #000;
    border-radius: 1px;
  }

  h1 {
    font-family: 'Inter', sans-serif;
    font-size: clamp(20px, 3vw, 44px);
    font-weight: 900;
    line-height: 1.05;
    color: #000;
    letter-spacing: -0.02em;
  }

  h1 em { font-style: italic; color: #000; }

  .header-tagline {
    font-size: 12px;
    color: #000;
    font-weight: 700;
    margin-top: 3px;
  }

  .header-tagline span {
    font-size: 11px;
    color: var(--gold);
    font-weight: 600;
    font-style: italic;
  }

  .header-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    flex-shrink: 0;
  }

  .header-stats { display: flex; gap: 18px; align-items: flex-end; }
  .hstat { text-align: right; }
  .hstat-num {
    font-family: 'Inter', sans-serif;
    font-size: 26px;
    font-weight: 900;
    color: #000;
    line-height: 1;
  }
  .hstat-label {
    font-family: 'DM Mono', monospace;
    font-size: 8px;
    color: #000;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .lang-switcher {
    display: flex;
    gap: 2px;
    background: var(--bg2);
    border-radius: 6px;
    padding: 2px;
    margin-left: 12px;
  }
  
  .lang-btn {
    padding: 4px 8px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.05em;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
  }
  
  .lang-btn:hover {
    color: var(--text);
    background: var(--card);
  }
  
  .lang-btn.active {
    background: var(--card);
    color: var(--gold);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  @media (max-width: 640px) {
    .header-stripe { height: 3px; }
    .header-inner {
      grid-template-columns: auto 1fr;
      padding: 12px 16px 10px;
      gap: 12px;
    }
    .header-logo { width: 44px; height: 44px; }
    .header-right { display: none; }
    h1 { font-size: 22px; }
    .header-eyebrow { font-size: 9px; }
    .header-tagline { font-size: 11px; }
  }
</style>
