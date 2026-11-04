import { useState, useMemo } from 'react';

export interface LayananItem {
  id: number;
  rank: number;
  code: string;
  nama: string;
  verificationId: string;
  kategori: string;
  filterKategori: string;
  wilayah: string;
  status: 'aktif' | 'tidak aktif';
  isVerified?: boolean;
  iconType: 'hospital' | 'school' | 'star' | 'gov' | 'water' | 'shield' | 'social';
}

const INITIAL_DATA: LayananItem[] = [
  // Page 1 (Ranks 1 - 8) - Exact Match with Reference
  {
    id: 1,
    rank: 1,
    code: 'PHB',
    nama: 'Puskesmas Medan Baru',
    verificationId: 'MBN 0912',
    kategori: 'Kesehatan',
    filterKategori: 'Kesehatan',
    wilayah: 'Medan Baru',
    status: 'aktif',
    isVerified: true,
    iconType: 'hospital',
  },
  {
    id: 2,
    rank: 2,
    code: 'SMP1',
    nama: 'SMP Negeri 1 Medan',
    verificationId: 'EDU 1044',
    kategori: 'Pendidikan',
    filterKategori: 'Pendidikan',
    wilayah: 'Medan Petissh',
    status: 'aktif',
    isVerified: true,
    iconType: 'school',
  },
  {
    id: 3,
    rank: 3,
    code: 'SKP',
    nama: 'Kantor Kelurahan Padang Bulan',
    verificationId: 'ADM 2014',
    kategori: 'Administrasi',
    filterKategori: 'Kependudukan',
    wilayah: 'Medan Baru',
    status: 'aktif',
    isVerified: false,
    iconType: 'star',
  },
  {
    id: 4,
    rank: 4,
    code: 'SNC',
    nama: 'Samsat Medan Kota',
    verificationId: 'ADM 7731',
    kategori: 'Administrasi & Pajak',
    filterKategori: 'Ekonomi & Usaha',
    wilayah: 'Medan Kota',
    status: 'tidak aktif',
    isVerified: false,
    iconType: 'gov',
  },
  {
    id: 5,
    rank: 5,
    code: 'PDAM',
    nama: 'Unit Pelayanan PDAM Tirtanadi',
    verificationId: 'UTL ULS2',
    kategori: 'Air & Listrik',
    filterKategori: 'Infrastruktur',
    wilayah: 'Medan Amplas',
    status: 'aktif',
    isVerified: false,
    iconType: 'water',
  },
  {
    id: 6,
    rank: 6,
    code: 'RSUD',
    nama: 'RSUD Dr. Pirngadi',
    verificationId: 'MED-0012',
    kategori: 'Kesehatan',
    filterKategori: 'Kesehatan',
    wilayah: 'Medan Timur',
    status: 'tidak aktif',
    isVerified: false,
    iconType: 'hospital',
  },
  {
    id: 7,
    rank: 7,
    code: 'DIS',
    nama: 'Disdukcapil Kota Medan',
    verificationId: 'ADM 0110',
    kategori: 'Administrasi',
    filterKategori: 'Kependudukan',
    wilayah: 'Medan Petisah',
    status: 'aktif',
    isVerified: false,
    iconType: 'gov',
  },
  {
    id: 8,
    rank: 8,
    code: 'SONS',
    nama: 'SDN 060800 Medan',
    verificationId: 'EDU 0881',
    kategori: 'Pendidikan',
    filterKategori: 'Pendidikan',
    wilayah: 'Medan Helvetia',
    status: 'aktif',
    isVerified: false,
    iconType: 'school',
  },

  // Page 2 (Ranks 9 - 16)
  {
    id: 9,
    rank: 9,
    code: 'DSOS',
    nama: 'Dinas Sosial Kota Medan',
    verificationId: 'SOS 3321',
    kategori: 'Bantuan Sosial',
    filterKategori: 'Bantuan Sosial',
    wilayah: 'Medan Barat',
    status: 'aktif',
    isVerified: true,
    iconType: 'social',
  },
  {
    id: 10,
    rank: 10,
    code: 'POL',
    nama: 'Satlantas Polrestabes Medan',
    verificationId: 'SEC 1029',
    kategori: 'Keamanan',
    filterKategori: 'Keamanan',
    wilayah: 'Medan Baru',
    status: 'aktif',
    isVerified: false,
    iconType: 'shield',
  },
  {
    id: 11,
    rank: 11,
    code: 'PKH',
    nama: 'Pusat Penyaluran PKH Medan Area',
    verificationId: 'SOS 4410',
    kategori: 'Bantuan Sosial',
    filterKategori: 'Bantuan Sosial',
    wilayah: 'Medan Area',
    status: 'aktif',
    isVerified: false,
    iconType: 'social',
  },
  {
    id: 12,
    rank: 12,
    code: 'DAM',
    nama: 'Dinas Pemadam Kebakaran Medan',
    verificationId: 'DAM 0119',
    kategori: 'Keamanan',
    filterKategori: 'Keamanan',
    wilayah: 'Medan Kota',
    status: 'aktif',
    isVerified: true,
    iconType: 'shield',
  },
  {
    id: 13,
    rank: 13,
    code: 'UMKM',
    nama: 'Pusat Layanan Usaha Terpadu (PLUT) UMKM',
    verificationId: 'EKO 2024',
    kategori: 'Ekonomi & Usaha',
    filterKategori: 'Ekonomi & Usaha',
    wilayah: 'Medan Johor',
    status: 'aktif',
    isVerified: false,
    iconType: 'gov',
  },
  {
    id: 14,
    rank: 14,
    code: 'BMAR',
    nama: 'Dinas Sumber Daya Air & Bina Marga',
    verificationId: 'INF 5590',
    kategori: 'Infrastruktur',
    filterKategori: 'Infrastruktur',
    wilayah: 'Medan Amplas',
    status: 'aktif',
    isVerified: false,
    iconType: 'water',
  },
  {
    id: 15,
    rank: 15,
    code: 'KEC',
    nama: 'Kantor Camat Medan Denai',
    verificationId: 'ADM 0982',
    kategori: 'Administrasi',
    filterKategori: 'Kependudukan',
    wilayah: 'Medan Denai',
    status: 'aktif',
    isVerified: false,
    iconType: 'star',
  },
  {
    id: 16,
    rank: 16,
    code: 'KTR',
    nama: 'Puskesmas Medan Sunggal',
    verificationId: 'MED 0441',
    kategori: 'Kesehatan',
    filterKategori: 'Kesehatan',
    wilayah: 'Medan Sunggal',
    status: 'aktif',
    isVerified: false,
    iconType: 'hospital',
  },

  // Page 3 (Ranks 17 - 24)
  {
    id: 17,
    rank: 17,
    code: 'BPJS',
    nama: 'Kantor Cabang BPJS Kesehatan Medan',
    verificationId: 'KES 8821',
    kategori: 'Kesehatan',
    filterKategori: 'Kesehatan',
    wilayah: 'Medan Barat',
    status: 'aktif',
    isVerified: true,
    iconType: 'hospital',
  },
  {
    id: 18,
    rank: 18,
    code: 'DLH',
    nama: 'Dinas Lingkungan Hidup Kota Medan',
    verificationId: 'LHK 7712',
    kategori: 'Infrastruktur',
    filterKategori: 'Infrastruktur',
    wilayah: 'Medan Amplas',
    status: 'aktif',
    isVerified: false,
    iconType: 'water',
  },
  {
    id: 19,
    rank: 19,
    code: 'SMKN',
    nama: 'SMK Negeri 1 Medan',
    verificationId: 'EDU 0112',
    kategori: 'Pendidikan',
    filterKategori: 'Pendidikan',
    wilayah: 'Medan Kota',
    status: 'aktif',
    isVerified: false,
    iconType: 'school',
  },
  {
    id: 20,
    rank: 20,
    code: 'BPN',
    nama: 'Kantor Pertanahan Kota Medan',
    verificationId: 'ATR 4432',
    kategori: 'Administrasi',
    filterKategori: 'Kependudukan',
    wilayah: 'Medan Petisah',
    status: 'aktif',
    isVerified: false,
    iconType: 'gov',
  },
  {
    id: 21,
    rank: 21,
    code: 'RSMM',
    nama: 'RSU Martha Friska Multatuli',
    verificationId: 'MED 9901',
    kategori: 'Kesehatan',
    filterKategori: 'Kesehatan',
    wilayah: 'Medan Maimun',
    status: 'tidak aktif',
    isVerified: false,
    iconType: 'hospital',
  },
  {
    id: 22,
    rank: 22,
    code: 'STPL',
    nama: 'Satpol PP Kota Medan',
    verificationId: 'POL 0211',
    kategori: 'Keamanan',
    filterKategori: 'Keamanan',
    wilayah: 'Medan Petisah',
    status: 'aktif',
    isVerified: false,
    iconType: 'shield',
  },
  {
    id: 23,
    rank: 23,
    code: 'PDPS',
    nama: 'PD Pasar Kota Medan',
    verificationId: 'EKO 3314',
    kategori: 'Ekonomi & Usaha',
    filterKategori: 'Ekonomi & Usaha',
    wilayah: 'Medan Kota',
    status: 'aktif',
    isVerified: false,
    iconType: 'gov',
  },
  {
    id: 24,
    rank: 24,
    code: 'BLT',
    nama: 'Sentra Penyaluran Bansos BLT',
    verificationId: 'SOS 5567',
    kategori: 'Bantuan Sosial',
    filterKategori: 'Bantuan Sosial',
    wilayah: 'Medan Tembung',
    status: 'aktif',
    isVerified: false,
    iconType: 'social',
  },

  // Page 25 (Ranks 241 - 248)
  {
    id: 241,
    rank: 241,
    code: 'KTR',
    nama: 'Balai Pengujian Mutu Hasil Perikanan',
    verificationId: 'EKO 9081',
    kategori: 'Ekonomi & Usaha',
    filterKategori: 'Ekonomi & Usaha',
    wilayah: 'Medan Belawan',
    status: 'aktif',
    isVerified: false,
    iconType: 'gov',
  },
  {
    id: 242,
    rank: 242,
    code: 'PKM',
    nama: 'Puskesmas Belawan',
    verificationId: 'MED 8831',
    kategori: 'Kesehatan',
    filterKategori: 'Kesehatan',
    wilayah: 'Medan Belawan',
    status: 'aktif',
    isVerified: false,
    iconType: 'hospital',
  },
  {
    id: 243,
    rank: 243,
    code: 'SDN',
    nama: 'SDN 064023 Medan',
    verificationId: 'EDU 7719',
    kategori: 'Pendidikan',
    filterKategori: 'Pendidikan',
    wilayah: 'Medan Tuntungan',
    status: 'aktif',
    isVerified: false,
    iconType: 'school',
  },
  {
    id: 244,
    rank: 244,
    code: 'KEC',
    nama: 'Kantor Camat Medan Labuhan',
    verificationId: 'ADM 6612',
    kategori: 'Administrasi',
    filterKategori: 'Kependudukan',
    wilayah: 'Medan Labuhan',
    status: 'aktif',
    isVerified: false,
    iconType: 'star',
  },
  {
    id: 245,
    rank: 245,
    code: 'POS',
    nama: 'Pos Pemadam Kebakaran Medan Deli',
    verificationId: 'DAM 5519',
    kategori: 'Keamanan',
    filterKategori: 'Keamanan',
    wilayah: 'Medan Deli',
    status: 'aktif',
    isVerified: true,
    iconType: 'shield',
  },
  {
    id: 246,
    rank: 246,
    code: 'TRN',
    nama: 'Terminal Terpadu Amplas',
    verificationId: 'INF 4431',
    kategori: 'Infrastruktur',
    filterKategori: 'Infrastruktur',
    wilayah: 'Medan Amplas',
    status: 'aktif',
    isVerified: false,
    iconType: 'water',
  },
  {
    id: 247,
    rank: 247,
    code: 'KTR',
    nama: 'Sentra Bantuan UMKM Medan Timur',
    verificationId: 'EKO 3320',
    kategori: 'Ekonomi & Usaha',
    filterKategori: 'Ekonomi & Usaha',
    wilayah: 'Medan Timur',
    status: 'tidak aktif',
    isVerified: false,
    iconType: 'gov',
  },
  {
    id: 248,
    rank: 248,
    code: 'KEC',
    nama: 'Kantor Lurah Belawan I',
    verificationId: 'ADM 1190',
    kategori: 'Administrasi',
    filterKategori: 'Kependudukan',
    wilayah: 'Medan Belawan',
    status: 'aktif',
    isVerified: false,
    iconType: 'star',
  },
];

