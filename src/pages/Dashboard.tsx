import { useMemo, createElement } from 'react';
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

interface Layanan {
  id: number;
  nama: string;
  kategori: string;
  akses: number;
  status: string;
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

const Dashboard = ({ formatNumber, layanan }: { formatNumber: (num: number) => string; layanan: Layanan[] }) => {
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
    
  return (
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
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
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
  )};

export default Dashboard;