import {useState} from 'react';
import {dpad, refreshDpad, toggleDebug, useDebugOn, useFocusedNode} from '../lib/dpad';
import styles from './Settings.module.css';

const navItems = [
  {id: 'settings-display', icon: 'desktop_windows', label: 'Display'},
  {id: 'settings-audio', icon: 'volume_up', label: 'Audio & Voice'},
  {id: 'settings-network', icon: 'wifi', label: 'Network'},
  {id: 'settings-privacy', icon: 'shield', label: 'Privacy'},
];

export default function Settings() {
  const debugOn = useDebugOn();
  const focused = useFocusedNode();
  const [shaderOn, setShaderOn] = useState(true);
  const [zSpaceDebug, setZSpaceDebug] = useState(false);

  function resetFocusState() {
    refreshDpad();
    dpad.setCurrentFocusItem(0);
  }

  return (
    <>
      <div className={styles.settingsShell}>
        <div className={styles.settingsNav}>
          <h4>Settings</h4>
          {navItems.map((item, i) => (
            <button
              key={item.id}
              className={`dpad-focusable ${styles.listFocus} list-focus${i === 0 ? ` ${styles.listFocusActive}` : ''}`}
              tabIndex={0}
              data-node-id={item.id}
              data-dpad-initial-focus={i === 0 ? true : undefined}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.panels}>
          <div className={styles.panel}>
            <h5>Device Identity</h5>
            <div className={`${styles.field} dpad-focusable`} role="button" tabIndex={0} data-node-id="device-name">
              <span>Spatial-Node-01</span>
              <span className={styles.hint}>
                <span className="material-symbols-outlined" style={{fontSize: 16}}>
                  edit
                </span>
                Press OK to Edit
              </span>
            </div>
            <p style={{marginTop: 16, marginBottom: 0}}>
              The name displayed when broadcasting to other spatial nodes on your network.
            </p>
          </div>

          <div className={styles.panelCols}>
            <div className={styles.panel}>
              <h5>Atmospheric Depth</h5>
              <p>Enable background shaders and glassmorphism effects for a more immersive experience.</p>
              <div className={styles.field}>
                <span>Enable Shader Layer</span>
                <button
                  className={`dpad-focusable ${styles.switch}${shaderOn ? ` ${styles.switchOn}` : ''}`}
                  tabIndex={0}
                  data-node-id="shader-layer"
                  role="switch"
                  aria-label="Enable Shader Layer"
                  aria-checked={shaderOn}
                  onClick={() => setShaderOn((v) => !v)}
                />
              </div>
            </div>
            <div className={styles.panel}>
              <h5>Telemetry Nodes</h5>
              <button
                type="button"
                className={`dpad-focusable ${styles.checkboxRow}`}
                tabIndex={0}
                data-node-id="show-focus-vectors"
                aria-pressed={debugOn}
                onClick={toggleDebug}
              >
                <span className={`${styles.checkboxBox}${debugOn ? ` ${styles.checkboxBoxChecked}` : ''}`} aria-hidden="true" />
                Show Focus Vectors
              </button>
              <button
                type="button"
                className={`dpad-focusable ${styles.checkboxRow}`}
                tabIndex={0}
                data-node-id="z-space-debugging"
                aria-pressed={zSpaceDebug}
                onClick={() => setZSpaceDebug((v) => !v)}
              >
                <span
                  className={`${styles.checkboxBox}${zSpaceDebug ? ` ${styles.checkboxBoxChecked}` : ''}`}
                  aria-hidden="true"
                />
                Z-Space Debugging
              </button>
            </div>
          </div>

          <button className={`dpad-focusable ${styles.resetBtn}`} tabIndex={0} data-node-id="reset-focus-state" onClick={resetFocusState}>
            <span className="material-symbols-outlined">restart_alt</span>Reset Focus State
          </button>
        </div>
      </div>

      <div className="debug-hud glass-panel mono visible" style={{bottom: 32, right: 32}}>
        <div>
          <span className="dot" />
          <b>SPATIAL DEBUGGER ACTIVE</b>
        </div>
        <div className="row">
          Focus ID: <b>{focused?.id?.toUpperCase() ?? 'NONE'}</b>
        </div>
        <div className="row">
          Traversal: <b>D-PAD_LIBRARY</b>
        </div>
      </div>
    </>
  );
}
