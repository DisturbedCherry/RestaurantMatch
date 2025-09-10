import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import styles from './Header.module.css';
import Logo from '../../assets/restaurant_match_logo_white_noborder.svg';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);                  // Firebase logout
            localStorage.removeItem('token');     // usuń token
            navigate('/');                   // przekieruj na stronę logowania
        } catch (err) {
            console.error('Błąd podczas wylogowania:', err);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

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
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            Wyloguj
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
