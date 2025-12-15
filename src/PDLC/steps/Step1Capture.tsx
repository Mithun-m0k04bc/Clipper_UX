import { useState } from 'react'
import { usePDLC } from '../context/PDLCContext'

export default function Step1Capture() {
  const { pdlcData, updatePDLCData } = usePDLC()
  const [initiativeName, setInitiativeName] = useState(pdlcData.initiativeName || '')
  const [description, setDescription] = useState(pdlcData.initiativeDescription || '')
  const [newProblemStatement, setNewProblemStatement] = useState('')
  const [newJobToBeDone, setNewJobToBeDone] = useState('')

  const handleAddProblemStatement = () => {
    if (newProblemStatement.trim()) {
      updatePDLCData({
        problemStatements: [...pdlcData.problemStatements, newProblemStatement],
      })
      setNewProblemStatement('')
    }
  }

  const handleAddJobToBeDone = () => {
    if (newJobToBeDone.trim()) {
      updatePDLCData({
        jobsToBeDone: [...pdlcData.jobsToBeDone, newJobToBeDone],
      })
      setNewJobToBeDone('')
    }
  }

  const handleNameChange = (value: string) => {
    setInitiativeName(value)
    updatePDLCData({ initiativeName: value })
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    updatePDLCData({ initiativeDescription: value })
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
          Phase 1: Capture & Curate Signals (Wibey Workspace)
        </h2>
        <p style={{
          fontFamily: 'var(--ld-semantic-font-body-small-family, Bogle)',
          fontSize: 'var(--ld-semantic-font-body-small-size, 14px)',
          color: '#74767c',
          margin: 0,
        }}>
          Collect all pertinent inputs (PRDs, Jira, Slack, analytics, incidents) into a centralized workspace. 
          AI tools facilitate extraction and synthesis into structured insights.
        </p>
      </div>

      {/* Initiative Name */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <label style={{
          display: 'block',
          fontWeight: 700,
          fontSize: '14px',
          color: '#2e2f32',
          marginBottom: '8px',
        }}>
          Initiative Name *
        </label>
        <input
          type="text"
          value={initiativeName}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g., Customer Checkout Optimization"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e3e4e5',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'Bogle',
          }}
        />
      </div>

      {/* Initiative Description */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <label style={{
          display: 'block',
          fontWeight: 700,
          fontSize: '14px',
          color: '#2e2f32',
          marginBottom: '8px',
        }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Provide a brief description of this initiative..."
          rows={4}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e3e4e5',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'Bogle',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Signals Input Sources */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#2e2f32',
          margin: '0 0 12px 0',
        }}>
          Input Sources
        </h3>
        <p style={{ fontSize: '14px', color: '#74767c', marginBottom: '16px' }}>
          Attach relevant documents, links, and data sources (PRDs, Jira tickets, Slack threads, analytics, incidents)
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {['PRDs', 'Jira Tickets', 'Slack Threads', 'Analytics', 'Incidents', 'Other Inputs'].map(source => (
            <button
              key={source}
              style={{
                padding: '12px',
                border: '2px dashed #e3e4e5',
                borderRadius: '6px',
                backgroundColor: '#f8f8f8',
                fontSize: '14px',
                color: '#2e2f32',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0071dc'
                e.currentTarget.style.backgroundColor = '#e6f1fc'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e3e4e5'
                e.currentTarget.style.backgroundColor = '#f8f8f8'
              }}
            >
              + Add {source}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Statements */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#2e2f32',
          margin: '0 0 8px 0',
        }}>
          Problem Statements *
        </h3>
        <p style={{ fontSize: '14px', color: '#74767c', marginBottom: '16px' }}>
          AI-synthesized insights: What problems are we solving?
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="text"
            value={newProblemStatement}
            onChange={(e) => setNewProblemStatement(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddProblemStatement()}
            placeholder="Enter a problem statement..."
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #e3e4e5',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'Bogle',
            }}
          />
          <button
            onClick={handleAddProblemStatement}
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

        {pdlcData.problemStatements.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pdlcData.problemStatements.map((statement, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  backgroundColor: '#f8f8f8',
                  border: '1px solid #e3e4e5',
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: '#2e2f32',
                }}
              >
                {statement}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Jobs to Be Done */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#2e2f32',
          margin: '0 0 8px 0',
        }}>
          Jobs-to-be-Done
        </h3>
        <p style={{ fontSize: '14px', color: '#74767c', marginBottom: '16px' }}>
          What tasks or outcomes do users want to accomplish?
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="text"
            value={newJobToBeDone}
            onChange={(e) => setNewJobToBeDone(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddJobToBeDone()}
            placeholder="Enter a job-to-be-done..."
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #e3e4e5',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'Bogle',
            }}
          />
          <button
            onClick={handleAddJobToBeDone}
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

        {pdlcData.jobsToBeDone.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pdlcData.jobsToBeDone.map((job, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  backgroundColor: '#f8f8f8',
                  border: '1px solid #e3e4e5',
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: '#2e2f32',
                }}
              >
                {job}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Assistant Panel */}
      <div style={{
        backgroundColor: '#e6f1fc',
        border: '1px solid #0071dc',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#0071dc',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v6c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5z" stroke="white" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="11" r="3" fill="white"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#004f9a', margin: '0 0 8px 0' }}>
              🤖 Wibey AI Assistant
            </h4>
            <p style={{ fontSize: '14px', color: '#004f9a', margin: '0 0 12px 0' }}>
              I've analyzed your inputs and identified 3 key themes, 5 dependencies, and 2 potential gaps. 
              Would you like me to help extract structured insights?
            </p>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#0071dc',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
            }}>
              Generate Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


