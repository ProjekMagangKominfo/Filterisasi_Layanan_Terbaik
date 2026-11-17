import { useMemo, createElement } from "react";
import '../styles/Dashboard.css';
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
} from "recharts";

interface KunjunganLayanan {
  id_layanan: number;
  nama_layanan: string;
  periode: string;
  jumlah_kunjungan: number;
  kategori_layanan: string;
  url: string;
}

const PIE_COLORS = [
  "#7C3AED",
  "#6B7280",
  "#F59E0B",
  "#EAB308",
  "#14B8A6",
  "#A855F7",
  "#1F2937",
];

const Dashboard = ({
  formatNumber,
  kunjungan,
}: {
  formatNumber: (num: number) => string;
  kunjungan: KunjunganLayanan[];
}) => {
  const top5 = useMemo(() => {
    const totalPerLayanan = new Map<number, {
      nama: string;
      url: string;
      jumlahKunjungan: number;
    }>();

    kunjungan.forEach((row) => {
      const current = totalPerLayanan.get(row.id_layanan);
      totalPerLayanan.set(row.id_layanan, {
        nama: row.nama_layanan,
        url: row.url,
        jumlahKunjungan: (current?.jumlahKunjungan || 0) + row.jumlah_kunjungan,
      });
    });

    return [...totalPerLayanan.entries()]
      .filter(([, layanan]) => layanan.jumlahKunjungan > 0)
      .sort(([, a], [, b]) => b.jumlahKunjungan - a.jumlahKunjungan)
      .slice(0, 5)
      .map(([id, layanan]) => ({
        name:
          layanan.nama.length > 10
            ? layanan.nama.slice(0, 10) + "…"
            : layanan.nama,
        fullName: layanan.nama,
        url: layanan.url,
        id,
        akses: layanan.jumlahKunjungan,
      }));
  }, [kunjungan]);

  // Data pie chart per kategori
  const kategoriData = useMemo(() => {
    const map: Record<string, number> = {};
    kunjungan.forEach((row) => {
      map[row.kategori_layanan] =
        (map[row.kategori_layanan] || 0) + row.jumlah_kunjungan;
    });
    const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value,
        percent: ((value / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value);
  }, [kunjungan]);

  interface CustomBarTooltipProps {
    active?: boolean;
    payload?: { payload: { fullName: string; url: string; akses: number } }[];
  }

  function CustomBarTooltip({ active, payload }: CustomBarTooltipProps) {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return createElement("div", { className: "custom-tooltip" },
        createElement("p", { className: "tooltip-label" }, data.fullName),
        createElement("p", { className: "tooltip-value" }, `${formatNumber(data.akses)} kunjungan`),
        data.url && createElement("a", {
          href: data.url,
          target: "_blank",
          rel: "noreferrer",
        }, "Buka layanan"),
      );
    }
    return null;
  }

  return (
    <section className="charts-row">
      {/* Bar Chart - Top 5 */}
      <div className="chart-card">
        <h2 className="chart-title">5 Layanan Dengan Kunjungan Terbanyak</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={top5}
              margin={{ top: 2.5, right: 2.5, left: 0, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#808385"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#6B7280" }}
                axisLine={true}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
              />
              <Tooltip
                content={<CustomBarTooltip />}
                cursor={{ fill: "rgba(58, 142, 237, 0.08)" }}
              />
              <Bar
                dataKey="akses"
                fill="#4e91f9"
                radius={[4, 4, 0, 0]}
                maxBarSize={56}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart - Kategori */}
      <div className="chart-card">
        <h2 className="chart-title">Jumlah Kunjungan Berdasarkan Kategori Layanan</h2>
        <div className="pie-layout">
          <div className="pie-chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={kategoriData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {kategoriData.map((_, index) => (
                    <Cell
                      key={`${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    <span style={{ color: "#4e91f9" }}>
                      {formatNumber(Number(value))}
                    </span>,
                    <span style={{ color: "#000000" }}>{name}</span>,
                  ]}
                  contentStyle={{
                    borderRadius: 3,
                    border: "1px solid #9a9a9a",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
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
                    backgroundColor: PIE_COLORS[idx % PIE_COLORS.length],
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
  );
};

export default Dashboard;
