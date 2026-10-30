import { useState } from 'react'
import type { CSSProperties, Dispatch, SetStateAction } from 'react'

type Recommendation = {
  title: string
  services: string[]
}

type SaranAntisipasiProps = {
  recommendations: Recommendation[]
  selectedRecommendation: string | null
  setSelectedRecommendation: Dispatch<SetStateAction<string | null>>
}

// Kotak saran: tidak bisa diklik dan tidak ada efek hover
const saranStyle: CSSProperties = {
  pointerEvents: 'none',
  cursor: 'default',
  textAlign: 'center',
}

const Saran_Antisipasi = ({
  recommendations,
  selectedRecommendation,
  setSelectedRecommendation,
}: SaranAntisipasiProps) => {
  const [hoveredRecommendation, setHoveredRecommendation] = useState<string | null>(null)

  // Gaya kotak judul (inline, jadi tidak perlu menambah CSS)
  const titleStyle = (title: string): CSSProperties => {
    const isSelected = selectedRecommendation === title
    const isHovered = hoveredRecommendation === title
    return {
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'border-color 0.15s, box-shadow 0.15s, background-color 0.15s',
      ...(isSelected || isHovered ? { borderColor: '#2563eb' } : {}),
      ...(isSelected
        ? { boxShadow: '0 0 0 2px #2563eb', backgroundColor: '#eaf1ff' }
        : {}),
    }
  }

  return (
    <section className="recommendations" aria-labelledby="recommendation-title">
      <div className="section-heading">
        <h1 id="recommendation-title">
          Rekomendasi tindakan pemerintahan berdasarkan kejadian saat ini
        </h1>
      </div>
      <div className="recommendation-grid">
        {recommendations.map(({ title, services }) => (
          <article className="recommendation-column" key={title}>
            <span className="ranking-label">Ranking Terbaik</span>
            <div className="recommendation-card">
              {/* Kotak paling atas: satu-satunya yang bisa diklik */}
              <h2
                className={`recommendation-title${selectedRecommendation === title ? ' selected' : ''}`}
                onClick={() => setSelectedRecommendation(title)}
                onMouseEnter={() => setHoveredRecommendation(title)}
                onMouseLeave={() => setHoveredRecommendation(null)}
                style={titleStyle(title)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedRecommendation(title)
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={selectedRecommendation === title}
              >
                {title}
              </h2>

              {/* Kotak di bawahnya: hanya saran, tidak bisa diklik */}
              <div className="related-button saran" style={saranStyle}>
                layanan terkait
              </div>
              {services.map((service) => (
                <div className="service-button saran" key={service} style={saranStyle}>
                  {service}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Saran_Antisipasi