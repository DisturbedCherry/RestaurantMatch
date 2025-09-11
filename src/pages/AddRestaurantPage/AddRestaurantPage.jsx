import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { loadStripe } from '@stripe/stripe-js';
import styles from './AddRestaurantPage.module.css';
// Twój klucz publiczny Stripe
const stripePromise = loadStripe('pk_test_51RYnFO1ZncWnkPPTWn72XCVdb0QnH8AbGiiUGaKAqXWJZc0QDzNP4a4WNYY8kezDwyqsX32xtP26dAjZCaeNEfJH00olvH233W');
// ID Twoich planów subskrypcyjnych ze Stripe
const subscriptionPriceIds = {
    'Basic': 'price_1RYnMo1ZncWnkPPTQLofRgXd',
    'Premium': 'price_1RYnN11ZncWnkPPTYtVw47nW',
};

export default function AddRestaurantPage() {
    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (!user) {
                navigate('/');
                return;
            }

            try {
                // POBIERAMY Z DOKUMENTU USERS
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.selectedPlan) {
                        setSelectedPlan(data.selectedPlan);
                        // Teraz możemy opcjonalnie spróbować pobrać dane restauracji, jeśli już istnieją
                        const restaurantDocRef = doc(db, "restaurants", user.uid);
                        const restaurantDocSnap = await getDoc(restaurantDocRef);
                        if (restaurantDocSnap.exists()) {
                            const restaurantData = restaurantDocSnap.data();
                            setName(restaurantData.nameOfRestaurant || "");
                            setWebsite(restaurantData.website || "");
                            setDescription(restaurantData.description || "");
                        }
                        setStatus("");
                    } else {
                        // Jeśli w dokumencie 'users' nie ma selectedPlan, to jest błąd w przepływie
                        setStatus("Nie znaleziono wybranego planu. Proszę wrócić i wybrać plan.");
                        setTimeout(() => navigate('/'), 3000);
                    }
                } else {
                    // Użytkownik jest zalogowany, ale jego dokument nie istnieje. To też jest błąd.
                    setStatus("Brak danych użytkownika. Proszę spróbować ponownie.");
                    setTimeout(() => navigate('/'), 3000);
                }
            } catch (error) {
                console.error("Błąd podczas pobierania danych:", error);
                setStatus("Wystąpił błąd podczas ładowania danych.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [auth, db, navigate]);
    // const basicPlanPaymentLink = 'https://buy.stripe.com/test_4gM9AM9BZgUm0es2yi7g400';
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        
        if (!user || !selectedPlan) {
            setStatus("Błąd: Nie można przetworzyć formularza.");
            return;
        }

        if (!name || !website) {
            setStatus("Proszę wypełnić wszystkie wymagane pola.");
            return;
        }

        try {
            // TERAZ TWORZYMY LUB AKTUALIZUJEMY RESTAURACJĘ
            await setDoc(doc(db, "restaurants", user.uid), {
                nameOfRestaurant: name,
                website,
                description,
                ownerId: user.uid,
                selectedPlan: selectedPlan,
                isVerified: false,
                creationDate: new Date(),
            }, { merge: true });
            // window.location.href = basicPlanPaymentLink
            const stripe = await stripePromise;
            const priceId = subscriptionPriceIds[selectedPlan];
            
            if (!priceId) {
                setStatus("Błąd: Nieprawidłowy plan płatności.");
                return;
            }

            await stripe.redirectToCheckout({
                lineItems: [{ price: priceId, quantity: 1 }],
                mode: 'subscription',
                successUrl: `${window.location.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
                // successUrl: `${window.location.origin}/checkout-success`,
                cancelUrl: `${window.location.origin}/`,
                customerEmail: user.email,
            });

        } catch (error) {
            console.error("Błąd podczas zapisywania danych lub płatności:", error);
            setStatus("Wystąpił błąd. Spróbuj ponownie.");
        }
    };
    
    if (loading) {
        return (
            <div className={styles.formBackground}>
                <div className={styles.formBox}>
                    <div className={styles.content}>
                        <p>Ładowanie danych...</p>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!selectedPlan) {
        return (
            <div className={styles.formBackground}>
                <div className={styles.formBox}>
                    <div className={styles.content}>
                        <p className={`${styles.statusMessage} ${styles.error}`}>{status}</p>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className={styles.formBackground}>
            <div className={styles.formBox}>
                <div className={styles.content}>
                    <h2 className={styles.titleWrapper}>Dodaj Restaurację (Plan: {selectedPlan})</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formElement}>
                            <label htmlFor="name" className={styles.formLabel}>Nazwa Restauracji *</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className={styles.formInput}
                            />
                        </div>
                        <div className={styles.formElement}>
                            <label htmlFor="website" className={styles.formLabel}>Strona internetowa *</label>
                            <input
                                id="website"
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                required
                                className={styles.formInput}
                            />
                        </div>
                        <div className={styles.formElement}>
                            <label htmlFor="description" className={styles.formLabel}>Opis</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className={styles.formTextarea}
                            />
                        </div>
                        <button type="submit" className={styles.submitButton}>
                            Przejdź do płatności
                        </button>
                    </form>
                </div>
            </div>
            {status && (
                <div className={`${styles.statusMessage} ${status.includes('Błąd') ? styles.error : styles.success}`}>
                    <p>{status}</p>
                </div>
            )}
        </div>
    );
}