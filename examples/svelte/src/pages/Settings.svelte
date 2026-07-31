<script lang="ts">
  import {dpad, debugController, debugOn, focusedNode, refreshDpad} from '../lib/dpad';

  const navItems = [
    {id: 'settings-display', icon: 'desktop_windows', label: 'Display'},
    {id: 'settings-audio', icon: 'volume_up', label: 'Audio & Voice'},
    {id: 'settings-network', icon: 'wifi', label: 'Network'},
    {id: 'settings-privacy', icon: 'shield', label: 'Privacy'},
  ];

  let shaderOn = $state(true);
  let zSpaceDebug = $state(false);

  function toggleShowFocusVectors() {
    debugController.toggleDebugMode();
    debugOn.update((v) => !v);
  }

  function resetFocusState() {
    refreshDpad();
    dpad.setCurrentFocusItem(0);
  }
</script>

<div class="settings-shell">
  <div class="settings-nav">
    <h4>Settings</h4>
    {#each navItems as item, i (item.id)}
      <button
        class="dpad-focusable list-focus"
        class:active={i === 0}
        tabindex="0"
        data-node-id={item.id}
        data-dpad-initial-focus={i === 0 ? true : undefined}
      >
        <span class="material-symbols-outlined">{item.icon}</span>{item.label}
      </button>
    {/each}
  </div>

  <div class="panels">
    <div class="panel">
      <h5>Device Identity</h5>
      <div class="field dpad-focusable" role="button" tabindex="0" data-node-id="device-name">
        <span>Spatial-Node-01</span>
        <span class="hint"><span class="material-symbols-outlined" style="font-size: 16px;">edit</span>Press OK to Edit</span>
      </div>
      <p style="margin-top: 16px; margin-bottom: 0;">The name displayed when broadcasting to other spatial nodes on your network.</p>
    </div>

    <div class="panel-cols">
      <div class="panel">
        <h5>Atmospheric Depth</h5>
        <p>Enable background shaders and glassmorphism effects for a more immersive experience.</p>
        <div class="field">
          <span>Enable Shader Layer</span>
          <button
            class="dpad-focusable switch"
            class:on={shaderOn}
            tabindex="0"
            data-node-id="shader-layer"
            role="switch"
            aria-label="Enable Shader Layer"
            aria-checked={shaderOn}
            onclick={() => (shaderOn = !shaderOn)}
          ></button>
        </div>
      </div>
      <div class="panel">
        <h5>Telemetry Nodes</h5>
        <button
          type="button"
          class="checkbox-row dpad-focusable"
          tabindex="0"
          data-node-id="show-focus-vectors"
          aria-pressed={$debugOn}
          onclick={toggleShowFocusVectors}
        >
          <span class="checkbox-box" class:checked={$debugOn} aria-hidden="true"></span>Show Focus Vectors
        </button>
        <button
          type="button"
          class="checkbox-row dpad-focusable"
          tabindex="0"
          data-node-id="z-space-debugging"
          aria-pressed={zSpaceDebug}
          onclick={() => (zSpaceDebug = !zSpaceDebug)}
        >
          <span class="checkbox-box" class:checked={zSpaceDebug} aria-hidden="true"></span>Z-Space Debugging
        </button>
      </div>
    </div>

    <button class="dpad-focusable reset-btn" tabindex="0" data-node-id="reset-focus-state" onclick={resetFocusState}>
      <span class="material-symbols-outlined">restart_alt</span>Reset Focus State
    </button>
  </div>
</div>

<div class="debug-hud glass-panel mono visible" style="bottom: 32px; right: 32px;">
  <div><span class="dot"></span><b>SPATIAL DEBUGGER ACTIVE</b></div>
  <div class="row">Focus ID: <b>{$focusedNode?.id?.toUpperCase() ?? 'NONE'}</b></div>
  <div class="row">Traversal: <b>D-PAD_LIBRARY</b></div>
</div>

<style>
  .settings-shell {
    display: flex;
    gap: 56px;
    align-items: flex-start;
  }
  .settings-nav {
    width: 240px;
    flex: none;
  }
  .settings-nav h4 {
    font-size: 18px;
    color: var(--on-surface-variant);
    margin: 0 0 20px;
  }
  .settings-nav :global(.list-focus) {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    border-radius: 10px;
    background: transparent;
    border: none;
    color: var(--on-surface);
    width: 100%;
    text-align: left;
    cursor: pointer;
    font: inherit;
    font-size: 16px;
    margin-bottom: 8px;
    box-sizing: border-box;
  }
  .settings-nav :global(.list-focus.active) {
    background: var(--surface-container-high);
    border-left: 4px solid var(--primary);
  }
  .panels {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 760px;
  }
  .panel {
    background: var(--surface-container);
    border: 1px solid var(--outline-variant);
    border-radius: 14px;
    padding: 28px;
    box-sizing: border-box;
  }
  .panel h5 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 600;
  }
  .panel p {
    color: var(--on-surface-variant);
    font-size: 15px;
    line-height: 1.5;
    margin: 0 0 16px;
  }
  .panel-cols {
    display: flex;
    gap: 24px;
  }
  .panel-cols .panel {
    flex: 1;
  }
  .field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface-container-high);
    border-radius: 10px;
    padding: 16px 20px;
    border: 2px solid transparent;
    box-sizing: border-box;
  }
  .field .hint {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--on-surface-variant);
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
  }
  .switch {
    width: 46px;
    height: 26px;
    border-radius: 999px;
    background: var(--surface-bright);
    border: none;
    position: relative;
    cursor: pointer;
  }
  .switch::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: white;
    top: 3px;
    left: 3px;
    transition: left 0.2s ease;
  }
  .switch.on {
    background: var(--primary);
  }
  .switch.on::after {
    left: 23px;
  }
  .checkbox-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    cursor: pointer;
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    font-size: 15px;
    width: 100%;
    text-align: left;
  }
  .checkbox-box {
    width: 20px;
    height: 20px;
    flex: none;
    border-radius: 4px;
    border: 2px solid var(--outline);
    position: relative;
  }
  .checkbox-box.checked {
    background: var(--primary);
    border-color: var(--primary);
  }
  .checkbox-box.checked::after {
    content: '';
    position: absolute;
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid var(--on-primary);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  .reset-btn {
    align-self: center;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 40px;
    border-radius: 999px;
    border: none;
    background: var(--secondary);
    color: #2c0051;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
  }
</style>
