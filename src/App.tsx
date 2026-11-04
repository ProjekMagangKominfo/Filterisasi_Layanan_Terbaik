import { useState, useEffect, useMemo, type ComponentProps } from "react";

import Papa from "papaparse";
const csvUrl = new URL("./assets/data_layanan.csv", import.meta.url).href;
const cssUrl = new URL("./app.css", import.meta.url).href;
import Navbar from "./component/Navbar.tsx";
import StatsCard from "./component/StatsCard.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AnalisisOptimalisasi from "./pages/AnalisisOptimalisasi.tsx";
import LayananTable from "./pages/LayananTable.tsx";
import Saran_Antisipasi from "./pages/Saran_Antisipasi.tsx";

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

const recommendations = [
  {
    title: 'perluas sosialisasi layanan digital',
    services: ['nomor induk berusaha(NIB) UMKM', 'KTP-el Baru'],
  },
  {
    title: 'pemberdayaan LKS dan Disabilitas',
    services: ['pendaftaran penyandang disabilitas', 'program keluarga Harapan'],
  },
  {
    title: 'pembersihan data kependudukan Ganda',
    services: ['konsolidasi data adminduk', 'BPJS kesehatan Mandiri'],
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  Kependudukan: "#3B82F6",
  Kesehatan: "#6B7280",
  Pendidikan: "#F59E0B",
  Sosial: "#EAB308",
  "Ekonomi&Usaha": "#14B8A6",
  "Infrastruktur&Lingkungan": "#A855F7",
  "Keamanan&Darurat": "#1F2937",
};

function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

export default function App() {
  const [layanan, setLayanan] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("grafik");
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null)

  useEffect(() => {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = cssUrl;
    document.head.appendChild(stylesheet);
    return () => {
      stylesheet.remove();
    };
  }, []);

  // Load CSV
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error("CSV not found");
        const text = await response.text();
        Papa.parse<CsvLayanan>(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsed = results.data.map((row, idx) => ({
              id: Number.parseInt(row.id ?? "", 10) || idx + 1,
              nama: row.nama || "",
              kategori: row.kategori || "",
              akses: Number.parseInt(row.akses ?? "", 10) || 0,
              status: (row.status || "aktif").toLowerCase(),
            }));
            setLayanan(parsed);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error loading CSV:", error);
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
    const nonAktif = layanan.filter((l) => l.status === "non-aktif").length;
    return {
      totalLayanan,
      totalAkses,
      kategori: kategoriSet.size,
      nonAktif,
    };
  }, [layanan]);

  // Export Excel (CSV sederhana)
  const handleExport = () => {
    const headers = ["id", "nama", "kategori", "akses", "status"];
    const rows = layanan.map((l) =>
      [l.id, `"${l.nama}"`, `"${l.kategori}"`, l.akses, l.status].join(","),
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data_layanan_export.csv";
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
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} handleExport={handleExport} />
      <StatsCard stats={stats} formatNumber={formatNumber} />

      {activeTab === "grafik" && (<Dashboard layanan={layanan} formatNumber={formatNumber} />)}

      {activeTab === "saran" && (<Saran_Antisipasi recommendations={recommendations} selectedRecommendation={selectedRecommendation} setSelectedRecommendation={setSelectedRecommendation} />)}

      {activeTab === "analisis" && (<AnalisisOptimalisasi />)}

      {activeTab === "tabel" && (<LayananTable />)}
    </div>
  );
}