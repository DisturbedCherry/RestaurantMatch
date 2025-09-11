import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore, collection, query, where, onSnapshot, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {  getDocs } from 'firebase/firestore';
export default function CheckoutSuccessPage() {
    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("Weryfikacja płatności...");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setStatus("Użytkownik nie zalogowany. Przekierowuję...");
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            try {
                // Sprawdź status restauracji w bazie danych
                const restaurantRef = doc(db, "restaurants", user.uid);
                const restaurantDoc = await getDoc(restaurantRef);
                
                if (!restaurantDoc.exists()) {
                    setStatus("Nie znaleziono danych restauracji. Przekierowuję...");
                    setTimeout(() => navigate('/'), 3000);
                    return;
                }
                
                // Sprawdź subskrypcje użytkownika w poprawnej lokalizacji
                try {
                    // Nowa lokalizacja subskrypcji zgodna z rozszerzeniem Stripe
                    const subscriptionsQuery = query(
                        collection(db, "users", user.uid, "subscriptions"),
                        where("status", "in", ["trialing", "active"])
                    );
                    
                    const unsubscribeSnapshot = onSnapshot(subscriptionsQuery, (snapshot) => {
                        if (!snapshot.empty) {
                            // Mamy aktywną subskrypcję
                            const subscription = snapshot.docs[0].data();
                            
                            // Aktualizuj status restauracji
                            updateRestaurantStatus(user.uid, subscription);
                            
                            setStatus("Płatność powiodła się! Twój plan jest aktywny. Przekierowuję do panelu...");
                            setTimeout(() => navigate('/Main'), 3000);
                        } else {
                            // Brak aktywnej subskrypcji, sprawdź tryb testowy
                            checkTestMode();
                        }
                    }, (error) => {
                        console.error("Błąd podczas nasłuchiwania subskrypcji:", error);
                        checkTestMode();
                    });
                    
                    return () => unsubscribeSnapshot();
                } catch (subError) {
                    console.error("Błąd sprawdzania subskrypcji:", subError);
                    checkTestMode();
                }
                
                // Funkcja sprawdzająca tryb testowy (URL z parametrem test=true)
                function checkTestMode() {
                    const urlParams = new URLSearchParams(window.location.search);
                    const isTestMode = urlParams.get('test') === 'true';
                    
                    if (isTestMode) {
                        // W trybie testowym, ustaw restaurację jako zweryfikowaną
                        setDoc(restaurantRef, {
                            isVerified: true,
                            paidAt: new Date(),
                            testMode: true
                        }, { merge: true }).then(() => {
                            setStatus("Płatność testowa zaakceptowana. Przekierowuję do panelu...");
                            setTimeout(() => navigate('/Main'), 3000);
                        });
                    } else {
                        // Sprawdź checkout_sessions, aby zobaczyć, czy jest w toku
                        const checkoutSessionsQuery = query(
                            collection(db, "users", user.uid, "checkout_sessions")
                        );
                        
                        getDocs(checkoutSessionsQuery).then((sessionsSnapshot) => {
                            if (!sessionsSnapshot.empty) {
                                // Istnieje sesja checkout, poczekaj na jej zakończenie
                                setStatus("Weryfikacja płatności w toku... Proszę czekać...");
                                
                                // Daj systemowi trochę czasu na przetworzenie płatności
                                setTimeout(() => {
                                    setStatus("Przekierowuję do panelu...");
                                    setTimeout(() => navigate('/Main'), 3000);
                                }, 5000);
                            } else {
                                setStatus("Nie znaleziono aktywnej subskrypcji. Przekierowuję...");
                                setTimeout(() => navigate('/'), 3000);
                            }
                        }).catch((error) => {
                            console.error("Błąd podczas sprawdzania sesji:", error);
                            setStatus("Wystąpił błąd. Przekierowuję...");
                            setTimeout(() => navigate('/'), 3000);
                        });
                    }
                }
                
                setLoading(false);
            } catch (error) {
                console.error("Błąd podczas weryfikacji płatności:", error);
                setStatus("Wystąpił błąd w trakcie weryfikacji. Przekierowuję...");
                setTimeout(() => navigate('/'), 3000);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db, navigate]);

    // Funkcja aktualizująca status restauracji
    const updateRestaurantStatus = async (userId, subscription) => {
        try {
            const restaurantRef = doc(db, "restaurants", userId);
            
            // Przygotuj dane do aktualizacji
            const updateData = {
                isVerified: true,
                subscriptionId: subscription.id,
                subscriptionStatus: subscription.status,
                updatedAt: new Date()
            };
            
            // Dodaj informacje o dacie zakończenia okresu, jeśli dostępne
            if (subscription.current_period_end) {
                if (typeof subscription.current_period_end === 'object' && subscription.current_period_end.toDate) {
                    updateData.currentPeriodEnd = subscription.current_period_end.toDate();
                } else if (subscription.current_period_end.seconds) {
                    updateData.currentPeriodEnd = new Date(subscription.current_period_end.seconds * 1000);
                }
            }
            
            // Dodaj informacje o planie, jeśli dostępne
            if (subscription.prices && subscription.prices.length > 0) {
                updateData.planId = subscription.prices[0].id;
                if (subscription.prices[0].product) {
                    updateData.planName = subscription.prices[0].product.name || 'Unknown Plan';
                }
            }
            
            await setDoc(restaurantRef, updateData, { merge: true });
            
            console.log("Status restauracji zaktualizowany:", updateData);
        } catch (error) {
            console.error("Błąd podczas aktualizacji statusu restauracji:", error);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Status Płatności</h2>
            <p>{status}</p>
            {loading && <div style={{ marginTop: '20px' }}>
                <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    border: '5px solid #f3f3f3',
                    borderTop: '5px solid #3498db',
                    borderRadius: '50%',
                    margin: '0 auto',
                    animation: 'spin 2s linear infinite'
                }}></div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>}
        </div>
    );
}