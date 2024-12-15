import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/Auth.tsx'
import { Toaster } from 'sonner'
import { FeedContextProvider } from './context/Feed.tsx'
import { ForumContextProvider } from './context/Forum.tsx'
import { AgoraContextProvider } from './context/Agora.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AgoraContextProvider>
        <AuthContextProvider>
          <FeedContextProvider>
            <ForumContextProvider>
              <Toaster richColors position='top-center' />
              <App />
            </ForumContextProvider>
          </FeedContextProvider>
        </AuthContextProvider>
      </AgoraContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
