import { useNavigate } from 'react-router-dom'
import { usePDLC } from './context/PDLCContext'
import Step1Capture from './steps/Step1Capture'
import Step2Discovery from './steps/Step2Discovery'
import Step3Specification from './steps/Step3Specification'
import Step4Design from './steps/Step4Design'
import Step5Plan from './steps/Step5Plan'
import Step6Build from './steps/Step6Build'
import Step7Trace from './steps/Step7Trace'
import Step8Feedback from './steps/Step8Feedback'

const CheckIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8L7 11L12 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function NewPDLCInitiativePage() {
  const navigate = useNavigate()
  const { currentStep, setCurrentStep, pdlcData } = usePDLC()

  const steps = [
    { number: 1, label: 'Capture Signals', shortLabel: 'Capture' },
    { number: 2, label: 'Discovery', shortLabel: 'Discovery' },
    { number: 3, label: 'Specification', shortLabel: 'Spec' },
    { number: 4, label: 'Design', shortLabel: 'Design' },
    { number: 5, label: 'Plan', shortLabel: 'Plan' },
    { number: 6, label: 'Build', shortLabel: 'Build' },
    { number: 7, label: 'Trace/Audit', shortLabel: 'Trace' },
    { number: 8, label: 'Feedback', shortLabel: 'Feedback' },
  ]

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate('/pdlc')
    }
  }

  const handleProceed = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission
      alert('Initiative submitted successfully!')
      navigate('/pdlc')
    }
  }

  const isProceedDisabled = () => {
    // Add validation logic based on current step
    if (currentStep === 1) {
      return !pdlcData.initiativeName || pdlcData.problemStatements.length === 0
    }
    return false
  }

  const getProceedButtonText = () => {
    if (currentStep === 8) {
      return 'Submit Initiative'
    }
    return 'Proceed to Next Phase'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--ld-semantic-color-background-gray, #f8f8f8)' }}>
      {/* Header */}
      <header style={{
        height: '60px',
        backgroundColor: 'var(--ld-semantic-color-background, #ffffff)',
        borderBottom: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        <h1 style={{
          fontFamily: 'var(--ld-semantic-font-heading-medium-family, Bogle)',
          fontWeight: 'var(--ld-semantic-font-heading-medium-weight-default, 700)',
          fontSize: 'var(--ld-semantic-font-heading-medium-size, 20px)',
          lineHeight: 'var(--ld-semantic-font-heading-medium-lineheight, 28px)',
          color: 'var(--ld-semantic-color-text-maxcontrast, #000000)',
        }}>
          New PDLC Initiative
        </h1>
        <button
          onClick={() => navigate('/pdlc')}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--ld-semantic-color-background, #ffffff)',
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            borderRadius: 'var(--ld-primitive-scale-borderradius-50, 4px)',
            fontFamily: 'var(--ld-semantic-font-body-small-family, Bogle)',
            fontSize: 'var(--ld-semantic-font-body-small-size, 14px)',
            color: 'var(--ld-semantic-color-text, #2e2f32)',
            cursor: 'pointer',
          }}
        >
          Save as Draft
        </button>
      </header>

      {/* Progress Tracker */}
      <div style={{
        backgroundColor: 'var(--ld-semantic-color-background, #ffffff)',
        borderBottom: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
        padding: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          {/* Progress Line */}
          <div style={{
            position: 'absolute',
            left: '0',
            right: '0',
            top: '16px',
            height: '2px',
            backgroundColor: 'var(--ld-semantic-color-separator, #e3e4e5)',
            zIndex: 0,
          }} />
          <div
            style={{
              position: 'absolute',
              left: '0',
              top: '16px',
              height: '2px',
              backgroundColor: 'var(--ld-semantic-color-action-fill-primary, #0071dc)',
              zIndex: 1,
              transition: 'width 0.3s ease-in-out',
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.number
            const isActive = currentStep === step.number

            return (
              <div key={step.number} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2, flex: 1 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted || isActive ? 'var(--ld-semantic-color-action-fill-primary, #0071dc)' : 'var(--ld-semantic-color-background, #ffffff)',
                  color: isCompleted || isActive ? 'var(--ld-semantic-color-text-onprimary, #ffffff)' : 'var(--ld-semantic-color-text-subtle, #74767c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--ld-semantic-font-caption-family, Bogle)',
                  fontWeight: 'var(--ld-semantic-font-caption-weight-alt, 700)',
                  fontSize: 'var(--ld-semantic-font-caption-size, 12px)',
                  border: isCompleted || isActive ? '2px solid var(--ld-semantic-color-action-fill-primary, #0071dc)' : '2px solid var(--ld-semantic-color-separator, #e3e4e5)',
                }}>
                  {isCompleted ? <CheckIcon color="white" size={16} /> : step.number}
                </div>
                <span style={{
                  fontFamily: 'var(--ld-semantic-font-caption-family, Bogle)',
                  fontWeight: isActive ? 'var(--ld-semantic-font-caption-weight-alt, 700)' : 'var(--ld-semantic-font-caption-weight-default, 400)',
                  fontSize: '11px',
                  lineHeight: 'var(--ld-semantic-font-caption-lineheight, 16px)',
                  color: isActive ? 'var(--ld-semantic-color-text-maxcontrast, #000000)' : 'var(--ld-semantic-color-text-subtle, #74767c)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}>
                  {step.shortLabel}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {currentStep === 1 && <Step1Capture />}
          {currentStep === 2 && <Step2Discovery />}
          {currentStep === 3 && <Step3Specification />}
          {currentStep === 4 && <Step4Design />}
          {currentStep === 5 && <Step5Plan />}
          {currentStep === 6 && <Step6Build />}
          {currentStep === 7 && <Step7Trace />}
          {currentStep === 8 && <Step8Feedback />}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        backgroundColor: 'var(--ld-semantic-color-background, #ffffff)',
        borderTop: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={handleGoBack}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--ld-semantic-color-background, #ffffff)',
            border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            borderRadius: 'var(--ld-primitive-scale-borderradius-50, 4px)',
            fontFamily: 'var(--ld-semantic-font-body-small-family, Bogle)',
            fontSize: 'var(--ld-semantic-font-body-small-size, 14px)',
            color: 'var(--ld-semantic-color-text, #2e2f32)',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/pdlc')}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--ld-semantic-color-background, #ffffff)',
              border: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
              borderRadius: 'var(--ld-primitive-scale-borderradius-50, 4px)',
              fontFamily: 'var(--ld-semantic-font-body-small-family, Bogle)',
              fontSize: 'var(--ld-semantic-font-body-small-size, 14px)',
              color: 'var(--ld-semantic-color-text, #2e2f32)',
              cursor: 'pointer',
            }}
          >
            Save as Draft
          </button>
          <button
            onClick={handleProceed}
            disabled={isProceedDisabled()}
            style={{
              padding: '10px 24px',
              backgroundColor: isProceedDisabled() ? 'var(--ld-semantic-color-action-fill-disabled, #babbbe)' : 'var(--ld-semantic-color-action-fill-primary, #0071dc)',
              color: 'var(--ld-semantic-color-text-onprimary, #ffffff)',
              border: 'none',
              borderRadius: 'var(--ld-primitive-scale-borderradius-50, 4px)',
              fontFamily: 'var(--ld-semantic-font-body-small-family, Bogle)',
              fontWeight: 'var(--ld-semantic-font-body-small-weight-alt, 700)',
              fontSize: 'var(--ld-semantic-font-body-small-size, 14px)',
              cursor: isProceedDisabled() ? 'not-allowed' : 'pointer',
            }}
          >
            {getProceedButtonText()} →
          </button>
        </div>
      </div>
    </div>
  )
}