const CATEGORIES = [
  'Ranking Terbaik',
  'Kependudukan',
  'Kesehatan',
  'Pendidikan',
  'Bantuan Sosial',
  'Keamanan',
  'Ekonomi & Usaha',
  'Infrastruktur',
] as const;

function CategoryIcon({ type }: { type: LayananItem['iconType'] }) {
  switch (type) {
    case 'hospital':
      return (
        <span className="text-base leading-none select-none" role="img" aria-label="Kesehatan">
          🏥
        </span>
      );
    case 'school':
      return (
        <span className="text-base leading-none select-none" role="img" aria-label="Pendidikan">
          🎓
        </span>
      );
    case 'star':
      return (
        <span className="text-sm text-gray-700 leading-none select-none" role="img" aria-label="Bintang">
          ★
        </span>
      );
    case 'gov':
      return (
        <span className="text-base leading-none select-none" role="img" aria-label="Pemerintah">
          🏛
        </span>
      );
    case 'water':
      return (
        <span className="text-base text-sky-400 leading-none select-none" role="img" aria-label="Air">
          💧
        </span>
      );
    case 'shield':
      return (
        <span className="text-base leading-none select-none" role="img" aria-label="Keamanan">
          🛡️
        </span>
      );
    case 'social':
      return (
        <span className="text-base leading-none select-none" role="img" aria-label="Bantuan Sosial">
          🤝
        </span>
      );
    default:
      return (
        <span className="text-base leading-none select-none" role="img" aria-label="Layanan">
          🏢
        </span>
      );
  }
}

