import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../services/firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";
import styles from './LoginPopup.module.css';
import { useNavigate } from "react-router-dom";
import Button from '../Button/Button';

function LoginPopup({ onClose, onRegisterClick }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate(); 

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();

            // Update lastLogin and email
            await setDoc(doc(db, "users", user.uid), {
                lastLogin: new Date(),
                email: user.email
            }, { merge: true });

            // Fetch userType
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data();
            const userType = userData?.userType || "customer";

            localStorage.setItem('token', idToken);
            onClose();

            // Redirect based on userType
            if (userType === "owner") {
                navigate("/ControlPanel");
            } else {
                navigate("/Main");
            }

        } catch (err) {
            console.error(err);
            setError("Błąd logowania: " + err.message);
            setTimeout(() => setError(''), 4000);
        }
    };
    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();

            // Save or update user in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
                lastLogin: new Date(),
                provider: 'google'
            }, { merge: true });

            // Fetch userType
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data();
            const userType = userData?.userType || "customer";

            localStorage.setItem('token', idToken);
            onClose();

            if (userType === "owner") {
                navigate("/ControlPanel");
            } else {
                navigate("/Main");
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
                    <div className={styles.titleWrapper}>
                        Zaloguj się
                    </div>

                    {/* Google login */}
                    <div className={styles.registerElement}>
                        <Button 
                            color='#FFFFFF'
                            backgroundColor='#1E1825'
                            borderColor='#B5B3BF'
                            borderRadius='0.5rem'
                            text='Continue with Google'
                            onClick={handleGoogleLogin}
                        />
                    </div>

                    {/* Facebook login */}
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

                    {/* Email/password */}
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

                    <div className={styles.forgorText}>
                        Nie pamiętasz hasła?
                    </div>

                    {/* Error popup */}
                    {error && (
                        <div className={styles.errorPopup}>
                            {error}
                        </div>
                    )}

                    <div className={styles.registerElement}>
                        <Button 
                            color='#FFFFFF'
                            backgroundColor='#8E5AFF'
                            borderRadius='0.5rem'
                            text='Zaloguj się'
                            onClick={handleLogin}
                        />
                    </div>

                    <div 
                        className={styles.registerText}
                        onClick={() => {
                            onClose();
                            onRegisterClick();
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        Nie masz konta? Zarejestruj się!
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPopup;
