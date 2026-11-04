import './style_analisis_optimalisasi.css';
import dataAnalisis from '../assets/dataAnalisis.json';

export default function AnalisisOptimalisasi() {
  return (
    <div className="analisis-container">
      
      {/* Main Content (Dua Kolom Layanan) */}
      <div className="analisis-grid">
        
        {/* Kolom Kiri: Sering Digunakan */}
        <div className="analisis-card">
          <h2 className="analisis-title">Layanan yang sering digunakan</h2>
          <div className="analisis-list">
            {dataAnalisis.sering_digunakan.map((item) => (
              <ServiceItem key={item.id} data={item} />
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Jarang Digunakan */}
        <div className="analisis-card">
          <h2 className="analisis-title">Layanan yang tidak sering digunakan</h2>
          <div className="analisis-list">
            {dataAnalisis.jarang_digunakan.map((item) => (
              <ServiceItem key={item.id} data={item} />
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}

// Komponen Card Kecil
function ServiceItem({ data }: { data: any }) {
  return (
    <div className="service-item">
      <h3 className="service-name">{data.nama}</h3>
      <p className="service-category">{data.kategori}</p>
      <div className="service-badge">
        {data.akses} Akses
      </div>
    </div>
  );
}