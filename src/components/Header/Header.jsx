import styles from './Header.module.css'
import Logo from '../../assets/restaurant_match_logo_white_noborder.svg'
import Button from '../Button/Button';

// Header.jsx
function Header({ onRegisterClick, onLoginClick, onOfferClick}) {
    return(
        <header className={styles.header}>
            <div className={styles.logoBox}>
                <div className={styles.logoWrapper}>
                    <img src={Logo} alt="Restaurant Match Logo" className={styles.image}/>
                </div>
                <div className={styles.textWrapper}>
                    RestaurantMatch
                </div>
            </div>
            <div className={styles.buttonsWrapper}>
                <div className={styles.promoteButton}>
                    <Button 
                        backgroundColor='#1E1825' 
                        color='#F5F5FF' 
                        borderColor='#8E5AFF' 
                        text='Rozpromuj restaurację' 
                        onClick={onOfferClick}
                    />
                </div>
                <div className={styles.loginButton}>
                    <Button 
                        backgroundColor='#1E1825' 
                        color='#F5F5FF' 
                        borderColor='#F5F5FF' 
                        text='Zaloguj się'
                        onClick={onLoginClick} // ✅ ADD THIS
                    />
                </div>
                <div className={styles.registerButton}>
                    <Button 
                        backgroundColor='#F5F5FF' 
                        color='#1E1825'  
                        text='Zarejestruj się'
                        onClick={onRegisterClick}
                    />
                </div>
            </div>
        </header>
    )
}


export default Header;
