<script>
  import { _ } from '../lib/i18n.js';
  let {content} = $props();
</script>

<div class="about-container">
  <a href="/KLA2026/" class="back-link">← {$_('about.back')}</a>

  <h1>{$_('about.title')}</h1>

  <p>
    {$_('about.description')}
  </p>

  <h2>{$_('about.reportIssues')}</h2>
  <p>
    {@html $_('about.reportIssuesIntro')}
  </p>
  
  {@html content}
</div>

<style>
  .about-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 24px;
    font-family: 'Manjari', sans-serif;
    color: var(--text);
  }
  .back-link {
    display: inline-block;
    font-family: 'Manjari', monospace;
    font-size: 12px;
    color: var(--gold);
    text-decoration: none;
    margin-bottom: 24px;
    transition: color 0.2s;
  }
  .back-link:hover {
    color: var(--gold-mid);
  }
  :global(.about-container h1) {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 24px;
    color: var(--text);
  }
  :global(.about-container h2) {
    font-size: 22px;
    font-weight: 600;
    margin-top: 36px;
    margin-bottom: 16px;
    color: var(--text);
  }
  :global(.about-container p) {
    font-size: 15px;
    line-height: 1.7;
    color: var(--text-soft);
    margin-bottom: 16px;
  }
  :global(.about-container ul) {
    list-style: none;
    padding: 0;
  }
  :global(.about-container li) {
    font-size: 14px;
    margin-bottom: 10px;
    color: var(--text-soft);
  }
  :global(.about-container li strong) {
    color: var(--text);
  }
  :global(.about-container a) {
    color: var(--udf);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  :global(.about-container a:hover) {
    color: var(--gold);
  }
</style>
