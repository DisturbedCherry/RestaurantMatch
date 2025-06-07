// LoginPopup.jsx
import styles from './LoginPopup.module.css'
import Button from '../Button/Button'

function LoginPopup({ onClose, onRegisterClick }) {
    return (
        <div 
            className={styles.registerBackground}
            onClick={onClose}
        >
            <div 
                className={styles.registerBox}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.content}>
                    <div className={styles.titleWrapper}>
                        Zaloguj się
                    </div>
                    <div className={styles.registerElement}>
                        <Button 
                            color='#FFFFFF'
                            backgroundColor='#1E1825'
                            borderColor='#B5B3BF'
                            borderRadius='0.5rem'
                            text='Continue with Google'
                        />
                    </div>
                    <div className={styles.registerElement}>
                        <Button 
                            color='#FFFFFF'
                            backgroundColor='#1E1825'
                            borderColor='#B5B3BF'
                            borderRadius='0.5rem'
                            text='Continue with Facebook'
                        />
                    </div>
                    <div className={styles.registerElement}>
                        <div className={styles.splitter}>
                            <div className={styles.line}><hr /></div>
                            <div className={styles.splitterText}>Lub</div>
                            <div className={styles.line}><hr /></div>
                        </div>
                    </div>
                    <div className={styles.registerElement}>
                        <input type="email" placeholder='Emali' className={styles.inputBox}/>
                    </div>
                    <div className={styles.registerElement}>
                        <input type="password" placeholder='Hasło' className={styles.inputBox}/>
                    </div>
                    <div className={styles.forgorText}>
                        Nie pamiętasz hasła?
                    </div>
                    <div className={styles.registerElement}>
                        <Button 
                            color='#FFFFFF'
                            backgroundColor='#8E5AFF'
                            borderRadius='0.5rem'
                            text='Zaloguj się'
                        />
                    </div>
                    <div 
                        className={styles.registerText}
                        onClick={() => {
                            onClose();           // Close login popup
                            onRegisterClick();   // Open register popup
                        }}
                        style={{ cursor: 'pointer' }} // Optional: show pointer
                    >
                        Nie masz konta? Zarejestruj się!
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPopup;
