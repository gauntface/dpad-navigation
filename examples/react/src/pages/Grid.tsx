import {toggleDebug, useDebugOn, useFocusedNode} from '../lib/dpad';
import styles from './Grid.module.css';

const simpleNodes = ['05', '06', '07', '08', '09'];

export default function Grid() {
  const debugOn = useDebugOn();
  const focused = useFocusedNode();

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h2>Navigation Lab</h2>
          <p>
            Complex 5-column spatial traversal testing — irregular spans force the library's nearest-neighbor logic,
            not simple grid-index math.
          </p>
        </div>
        <button className={styles.debugToggleBtn} onClick={toggleDebug} data-node-id="debug-toggle">
          <span className="material-symbols-outlined" style={{fontSize: 18}}>
            bug_report
          </span>
          Debug Mode: {debugOn ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className={styles.labGrid}>
        <div className={`dpad-focusable ${styles.node}`} role="button" tabIndex={0} data-node-id="node-01" data-dpad-initial-focus>
          01
        </div>
        <div className={`dpad-focusable ${styles.node} ${styles.wide}`} role="button" tabIndex={0} data-node-id="node-02">
          02 — Wide Node
        </div>
        <div className={`dpad-focusable ${styles.node}`} role="button" tabIndex={0} data-node-id="node-03">
          03
        </div>
        <div className={`dpad-focusable ${styles.node}`} role="button" tabIndex={0} data-node-id="node-04">
          04
        </div>

        {simpleNodes.map((n) => (
          <div key={n} className={`dpad-focusable ${styles.node}`} role="button" tabIndex={0} data-node-id={`node-${n}`}>
            {n}
          </div>
        ))}

        <div className={`dpad-focusable ${styles.node} ${styles.feature}`} role="button" tabIndex={0} data-node-id="node-feature">
          Feature Node — Path Test
          <p>Spanning 3 columns forces unique up/down logic across the items above and below.</p>
        </div>
        <div className={`dpad-focusable ${styles.node}`} role="button" tabIndex={0} data-node-id="node-10">
          10
        </div>
        <div className={`dpad-focusable ${styles.node}`} role="button" tabIndex={0} data-node-id="node-11">
          11
        </div>

        <div className={`dpad-focusable ${styles.node}`} role="button" tabIndex={0} data-node-id="node-12">
          12
        </div>
        <div className={`dpad-focusable ${styles.node} ${styles.footer}`} role="button" tabIndex={0} data-node-id="node-13">
          13 — Massive Footer Node
        </div>
      </div>

      <div className={styles.labStatus}>
        <span>
          Focus Count: <b>14 Nodes</b>
        </span>
        <span>
          Grid Layout: <b>5-Column Responsive</b>
        </span>
        <span>
          Current Pos: <b>{focused?.id ?? 'node-01'}</b>
        </span>
      </div>
    </>
  );
}
