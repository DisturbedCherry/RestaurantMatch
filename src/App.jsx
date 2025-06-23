import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import WelcomePage from './pages/WelcomePage/WelcomePage.jsx'
import MainPage from './pages/MainPage/MainPage.jsx'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/Main" element={<MainPage />} />
        </Routes>
        </ BrowserRouter>
    </>
  )
}

export default App
