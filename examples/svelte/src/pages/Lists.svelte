<script lang="ts">
  import {focusedNode} from '../lib/dpad';

  const categories = [
    {id: 'cat-recommended', icon: 'auto_awesome', label: 'Recommended'},
    {id: 'cat-originals', icon: 'movie', label: 'Cinema Originals'},
    {id: 'cat-recent', icon: 'history', label: 'Recently Viewed'},
    {id: 'cat-favorites', icon: 'favorite', label: 'My Favorites'},
  ];

  const rows = [
    {
      id: 'row-neon-genesis',
      title: 'Neon Genesis',
      desc: 'A deep dive into the architecture of the 24th century.',
      badge: 'ULTRA HD',
      badgeBg: 'var(--primary)',
      badgeFg: 'var(--on-primary)',
      gradient: 'linear-gradient(135deg, #1b2a4a, #0b1326)',
      rating: '4.9',
      length: '2h 15m',
    },
    {
      id: 'row-ethereal-peaks',
      title: 'Ethereal Peaks',
      desc: 'Escape to the highest altitudes of the world.',
      badge: 'HDR10+',
      badgeBg: 'var(--secondary)',
      badgeFg: '#2c0051',
      gradient: 'linear-gradient(135deg, #3a1b4a, #0b1326)',
      rating: '4.8',
      length: '1h 40m',
    },
    {
      id: 'row-liquid-motion',
      title: 'Liquid Motion',
      desc: 'An abstract exploration of fluid dynamics.',
      badge: 'SPATIAL AUDIO',
      badgeBg: 'var(--tertiary)',
      badgeFg: '#00363e',
      gradient: 'linear-gradient(135deg, #0f4a3a, #0b1326)',
      rating: '5.0',
      length: '45m',
    },
  ];

  let axisLock = $state('VERTICAL');
</script>

<div class="lists-shell">
  <div class="categories">
    <h4>CATEGORIES</h4>
    {#each categories as cat, i (cat.id)}
      <button
        class="dpad-focusable list-focus"
        tabindex="0"
        data-node-id={cat.id}
        data-dpad-initial-focus={i === 0 ? true : undefined}
        onfocus={() => (axisLock = 'VERTICAL')}
      >
        <span class="material-symbols-outlined">{cat.icon}</span>{cat.label}
      </button>
    {/each}

    <div class="axis-panel glass-panel">
      <div class="row">FOCUS_NODE_ID: <b>{$focusedNode?.id ?? 'cat-recommended'}</b></div>
      <div class="row">AXIS_LOCK: <b>{axisLock}</b></div>
    </div>
  </div>

  <div class="content-col">
    <h2>Cinematic Highlights</h2>
    <p>Explore the latest high-fidelity spatial experiences curated for the 10-foot UI.</p>

    {#each rows as row (row.id)}
      <div
        class="dpad-focusable media-row"
        role="button"
        tabindex="0"
        data-node-id={row.id}
        onfocus={() => (axisLock = 'HORIZONTAL')}
      >
        <div class="thumb" style="background: {row.gradient};"></div>
        <div class="body">
          <span class="badge" style="background: {row.badgeBg}; color: {row.badgeFg};">{row.badge}</span>
          <h3>{row.title}</h3>
          <p>{row.desc}</p>
          <div class="meta"><span>★ {row.rating}</span><span>{row.length}</span></div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .lists-shell {
    display: flex;
    gap: 56px;
    align-items: flex-start;
  }
  .categories {
    width: 260px;
    flex: none;
  }
  .categories h4 {
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.15em;
    font-size: 13px;
    color: var(--on-surface-variant);
    margin-bottom: 20px;
  }
  .categories :global(.list-focus) {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-radius: 10px;
    font-size: 16px;
    background: transparent;
    border: none;
    color: var(--on-surface);
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
    box-sizing: border-box;
  }
  .content-col {
    flex: 1;
    min-width: 0;
  }
  .content-col h2 {
    font-size: 32px;
    margin: 0 0 8px;
  }
  .content-col > p {
    color: var(--on-surface-variant);
    margin: 0 0 32px;
  }
  .media-row {
    display: flex;
    gap: 24px;
    border-radius: 14px;
    border: 1px solid var(--outline-variant);
    background: var(--surface-container);
    padding: 20px;
    margin-bottom: 20px;
    align-items: center;
    box-sizing: border-box;
  }
  .thumb {
    width: 220px;
    height: 130px;
    border-radius: 10px;
    flex: none;
  }
  .body {
    flex: 1;
    min-width: 0;
  }
  .body h3 {
    margin: 0 0 8px;
    font-size: 24px;
  }
  .body p {
    margin: 0 0 12px;
    color: var(--on-surface-variant);
    font-size: 15px;
  }
  .badge {
    padding: 6px 16px;
    border-radius: 999px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    float: right;
  }
  .meta {
    display: flex;
    gap: 20px;
    color: var(--secondary);
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
  }
  .axis-panel {
    margin-top: 32px;
    padding: 20px;
    border-radius: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
  }
  .axis-panel .row {
    margin: 6px 0;
    color: var(--on-surface-variant);
  }
  .axis-panel b {
    color: var(--secondary);
  }
</style>
