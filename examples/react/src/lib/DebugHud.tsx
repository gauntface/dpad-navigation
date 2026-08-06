import {useFocusedNode} from './dpad';

export default function DebugHud() {
  const node = useFocusedNode();

  return (
    <div className={`debug-hud glass-panel mono${node ? ' visible' : ''}`}>
      <div>
        <span className="dot" />
        <b>SPATIAL NODE ACTIVE</b>
      </div>
      <div className="row">
        ID: <b>{node?.id ?? 'none'}</b>
      </div>
      <div className="row">
        TABINDEX: <b>{node?.tabindex ?? 0}</b>
      </div>
      <div className="row">
        COORDS: <b>{node ? `${node.x}, ${node.y}` : '0, 0'}</b>
      </div>
    </div>
  );
}
