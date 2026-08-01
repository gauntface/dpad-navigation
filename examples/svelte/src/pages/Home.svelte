<script lang="ts">
  const trending = [
    {id: 'signal-lost', title: 'Signal Lost', gradient: 'linear-gradient(135deg, #1b2a4a, #0b1326)'},
    {id: 'velocity-noir', title: 'Velocity Noir', gradient: 'linear-gradient(135deg, #3a1b4a, #0b1326)'},
    {id: 'eden-404', title: 'Eden 404', gradient: 'linear-gradient(135deg, #0f4a3a, #0b1326)'},
    {id: 'protocol-7', title: 'Protocol 7', gradient: 'linear-gradient(135deg, #4a1b2e, #0b1326)'},
  ];

  const library = [
    {id: 'orbital', title: 'Orbital', gradient: 'linear-gradient(160deg, #2a2450, #0b1326)'},
    {id: 'synthesis', title: 'Synthesis', gradient: 'linear-gradient(160deg, #4a3a1b, #0b1326)'},
    {id: 'retroglow', title: 'Retroglow', gradient: 'linear-gradient(160deg, #4a1b45, #0b1326)'},
    {id: 'monolith', title: 'Monolith', gradient: 'linear-gradient(160deg, #33394a, #0b1326)'},
    {id: 'flux', title: 'Flux', gradient: 'linear-gradient(160deg, #1b3a4a, #0b1326)'},
  ];
</script>

<section class="hero">
  <div class="eyebrow">ORIGINAL SERIES</div>
  <h2>THE NEON<br />CHRONICLES</h2>
  <p>In a world where memories are traded like currency, one rogue navigator must find the source code of reality before the system reboots.</p>
  <div class="hero-actions">
    <button class="dpad-focusable btn btn-primary" tabindex="0" data-node-id="play-now" data-dpad-initial-focus>
      <span class="material-symbols-outlined">play_arrow</span>Play Now
    </button>
    <button class="dpad-focusable btn btn-secondary" tabindex="0" data-node-id="more-info">
      <span class="material-symbols-outlined">info</span>More Info
    </button>
  </div>
</section>

<section class="shelf">
  <div class="shelf-head">
    <h3>Trending Now</h3>
    <span>View All</span>
  </div>
  <div class="rail no-scrollbar">
    {#each trending as item (item.id)}
      <div class="dpad-focusable card wide" role="button" tabindex="0" data-node-id={item.id} style="background: {item.gradient};">
        {item.title}
      </div>
    {/each}
  </div>
</section>

<section class="shelf">
  <div class="shelf-head">
    <h3>Your Library</h3>
    <span>Sort by Recent</span>
  </div>
  <div class="rail no-scrollbar">
    {#each library as item (item.id)}
      <div class="dpad-focusable card tall" role="button" tabindex="0" data-node-id={item.id} style="background: {item.gradient};">
        {item.title}
      </div>
    {/each}
  </div>
</section>

<style>
  .hero {
    padding: 40px 0 80px;
    max-width: 640px;
  }
  .eyebrow {
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.2em;
    color: var(--secondary);
    font-size: 14px;
  }
  h2 {
    font-size: 56px;
    line-height: 1.1;
    margin: 16px 0 24px;
  }
  .hero p {
    color: var(--on-surface-variant);
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 32px;
  }
  .hero-actions {
    display: flex;
    gap: 20px;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 32px;
    border-radius: 12px;
    border: 1px solid transparent;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
  }
  .btn-primary {
    background: var(--primary);
    color: var(--on-primary);
  }
  .btn-secondary {
    background: rgba(45, 52, 73, 0.6);
    color: var(--on-surface);
    border-color: var(--outline-variant);
  }
  .shelf {
    margin-bottom: 56px;
  }
  .shelf-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 20px;
  }
  .shelf-head h3 {
    font-size: 24px;
    margin: 0;
  }
  .shelf-head span {
    color: var(--secondary);
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
  }
  .rail {
    display: flex;
    gap: 24px;
    overflow-x: auto;
    /* The focused card scales up (transform: scale(1.05)) and grows a
       25px glow (box-shadow); overflow-x: auto clips both at this
       container's edge, so the first/last card looked clipped when
       focused. Give the scroll box 40px of padding on every side as
       breathing room, then pull it back with a matching negative
       margin so the rail's resting-state alignment with its heading
       above is unaffected. */
    margin: 0 -40px;
    padding: 24px 40px;
  }
  .card {
    flex: none;
    border-radius: 14px;
    border: 2px solid transparent;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: flex-end;
    padding: 16px;
    font-weight: 700;
    color: white;
    box-sizing: border-box;
  }
  .card.wide {
    width: 320px;
    aspect-ratio: 16 / 9;
  }
  .card.tall {
    width: 200px;
    aspect-ratio: 2 / 3;
  }
</style>
