import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/react'
import {dark} from '@clerk/themes'



const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if(!PUBLISHABLE_KEY){
    throw new Error('Missing publishable key')
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ClerkProvider appearance={{
        theme: dark,
        Variables:{
            colorPrimary: '#4f39f6',
            colorTextOnPrimaryBackground: '#ffffff'
        } 
    }}
    publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </BrowserRouter>
)