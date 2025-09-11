import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc, collection, addDoc, onSnapshot } from "firebase/firestore";
import styles from './AddRestaurantPage.module.css';

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

    // Mapowanie planów na znane ID cen w Stripe
    const planToPriceId = {
        'Basic': 'price_1RYnMo1ZncWnkPPTQLofRgXd',
        'Premium': 'price_1RYnN11ZncWnkPPTYtVw47nW'
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (!user) {
                navigate('/');
                return;
            }

            try {
                // Pobierz dane użytkownika
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.selectedPlan) {
                        setSelectedPlan(data.selectedPlan);
                        
                        // Spróbuj pobrać istniejące dane restauracji
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
                        setStatus("Nie znaleziono wybranego planu. Proszę wrócić i wybrać plan.");
                        setTimeout(() => navigate('/'), 3000);
                    }
                } else {
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
            // 1. Zapisz dane restauracji
            const restaurantDocRef = doc(db, "restaurants", user.uid);
            await setDoc(restaurantDocRef, {
                nameOfRestaurant: name,
                website,
                description,
                ownerId: user.uid,
                selectedPlan: selectedPlan,
                isVerified: false,
                creationDate: new Date(),
            }, { merge: true });

            // 2. Znajdź ID ceny na podstawie wybranego planu
            const priceId = planToPriceId[selectedPlan];
            if (!priceId) {
                throw new Error(`Nie znaleziono ID ceny dla planu: ${selectedPlan}`);
            }

            setStatus("Tworzenie sesji płatności...");
            
            // 3. Utwórz sesję płatności używając kolekcji checkout_sessions
            const checkoutSessionRef = await addDoc(
                collection(db, "users", user.uid, "checkout_sessions"),
                {
                    price: priceId,
                    success_url: `${window.location.origin}/checkout-success`,
                    cancel_url: `${window.location.origin}/`,
                    metadata: {
                        restaurantId: user.uid
                    }
                }
            );
            
            // 4. Nasłuchuj na aktualizacje dokumentu sesji
            setStatus("Przygotowuję przekierowanie do płatności...");
            onSnapshot(checkoutSessionRef, (snap) => {
                const { error, url } = snap.data();
                if (error) {
                    // Pokaż błąd użytkownikowi
                    console.error("Błąd sesji Stripe:", error);
                    setStatus(`Wystąpił błąd: ${error.message}`);
                }
                if (url) {
                    // Mamy URL sesji Stripe Checkout, przekierowujemy
                    window.location.assign(url);
                }
            });
        } catch (error) {
            console.error("Błąd podczas zapisywania danych lub płatności:", error);
            setStatus("Wystąpił błąd. Spróbuj ponownie: " + error.message);
        }
    };
    
    // Pozostała część komponentu (render, loading, itd.)
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