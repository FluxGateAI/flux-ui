import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    HydrateFallback: () => null,
    children: [
      { index: true, lazy: () => import('@/pages/landing') },
      { path: 'approach', lazy: () => import('@/pages/approach') },
      { path: 'pricing', lazy: () => import('@/pages/pricing') },
      { path: 'try', lazy: () => import('@/pages/try-wizard') },
      { path: 'showcase', lazy: () => import('@/pages/showcase') },
    ],
  },
])
