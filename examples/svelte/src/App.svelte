<script lang="ts">
  import {tick} from 'svelte';
  import SideNav from './lib/SideNav.svelte';
  import TopBar from './lib/TopBar.svelte';
  import DebugHud from './lib/DebugHud.svelte';
  import Home from './pages/Home.svelte';
  import Grid from './pages/Grid.svelte';
  import Lists from './pages/Lists.svelte';
  import Settings from './pages/Settings.svelte';
  import {refreshDpad, focusInitial} from './lib/dpad';

  function routeFromHash(): string {
    return window.location.hash.replace(/^#\/?/, '') || 'home';
  }

  let route = $state(routeFromHash());

  window.addEventListener('hashchange', () => {
    route = routeFromHash();
  });

  $effect(() => {
    // Re-run whenever `route` changes. Wait for Svelte to finish patching the
    // DOM, then tell the real dpad-nav library to rebuild its focus graph
    // for whatever `.dpad-focusable` elements are now on screen.
    void route;
    tick().then(() => {
      refreshDpad();
      focusInitial();
    });
  });
</script>

<div class="app-shell">
  <SideNav {route} />
  <main class="main no-scrollbar">
    <TopBar />
    {#if route === 'grid'}
      <Grid />
    {:else if route === 'lists'}
      <Lists />
    {:else if route === 'settings'}
      <Settings />
    {:else}
      <Home />
    {/if}
  </main>
</div>
<DebugHud />
