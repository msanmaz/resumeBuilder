import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import App from './App.jsx'
import { ResumeProvider } from './presentation/context/resumeContext/resumeContext.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <ResumeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ResumeProvider>
    </Provider>
  </StrictMode>,
)
