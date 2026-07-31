import {toggleDebug, useDebugOn} from './dpad';

export default function TopBar() {
  const debugOn = useDebugOn();

  return (
    <header className="top-bar">
      <h1>SpatialExplorer</h1>
      <div className="top-bar-actions">
        <div className="search-box">
          <span className="material-symbols-outlined">search</span>
          <span>Search...</span>
        </div>
        <button
          className={`dpad-focusable icon-btn${debugOn ? ' active' : ''}`}
          tabIndex={0}
          data-node-id="debug-toggle"
          onClick={toggleDebug}
          title="Toggle debug vectors"
        >
          <span className="material-symbols-outlined">bug_report</span>
        </button>
        <button className="dpad-focusable icon-btn" tabIndex={0} data-node-id="account" aria-label="Account">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}
