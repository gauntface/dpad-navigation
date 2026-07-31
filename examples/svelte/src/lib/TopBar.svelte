<script lang="ts">
  import {toggleDebug, debugOn} from './dpad';
</script>

<header class="top-bar">
  <h1>SpatialExplorer</h1>
  <div class="top-bar-actions">
    <div class="search-box">
      <span class="material-symbols-outlined">search</span>
      <span>Search...</span>
    </div>
    <button
      class="dpad-focusable icon-btn"
      class:active={$debugOn}
      tabindex="0"
      data-node-id="debug-toggle"
      onclick={toggleDebug}
      title="Toggle debug vectors"
    >
      <span class="material-symbols-outlined">bug_report</span>
    </button>
    <button class="dpad-focusable icon-btn" tabindex="0" data-node-id="account" aria-label="Account">
      <span class="material-symbols-outlined">account_circle</span>
    </button>
  </div>
</header>
