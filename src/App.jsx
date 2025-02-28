import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './routes/Home'
import ResumeEdit from './routes/ResumeEdit'
import TemplateSelection from './presentation/components/templateSelection/templateselection'
import CreatedResumes from './presentation/components/createdResumes'
import NotFound from './presentation/components/common/notFound'

export default function App() {
  
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/templates" element={<TemplateSelection />} />
        <Route path="/resume" element={<ResumeEdit />} />
        <Route path="/resumes" element={<CreatedResumes />} />
        {/* Add a catch-all route for 404 handling */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  )
}