import { usePDLC } from '../context/PDLCContext'

export default function Step6Build() {
  const { pdlcData, updatePDLCData } = usePDLC()

  const handleGenerateCode = () => {
    updatePDLCData({
      buildArtifacts: {
        ...pdlcData.buildArtifacts,
        codeGenerated: true,
      },
    })
    alert('🤖 Code generated successfully based on specification!')
  }

  const handleGenerateTests = () => {
    updatePDLCData({
      buildArtifacts: {
        ...pdlcData.buildArtifacts,
        testsGenerated: true,
      },
    })
    alert('🤖 Test suite generated successfully!')
  }

  const handleApprove = () => {
    updatePDLCData({
      buildArtifacts: {
        ...pdlcData.buildArtifacts,
        approved: true,
        traceabilityLink: `TRACE-${Date.now()}`,
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
          Phase 6: Build / Execute (AIDLC Automation)
        </h2>
        <p style={{ fontSize: '14px', color: '#74767c', margin: 0 }}>
          Automated code and test generation based on the specification. 
          Developers can modify, approve, and maintain traceability to the original spec.
        </p>
      </div>

      {/* Code Generation */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: 0 }}>
            Automated Code Generation
          </h3>
          {!pdlcData.buildArtifacts.codeGenerated && (
            <button
              onClick={handleGenerateCode}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6aab4f',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Generate Code
            </button>
          )}
        </div>

        {pdlcData.buildArtifacts.codeGenerated ? (
          <div style={{
            padding: '20px',
            backgroundColor: '#e6f4ea',
            border: '1px solid #6aab4f',
            borderRadius: '6px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#6aab4f" strokeWidth="2"/>
              </svg>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#137333' }}>
                Code Generated Successfully
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#137333', marginBottom: '12px' }}>
              Generated files:
            </p>
            <ul style={{ fontSize: '13px', color: '#137333', margin: 0 }}>
              <li>components/UserDashboard.tsx</li>
              <li>services/AuthenticationService.ts</li>
              <li>utils/validators.ts</li>
              <li>api/endpoints.ts</li>
            </ul>
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
            Click "Generate Code" to auto-generate implementation based on your specification
          </div>
        )}
      </div>

      {/* Test Generation */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: 0 }}>
            Automated Test Suite
          </h3>
          {!pdlcData.buildArtifacts.testsGenerated && (
            <button
              onClick={handleGenerateTests}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6aab4f',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Generate Tests
            </button>
          )}
        </div>

        {pdlcData.buildArtifacts.testsGenerated ? (
          <div style={{
            padding: '20px',
            backgroundColor: '#e6f4ea',
            border: '1px solid #6aab4f',
            borderRadius: '6px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#6aab4f" strokeWidth="2"/>
              </svg>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#137333' }}>
                Test Suite Generated
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#137333' }}>
              Coverage: 87% | Unit Tests: 45 | Integration Tests: 12
            </p>
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
            Click "Generate Tests" to auto-generate comprehensive test coverage
          </div>
        )}
      </div>

      {/* Developer Review & Approval */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 16px 0' }}>
          Developer Review & Approval
        </h3>
        <p style={{ fontSize: '14px', color: '#74767c', marginBottom: '16px' }}>
          Developers can modify, review, and approve the generated code while maintaining traceability.
        </p>
        
        {!pdlcData.buildArtifacts.approved ? (
          <button
            onClick={handleApprove}
            disabled={!pdlcData.buildArtifacts.codeGenerated || !pdlcData.buildArtifacts.testsGenerated}
            style={{
              padding: '12px 24px',
              backgroundColor: (!pdlcData.buildArtifacts.codeGenerated || !pdlcData.buildArtifacts.testsGenerated) ? '#babbbe' : '#6aab4f',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: (!pdlcData.buildArtifacts.codeGenerated || !pdlcData.buildArtifacts.testsGenerated) ? 'not-allowed' : 'pointer',
            }}
          >
            Approve Build Artifacts
          </button>
        ) : (
          <div style={{
            padding: '16px',
            backgroundColor: '#e6f4ea',
            border: '1px solid #6aab4f',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#6aab4f" strokeWidth="2"/>
            </svg>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#137333' }}>
                Build Approved
              </div>
              <div style={{ fontSize: '13px', color: '#137333' }}>
                Traceability Link: {pdlcData.buildArtifacts.traceabilityLink}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


