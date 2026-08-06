const items = [
  {id: 'home', href: '#/', icon: 'home', label: 'Home'},
  {id: 'grid', href: '#/grid', icon: 'grid_view', label: 'Grid Demo'},
  {id: 'lists', href: '#/lists', icon: 'list', label: 'Lists'},
  {id: 'settings', href: '#/settings', icon: 'settings', label: 'Settings'},
];

export default function SideNav({route}: {route: string}) {
  return (
    <aside className="side-nav">
      <div className="brand">
        <span className="material-symbols-outlined icon">spatial_audio_off</span>
        <span>Spatial Demo</span>
      </div>
      <nav>
        {items.map((item) => (
          <a
            key={item.id}
            className={`dpad-focusable nav-item${route === item.id ? ' active' : ''}`}
            href={item.href}
            tabIndex={0}
            data-node-id={`nav-${item.id}`}
          >
            <span className="material-symbols-outlined icon">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="avatar" />
    </aside>
  );
}
