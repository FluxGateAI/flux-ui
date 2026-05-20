import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import { SeoProvider, ThemeProvider, Toaster } from '@flux-ui/react'

import { router } from '@/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <HelmetProvider>
        <SeoProvider
          siteName="Ember"
          baseUrl="https://ember.example"
          defaultDescription="Turn rough notes into polished writing — executive summaries, FAQs, and one-pagers tailored to your audience."
          defaultImage="/logo.png"
        >
          <RouterProvider router={router} />
          <Toaster />
        </SeoProvider>
      </HelmetProvider>
    </ThemeProvider>
  </StrictMode>,
)
