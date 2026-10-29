const StatsCard = ({formatNumber, stats}: { formatNumber: (num: number) => string; stats: { totalLayanan: number; totalAkses: number; kategori: number; nonAktif: number } }) => {
    return (
      <section className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total Layanan</span>
          <input type="text" className="stat-value" value={stats.totalLayanan} readOnly />
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Akses Publik</span>
          <span className="stat-value">{formatNumber(stats.totalAkses)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Kategori</span>
          <span className="stat-value">{stats.kategori}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Layanan non-aktif</span>
          <span className="stat-value">{stats.nonAktif}</span>
        </div>
      </section>
)}

export default StatsCard;