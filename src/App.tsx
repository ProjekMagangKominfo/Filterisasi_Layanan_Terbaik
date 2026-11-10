import { useState, useEffect, useMemo } from "react";

import Papa from "papaparse";
const csvUrl = new URL("./assets/data_layanan_dummy.csv", import.meta.url).href;
const layananCsvUrl = new URL("./assets/data_layanan.csv", import.meta.url).href;
const kunjunganCsvUrl = new URL("./assets/data_kunjungan_SIMULASI.csv", import.meta.url).href;
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

interface CsvMetadataLayanan {
  id_layanan?: string;
  nama_layanan?: string;
  kategori_layanan?: string;
  status_operasional?: string;
  url?: string;
}

interface CsvKunjungan {
  id_layanan?: string;
  nama_layanan?: string;
  periode?: string;
  jumlah_kunjungan?: string;
}

interface KunjunganLayanan {
  id_layanan: number;
  nama_layanan: string;
  periode: string;
  jumlah_kunjungan: number;
  kategori_layanan: string;
  url: string;
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

function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

export default function App() {
  const [layanan, setLayanan] = useState<Layanan[]>([]);
  const [metadataLayanan, setMetadataLayanan] = useState<CsvMetadataLayanan[]>([]);
  const [kunjunganLayanan, setKunjunganLayanan] = useState<KunjunganLayanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
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
        const responses = await Promise.all([
          fetch(csvUrl),
          fetch(layananCsvUrl),
          fetch(kunjunganCsvUrl),
        ]);
        const fileNames = ["data_layanan_dummy.csv", "data_layanan.csv", "data_kunjungan_SIMULASI.csv"];
        const failedResponse = responses.findIndex((response) => !response.ok);
        if (failedResponse !== -1) {
          throw new Error(`Gagal memuat ${fileNames[failedResponse]}`);
        }

        const [dummyText, metadataText, visitsText] = await Promise.all(
          responses.map((response) => response.text()),
        );
        const dummyRows = Papa.parse<CsvLayanan>(dummyText, {
          header: true,
          skipEmptyLines: true,
        }).data;
        const metadataRows = Papa.parse<CsvMetadataLayanan>(metadataText, {
          header: true,
          skipEmptyLines: true,
        }).data;
        const visitRows = Papa.parse<CsvKunjungan>(visitsText, {
          header: true,
          skipEmptyLines: true,
        }).data;

        setMetadataLayanan(metadataRows);
        setLayanan(
          dummyRows.map((row, idx) => ({
            id: Number.parseInt(row.id ?? "", 10) || idx + 1,
            nama: row.nama || "",
            kategori: row.kategori || "",
            akses: Number.parseInt(row.akses ?? "", 10) || 0,
            status: (row.status || "aktif").toLowerCase(),
          })),
        );

        const layananById = new Map<number, CsvMetadataLayanan>();
        metadataRows.forEach((row) => {
          const id = Number.parseInt(row.id_layanan ?? "", 10);
          if (Number.isFinite(id)) layananById.set(id, row);
        });

        setKunjunganLayanan(
          visitRows.map((row, index) => {
            const id = Number.parseInt(row.id_layanan ?? "", 10);
            const jumlahKunjungan = Number.parseInt(row.jumlah_kunjungan ?? "", 10);
            const metadata = layananById.get(id);
            if (!Number.isFinite(id) || !Number.isFinite(jumlahKunjungan) || !metadata) {
              throw new Error(`Data kunjungan baris ${index + 2} tidak valid atau tidak memiliki metadata layanan`);
            }

            return {
              id_layanan: id,
              nama_layanan: metadata.nama_layanan || row.nama_layanan || `Layanan ${id}`,
              periode: row.periode || "",
              jumlah_kunjungan: jumlahKunjungan,
              kategori_layanan: metadata.kategori_layanan || "Tidak diketahui",
              url: metadata.url || "",
            };
          }),
        );
      } catch (error) {
        console.error("Error loading CSV:", error);
        setLoadError(error instanceof Error ? error.message : "Terjadi kesalahan saat memuat data CSV");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ============== STATISTIK ==============
  const stats = useMemo(() => {
    const kategoriSet = new Set(
      metadataLayanan
        .map((row) => row.kategori_layanan?.trim())
        .filter((kategori): kategori is string => Boolean(kategori)),
    );
    return {
      totalLayanan: metadataLayanan.length,
      totalAkses: kunjunganLayanan.reduce((sum, row) => sum + row.jumlah_kunjungan, 0),
      kategori: kategoriSet.size,
      nonAktif: metadataLayanan.filter(
        (row) => row.status_operasional?.trim() === "Tidak Aktif",
      ).length,
    };
  }, [metadataLayanan, kunjunganLayanan]);

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

  if (loadError) {
    return (
      <div className="dashboard-loading" role="alert">
        <p>Gagal memuat data dashboard: {loadError}</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} handleExport={handleExport} />
      
      <StatsCard stats={stats} formatNumber={formatNumber} />

      {activeTab === "grafik" && (<Dashboard kunjungan={kunjunganLayanan} formatNumber={formatNumber} />)}

      {activeTab === "saran" && (<Saran_Antisipasi recommendations={recommendations} selectedRecommendation={selectedRecommendation} setSelectedRecommendation={setSelectedRecommendation} />)}

      {activeTab === "analisis" && (<AnalisisOptimalisasi />)}

      {activeTab === "tabel" && (<LayananTable />)}
    </div>
  );
}
