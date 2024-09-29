import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/Auth.tsx'
import { Toaster } from 'sonner'
import { FeedContextProvider } from './context/Feed.tsx'
import { ForumContextProvider } from './context/Forum.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <FeedContextProvider>
          <ForumContextProvider>
            <Toaster richColors position='top-center' />
            <App />
          </ForumContextProvider>
        </FeedContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
