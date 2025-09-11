import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import styles from './Header.module.css';
import Logo from '../../assets/restaurant_match_logo_white_noborder.svg';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
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

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    if (data.name) {
                        // take only first word before space
                        setUserName(data.name.split(' ')[0]);
                    } else if (data.email) {
                        setUserName(data.email.split('@')[0]);
                    }
                }
            } else {
                setUserName('');
            }
        });

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            unsubscribe();
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
                    Witaj{userName ? `, ${userName}` : ''} ▼
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
