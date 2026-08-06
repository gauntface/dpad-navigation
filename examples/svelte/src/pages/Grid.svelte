<script lang="ts">
  import {toggleDebug, debugOn, focusedNode} from '../lib/dpad';

  const simpleNodes = ['05', '06', '07', '08', '09'];
</script>

<div class="page-head">
  <div>
    <h2>Navigation Lab</h2>
    <p>Complex 5-column spatial traversal testing — irregular spans force the library's nearest-neighbor logic, not simple grid-index math.</p>
  </div>
  <button class="debug-toggle-btn" onclick={toggleDebug} data-node-id="debug-toggle">
    <span class="material-symbols-outlined" style="font-size: 18px;">bug_report</span>
    Debug Mode: {$debugOn ? 'ON' : 'OFF'}
  </button>
</div>

<div class="lab-grid">
  <div class="dpad-focusable node" role="button" tabindex="0" data-node-id="node-01" data-dpad-initial-focus>01</div>
  <div class="dpad-focusable node wide" role="button" tabindex="0" data-node-id="node-02">02 — Wide Node</div>
  <div class="dpad-focusable node" role="button" tabindex="0" data-node-id="node-03">03</div>
  <div class="dpad-focusable node" role="button" tabindex="0" data-node-id="node-04">04</div>

  {#each simpleNodes as n (n)}
    <div class="dpad-focusable node" role="button" tabindex="0" data-node-id="node-{n}">{n}</div>
  {/each}

  <div class="dpad-focusable node feature" role="button" tabindex="0" data-node-id="node-feature">
    Feature Node — Path Test
    <p>Spanning 3 columns forces unique up/down logic across the items above and below.</p>
  </div>
  <div class="dpad-focusable node" role="button" tabindex="0" data-node-id="node-10">10</div>
  <div class="dpad-focusable node" role="button" tabindex="0" data-node-id="node-11">11</div>

  <div class="dpad-focusable node" role="button" tabindex="0" data-node-id="node-12">12</div>
  <div class="dpad-focusable node footer" role="button" tabindex="0" data-node-id="node-13">13 — Massive Footer Node</div>
</div>

<div class="lab-status">
  <span>Focus Count: <b>14 Nodes</b></span>
  <span>Grid Layout: <b>5-Column Responsive</b></span>
  <span>Current Pos: <b>{$focusedNode?.id ?? 'node-01'}</b></span>
</div>

<style>
  .page-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
  }
  .page-head h2 {
    font-size: 40px;
    margin: 0 0 8px;
    color: var(--primary);
  }
  .page-head p {
    color: var(--on-surface-variant);
    margin: 0;
    max-width: 640px;
  }
  .debug-toggle-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    border-radius: 999px;
    border: none;
    background: linear-gradient(90deg, #7b2ff7, #6f00be);
    color: white;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
  }
  .lab-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 24px;
  }
  .node {
    border: 1px solid var(--outline-variant);
    background: var(--surface-container);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: flex-end;
    min-height: 160px;
    font-size: 20px;
    font-weight: 700;
    box-sizing: border-box;
  }
  .node.feature {
    grid-column: span 3;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    background: linear-gradient(135deg, #1b2a4a, #0b1326);
  }
  .node.feature p {
    font-size: 14px;
    font-weight: 400;
    color: var(--on-surface-variant);
    margin: 8px 0 0;
  }
  .node.wide {
    grid-column: span 2;
    background: linear-gradient(135deg, #101d3d, #0b1326);
  }
  .node.footer {
    grid-column: span 4;
    background: linear-gradient(135deg, #0e1830, #0b1326);
  }
  .lab-status {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid var(--outline-variant);
    display: flex;
    gap: 48px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: var(--on-surface-variant);
  }
  .lab-status b {
    color: var(--tertiary);
  }
</style>
