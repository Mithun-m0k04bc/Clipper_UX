import { Routes, Route, Navigate } from 'react-router-dom'
import UnifiedWorkspace from './UnifiedWorkspace'
import { PDLCProvider } from './context/PDLCContext'

export default function PDLCPage() {
  return (
    <PDLCProvider>
      <Routes>
        <Route index element={<UnifiedWorkspace />} />
        <Route path="*" element={<Navigate to="/pdlc" replace />} />
      </Routes>
    </PDLCProvider>
  )
}

