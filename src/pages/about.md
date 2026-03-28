---
layout: ../components/LayoutSimple.astro
title: About - Kerala Legislative Assembly Election 2026
---

<div class="about-container">
  <a href="/KLA2026/" class="back-link">← Back to Home</a>

  <h1>About</h1>

  <p>
    This is an OpenDataKerala initiative to track and display candidate information for the Kerala Legislative Assembly Election 2026.
    The data is sourced from various media outlets, party social media handles, and the CEC Kerala website.
  </p>

  <h2>Team</h2>
  <p>To be announced.</p>

  <h2>Report Issues</h2>
  <p>
    If you find any errors or have suggestions, please report them:
  </p>
  <ul>
    <li><strong>GitHub:</strong> <a href="https://github.com/opendatakerala/KLA2026/issues" target="_blank" rel="noopener">https://github.com/opendatakerala/KLA2026/issues</a></li>
    <li><strong>Email:</strong> <a href="mailto:opendatakerala@gmail.com">opendatakerala@gmail.com</a></li>
  </ul>
</div>

<style>
  .about-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 24px;
    font-family: 'Inter', sans-serif;
    color: var(--text);
  }
  .back-link {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--gold);
    text-decoration: none;
    margin-bottom: 24px;
    transition: color 0.2s;
  }
  .back-link:hover {
    color: var(--gold-mid);
  }
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 24px;
    color: var(--text);
  }
  h2 {
    font-size: 22px;
    font-weight: 600;
    margin-top: 36px;
    margin-bottom: 16px;
    color: var(--text);
  }
  p {
    font-size: 15px;
    line-height: 1.7;
    color: var(--text-soft);
    margin-bottom: 16px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    font-size: 14px;
    margin-bottom: 10px;
    color: var(--text-soft);
  }
  li strong {
    color: var(--text);
  }
  a {
    color: var(--udf);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  a:hover {
    color: var(--gold);
  }
</style>
