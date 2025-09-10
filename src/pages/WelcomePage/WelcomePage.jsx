// WelcomePage.jsx
import { useState, useRef, useEffect } from 'react';
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
import LoginPopup from '../../components/LoginPopup/LoginPopup'
import OfferPopup from '../../components/OfferPopup/OfferPopup'

function WelcomePage() {
    const [showRegisterPopup, setShowRegisterPopup] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showOfferPopup, setShowOfferPopup] = useState(false);

    const introductionRef = useRef(null);

    const scrollToIntroduction = () => {
        introductionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const isAnyPopupOpen = showRegisterPopup || showLoginPopup || showOfferPopup;
        const appContainer = document.querySelector('body > #root > div');

        if (appContainer) {
            appContainer.classList.toggle('no-scroll', isAnyPopupOpen);
        }

        return () => {
            if (appContainer) appContainer.classList.remove('no-scroll');
        };
    }, [showRegisterPopup, showLoginPopup, showOfferPopup]);

    return (
        <div className={styles.welcomePage}>
            {showOfferPopup && <OfferPopup onClose={() => setShowOfferPopup(false)} />}
            {showRegisterPopup && <RegisterPopup onClose={() => setShowRegisterPopup(false)} userType={"consument"}/>}
            {showLoginPopup && (
            <LoginPopup 
                onClose={() => setShowLoginPopup(false)} 
                onRegisterClick={() => {
                    setShowLoginPopup(false);
                    setShowRegisterPopup(true);
                }}
            />
            )}
            <Header 
                onRegisterClick={() => setShowRegisterPopup(true)} 
                onLoginClick={() => setShowLoginPopup(true)}
                onOfferClick={() => setShowOfferPopup(true)}
            />
            <About 
                onRegisterClick={() => setShowRegisterPopup(true)} 
                onMoreClick={scrollToIntroduction} 
            />
            <Banner />
            <div ref={introductionRef} className={styles.introductionWrapper}>
                <Introduction onRegisterClick={() => setShowRegisterPopup(true)} />
            </div>
            <Strip />
            <Offer 
                onOfferClick={() => setShowOfferPopup(true)}
            />
            <Footer />
            <Background />
        </div>
    )
}

export default WelcomePage;
