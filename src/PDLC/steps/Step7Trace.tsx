import { usePDLC } from '../context/PDLCContext'

export default function Step7Trace() {
  const { pdlcData } = usePDLC()

  const mockAuditLog = [
    { action: 'Initiative Created', user: 'Sarah Johnson', timestamp: '2025-12-09 10:00', details: 'New PDLC initiative created' },
    { action: 'Problem Statements Added', user: 'Sarah Johnson', timestamp: '2025-12-09 10:15', details: '3 problem statements documented' },
    { action: 'Personas Defined', user: 'AI Assistant', timestamp: '2025-12-09 10:30', details: '4 user personas generated' },
    { action: 'Specification Generated', user: 'AI Assistant', timestamp: '2025-12-09 10:45', details: 'SpecKit-compatible specification created' },
    { action: 'UI Skeletons Created', user: 'MagicScreen', timestamp: '2025-12-09 11:00', details: 'Auto-generated 5 UI wireframes' },
    { action: 'Project Plan Created', user: 'AI Planner', timestamp: '2025-12-09 11:15', details: 'Task breakdown with dependencies' },
    { action: 'Code Generated', user: 'AIDLC', timestamp: '2025-12-09 11:30', details: '12 files generated' },
    { action: 'Tests Generated', user: 'AIDLC', timestamp: '2025-12-09 11:35', details: '57 tests with 87% coverage' },
    { action: 'Build Approved', user: 'Mike Chen', timestamp: '2025-12-09 11:50', details: 'Code review completed and approved' },
  ]

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
          Phase 7: Trace / Audit
        </h2>
        <p style={{ fontSize: '14px', color: '#74767c', margin: 0 }}>
          Every action is logged for full traceability from intent to deployment. 
          Complete audit trail ensures transparency and accountability.
        </p>
      </div>

      {/* Audit Log */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 16px 0' }}>
          Complete Audit Trail
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {mockAuditLog.map((log, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '16px',
                padding: '16px 0',
                borderBottom: index < mockAuditLog.length - 1 ? '1px solid #e3e4e5' : 'none',
              }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#0071dc',
                borderRadius: '50%',
                marginTop: '6px',
                flexShrink: 0,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#2e2f32' }}>
                    {log.action}
                  </span>
                  <span style={{ fontSize: '12px', color: '#74767c' }}>
                    {log.timestamp}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#74767c', margin: '0 0 4px 0' }}>
                  {log.details}
                </p>
                <span style={{ fontSize: '12px', color: '#0071dc' }}>
                  By: {log.user}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traceability Matrix */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 16px 0' }}>
          Traceability Matrix
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f8f8',
            border: '1px solid #e3e4e5',
            borderRadius: '6px',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0071dc', marginBottom: '8px' }}>
              5
            </div>
            <div style={{ fontSize: '14px', color: '#2e2f32' }}>
              Problem Statements
            </div>
            <div style={{ fontSize: '12px', color: '#74767c', marginTop: '4px' }}>
              → 12 Requirements
            </div>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#f8f8f8',
            border: '1px solid #e3e4e5',
            borderRadius: '6px',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0071dc', marginBottom: '8px' }}>
              12
            </div>
            <div style={{ fontSize: '14px', color: '#2e2f32' }}>
              Requirements
            </div>
            <div style={{ fontSize: '12px', color: '#74767c', marginTop: '4px' }}>
              → 25 Tasks
            </div>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#f8f8f8',
            border: '1px solid #e3e4e5',
            borderRadius: '6px',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0071dc', marginBottom: '8px' }}>
              25
            </div>
            <div style={{ fontSize: '14px', color: '#2e2f32' }}>
              Tasks
            </div>
            <div style={{ fontSize: '12px', color: '#74767c', marginTop: '4px' }}>
              → 12 Files Generated
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Timeline */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 16px 0' }}>
          Deployment Timeline
        </h3>
        
        <div style={{ position: 'relative', paddingLeft: '30px' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: '8px',
            top: '0',
            bottom: '0',
            width: '2px',
            backgroundColor: '#e3e4e5',
          }} />

          {[
            { stage: 'Development', date: '2025-12-09', status: 'Completed' },
            { stage: 'Testing', date: '2025-12-12', status: 'In Progress' },
            { stage: 'Staging', date: '2025-12-15', status: 'Pending' },
            { stage: 'Production', date: '2025-12-18', status: 'Pending' },
          ].map((item, index) => (
            <div key={index} style={{ marginBottom: '20px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '-26px',
                top: '4px',
                width: '12px',
                height: '12px',
                backgroundColor: item.status === 'Completed' ? '#6aab4f' : item.status === 'In Progress' ? '#0071dc' : '#e3e4e5',
                borderRadius: '50%',
                border: '2px solid #ffffff',
              }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#2e2f32', marginBottom: '4px' }}>
                {item.stage}
              </div>
              <div style={{ fontSize: '12px', color: '#74767c' }}>
                {item.date} - {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traceability Link */}
      {pdlcData.buildArtifacts.traceabilityLink && (
        <div style={{
          backgroundColor: '#e6f1fc',
          border: '1px solid #0071dc',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#004f9a', margin: '0 0 8px 0' }}>
            🔗 Traceability Link Generated
          </h4>
          <p style={{ fontSize: '14px', color: '#004f9a', margin: 0, fontFamily: 'monospace' }}>
            {pdlcData.buildArtifacts.traceabilityLink}
          </p>
        </div>
      )}
    </div>
  )
}


