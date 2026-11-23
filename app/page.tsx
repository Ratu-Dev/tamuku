import Mascot from '@/components/Mascot';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3rem',
        padding: '3rem 1.5rem',
        background: 'linear-gradient(160deg,#eef1fb 0%,#fdf3d6 100%)',
        color: '#1b2559',
      }}
    >
      <Mascot size={300} />
      <section style={{ maxWidth: 460 }}>
        <h1 style={{ fontSize: '3.4rem', fontWeight: 800, lineHeight: 1.05, margin: 0 }}>Tamuku</h1>
        <p style={{ fontSize: '1.25rem', lineHeight: 1.5, margin: '1rem 0 1.75rem' }}>
          Kirim undangan, catat konfirmasi hadir, dan sambut setiap tamu dengan namanya di layar.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            style={{
              background: '#27408b',
              color: '#fff',
              border: 0,
              borderRadius: 999,
              padding: '0.85rem 1.6rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Masuk dengan Google
          </button>
          <button
            style={{
              background: 'transparent',
              color: '#27408b',
              border: '2px solid #27408b',
              borderRadius: 999,
              padding: '0.85rem 1.6rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Lihat fitur
          </button>
        </div>
      </section>
    </main>
  );
}
