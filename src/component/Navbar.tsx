const Navbar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  return (
    <nav className="nav-tabs">
        <button
            className={`nav-tab ${activeTab === 'grafik' ? 'active' : ''}`}
            onClick={() => setActiveTab('grafik')}>Grafik Layanan</button>
        <button
            className={`nav-tab ${activeTab === 'saran' ? 'active' : ''}`}
            onClick={() => setActiveTab('saran')}>Saran & Antisipasi</button>
        <button
            className={`nav-tab ${activeTab === 'analisis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analisis')}>Analisis Optimalisasi</button>
        <button
            className={`nav-tab ${activeTab === 'tabel' ? 'active' : ''}`}
            onClick={() => setActiveTab('tabel')}>Tabel Layanan</button>
        </nav>
)};

export default Navbar;