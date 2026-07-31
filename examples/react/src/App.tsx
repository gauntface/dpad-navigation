import {useEffect, useState} from 'react';
import SideNav from './lib/SideNav';
import TopBar from './lib/TopBar';
import DebugHud from './lib/DebugHud';
import Home from './pages/Home';
import Grid from './pages/Grid';
import Lists from './pages/Lists';
import Settings from './pages/Settings';
import {useDpadLifecycle} from './lib/dpad';

function routeFromHash(): string {
  return window.location.hash.replace(/^#\/?/, '') || 'home';
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash());

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useDpadLifecycle(route);

  return (
    <>
      <div className="app-shell">
        <SideNav route={route} />
        <main className="main no-scrollbar">
          <TopBar />
          {route === 'grid' && <Grid />}
          {route === 'lists' && <Lists />}
          {route === 'settings' && <Settings />}
          {route !== 'grid' && route !== 'lists' && route !== 'settings' && <Home />}
        </main>
      </div>
      {/* Settings renders its own "SPATIAL DEBUGGER ACTIVE" HUD variant, so skip the generic one to avoid stacking two panels in the same corner. */}
      {route !== 'settings' && <DebugHud />}
    </>
  );
}
