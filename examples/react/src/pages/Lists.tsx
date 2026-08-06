import {useState} from 'react';
import {useFocusedNode} from '../lib/dpad';
import styles from './Lists.module.css';

const categories = [
  {id: 'cat-recommended', icon: 'auto_awesome', label: 'Recommended'},
  {id: 'cat-originals', icon: 'movie', label: 'Cinema Originals'},
  {id: 'cat-recent', icon: 'history', label: 'Recently Viewed'},
  {id: 'cat-favorites', icon: 'favorite', label: 'My Favorites'},
];

const rows = [
  {
    id: 'row-neon-genesis',
    title: 'Neon Genesis',
    desc: 'A deep dive into the architecture of the 24th century.',
    badge: 'ULTRA HD',
    badgeBg: 'var(--primary)',
    badgeFg: 'var(--on-primary)',
    gradient: 'linear-gradient(135deg, #1b2a4a, #0b1326)',
    rating: '4.9',
    length: '2h 15m',
  },
  {
    id: 'row-ethereal-peaks',
    title: 'Ethereal Peaks',
    desc: 'Escape to the highest altitudes of the world.',
    badge: 'HDR10+',
    badgeBg: 'var(--secondary)',
    badgeFg: '#2c0051',
    gradient: 'linear-gradient(135deg, #3a1b4a, #0b1326)',
    rating: '4.8',
    length: '1h 40m',
  },
  {
    id: 'row-liquid-motion',
    title: 'Liquid Motion',
    desc: 'An abstract exploration of fluid dynamics.',
    badge: 'SPATIAL AUDIO',
    badgeBg: 'var(--tertiary)',
    badgeFg: '#00363e',
    gradient: 'linear-gradient(135deg, #0f4a3a, #0b1326)',
    rating: '5.0',
    length: '45m',
  },
];

export default function Lists() {
  const focused = useFocusedNode();
  const [axisLock, setAxisLock] = useState<'VERTICAL' | 'HORIZONTAL'>('VERTICAL');

  return (
    <div className={styles.listsShell}>
      <div className={styles.categories}>
        <h4>CATEGORIES</h4>
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            className={`dpad-focusable ${styles.listFocus} list-focus`}
            tabIndex={0}
            data-node-id={cat.id}
            data-dpad-initial-focus={i === 0 ? true : undefined}
            onFocus={() => setAxisLock('VERTICAL')}
          >
            <span className="material-symbols-outlined">{cat.icon}</span>
            {cat.label}
          </button>
        ))}

        <div className={`${styles.axisPanel} glass-panel mono`}>
          <div className={styles.row}>
            FOCUS_NODE_ID: <b>{focused?.id ?? 'cat-recommended'}</b>
          </div>
          <div className={styles.row}>
            AXIS_LOCK: <b>{axisLock}</b>
          </div>
        </div>
      </div>

      <div className={styles.contentCol}>
        <h2>Cinematic Highlights</h2>
        <p>Explore the latest high-fidelity spatial experiences curated for the 10-foot UI.</p>

        {rows.map((row) => (
          <div
            key={row.id}
            className={`dpad-focusable ${styles.mediaRow}`}
            role="button"
            tabIndex={0}
            data-node-id={row.id}
            onFocus={() => setAxisLock('HORIZONTAL')}
          >
            <div className={styles.thumb} style={{background: row.gradient}} />
            <div className={styles.body}>
              <span className={styles.badge} style={{background: row.badgeBg, color: row.badgeFg}}>
                {row.badge}
              </span>
              <h3>{row.title}</h3>
              <p>{row.desc}</p>
              <div className={styles.meta}>
                <span>★ {row.rating}</span>
                <span>{row.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
