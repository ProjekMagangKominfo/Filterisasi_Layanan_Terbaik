import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import "../styles/saran_antisipasi.css";

// ==========================================
// WARNA TEMA
// ==========================================
const COLORS = {
  aktif: "#10B981",
  nonaktif: "#EF4444",
  masyarakat: "#3B82F6",
  asn: "#8B5CF6",
};

// ==========================================
// DATA
// ==========================================

// 1. Status Layanan — Grafik Batang
const statusData = [
  { name: "Aktif", jumlah: 68, persen: 65.4 },
  { name: "Non-Aktif", jumlah: 36, persen: 34.6 },
];

// 2. Distribusi Kunjungan — Donut
const kunjunganData = [
  { name: "5 Layanan Teratas", value: 26 },
  { name: "99 Layanan Lainnya", value: 73 },
  { name: "20 Layanan Terbawah", value: 1 },
];

// 3. Persentase AKTIF per Platform — Grafik Batang
const dataPlatform = [
  { name: "Web", value: 66, fill: "#4e91f9" },
  { name: "Aplikasi Mobile", value: 37, fill: "#3a6ebd" },
];

// ==========================================
// KOMPONEN UTAMA
// ==========================================
export default function Saran_Antisipasi() {
  return (
    <div className="tes-page">
      <h1 className="tes-page-title">
        Rekomendasi Tindakan Pemerintahan Berdasarkan Keadaan Saat Ini
      </h1>

      <div className="dashboard-grid">
        <div className="summary-card">
          <h1>Layanan tak Berfungsi</h1>
          <div className="btn btn-3">
            <h3>BAPPEDA</h3>
            <p>
              5 dari 5 Layanan OPD BAPPEDA <b>Non-Aktif</b>
            </p>
          </div>
          <div className="btn btn-4">
            <h3>DLKH3</h3>
            <p>
              7 dari 10 Layanan OPD DLKH3 <b>Non-Aktif</b>
            </p>
          </div>
          <div className="btn btn-1">
            <h3>DISHUB</h3>
            <p>
              4 dari 6 Layanan OPD DISHUB <b>Non-Aktif</b>
            </p>
          </div>
          <div className="summary-note">
            <span>3 OPD tersebut menyumbang: </span>
            <strong className="summary-total">16 dari 36</strong>
            <span> layanan non-aktif</span>
          </div>
        </div>
        <div className="summary-card">
          <h1>Kelengkapan Data</h1>
          <div className="btn btn-1">
            <h3>9</h3>
            <p>
              Layanan <b>Tanpa URL</b>
            </p>
          </div>
          <div className="btn btn-2">
            <h3>27</h3>
            <p>
              Layanan <b>Tanpa Keterangan Fungsi</b>
            </p>
          </div>
          <div className="btn btn-3">
            <h3>36</h3>
            <p>
              Layanan <b>Non-Aktif</b>
            </p>
          </div>
          <div className="summary-total">
            <strong>68 dari 104</strong>
            <span> layanan yang Aktif</span>
          </div>
        </div>
        <div className="grafik-card">
        <div className="chart-card">
          <h3 className="chart-title">📊 Status Layanan</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={statusData}
              layout="vertical"
              margin={{ top: 8, right: 28, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#6b7280" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={88} />
              <Tooltip />
              <Bar dataKey="jumlah" name="Jumlah layanan" radius={[0, 8, 8, 0]} barSize={50}>
                <Cell fill="#4e91f9" />
                <Cell fill="#3a6ebd" />
                <LabelList dataKey="jumlah" position="right" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">
            📊 Persentase Layanan Aktif per Platform
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={dataPlatform}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                vertical={true}
                stroke="#9ea0a3"
              />
              <XAxis
                type="number"
                domain={[0, 80]}
                tickFormatter={(value) => `${value}%`}
                stroke="#6b7280"
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                stroke="#374151"
                tick={{ fontSize: 14, fontWeight: 500 }}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, "Persentase Aktif"]}
                contentStyle={{
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={50}>
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(value) => `${value}%`}
                  style={{ fill: "#1f2937", fontWeight: 600, fontSize: 14 }}
                />
                {dataPlatform.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        </div>
      </div>
      <div className="donut-grid">
        <div className="chart-card donut-card">
          <h3 className="chart-title">
            👥 Persentase Non-Aktif per Kategori
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={[
                  { name: "Masyarakat", value: 43 },
                  { name: "ASN", value: 29 },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                dataKey="value"
              >
                <Cell fill={COLORS.masyarakat} />
                <Cell fill={COLORS.asn} />
              </Pie>
              <Tooltip formatter={(value) => `${value}% Non-Aktif`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="chart-note">
            ⚠️ Layanan masyarakat lebih sering tidak aktif
          </p>
        </div>

        <div className="chart-card donut-card">
          <h3 className="chart-title">
            📊 Distribusi Kunjungan Layanan
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={kunjunganData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                dataKey="value"
              >
                <Cell fill="#6366F1" />
                <Cell fill="#A5B4FC" />
                <Cell fill="#E0E7FF" />
              </Pie>
              <Tooltip
                formatter={(value) => `${value}% dari total kunjungan`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="visit-details">
            <p>
              📉 <strong>4 layanan turun &gt; 20%:</strong> Spina-kes, SP4N
              Lapor, SIMTEBANG, SIPD
            </p>
            <p>
              💡 <strong>5 layanan teratas = 26% kunjungan</strong> — ini yang
              paling penting, jaga tetap aktif!
            </p>
            <p>
              🔍 <strong>20 layanan terbawah = hanya 1%</strong> — perlu
              evaluasi: masih diperlukan atau kurang dikenal?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
