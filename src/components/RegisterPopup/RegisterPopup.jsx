import { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup  } from "firebase/auth";
import { auth, db } from '../../services/firebaseConfig'; // importuj auth z pliku firebase.js
import styles from './RegisterPopup.module.css';
import Button from '../Button/Button';
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

function RegisterPopup({ onClose, userType, selectedPlan }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate(); 

    const handleRegister = async () => {
        if (password !== repeatPassword) {
            setError("Hasła nie są takie same.");
            setTimeout(() => setError(''), 4000);
            return;
        }

        try {
            // Zarejestruj użytkownika
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Stwórz obiekt z danymi użytkownika
            const userData = {
                email: user.email,
                createdAt: new Date(),
                lastLogin: new Date(),
                userType: userType
            };

            // Dodaj selectedPlan jeśli istnieje
            if (selectedPlan) {
                userData.selectedPlan = selectedPlan;
            }

            // Zapisz dane w Firestore
            await setDoc(doc(db, "users", user.uid), userData);

            onClose();
            if (selectedPlan) {
                navigate(`/add-restaurant/${selectedPlan}`);
            } else {
                navigate('/Main');
            }
            

        } catch (err) {
            console.error(err);
            setError("Błąd podczas rejestracji: " + err.message);
            setTimeout(() => setError(''), 4000);
        }
    };
    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Prepare user data
            const userData = {
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
                lastLogin: new Date(),
                provider: 'google',
                userType: userType  // use the prop passed to RegisterPopup
            };

            // Add selectedPlan if it exists
            if (selectedPlan) {
                userData.selectedPlan = selectedPlan;
            }

            await setDoc(doc(db, "users", user.uid), userData);

            onClose();
            if (selectedPlan || userType === 'owner') {
                navigate(`/add-restaurant/${selectedPlan}`);
            } else {
                navigate('/Main');
            }

        } catch (err) {
            console.error(err);
            setError("Błąd podczas logowania przez Google: " + err.message);
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
                            onClick={handleGoogleSignIn}
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