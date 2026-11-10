import '../styles/Navbar.css';

const Navbar = ({
  activeTab,
  setActiveTab,
  handleExport,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleExport: () => void;
}) => {
  return (
    <header className="dashboard-header">
      <div className="logo-area">
        <div className="logo-icon">
          <img
            src="src\assets\Pemko_rmBg.png"
            alt="Logo"
            className="logo-img"
          />
        </div>
        <div className="logo-text">
          <span className="logo-title">LAYANAN</span>
          <span className="logo-subtitle">Kota Banda Aceh</span>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === "grafik" ? "active" : ""}`}
          onClick={() => setActiveTab("grafik")}
        >
          Grafik Layanan
        </button>
        <button
          className={`nav-tab ${activeTab === "saran" ? "active" : ""}`}
          onClick={() => setActiveTab("saran")}
        >
          Saran & Antisipasi
        </button>
        <button
          className={`nav-tab ${activeTab === "analisis" ? "active" : ""}`}
          onClick={() => setActiveTab("analisis")}
        >
          Analisis Optimalisasi
        </button>
        <button
          className={`nav-tab ${activeTab === "tabel" ? "active" : ""}`}
          onClick={() => setActiveTab("tabel")}
        >
          Tabel Layanan
        </button>
      </nav>

      <button className="btn-export" onClick={handleExport}>
        EXPORT EXCEL
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      </button>
    </header>
  );
};

export default Navbar;