export default function LayananTable() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Ranking Terbaik');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;
  const totalCount = 248; // Total terverifikasi sesuai referensi

  // Filter logic
  const filteredData = useMemo(() => {
    return INITIAL_DATA.filter((item) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'Ranking Terbaik' ||
        item.filterKategori === selectedCategory ||
        item.kategori.toLowerCase().includes(selectedCategory.toLowerCase());

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.verificationId.toLowerCase().includes(q) ||
        item.wilayah.toLowerCase().includes(q) ||
        item.kategori.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Pagination data slice
  const displayedItems = useMemo(() => {
    if (selectedCategory === 'Ranking Terbaik' && !searchQuery) {
      if (currentPage === 1) return INITIAL_DATA.slice(0, 8);
      if (currentPage === 2) return INITIAL_DATA.slice(8, 16);
      if (currentPage === 3) return INITIAL_DATA.slice(16, 24);
      if (currentPage === 25) return INITIAL_DATA.slice(24, 32);
      // Fallback for intermediate pages
      return INITIAL_DATA.slice(0, 8);
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [selectedCategory, searchQuery, currentPage, filteredData]);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + displayedItems.length - 1, totalCount);

  // Handle CSV export
  const handleDownloadCSV = () => {
    const headers = ['Peringkat', 'Kode', 'Nama Layanan', 'ID Verifikasi', 'Kategori', 'Wilayah', 'Status Operasional'];
    const rows = filteredData.map((item) => [
      item.rank,
      `"${item.code}"`,
      `"${item.nama}"`,
      `"${item.verificationId}"`,
      `"${item.kategori}"`,
      `"${item.wilayah}"`,
      `"${item.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rekap_layanan_${selectedCategory.toLowerCase().replace(/\s+/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    /* 3. Spacing & Container Table: Satu kontainer utama bertipe card */
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4 text-left font-sans">
      {/* 1. Filter Kategori (Pill Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 2. Perbaikan Overlap Search Bar: Jarak margin yang jelas dengan pill buttons */}
      <div className="relative w-full my-2">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Cari nama Layanan"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs md:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
        />
      </div>

      {/* 3. Struktur Tabel & Footer Data Terpadu */}
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="py-3 px-4 text-xs font-bold text-gray-800 tracking-wider">
                <div className="flex items-center gap-1.5">
                  {/* Sort Arrow Icon ↕ */}
                  <svg className="w-3.5 h-3.5 text-gray-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                  PERINGKAT &amp; INSTANSI
                </div>
              </th>
              <th className="py-3 px-4 text-xs font-bold text-gray-800 tracking-wider">
                KATEGORI &amp; WILAYAH
              </th>
              <th className="py-3 px-4 text-xs font-bold text-gray-800 tracking-wider text-right pr-6">
                STATUS OPERASIONAL
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.length > 0 ? (
              displayedItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Kolom 1: PERINGKAT & INSTANSI */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {/* Checkmark icon for verified item */}
                      {item.isVerified ? (
                        <div className="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 shrink-0" />
                      )}

                      {/* Rank Badge #1 */}
                      <span className="font-bold text-gray-900 text-sm w-7 shrink-0">
                        #{item.rank}
                      </span>

                      {/* Code Pill (PHB, SMP1, dll) */}
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded shrink-0 tracking-wide">
                        {item.code}
                      </span>

                      {/* Name & ID Verifikasi */}
                      <div className="flex flex-col ml-1">
                        <span className="font-bold text-gray-900 text-sm leading-tight">
                          {item.nama}
                        </span>
                        <span className="text-xs text-gray-400 font-normal mt-0.5">
                          ID Verifikasi: {item.verificationId}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Kolom 2: KATEGORI & WILAYAH */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                      <CategoryIcon type={item.iconType} />
                      <span>
                        {item.kategori} - {item.wilayah}
                      </span>
                    </div>
                  </td>

                  {/* Kolom 3: STATUS OPERASIONAL */}
                  <td className="py-3 px-4 text-right pr-6">
                    <div className="flex justify-end">
                      {item.status === 'aktif' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#e6f9f0] text-[#059669] border border-[#a7f3d0]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#fef2f2] text-[#e11d48] border border-[#fecdd3]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />
                          Tidak Aktif
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-12 text-center text-gray-400 text-sm">
                  Tidak ada layanan yang ditemukan untuk pencarian "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer Data di dalam batas tabel */}
        <div className="border-t border-gray-100 py-3 px-4 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 bg-white">
          <div className="flex items-center gap-1.5 text-gray-500">
            {/* Clock Icon */}
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Data diperbarui access real time berdasarkan 4.192 formulir audit warga terverifikasi.</span>
          </div>

          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
          >
            {/* Download Icon */}
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Unduh Rekap CSV
          </button>
        </div>
      </div>

      {/* 2. & 3. Paginasi: Termasuk di dalam card, nomor aktif teal/emerald gelap dan teks putih sangat jelas */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-gray-600">
        <div>
          Menampilkan <span className="font-semibold text-gray-900">{displayedItems.length > 0 ? startIndex : 0}</span> sampai{' '}
          <span className="font-semibold text-gray-900">{endIndex}</span> dari{' '}
          <span className="font-semibold text-gray-900">{totalCount}</span> layanan publik terverifikasi
        </div>

        <div className="flex items-center gap-1 md:gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="text-xs text-gray-600 hover:text-blue-600 px-2 py-1 disabled:opacity-30 disabled:hover:text-gray-600 cursor-pointer disabled:cursor-not-allowed font-medium select-none"
          >
            &lt; Sebelumnya
          </button>

          {[1, 2, 3].map((page) => {
            const isActive = currentPage === page;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 flex items-center justify-center rounded text-xs transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-emerald-800 text-white font-bold shadow-xs'
                    : 'text-gray-700 hover:bg-gray-100 font-medium'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: '#065f46',
                        color: '#ffffff',
                        fontWeight: '700',
                      }
                    : undefined
                }
              >
                {page}
              </button>
            );
          })}

          <span className="text-gray-400 text-xs px-1 select-none">...</span>

          <button
            onClick={() => setCurrentPage(25)}
            className={`w-7 h-7 flex items-center justify-center rounded text-xs transition-all cursor-pointer select-none ${
              currentPage === 25
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-gray-700 hover:bg-gray-100 font-medium'
            }`}
            style={
              currentPage === 25
                ? {
                    backgroundColor: '#065f46',
                    color: '#ffffff',
                    fontWeight: '700',
                  }
                : undefined
            }
          >
            25
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, 25))}
            disabled={currentPage === 25}
            className="text-xs text-gray-600 hover:text-blue-600 px-2 py-1 disabled:opacity-30 disabled:hover:text-gray-600 cursor-pointer disabled:cursor-not-allowed font-medium select-none"
          >
            Selanjutnya &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
