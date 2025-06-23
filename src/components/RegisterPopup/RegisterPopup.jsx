import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../services/firebaseConfig'; // importuj auth z pliku firebase.js
import styles from './RegisterPopup.module.css';
import Button from '../Button/Button';


function RegisterPopup({ onClose }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (password !== repeatPassword) {
            setError("Hasła nie są takie same.");
            setTimeout(() => setError(''), 4000); // czyści błąd po 4 sekundach
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            onClose();
        } catch (err) {
            console.error(err);
            setError("Błąd podczas rejestracji: " + err.message);
            setTimeout(() => setError(''), 4000);
        }
    };

    return (
        <div className={styles.registerBackground} onClick={onClose}>
            <div className={styles.registerBox} onClick={(e) => e.stopPropagation()}>
                <div className={styles.content}>
                    <div className={styles.titleWrapper}>Zarejestruj się</div>

                    {/* Google */}
                    <div className={styles.registerElement}>
                        <Button 
                            color='#FFFFFF'
                            backgroundColor='#1E1825'
                            borderColor='#B5B3BF'
                            borderRadius='0.5rem'
                            text='Continue with Google'
                            onClick={() => console.log("Google login not yet implemented")}
                        />
                    </div>

                    {/* Facebook */}
                    <div className={styles.registerElement}>
                        <Button 
                            color='#FFFFFF'
                            backgroundColor='#1E1825'
                            borderColor='#B5B3BF'
                            borderRadius='0.5rem'
                            text='Continue with Facebook'
                            onClick={() => console.log("Facebook login not yet implemented")}
                        />
                    </div>

                    {/* Divider */}
                    <div className={styles.registerElement}>
                        <div className={styles.splitter}>
                            <div className={styles.line}><hr /></div>
                            <div className={styles.splitterText}>Lub</div>
                            <div className={styles.line}><hr /></div>
                        </div>
                    </div>

                    {/* Formularz rejestracji */}
                    <div className={styles.registerText}>Stwórz konto</div>

                    <div className={styles.registerElement}>
                        <input 
                            type="email" 
                            placeholder='Email' 
                            className={styles.inputBox}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.registerElement}>
                        <input 
                            type="password" 
                            placeholder='Hasło' 
                            className={styles.inputBox}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className={styles.registerElement}>
                        <input 
                            type="password" 
                            placeholder='Powtórz hasło' 
                            className={styles.inputBox}
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className={styles.errorPopup}>
                            {error}
                        </div>
                    )}

                    <div className={styles.registerElement}>
                        <Button 
                            color='#FFFFFF'
                            backgroundColor='#0CBA88'
                            borderRadius='0.5rem'
                            text='Utwórz konto'
                            onClick={handleRegister}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPopup;