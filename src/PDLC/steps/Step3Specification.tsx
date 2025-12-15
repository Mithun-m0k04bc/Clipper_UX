import { useState } from 'react'
import { usePDLC } from '../context/PDLCContext'

export default function Step3Specification() {
  const { pdlcData, updatePDLCData } = usePDLC()
  const [newRequirement, setNewRequirement] = useState('')
  const [requirementType, setRequirementType] = useState<'functional' | 'nonFunctional'>('functional')

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      const key = requirementType === 'functional' ? 'functionalRequirements' : 'nonFunctionalRequirements'
      updatePDLCData({
        specification: {
          ...pdlcData.specification,
          [key]: [...pdlcData.specification[key], newRequirement],
        },
      })
      setNewRequirement('')
    }
  }

  const handleGenerateSpec = () => {
    // Simulate AI generation
    alert('🤖 Generating machine-readable SpecKit-compatible specification...')
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
          Phase 3: Specification / Design (SDD)
        </h2>
        <p style={{ fontSize: '14px', color: '#74767c', margin: 0 }}>
          One-click generation of a machine-readable, SpecKit-compatible specification. 
          This serves as a contract between PM and Engineering for safe automation.
        </p>
      </div>

      {/* Specification Title */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', color: '#2e2f32', marginBottom: '8px' }}>
          Specification Title
        </label>
        <input
          type="text"
          value={pdlcData.specification.title}
          onChange={(e) => updatePDLCData({
            specification: { ...pdlcData.specification, title: e.target.value }
          })}
          placeholder="Enter specification title..."
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e3e4e5',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />
      </div>

      {/* Requirements */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 16px 0' }}>
          Requirements
        </h3>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <select
            value={requirementType}
            onChange={(e) => setRequirementType(e.target.value as 'functional' | 'nonFunctional')}
            style={{
              padding: '10px 12px',
              border: '1px solid #e3e4e5',
              borderRadius: '4px',
              fontSize: '14px',
              minWidth: '180px',
            }}
          >
            <option value="functional">Functional</option>
            <option value="nonFunctional">Non-Functional</option>
          </select>
          <input
            type="text"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
            placeholder="Enter requirement..."
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #e3e4e5',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
          <button
            onClick={handleAddRequirement}
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

        {/* Functional Requirements */}
        {pdlcData.specification.functionalRequirements.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#2e2f32', margin: '0 0 8px 0' }}>
              Functional Requirements
            </h4>
            {pdlcData.specification.functionalRequirements.map((req, index) => (
              <div key={index} style={{
                padding: '10px 12px',
                backgroundColor: '#f8f8f8',
                border: '1px solid #e3e4e5',
                borderRadius: '4px',
                fontSize: '14px',
                marginBottom: '8px',
              }}>
                {req}
              </div>
            ))}
          </div>
        )}

        {/* Non-Functional Requirements */}
        {pdlcData.specification.nonFunctionalRequirements.length > 0 && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#2e2f32', margin: '0 0 8px 0' }}>
              Non-Functional Requirements
            </h4>
            {pdlcData.specification.nonFunctionalRequirements.map((req, index) => (
              <div key={index} style={{
                padding: '10px 12px',
                backgroundColor: '#f8f8f8',
                border: '1px solid #e3e4e5',
                borderRadius: '4px',
                fontSize: '14px',
                marginBottom: '8px',
              }}>
                {req}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Specification Button */}
      <div style={{
        backgroundColor: '#e6f1fc',
        border: '1px solid #0071dc',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#004f9a', margin: '0 0 12px 0' }}>
          🤖 AI-Powered Specification Generation
        </h3>
        <p style={{ fontSize: '14px', color: '#004f9a', margin: '0 0 16px 0' }}>
          Generate a complete, machine-readable specification based on your inputs
        </p>
        <button
          onClick={handleGenerateSpec}
          style={{
            padding: '12px 32px',
            backgroundColor: '#0071dc',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Generate Specification
        </button>
      </div>

      {/* Dependencies */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 12px 0' }}>
          Dependencies
        </h3>
        <p style={{ fontSize: '14px', color: '#74767c', marginBottom: '16px' }}>
          AI-detected dependencies and prerequisites
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['API Gateway v2', 'Authentication Service', 'User Data Platform', 'Analytics Pipeline'].map(dep => (
            <span
              key={dep}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ffc83615',
                color: '#856404',
                borderRadius: '4px',
                fontSize: '13px',
              }}
            >
              {dep}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}


