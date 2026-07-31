import styles from './Home.module.css';

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

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.eyebrow}>ORIGINAL SERIES</div>
        <h2>
          THE NEON
          <br />
          CHRONICLES
        </h2>
        <p>
          In a world where memories are traded like currency, one rogue navigator must find the source code of
          reality before the system reboots.
        </p>
        <div className={styles.heroActions}>
          <button
            className={`dpad-focusable ${styles.btn} ${styles.btnPrimary}`}
            tabIndex={0}
            data-node-id="play-now"
            data-dpad-initial-focus
          >
            <span className="material-symbols-outlined">play_arrow</span>Play Now
          </button>
          <button className={`dpad-focusable ${styles.btn} ${styles.btnSecondary}`} tabIndex={0} data-node-id="more-info">
            <span className="material-symbols-outlined">info</span>More Info
          </button>
        </div>
      </section>

      <section className={styles.shelf}>
        <div className={styles.shelfHead}>
          <h3>Trending Now</h3>
          <span>View All</span>
        </div>
        <div className={`${styles.rail} rail no-scrollbar`}>
          {trending.map((item) => (
            <div
              key={item.id}
              className={`dpad-focusable ${styles.card} ${styles.wide}`}
              role="button"
              tabIndex={0}
              data-node-id={item.id}
              style={{background: item.gradient}}
            >
              {item.title}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.shelf}>
        <div className={styles.shelfHead}>
          <h3>Your Library</h3>
          <span>Sort by Recent</span>
        </div>
        <div className={`${styles.rail} rail no-scrollbar`}>
          {library.map((item) => (
            <div
              key={item.id}
              className={`dpad-focusable ${styles.card} ${styles.tall}`}
              role="button"
              tabIndex={0}
              data-node-id={item.id}
              style={{background: item.gradient}}
            >
              {item.title}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
