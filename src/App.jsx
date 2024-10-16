import './App.css'

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Landing from './pages/Landing'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />

      </Routes>
    </Router>
  )
}

export default App