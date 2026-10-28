import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Download,
  Clock,
  Check,
  Building2,
  GraduationCap,
  Sparkles,
  Droplets,
  HeartPulse,
  FileSpreadsheet,
  FileDown,
  X,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

// Data Layanan Publik (Persis Gambar Dummy & Tambahan untuk Paginasi)
const INITIAL_DATA = [
  {
    id: 1,
    rank: '#1',
    code: 'PHB',
    name: 'Puskesmas Medan Baru',
    verifyId: 'ID Verifikasi: MBN 0912',
    category: 'Kesehatan',
    region: 'Medan Baru',
    fullCategory: 'Kesehatan - Medan Baru',
    iconType: 'health',
    status: 'Aktif',
    checked: true,
    accessCount: '34.820',
    rating: '4.8'
  },
  {
    id: 2,
    rank: '#2',
    code: 'SMP1',
    name: 'SMP Negeri 1 Medan',
    verifyId: 'ID Verifikasi: EDU 1044',
    category: 'Pendidikan',
    region: 'Medan Petissh',
    fullCategory: 'Pendidikan - Medan Petissh',
    iconType: 'education',
    status: 'Aktif',
    checked: true,
    accessCount: '28.450',
    rating: '4.7'
  },
  {
    id: 3,
    rank: '#3',
    code: 'SKP',
    name: 'Kantor Kelurahan Padang Bulan',
    verifyId: 'ID Verifikasi: ADM 2014',
    category: 'Administrasi',
    region: 'Medan Baru',
    fullCategory: 'Administrasi - Medan Baru',
    iconType: 'star',
    status: 'Aktif',
    checked: false,
    accessCount: '24.110',
    rating: '4.6'
  },
  {
    id: 4,
    rank: '#4',
    code: 'SNC',
    name: 'Samsat Medan Kota',
    verifyId: 'ID Verifikasi: ADM 7731',
    category: 'Ekonomi & Usaha',
    region: 'Medan Kota',
    fullCategory: 'Administrasi & Pajak - Medan Kota',
    iconType: 'building',
    status: 'Tidak Aktif',
    checked: false,
    accessCount: '19.800',
    rating: '3.9'
  },
  {
    id: 5,
    rank: '#5',
    code: 'PDAM',
    name: 'Unit Pelayanan PDAM Tirtanadi',
    verifyId: 'ID Verifikasi: UTL ULS2',
    category: 'Infrastruktur',
    region: 'Medan Amplas',
    fullCategory: 'Air & Listrik - Medan Amplas',
    iconType: 'water',
    status: 'Aktif',
    checked: false,
    accessCount: '31.200',
    rating: '4.5'
  },
  {
    id: 6,
    rank: '#6',
    code: 'RSUD',
    name: 'RSUD Dr. Pirngadi',
    verifyId: 'ID Verifikasi: MED-0012',
    category: 'Kesehatan',
    region: 'Medan Timur',
    fullCategory: 'Kesehatan - Medan Timur',
    iconType: 'health',
    status: 'Tidak Aktif',
    checked: false,
    accessCount: '15.930',
    rating: '3.8'
  },
  {
    id: 7,
    rank: '#7',
    code: 'DIS',
    name: 'Disdukcapil Kota Medan',
    verifyId: 'ID Verifikasi: ADM 0110',
    category: 'Kependudukan',
    region: 'Medan Petisah',
    fullCategory: 'Administrasi - Medan Petisah',
    iconType: 'building',
    status: 'Aktif',
    checked: false,
    accessCount: '42.100',
    rating: '4.9'
  },
  {
    id: 8,
    rank: '#8',
    code: 'SONS',
    name: 'SDN 060800 Medan',
    verifyId: 'ID Verifikasi: EDU 0881',
    category: 'Pendidikan',
    region: 'Medan Helvetia',
    fullCategory: 'Pendidikan - Medan Helvetia',
    iconType: 'education',
    status: 'Aktif',
    checked: false,
    accessCount: '12.940',
    rating: '4.4'
  }
];

