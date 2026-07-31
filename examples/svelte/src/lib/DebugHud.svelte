<script lang="ts">
  import {focusedNode} from './dpad';
</script>

<div class="debug-hud glass-panel mono" class:visible={$focusedNode}>
  <div><span class="dot"></span><b>SPATIAL NODE ACTIVE</b></div>
  <div class="row">ID: <b>{$focusedNode?.id ?? 'none'}</b></div>
  <div class="row">TABINDEX: <b>{$focusedNode?.tabindex ?? 0}</b></div>
  <div class="row">COORDS: <b>{$focusedNode ? `${$focusedNode.x}, ${$focusedNode.y}` : '0, 0'}</b></div>
</div>
