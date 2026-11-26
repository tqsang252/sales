import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { SalesFeedPage } from './pages/SalesFeedPage'
import { SlickdealsPage } from './pages/SlickdealsPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Default landing page is Sales Feed */}
          <Route path="/" element={<SalesFeedPage />} />
          <Route path="/feed" element={<SalesFeedPage />} />
          <Route path="/slickdeals" element={<SlickdealsPage />} />
          {/* Dashboard route kept for future activation */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
