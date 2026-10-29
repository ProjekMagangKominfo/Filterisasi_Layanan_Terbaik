import { createElement, useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Papa from 'papaparse';
const csvUrl = new URL('./assets/data_layanan.csv', import.meta.url).href;
const cssUrl = new URL('./app.css', import.meta.url).href;
import Navbar from './component/Navbar.tsx';
import StatsCard from './component/StatsCard.tsx';

interface Layanan {
  id: number;
  nama: string;
  kategori: string;
  akses: number;
  status: string;
}

interface CsvLayanan {
  id?: string;
  nama?: string;
  kategori?: string;
  akses?: string;
  status?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Kependudukan: '#3B82F6',
  Kesehatan: '#6B7280',
  Pendidikan: '#F59E0B',
  Sosial: '#EAB308',
  'Ekonomi&Usaha': '#14B8A6',
  'Infrastruktur&Lingkungan': '#A855F7',
  'Keamanan&Darurat': '#1F2937',
};

const PIE_COLORS = [
  '#7C3AED',
  '#6B7280',
  '#F59E0B',
  '#EAB308',
  '#14B8A6',
  '#A855F7',
  '#1F2937',
];

function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

interface CustomBarTooltipProps {
  active?: boolean;
  payload?: { payload: { fullName: string; akses: number } }[];
}

function CustomBarTooltip({ active, payload }: CustomBarTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return createElement(
      'div',
      { className: 'custom-tooltip' },
      createElement('p', { className: 'tooltip-label' }, data.fullName),
      createElement('p', { className: 'tooltip-value' }, formatNumber(data.akses)),
    );
  }
  return null;
}

export default function App() {
  const [layanan, setLayanan] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('grafik');


  useEffect(() => {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = cssUrl;
    document.head.appendChild(stylesheet);
    return () => stylesheet.remove();
  }, []);

  // Load CSV
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error('CSV not found');
        const text = await response.text();
        Papa.parse<CsvLayanan>(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsed = results.data.map((row, idx) => ({
              id: Number.parseInt(row.id ?? '', 10) || idx + 1,
              nama: row.nama || '',
              kategori: row.kategori || '',
              akses: Number.parseInt(row.akses ?? '', 10) || 0,
              status: (row.status || 'aktif').toLowerCase(),
            }));
            setLayanan(parsed);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error loading CSV:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ============== STATISTIK ==============
  const stats = useMemo(() => {
    const totalLayanan = layanan.length;
    const totalAkses = layanan.reduce((sum, l) => sum + (l.akses || 0), 0);
    const kategoriSet = new Set(layanan.map((l) => l.kategori).filter(Boolean));
    const nonAktif = layanan.filter((l) => l.status === 'non-aktif').length;
    return {
      totalLayanan,
      totalAkses,
      kategori: kategoriSet.size,
      nonAktif,
    };
  }, [layanan]);

  // Top 5 layanan berdasarkan akses
  const top5 = useMemo(() => {
    return [...layanan]
      .filter((l) => l.akses > 0)
      .sort((a, b) => b.akses - a.akses)
      .slice(0, 5)
      .map((l) => ({
        name: l.nama.length > 18 ? l.nama.slice(0, 16) + '…' : l.nama,
        fullName: l.nama,
        akses: l.akses,
      }));
  }, [layanan]);

  // Data pie chart per kategori
  const kategoriData = useMemo(() => {
    const map: Record<string, number> = {};
    layanan.forEach((l) => {
      if (!l.kategori) return;
      map[l.kategori] = (map[l.kategori] || 0) + (l.akses || 0);
    });
    const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value,
        percent: ((value / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value);
  }, [layanan]);

  // Export Excel (CSV sederhana)
  const handleExport = () => {
    const headers = ['id', 'nama', 'kategori', 'akses', 'status'];
    const rows = layanan.map((l) =>
      [l.id, `"${l.nama}"`, `"${l.kategori}"`, l.akses, l.status].join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data_layanan_export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Memuat data layanan...</p>
      </div>
    );
}
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo-area">
          <div className="logo-icon">
            <img src="src\assets\Pemko_rmBg.png" alt="Logo" className="logo-img" />
          </div>
          <div className="logo-text">
            <span className="logo-title">LAYANAN</span>
            <span className="logo-subtitle">Kota Banda Aceh</span>
          </div>
        </div>
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />


        <button className="btn-export" onClick={handleExport}>
          EXPORT EXCEL
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </button>
      </header>

            <StatsCard stats={stats} formatNumber={formatNumber} />


      {/* Main Content - Grafik */}
      {activeTab === 'grafik' && (
        <section className="charts-row">
          {/* Bar Chart - Top 5 */}
          <div className="chart-card">
            <h2 className="chart-title">5 Layanan Dengan Akses Terbanyak</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={top5}
                  margin={{ top: 2.5, right: 2.5, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#808385" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(58, 142, 237, 0.08)' }} />
                  <Bar dataKey="akses" fill="#4e91f9" radius={[4, 4, 0, 0]} maxBarSize={56} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Kategori */}
          <div className="chart-card">
            <h2 className="chart-title">Jumlah Berdasarkan Kategori Layanan</h2>
            <div className="pie-layout">
              <div className="pie-chart-wrap">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={kategoriData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {kategoriData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[entry.name] || PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [formatNumber(Number(value)), name]}
                      contentStyle={{
                        borderRadius: 8,
                        border: '1px solid #E5E7EB',
                        fontSize: 13,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="pie-legend">
                {kategoriData.map((item, idx) => (
                  <div key={item.name} className="legend-item">
                    <span
                      className="legend-dot"
                      style={{
                        backgroundColor:
                          CATEGORY_COLORS[item.name] || PIE_COLORS[idx % PIE_COLORS.length],
                      }}
                    />
                    <span className="legend-name">{item.name}</span>
                    <span className="legend-value">{formatNumber(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Placeholder tabs */}
      {activeTab === 'saran' && (
        <div className="placeholder-panel">
          <h2>Saran & Antisipasi</h2>
          <p>Panel saran dan antisipasi layanan akan ditampilkan di sini.</p>
        </div>
      )}
      {activeTab === 'analisis' && (
        <div className="placeholder-panel">
          <h2>Analisis Optimalisasi</h2>
          <p>Panel analisis optimalisasi layanan akan ditampilkan di sini.</p>
        </div>
      )}
      {activeTab === 'tabel' && (
        <div className="table-panel">
          <h2 className="chart-title">Tabel Layanan</h2>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Layanan</th>
                  <th>Kategori</th>
                  <th>Akses Publik</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {layanan.map((l) => (
                  <tr key={l.id}>
                    <td>{l.id}</td>
                    <td>{l.nama}</td>
                    <td>
                      <span
                        className="category-badge"
                        style={{
                          backgroundColor:
                            (CATEGORY_COLORS[l.kategori] || '#6B7280') + '22',
                          color: CATEGORY_COLORS[l.kategori] || '#6B7280',
                        }}
                      >
                        {l.kategori}
                      </span>
                    </td>
                    <td className="text-right">{formatNumber(l.akses)}</td>
                    <td>
                      <span className={`status-badge ${l.status}`}>
                        {l.status === 'aktif' ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
