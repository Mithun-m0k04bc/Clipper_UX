import { usePDLC } from '../context/PDLCContext'

export default function Step4Design() {
  const { pdlcData, updatePDLCData } = usePDLC()

  const designTools = [
    { name: 'GenMap', description: 'Auto-generate dependency graphs', icon: '🗺️', color: '#009ab7' },
    { name: 'MagicScreen', description: 'Generate UI/UX skeletons', icon: '✨', color: '#cb2c90' },
    { name: 'AskGlass', description: 'Technical Q&A assistant', icon: '💬', color: '#0071dc' },
    { name: 'TechDesignCoach', description: 'Architecture guidance', icon: '🎓', color: '#fc934d' },
  ]

  const handleGenerateUI = () => {
    alert('🎨 Generating UI/UX skeleton based on your specification...')
    updatePDLCData({
      uiSkeletons: [...pdlcData.uiSkeletons, 'Landing Page Wireframe', 'Dashboard Layout', 'Mobile View'],
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{
          fontFamily: 'var(--ld-semantic-font-heading-medium-family, Bogle)',
          fontSize: 'var(--ld-semantic-font-heading-medium-size, 20px)',
          fontWeight: 'var(--ld-semantic-font-heading-medium-weight-default, 700)',
          color: '#2e2f32',
          margin: '0 0 8px 0',
        }}>
          Phase 4: Design (AI-Powered)
        </h2>
        <p style={{ fontSize: '14px', color: '#74767c', margin: 0 }}>
          AI agents auto-generate UI/UX skeletons, dependency graphs, and provide technical answers. 
          Design decisions are anchored in existing knowledge and standards.
        </p>
      </div>

      {/* Design Tools */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
      }}>
        {designTools.map((tool) => (
          <div
            key={tool.name}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e3e4e5',
              borderRadius: '8px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = tool.color
              e.currentTarget.style.boxShadow = `0 4px 12px ${tool.color}20`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e3e4e5'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{tool.icon}</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 8px 0' }}>
              {tool.name}
            </h3>
            <p style={{ fontSize: '14px', color: '#74767c', margin: '0 0 16px 0' }}>
              {tool.description}
            </p>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: tool.color,
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Launch {tool.name}
            </button>
          </div>
        ))}
      </div>

      {/* UI Skeletons */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: 0 }}>
            UI/UX Skeletons
          </h3>
          <button
            onClick={handleGenerateUI}
            style={{
              padding: '8px 16px',
              backgroundColor: '#cb2c90',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ✨ Auto-Generate UI
          </button>
        </div>

        {pdlcData.uiSkeletons.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {pdlcData.uiSkeletons.map((skeleton, index) => (
              <div
                key={index}
                style={{
                  padding: '40px 20px',
                  border: '2px dashed #e3e4e5',
                  borderRadius: '8px',
                  backgroundColor: '#f8f8f8',
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#2e2f32',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🖼️</div>
                {skeleton}
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '40px',
            border: '2px dashed #e3e4e5',
            borderRadius: '8px',
            backgroundColor: '#f8f8f8',
            textAlign: 'center',
            color: '#74767c',
          }}>
            No UI skeletons generated yet. Click "Auto-Generate UI" to create wireframes.
          </div>
        )}
      </div>

      {/* Dependency Graph */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 16px 0' }}>
          Dependency Graph
        </h3>
        <div style={{
          padding: '60px 20px',
          border: '2px dashed #009ab7',
          borderRadius: '8px',
          backgroundColor: '#e1f3f8',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🗺️</div>
          <p style={{ fontSize: '14px', color: '#008daa', fontWeight: 600 }}>
            Auto-generated dependency graph will appear here
          </p>
          <button
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              backgroundColor: '#009ab7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Generate Dependency Graph
          </button>
        </div>
      </div>

      {/* Design Decisions */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 16px 0' }}>
          Design Decisions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { decision: 'Use React + TypeScript', rationale: 'Aligns with existing tech stack' },
            { decision: 'RESTful API architecture', rationale: 'Standard, well-supported, scalable' },
            { decision: 'Living Design System', rationale: 'Consistent UI/UX across products' },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                padding: '16px',
                backgroundColor: '#f8f8f8',
                border: '1px solid #e3e4e5',
                borderRadius: '6px',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#2e2f32', marginBottom: '4px' }}>
                ✓ {item.decision}
              </div>
              <div style={{ fontSize: '13px', color: '#74767c' }}>
                Rationale: {item.rationale}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


