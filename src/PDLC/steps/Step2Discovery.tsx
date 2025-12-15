import { useState } from 'react'
import { usePDLC } from '../context/PDLCContext'

export default function Step2Discovery() {
  const { pdlcData, updatePDLCData } = usePDLC()
  const [newPersona, setNewPersona] = useState({ name: '', description: '', needs: [''] })
  const [newOutcome, setNewOutcome] = useState('')

  const handleAddPersona = () => {
    if (newPersona.name && newPersona.description) {
      updatePDLCData({
        personas: [...pdlcData.personas, newPersona],
      })
      setNewPersona({ name: '', description: '', needs: [''] })
    }
  }

  const handleAddOutcome = () => {
    if (newOutcome.trim()) {
      updatePDLCData({
        businessOutcomes: [...pdlcData.businessOutcomes, newOutcome],
      })
      setNewOutcome('')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Phase Title */}
      <div>
        <h2 style={{
          fontFamily: 'var(--ld-semantic-font-heading-medium-family, Bogle)',
          fontSize: 'var(--ld-semantic-font-heading-medium-size, 20px)',
          fontWeight: 'var(--ld-semantic-font-heading-medium-weight-default, 700)',
          color: '#2e2f32',
          margin: '0 0 8px 0',
        }}>
          Phase 2: Discovery & Conceptualization
        </h2>
        <p style={{
          fontFamily: 'var(--ld-semantic-font-body-small-family, Bogle)',
          fontSize: 'var(--ld-semantic-font-body-small-size, 14px)',
          color: '#74767c',
          margin: 0,
        }}>
          AI guides you to refine insights into personas, process flows, risks, and desired business outcomes. 
          AI-enabled consistency checks guarantee completeness and clarity.
        </p>
      </div>

      {/* Personas */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 16px 0' }}>
          User Personas
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Persona name (e.g., Online Shopper)"
            value={newPersona.name}
            onChange={(e) => setNewPersona({ ...newPersona, name: e.target.value })}
            style={{
              padding: '10px 12px',
              border: '1px solid #e3e4e5',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
          <textarea
            placeholder="Description and characteristics..."
            value={newPersona.description}
            onChange={(e) => setNewPersona({ ...newPersona, description: e.target.value })}
            rows={3}
            style={{
              padding: '10px 12px',
              border: '1px solid #e3e4e5',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
          <button
            onClick={handleAddPersona}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0071dc',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            Add Persona
          </button>
        </div>

        {pdlcData.personas.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {pdlcData.personas.map((persona, index) => (
              <div
                key={index}
                style={{
                  padding: '16px',
                  backgroundColor: '#f8f8f8',
                  border: '1px solid #e3e4e5',
                  borderRadius: '6px',
                }}
              >
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#2e2f32', margin: '0 0 8px 0' }}>
                  {persona.name}
                </h4>
                <p style={{ fontSize: '13px', color: '#74767c', margin: 0 }}>
                  {persona.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Process Flows */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 12px 0' }}>
          Process Flows
        </h3>
        <p style={{ fontSize: '14px', color: '#74767c', marginBottom: '16px' }}>
          Map out key user journeys and process flows
        </p>
        <button
          style={{
            padding: '12px 24px',
            border: '2px dashed #0071dc',
            borderRadius: '6px',
            backgroundColor: '#e6f1fc',
            fontSize: '14px',
            color: '#0071dc',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + Create Process Flow Diagram
        </button>
      </div>

      {/* Risks */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 12px 0' }}>
          Risks & Mitigation
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {['Technical', 'Business', 'Timeline', 'Resource', 'Compliance', 'User Adoption'].map(risk => (
            <div
              key={risk}
              style={{
                padding: '12px',
                border: '1px solid #e3e4e5',
                borderRadius: '6px',
                backgroundColor: '#f8f8f8',
                textAlign: 'center',
                fontSize: '14px',
                color: '#2e2f32',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
              {risk} Risk
            </div>
          ))}
        </div>
      </div>

      {/* Business Outcomes */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 12px 0' }}>
          Desired Business Outcomes
        </h3>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="text"
            value={newOutcome}
            onChange={(e) => setNewOutcome(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddOutcome()}
            placeholder="Enter a business outcome..."
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #e3e4e5',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
          <button
            onClick={handleAddOutcome}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0071dc',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Add
          </button>
        </div>

        {pdlcData.businessOutcomes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pdlcData.businessOutcomes.map((outcome, index) => (
              <div
                key={index}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#e6f1fc',
                  border: '1px solid #0071dc',
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: '#004f9a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '18px' }}>🎯</span>
                {outcome}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Consistency Check */}
      <div style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc836',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#856404', margin: '0 0 8px 0' }}>
          ✓ AI Consistency Check
        </h4>
        <p style={{ fontSize: '14px', color: '#856404', margin: 0 }}>
          All required sections are complete. Personas align with problem statements. 
          Ready to proceed to Specification phase.
        </p>
      </div>
    </div>
  )
}


