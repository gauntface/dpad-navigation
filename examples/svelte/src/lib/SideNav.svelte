<script lang="ts">
  let {route}: {route: string} = $props();

  const items = [
    {id: 'home', href: '#/', icon: 'home', label: 'Home'},
    {id: 'grid', href: '#/grid', icon: 'grid_view', label: 'Grid Demo'},
    {id: 'lists', href: '#/lists', icon: 'list', label: 'Lists'},
    {id: 'settings', href: '#/settings', icon: 'settings', label: 'Settings'},
  ];
</script>

<aside class="side-nav">
  <div class="brand">
    <span class="material-symbols-outlined icon">spatial_audio_off</span>
    <span>Spatial Demo</span>
  </div>
  <nav>
    {#each items as item, i (item.id)}
      <a
        class="dpad-focusable nav-item"
        class:active={route === item.id}
        href={item.href}
        tabindex={i + 1}
        data-node-id="nav-{item.id}"
      >
        <span class="material-symbols-outlined icon">{item.icon}</span>
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>
  <div class="avatar"></div>
</aside>
