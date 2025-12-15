import React from 'react'
import { usePDLC } from '../context/PDLCContext'

export default function Step5Plan() {
  const { pdlcData, updatePDLCData } = usePDLC()

  const handleAutoPlanning = () => {
    // Simulate AI planning
    updatePDLCData({
      planning: {
        tasks: [
          { name: 'Setup project infrastructure', dependencies: [], estimate: '3 days' },
          { name: 'Implement authentication', dependencies: ['Setup project infrastructure'], estimate: '5 days' },
          { name: 'Build core features', dependencies: ['Implement authentication'], estimate: '10 days' },
          { name: 'Testing & QA', dependencies: ['Build core features'], estimate: '5 days' },
          { name: 'Deployment', dependencies: ['Testing & QA'], estimate: '2 days' },
        ],
        sequencing: ['Phase 1: Infrastructure', 'Phase 2: Core Development', 'Phase 3: Testing', 'Phase 4: Launch'],
        riskEvaluation: ['Low technical risk', 'Medium timeline risk', 'Low resource risk'],
        readinessStatus: 'Ready',
      },
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
          Phase 5: Plan
        </h2>
        <p style={{ fontSize: '14px', color: '#74767c', margin: 0 }}>
          Automated planning including dependency resolution, sequencing, risk evaluation, and readiness assessment. 
          Ensures all necessary inputs are available for the build phase.
        </p>
      </div>

      {/* Auto Planning */}
      <div style={{
        backgroundColor: '#e6f1fc',
        border: '1px solid #0071dc',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#004f9a', margin: '0 0 12px 0' }}>
          🤖 AI-Powered Automated Planning
        </h3>
        <p style={{ fontSize: '14px', color: '#004f9a', margin: '0 0 16px 0' }}>
          AI will analyze your specification and generate a comprehensive project plan with:
        </p>
        <ul style={{ textAlign: 'left', color: '#004f9a', fontSize: '14px', maxWidth: '500px', margin: '0 auto 20px' }}>
          <li>Task breakdown with dependencies</li>
          <li>Optimal sequencing</li>
          <li>Risk evaluation</li>
          <li>Resource readiness assessment</li>
        </ul>
        <button
          onClick={handleAutoPlanning}
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
          Generate Project Plan
        </button>
      </div>

      {/* Tasks */}
      {pdlcData.planning.tasks.length > 0 && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e3e4e5',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 16px 0' }}>
            Task Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pdlcData.planning.tasks.map((task, index) => (
              <div
                key={index}
                style={{
                  padding: '16px',
                  backgroundColor: '#f8f8f8',
                  border: '1px solid #e3e4e5',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#2e2f32', marginBottom: '4px' }}>
                    {index + 1}. {task.name}
                  </div>
                  {task.dependencies.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#74767c' }}>
                      Dependencies: {task.dependencies.join(', ')}
                    </div>
                  )}
                </div>
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: '#0071dc',
                  color: '#ffffff',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}>
                  {task.estimate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sequencing */}
      {pdlcData.planning.sequencing.length > 0 && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e3e4e5',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 16px 0' }}>
            Project Sequencing
          </h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {pdlcData.planning.sequencing.map((phase, index) => (
              <React.Fragment key={index}>
                <div style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#f8f8f8',
                  border: '2px solid #0071dc',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#2e2f32',
                }}>
                  {phase}
                </div>
                {index < pdlcData.planning.sequencing.length - 1 && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7 4l6 6-6 6" stroke="#0071dc" strokeWidth="2"/>
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Risk Evaluation */}
      {pdlcData.planning.riskEvaluation.length > 0 && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e3e4e5',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 16px 0' }}>
            Risk Evaluation
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pdlcData.planning.riskEvaluation.map((risk, index) => {
              const riskLevel = risk.includes('Low') ? 'low' : risk.includes('Medium') ? 'medium' : 'high'
              const colors = {
                low: { bg: '#e6f4ea', text: '#137333' },
                medium: { bg: '#fff3cd', text: '#856404' },
                high: { bg: '#ffe6e6', text: '#c41e3a' },
              }
              return (
                <div
                  key={index}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: colors[riskLevel].bg,
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: colors[riskLevel].text,
                  }}
                >
                  {risk}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Readiness Status */}
      {pdlcData.planning.readinessStatus && (
        <div style={{
          backgroundColor: pdlcData.planning.readinessStatus === 'Ready' ? '#e6f4ea' : '#fff3cd',
          border: `1px solid ${pdlcData.planning.readinessStatus === 'Ready' ? '#6aab4f' : '#ffc836'}`,
          borderRadius: '8px',
          padding: '20px',
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: pdlcData.planning.readinessStatus === 'Ready' ? '#137333' : '#856404',
            margin: '0 0 8px 0',
          }}>
            ✓ Readiness Assessment: {pdlcData.planning.readinessStatus}
          </h4>
          <p style={{
            fontSize: '14px',
            color: pdlcData.planning.readinessStatus === 'Ready' ? '#137333' : '#856404',
            margin: 0,
          }}>
            {pdlcData.planning.readinessStatus === 'Ready' 
              ? 'All necessary inputs are available. Ready to proceed to Build phase.'
              : 'Some inputs are missing or incomplete. Review before proceeding.'
            }
          </p>
        </div>
      )}
    </div>
  )
}

