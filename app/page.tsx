export default function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>SiagaKita Backend & API Service</h1>
      <p>Status: Operational</p>
      <ul>
        <li><code>GET /api/risiko</code> - Perhitungan skor risiko wilayah</li>
        <li><code>GET /api/evakuasi</code> - Titik & rute evakuasi (cache offline)</li>
        <li><code>POST /api/status-aman</code> - Status keselamatan pengguna</li>
      </ul>
    </div>
  );
}
