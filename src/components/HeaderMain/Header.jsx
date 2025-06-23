import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import Logo from '../../assets/restaurant_match_logo_white_noborder.svg';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        // nasłuchuj kliknięcia w cały dokument
        document.addEventListener('mousedown', handleClickOutside);

        // wyczyść po unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.logoBox}>
                <div className={styles.logoWrapper}>
                    <img src={Logo} alt="Restaurant Match Logo" className={styles.image} />
                </div>
                <div className={styles.textWrapper}>
                    RestaurantMatch
                </div>
            </div>

            <div className={styles.userMenuWrapper} ref={menuRef}>
                <div
                    className={styles.userMenuTrigger}
                    onClick={toggleMenu}
                >
                    Witaj, Jakub ▼
                </div>
                {isMenuOpen && (
                    <div className={styles.userMenu}>
                        <a href="/account">Twoje Konto</a>
                        <a href="/my-restaurants">Twoje Restauracje</a>
                        <a href="/my-reservations">Twoje Rezerwacje</a>
                        <a href="/settings">Ustawienia</a>
                        <a href="/logout">Wyloguj</a>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