// Template tambahan untuk menghasilkan 200 data layanan (25 halaman x 8 baris)
const RAW_ADDITIONAL_TEMPLATES = [
  { name: 'Kantor Camat Medan Baru', code: 'KCM', cat: 'Administrasi', reg: 'Medan Baru', icon: 'building', status: 'Aktif' },
  { name: 'Puskesmas Teladan', code: 'PKT', cat: 'Kesehatan', reg: 'Medan Kota', icon: 'health', status: 'Aktif' },
  { name: 'SMP Negeri 3 Medan', code: 'SMP3', cat: 'Pendidikan', reg: 'Medan Petisah', icon: 'education', status: 'Aktif' },
  { name: 'Dinas Sosial Kota Medan', code: 'DINS', cat: 'Bantuan Sosial', reg: 'Medan Amplas', icon: 'star', status: 'Aktif' },
  { name: 'RSUP H. Adam Malik', code: 'RSAM', cat: 'Kesehatan', reg: 'Medan Tuntungan', icon: 'health', status: 'Aktif' },
  { name: 'Kantor Pos Medan Kota', code: 'POS', cat: 'Ekonomi & Usaha', reg: 'Medan Kota', icon: 'building', status: 'Aktif' },
  { name: 'Dinas Perhubungan Medan', code: 'DPH', cat: 'Infrastruktur', reg: 'Medan Barat', icon: 'building', status: 'Aktif' },
  { name: 'Damkar Pos Medan Petisah', code: 'DMK', cat: 'Keamanan', reg: 'Medan Petisah', icon: 'building', status: 'Aktif' },
  { name: 'Puskesmas Glugur Darat', code: 'PKGD', cat: 'Kesehatan', reg: 'Medan Timur', icon: 'health', status: 'Tidak Aktif' },
  { name: 'SMA Negeri 1 Medan', code: 'SMA1', cat: 'Pendidikan', reg: 'Medan Baru', icon: 'education', status: 'Aktif' },
  { name: 'Perpustakaan Daerah Medan', code: 'PRP', cat: 'Pendidikan', reg: 'Medan Petisah', icon: 'education', status: 'Aktif' },
  { name: 'Kantor Imigrasi Kelas I', code: 'IMI', cat: 'Administrasi', reg: 'Medan Kota', icon: 'building', status: 'Aktif' },
  { name: 'BPJS Kesehatan Cabang Medan', code: 'BPJS', cat: 'Kesehatan', reg: 'Medan Baru', icon: 'health', status: 'Aktif' },
  { name: 'Dinas Lingkungan Hidup', code: 'DLH', cat: 'Infrastruktur', reg: 'Medan Amplas', icon: 'star', status: 'Aktif' },
  { name: 'Kantor Kelurahan Babura', code: 'KKB', cat: 'Administrasi', reg: 'Medan Baru', icon: 'star', status: 'Aktif' },
  { name: 'Puskesmas Medan Helvetia', code: 'PMH', cat: 'Kesehatan', reg: 'Medan Helvetia', icon: 'health', status: 'Aktif' },
  { name: 'SMP Negeri 10 Medan', code: 'SMP10', cat: 'Pendidikan', reg: 'Medan Amplas', icon: 'education', status: 'Aktif' },
  { name: 'Polsek Medan Kota', code: 'POL', cat: 'Keamanan', reg: 'Medan Kota', icon: 'building', status: 'Aktif' },
  { name: 'Dinas Koperasi & UMKM', code: 'KOP', cat: 'Ekonomi & Usaha', reg: 'Medan Petisah', icon: 'building', status: 'Aktif' },
  { name: 'PDAM Cabang Sei Agul', code: 'PDSA', cat: 'Infrastruktur', reg: 'Medan Barat', icon: 'water', status: 'Aktif' },
  { name: 'RS Jiwa Prof. Ildrem', code: 'RSJI', cat: 'Kesehatan', reg: 'Medan Tuntungan', icon: 'health', status: 'Tidak Aktif' },
  { name: 'SD Negeri Percobaan Medan', code: 'SDPC', cat: 'Pendidikan', reg: 'Medan Baru', icon: 'education', status: 'Aktif' },
  { name: 'Kantor Urusan Agama (KUA)', code: 'KUA', cat: 'Kependudukan', reg: 'Medan Kota', icon: 'building', status: 'Aktif' },
  { name: 'Puskesmas Padang Bulan', code: 'PKPB', cat: 'Kesehatan', reg: 'Medan Baru', icon: 'health', status: 'Aktif' }
];

