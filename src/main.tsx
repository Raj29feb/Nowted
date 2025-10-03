import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import { PageProvider } from './provider.tsx';


const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PageProvider>
        <RouterProvider router={router} />
      </PageProvider>
    </QueryClientProvider>
  </StrictMode>,
)
