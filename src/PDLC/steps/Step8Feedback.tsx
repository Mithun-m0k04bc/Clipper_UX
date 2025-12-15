import { useState } from 'react'
import { usePDLC } from '../context/PDLCContext'

export default function Step8Feedback() {
  const { pdlcData, updatePDLCData } = usePDLC()
  const [newFeedback, setNewFeedback] = useState('')
  const [feedbackType, setFeedbackType] = useState<'errors' | 'usage' | 'userFeedback' | 'improvements'>('userFeedback')

  const handleAddFeedback = () => {
    if (newFeedback.trim()) {
      updatePDLCData({
        feedback: {
          ...pdlcData.feedback,
          [feedbackType]: [...pdlcData.feedback[feedbackType], newFeedback],
        },
      })
      setNewFeedback('')
    }
  }

  const mockMetrics = {
    errors: { count: 3, trend: -40 },
    usage: { dau: '2.4K', mau: '8.1K', growth: '+15%' },
    satisfaction: { score: 4.6, responses: 124 },
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
          Phase 8: Learn / Feedback
        </h2>
        <p style={{ fontSize: '14px', color: '#74767c', margin: 0 }}>
          Operational data (errors, usage, feedback) feeds back into Wibey, starting the next cycle of improvement. 
          Continuous learning enables iterative enhancement.
        </p>
      </div>

      {/* Metrics Dashboard */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e3e4e5',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <div style={{ fontSize: '12px', color: '#74767c', marginBottom: '8px' }}>Error Rate</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#2e2f32', marginBottom: '8px' }}>
            {mockMetrics.errors.count}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#6aab4f', fontSize: '14px', fontWeight: 700 }}>
              ↓ {Math.abs(mockMetrics.errors.trend)}%
            </span>
            <span style={{ fontSize: '12px', color: '#74767c' }}>vs last week</span>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e3e4e5',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <div style={{ fontSize: '12px', color: '#74767c', marginBottom: '8px' }}>Usage</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#2e2f32', marginBottom: '8px' }}>
            {mockMetrics.usage.dau}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#6aab4f', fontSize: '14px', fontWeight: 700 }}>
              {mockMetrics.usage.growth}
            </span>
            <span style={{ fontSize: '12px', color: '#74767c' }}>DAU growth</span>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e3e4e5',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <div style={{ fontSize: '12px', color: '#74767c', marginBottom: '8px' }}>Satisfaction</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#2e2f32', marginBottom: '8px' }}>
            {mockMetrics.satisfaction.score}/5
          </div>
          <div style={{ fontSize: '12px', color: '#74767c' }}>
            {mockMetrics.satisfaction.responses} responses
          </div>
        </div>
      </div>

      {/* Feedback Collection */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 16px 0' }}>
          Collect Feedback
        </h3>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <select
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value as any)}
            style={{
              padding: '10px 12px',
              border: '1px solid #e3e4e5',
              borderRadius: '4px',
              fontSize: '14px',
              minWidth: '180px',
            }}
          >
            <option value="errors">Errors</option>
            <option value="usage">Usage Data</option>
            <option value="userFeedback">User Feedback</option>
            <option value="improvements">Improvement Ideas</option>
          </select>
          <input
            type="text"
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddFeedback()}
            placeholder="Enter feedback or observation..."
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #e3e4e5',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
          <button
            onClick={handleAddFeedback}
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

        {/* Display Collected Feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {pdlcData.feedback.userFeedback.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '12px 16px',
                backgroundColor: '#f8f8f8',
                border: '1px solid #e3e4e5',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#2e2f32',
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* AI Analysis */}
      <div style={{
        backgroundColor: '#e6f1fc',
        border: '1px solid #0071dc',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#0071dc',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L2 8v8c0 6.6 4.6 12.8 12 14 7.4-1.2 12-7.4 12-14V8l-12-6z" stroke="white" strokeWidth="2.5" fill="none"/>
              <circle cx="14" cy="13" r="4" fill="white"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#004f9a', margin: '0 0 12px 0' }}>
              🤖 Wibey AI Analysis
            </h4>
            <p style={{ fontSize: '14px', color: '#004f9a', margin: '0 0 16px 0' }}>
              I've analyzed the feedback and operational data. Here are the key insights:
            </p>
            <ul style={{ fontSize: '14px', color: '#004f9a', margin: 0, paddingLeft: '20px' }}>
              <li>3 common user pain points identified</li>
              <li>2 high-impact improvement opportunities</li>
              <li>Error rate decreased by 40% - good progress!</li>
              <li>Suggested 5 new features for next iteration</li>
            </ul>
            <button
              style={{
                marginTop: '16px',
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
              Start New PDLC Cycle
            </button>
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e4e5',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2e2f32', margin: '0 0 16px 0' }}>
          AI-Generated Improvement Suggestions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { title: 'Optimize checkout flow', impact: 'High', effort: 'Medium' },
            { title: 'Add mobile app support', impact: 'High', effort: 'High' },
            { title: 'Improve error messages', impact: 'Medium', effort: 'Low' },
            { title: 'Enhanced analytics dashboard', impact: 'Medium', effort: 'Medium' },
          ].map((suggestion, index) => (
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
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#2e2f32' }}>
                  {suggestion.title}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: suggestion.impact === 'High' ? '#e6f4ea' : '#fff3cd',
                  color: suggestion.impact === 'High' ? '#137333' : '#856404',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}>
                  Impact: {suggestion.impact}
                </span>
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: suggestion.effort === 'Low' ? '#e6f4ea' : suggestion.effort === 'Medium' ? '#fff3cd' : '#ffe6e6',
                  color: suggestion.effort === 'Low' ? '#137333' : suggestion.effort === 'Medium' ? '#856404' : '#c41e3a',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}>
                  Effort: {suggestion.effort}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continuous Improvement */}
      <div style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc836',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
      }}>
        <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#856404', margin: '0 0 8px 0' }}>
          🔄 Continuous Improvement Cycle
        </h4>
        <p style={{ fontSize: '14px', color: '#856404', margin: 0 }}>
          Feedback collected will automatically feed into Wibey for the next PDLC iteration. 
          The cycle of learning and improvement continues!
        </p>
      </div>
    </div>
  )
}


