import { Routes, Route } from 'react-router-dom'
import Home from './routes/Home'
import ResumeEdit from './routes/ResumeEdit'
import TemplateSelection from './presentation/components/templateSelection/templateselection'
import CreatedResumes from './presentation/components/createdResumes'

export default function App() {
  
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/templates" element={<TemplateSelection />} />
        <Route path="/resume" element={<ResumeEdit />} />
        <Route path="/resumes" element={<CreatedResumes />} /> 
      </Routes>
    </div>
  )
}