const generateFullServices = () => {
  const full = [...INITIAL_DATA];
  for (let i = 9; i <= 200; i++) {
    const tmpl = RAW_ADDITIONAL_TEMPLATES[(i - 9) % RAW_ADDITIONAL_TEMPLATES.length];
    const cycle = Math.floor((i - 9) / RAW_ADDITIONAL_TEMPLATES.length) + 1;
    const name = cycle === 1 ? tmpl.name : `${tmpl.name} Wilayah ${cycle}`;
    const code = tmpl.code + (cycle > 1 ? cycle : '');
    const prefix = tmpl.cat === 'Kesehatan' ? 'MED' : tmpl.cat === 'Pendidikan' ? 'EDU' : tmpl.cat === 'Infrastruktur' ? 'UTL' : 'ADM';
    const verifyId = `ID Verifikasi: ${prefix} ${1000 + ((i * 37) % 8990)}`;
    const accessCount = `${Math.floor(10 + ((i * 13) % 40))}.${Math.floor(100 + ((i * 73) % 899))}`;
    const rating = (4.0 + ((i * 3) % 10) / 10).toFixed(1);
    const isAktif = (i % 6 !== 0) && tmpl.status === 'Aktif';

    full.push({
      id: i,
      rank: `#${i}`,
      code: code,
      name: name,
      verifyId: verifyId,
      category: tmpl.cat,
      region: tmpl.reg,
      fullCategory: `${tmpl.cat} - ${tmpl.reg}`,
      iconType: tmpl.icon,
      status: isAktif ? 'Aktif' : 'Tidak Aktif',
      checked: false,
      accessCount: accessCount,
      rating: rating
    });
  }
  return full;
};

const ALL_SERVICES_DATA = generateFullServices();

const CATEGORIES = [
  'Ranking Terbaik',
  'Kependudukan',
  'Kesehatan',
  'Pendidikan',
  'Kesehatan',
  'Bantuan Sosial',
  'Keamanan',
  'Ekonomi & Usaha',
  'Infrastruktur'
];

