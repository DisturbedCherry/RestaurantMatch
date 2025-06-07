// RegisterPopup.jsx
import styles from './RegisterPopup.module.css'
import Button from '../Button/Button'

function RegisterPopup({ onClose }) {
    return (
        <div 
            className={styles.registerBackground}
            onClick={onClose} // ⬅️ Close when clicking outside the box
        >
            <div 
                className={styles.registerBox}
                onClick={(e) => e.stopPropagation()} // ⬅️ Prevent closing when clicking inside
            >
                <div className={styles.content}>
                    <div className={styles.titleWrapper}>
                        Zarejestruj się
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
                            <div className={styles.line}>
                                <hr />
                            </div>
                            <div className={styles.splitterText}>
                                Lub
                            </div>
                            <div className={styles.line}>
                                <hr />
                            </div>
                        </div>
                    </div>
                    <div className={styles.registerText}>
                        Stwórz konto
                    </div>
                    <div className={styles.registerElement}>
                        <input type="email" placeholder='Emali' className={styles.inputBox}/>
                    </div>
                    <div className={styles.registerElement}>
                        <input type="password" placeholder='Hasło' className={styles.inputBox}/>
                    </div>
                    <div className={styles.registerElement}>
                        <input type="password" placeholder='Powtórz hasło' className={styles.inputBox}/>
                    </div>
                    <div className={styles.registerElement}>
                        <Button 
                            color='#FFFFFF'
                            backgroundColor='#0CBA88'
                            borderRadius='0.5rem'
                            text='Utwórz konto'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPopup;
