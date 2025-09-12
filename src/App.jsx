import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import WelcomePage from './pages/WelcomePage/WelcomePage.jsx'
import MainPage from './pages/MainPage/MainPage.jsx'
import AddRestaurantPage from "./pages/AddRestaurantPage/AddRestaurantPage.jsx";
import CheckoutSuccessPage from './pages/CheckoutSuccessPage/CheckoutSuccessPage.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy.jsx';
import Terms from './pages/Terms/Terms.jsx';
import RestaurantDashboard from './pages/RestaurantDashboard/RestaurantDashboard.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/Main" element={<MainPage />} />
          <Route path="/add-restaurant/:paymentType" element={<AddRestaurantPage />} />
          <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/dashboard" element={<RestaurantDashboard />} />
        </Routes>
        </ BrowserRouter>
    </>
  )
}

export default App