export default function App() {
  const [activeNav, setActiveNav] = useState('Tabel Layanan');
  const [activeCategory, setActiveCategory] = useState('Ranking Terbaik');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState(ALL_SERVICES_DATA);
  const [selectedIds, setSelectedIds] = useState(new Set([1, 2]));
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const ITEMS_PER_PAGE = 8;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle checkbox baris
  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filter & Search
  const filteredServices = useMemo(() => {
    return services
      .filter((item) => {
        // Filter kategori jika bukan "Ranking Terbaik"
        if (activeCategory !== 'Ranking Terbaik') {
          const matchCat =
            item.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
            item.fullCategory.toLowerCase().includes(activeCategory.toLowerCase());
          if (!matchCat) return false;
        }
        // Filter pencarian
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchSearch =
            item.name.toLowerCase().includes(q) ||
            item.verifyId.toLowerCase().includes(q) ||
            item.fullCategory.toLowerCase().includes(q) ||
            item.code.toLowerCase().includes(q);
          if (!matchSearch) return false;
        }
        return true;
      })
      .sort((a, b) => {
        return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
      });
  }, [services, activeCategory, searchQuery, sortOrder]);

  // Total halaman berdasarkan data yang telah difilter
  const totalPages = Math.max(1, Math.ceil(filteredServices.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // Data baris yang ditampilkan sesuai halaman aktif
  const paginatedServices = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredServices, safeCurrentPage, ITEMS_PER_PAGE]);

  // Logika pembuatan deretan nomor halaman dinamis
  const getPaginationItems = (current, total) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, 4, '...', total];
    }

    if (current === 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }

    if (current >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total];
    }

    if (current === total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }

    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageClick = (page) => {
    if (typeof page === 'number') {
      setCurrentPage(page);
    }
  };

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };


  // Download CSV
  const handleDownloadCSV = () => {
    const headers = ['Peringkat', 'Kode', 'Nama Instansi', 'ID Verifikasi', 'Kategori & Wilayah', 'Status Operasional'];
    const rows = filteredServices.map((s) => [
      s.rank,
      s.code,
      `"${s.name}"`,
      `"${s.verifyId}"`,
      `"${s.fullCategory}"`,
      s.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Layanan_Banda_Aceh_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Berhasil mengunduh Rekap CSV layanan publik!');
  };

  // Export Excel simulation
  const handleExportExcel = () => {
    showToast('Menyiapkan berkas Excel (.xlsx) untuk 248 layanan...');
    setTimeout(() => {
      handleDownloadCSV();
    }, 600);
  };

  // Helper render icon kategori
  const renderCategoryIcon = (type) => {
    switch (type) {
      case 'health':
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm" role="img" aria-label="Kesehatan">
            🏥
          </span>
        );
      case 'education':
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm" role="img" aria-label="Pendidikan">
            🎓
          </span>
        );
      case 'star':
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm text-gray-700" role="img" aria-label="Bintang">
            ⭐
          </span>
        );
      case 'building':
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm text-amber-800" role="img" aria-label="Gedung">
            🏛️
          </span>
        );
      case 'water':
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm text-sky-500" role="img" aria-label="Air">
            💧
          </span>
        );
      default:
        return <Building2 className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased pb-20 selection:bg-blue-100 selection:text-blue-700">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700/80 transition-all duration-300 animate-bounce-subtle">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HEADER UTAMA */}
      <header className="w-full pt-8 pb-6 px-4 sm:px-6 max-w-[1240px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo Kiri: LAYANAN Kota Banda Aceh */}
          <div className="flex items-center gap-3.5 self-start md:self-auto cursor-pointer select-none">
            {/* Lambang Logo Kota Banda Aceh (Authentic Vector Graphic) */}
            <div className="w-10 h-11 relative flex-shrink-0">
              <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xs">
                {/* Shield background */}
                <path
                  d="M10 20 L50 8 L90 20 L90 75 Q90 110 50 118 Q10 110 10 75 Z"
                  fill="#15803d"
                  stroke="#eab308"
                  strokeWidth="3.5"
                />
                {/* Inner decorative contour */}
                <path
                  d="M17 26 L50 16 L83 26 L83 72 Q83 103 50 110 Q17 103 17 72 Z"
                  fill="#166534"
                />
                {/* Aceh Gate / Dome Crown */}
                <path
                  d="M32 38 Q50 20 68 38 L68 64 Q50 68 32 64 Z"
                  fill="#facc15"
                  stroke="#ca8a04"
                  strokeWidth="1.5"
                />
                {/* Gate arch */}
                <path
                  d="M42 64 Q50 48 58 64 Z"
                  fill="#991b1b"
                />
                {/* Rencong / Center monument */}
                <rect x="48" y="32" width="4" height="26" fill="#ffffff" rx="1" />
                <circle cx="50" cy="30" r="3" fill="#ef4444" />
                {/* Golden star on top */}
                <polygon
                  points="50,16 52,22 58,22 53,26 55,32 50,28 45,32 47,26 42,22 48,22"
                  fill="#fde047"
                />
                {/* Base ribbon */}
                <path
                  d="M26 84 Q50 90 74 84 L72 92 Q50 98 28 92 Z"
                  fill="#ffffff"
                  stroke="#ca8a04"
                  strokeWidth="1"
                />
                <circle cx="50" cy="88" r="2.5" fill="#dc2626" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-[18px] tracking-wider text-slate-800 leading-none">
                LAYANAN
              </span>
              <span className="text-[11px] font-semibold text-slate-500 tracking-tight mt-0.5">
                Kota Banda Aceh
              </span>
            </div>
          </div>

          {/* Navigasi Tengah */}
          <nav className="flex items-center gap-7 sm:gap-9 text-[13.5px]">
            {['Grafik Layanan', 'Saran & Antisipasi', 'Analisis Optimalisasi', 'Tabel Layanan'].map((item) => {
              const isActive = activeNav === item;
              return (
                <button
                  key={item}
                  onClick={() => setActiveNav(item)}
                  className={`relative py-1 font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#2563eb] font-semibold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {item}
                  {isActive && (
                    <span className="absolute bottom-[-3px] left-0 right-0 h-[2px] bg-[#2563eb] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Tombol Kanan: EXPORT EXCEL (Persis Desain Kapsul di Gambar) */}
          <button
            onClick={handleExportExcel}
            className="group flex items-center pl-5 pr-1.5 py-1 rounded-full border-2 border-blue-400 hover:border-blue-500 bg-white hover:bg-blue-50/40 transition-all shadow-2xs cursor-pointer"
          >
            <span className="text-[11px] font-bold tracking-wider text-slate-400 group-hover:text-blue-600 uppercase mr-3">
              EXPORT EXCEL
            </span>
            {/* Box with arrow pointing out/up inside an oval/pill outline */}
            <div className="w-8 h-8 rounded-full border border-blue-400/80 group-hover:border-blue-500 flex items-center justify-center text-slate-700 group-hover:text-blue-600 bg-white">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round"
              >
                <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
                <polyline points="16 8 12 4 8 8" />
                <line x1="12" y1="4" x2="12" y2="15" />
              </svg>
            </div>
          </button>
        </div>
      </header>

      {/* KONTEN UTAMA: CONTAINER PUTIH BESAR */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 mt-1">
        <div className="bg-white rounded-[28px] border border-slate-200/90 shadow-sm p-6 sm:p-8">
          {/* 1. SEARCH BAR */}
          <div className="relative w-full mb-6">
            <div className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari nama Layanan"
                className="w-full text-slate-700 placeholder:text-slate-400 text-sm focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 2. KARTU STATISTIK (4 Horizontal Cards di dalam box) */}
          <div className="w-full bg-[#f1f5f9]/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Kartu 1 */}
              <div>
                <p className="text-[13px] font-medium text-slate-700 mb-1.5">Total Layanan</p>
                <div className="bg-white border border-slate-200 rounded-lg px-3.5 py-2 shadow-2xs">
                  <span className="text-[17px] sm:text-[18px] font-semibold text-slate-800">68</span>
                </div>
              </div>

              {/* Kartu 2 */}
              <div>
                <p className="text-[13px] font-medium text-slate-700 mb-1.5">Total Akses Publik</p>
                <div className="bg-white border border-slate-200 rounded-lg px-3.5 py-2 shadow-2xs">
                  <span className="text-[17px] sm:text-[18px] font-semibold text-slate-800">199.350</span>
                </div>
              </div>

              {/* Kartu 3 */}
              <div>
                <p className="text-[13px] font-medium text-slate-700 mb-1.5">Jumlah Kategori</p>
                <div className="bg-white border border-slate-200 rounded-lg px-3.5 py-2 shadow-2xs">
                  <span className="text-[17px] sm:text-[18px] font-semibold text-slate-800">7</span>
                </div>
              </div>

              {/* Kartu 4 */}
              <div>
                <p className="text-[13px] font-medium text-slate-700 mb-1.5">Layanan non-aktif</p>
                <div className="bg-white border border-slate-200 rounded-lg px-3.5 py-2 shadow-2xs">
                  <span className="text-[17px] sm:text-[18px] font-semibold text-slate-800">21</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. FILTER KATEGORI (TOMBOL PIL) */}
          <div className="mb-6 space-y-2.5">
            {/* Baris 1 Filter */}
            <div className="flex flex-wrap items-center gap-2.5">
              {CATEGORIES.slice(0, 6).map((cat, idx) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={`${cat}-${idx}`}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 sm:px-5 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#2563eb] text-white shadow-xs hover:bg-blue-700'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Baris 2 Filter */}
            <div className="flex flex-wrap items-center gap-2.5">
              {CATEGORIES.slice(6).map((cat, idx) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={`${cat}-${idx}`}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 sm:px-5 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#2563eb] text-white shadow-xs hover:bg-blue-700'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. TABEL LAYANAN */}
          <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white mb-6">
            {/* Header Tabel */}
            <div className="grid grid-cols-12 px-5 py-3.5 bg-white border-b border-slate-200 text-slate-800 text-[11px] sm:text-[12px] font-bold tracking-wider uppercase items-center select-none">
              <div
                className="col-span-12 md:col-span-6 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                title="Urutkan peringkat"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-600" />
                <span>PERINGKAT &amp; INSTANSI</span>
              </div>
              <div className="hidden md:block md:col-span-3 text-slate-800">
                KATEGORI &amp; WILAYAH
              </div>
              <div className="hidden md:block md:col-span-3 text-right sm:text-center text-slate-800">
                STATUS OPERASIONAL
              </div>
            </div>

            {/* Baris Data Tabel */}
            <div className="divide-y divide-slate-100">
              {paginatedServices.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Tidak ada layanan publik yang sesuai dengan kriteria pencarian "{searchQuery}".
                </div>
              ) : (
                paginatedServices.map((service) => {
                  const isChecked = selectedIds.has(service.id);
                  const isAktif = service.status === 'Aktif';

                  return (
                    <div
                      key={service.id}
                      className="grid grid-cols-12 px-5 py-3.5 hover:bg-slate-50/70 transition-colors items-center gap-y-2 group"
                    >
                      {/* Kolom 1: Checkbox (hanya tampil jika checked atau saat hover), Peringkat, Badge Kode, Judul & Subjudul */}
                      <div className="col-span-12 md:col-span-6 flex items-center gap-3">
                        {/* Slot Checkbox (tersembunyi jika unchecked sesuai gambar, tetapi interaktif saat hover) */}
                        <div className="w-[18px] h-[18px] shrink-0 flex items-center justify-center">
                          {isChecked ? (
                            <button
                              type="button"
                              onClick={() => toggleCheckbox(service.id)}
                              className="w-[18px] h-[18px] rounded bg-[#009b60] text-white flex items-center justify-center shadow-2xs cursor-pointer hover:bg-emerald-700 transition-colors"
                              title="Batalkan pilihan"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleCheckbox(service.id)}
                              className="w-[18px] h-[18px] rounded border border-transparent group-hover:border-slate-300 hover:!border-slate-400 bg-transparent flex items-center justify-center transition-colors cursor-pointer"
                              title="Pilih layanan ini"
                            />
                          )}
                        </div>

                        {/* Nomor Peringkat */}
                        <span className="text-[13px] font-bold text-slate-800 w-6 shrink-0">
                          {service.rank}
                        </span>

                        {/* Badge Kode Singkatan (PHB, SMP1, SKP, dll) */}
                        <span className="px-2 py-0.5 text-[11px] font-semibold bg-[#eef2f6] text-slate-600 rounded border border-slate-200/60 shrink-0">
                          {service.code}
                        </span>

                        {/* Judul Instansi & ID Verifikasi */}
                        <div className="flex flex-col min-w-0 pr-2">
                          <span
                            onClick={() => setSelectedService(service)}
                            className="text-[13px] sm:text-[14px] font-bold text-slate-900 leading-snug truncate hover:text-blue-600 cursor-pointer"
                          >
                            {service.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal mt-0.5 tracking-tight">
                            {service.verifyId}
                          </span>
                        </div>
                      </div>

                      {/* Kolom 2: Ikon & Kategori Wilayah */}
                      <div className="col-span-7 md:col-span-3 flex items-center gap-2 pl-7 md:pl-0">
                        {renderCategoryIcon(service.iconType)}
                        <span className="text-[13px] text-slate-700 font-medium truncate">
                          {service.fullCategory}
                        </span>
                      </div>

                      {/* Kolom 3: Status Operasional */}
                      <div className="col-span-5 md:col-span-3 flex justify-end md:justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[12px] font-medium ${
                            isAktif
                              ? 'bg-[#e8fbf3] border border-[#a7f3d0]/60 text-[#009b60]'
                              : 'bg-[#fef2f2] border border-[#fecaca]/60 text-[#ef4444]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isAktif ? 'bg-[#009b60]' : 'bg-[#ef4444]'
                            }`}
                          />
                          {service.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Dalam Tabel (Info Data Real-Time & Unduh CSV) */}
            <div className="border-t border-slate-200/90 px-5 py-3.5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px]">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span>
                  Data diperbarui access real time berdasarkan 4.192 formulir audit warga terverifikasi.
                </span>
              </div>

              <button
                type="button"
                onClick={handleDownloadCSV}
                className="flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-600 transition-colors shrink-0 cursor-pointer self-end sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Rekap CSV</span>
              </button>
            </div>
          </div>

          {/* 5. FOOTER CONTAINER: PAGINASI */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-1 text-[13px] text-slate-500">
            {/* Keterangan Halaman */}
            <div>
              <span>Menampilkan </span>
              <strong className="font-semibold text-slate-800">
                {filteredServices.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
              </strong>
              <span> sampai </span>
              <strong className="font-semibold text-slate-800">
                {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredServices.length === 200 ? 248 : filteredServices.length)}
              </strong>
              <span> dari </span>
              <strong className="font-semibold text-slate-800">
                {filteredServices.length === 200 ? 248 : filteredServices.length}
              </strong>
              <span> layanan publik terverifikasi</span>
            </div>

            {/* Kontrol Navigasi Paginasi */}
            <div className="flex items-center gap-1.5 sm:gap-2 select-none">
              {/* Tombol Sebelumnya */}
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={safeCurrentPage === 1}
                className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                &lt; Sebelumnya
              </button>

              {/* Deretan Tombol Halaman Dinamis */}
              {getPaginationItems(safeCurrentPage, totalPages).map((item, idx) => {
                if (item === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className="w-5 text-center text-slate-400 font-medium">
                      ...
                    </span>
                  );
                }

                const isActive = item === safeCurrentPage;
                return (
                  <button
                    key={`page-${item}`}
                    type="button"
                    onClick={() => handlePageClick(item)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center font-semibold text-sm transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0d3b36] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}

              {/* Tombol Selanjutnya */}
              <button
                type="button"
                onClick={handleNextPage}
                disabled={safeCurrentPage === totalPages}
                className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Selanjutnya &gt;
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* DETAIL MODAL (Saat nama instansi diklik) */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-md">
                {selectedService.code}
              </span>
              <span className="text-xs text-slate-400 font-medium">{selectedService.verifyId}</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedService.name}</h3>

            <div className="flex items-center gap-2 mb-6 text-sm text-slate-600">
              {renderCategoryIcon(selectedService.iconType)}
              <span>{selectedService.fullCategory}</span>
              <span className="mx-2 text-slate-300">•</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  selectedService.status === 'Aktif'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                ● {selectedService.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
              <div>
                <span className="text-slate-400 text-xs block">Estimasi Akses Warga</span>
                <span className="font-semibold text-slate-800">{selectedService.accessCount} pengunjung</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">Indeks Kepuasan</span>
                <span className="font-semibold text-amber-600">⭐ {selectedService.rating} / 5.0</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  showToast(`Data verifikasi ${selectedService.code} berhasil divalidasi!`);
                  setSelectedService(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Audit Ulang Layanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
