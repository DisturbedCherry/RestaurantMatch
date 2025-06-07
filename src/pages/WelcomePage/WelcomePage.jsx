// WelcomePage.jsx
import { useState } from 'react'; // ⬅️ Add this
import styles from './WelcomePage.module.css'
import Header from '../../components/Header/Header'
import About from '../../components/About/About'
import Banner from '../../components/Banner/Banner'
import Introduction from '../../components/Introduction/Introduction'
import Strip from '../../components/Strip/Strip'
import Offer from '../../components/Offer/Offer'
import Footer from '../../components/Footer/Footer'
import Background from '../../components/Background/Background'

import RegisterPopup from '../../components/RegisterPopup/RegisterPopup'

function WelcomePage() {
    const [showRegisterPopup, setShowRegisterPopup] = useState(false);

    return (
        <div className={styles.welcomePage}>
            {showRegisterPopup && <RegisterPopup onClose={() => setShowRegisterPopup(false)} />}
            <Header onRegisterClick={() => setShowRegisterPopup(true)} />
            <About />
            <Banner />
            <Introduction />
            <Strip />
            <Offer />
            <Footer />
            <Background />
        </div>
    )
}

export default WelcomePage;
