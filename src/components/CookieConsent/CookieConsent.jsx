// src/components/CookieConsent/CookieConsent.jsx
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import styles from './CookieConsent.module.css';

function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const accepted = Cookies.get('cookiesAccepted');
        if (!accepted) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        Cookies.set('cookiesAccepted', 'true', { expires: 365 });
        setIsVisible(false);
    };

    const handleRefuse = () => {
        Cookies.set('cookiesAccepted', 'false', { expires: 365 });
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.cookiePopup}>
                <p>🍪 This website uses cookies to improve your experience. You can accept or refuse cookies.</p>
                <div className={styles.buttons}>
                    <button className={styles.accept} onClick={handleAccept}>Accept</button>
                    <button className={styles.refuse} onClick={handleRefuse}>Refuse</button>
                </div>
            </div>
        </div>
    );
}

export default CookieConsent;
