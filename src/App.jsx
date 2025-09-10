import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import WelcomePage from './pages/WelcomePage/WelcomePage.jsx'
import MainPage from './pages/MainPage/MainPage.jsx'
import AddRestaurantPage from "./pages/AddRestaurantPage/AddRestaurantPage.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/Main" element={<MainPage />} />
          <Route path="/add-restaurant/:paymentType" element={<AddRestaurantPage />} />
          {/*<Route path="/ControlPanel" element={<AddRestaurantPage />} /> */}
        </Routes>
        </ BrowserRouter>
    </>
  )
}

export default App
