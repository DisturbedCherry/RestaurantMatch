import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getFirestore, setDoc, getDoc } from 'firebase/firestore';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RYnFO1ZncWnkPPTWn72XCVdb0QnH8AbGiiUGaKAqXWJZc0QDzNP4a4WNYY8kezDwyqsX32xtP26dAjZCaeNEfJH00olvH233W');

export default function CheckoutSuccessPage() {
    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("Weryfikacja...");

    useEffect(() => {
        // Nasłuchuj zmian stanu uwierzytelnienia Firebase
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // Po pierwsze, upewnij się, że Firebase jest gotowy
            if (user === undefined) {
                // Jeśli user jest undefined, to znaczy, że Auth jeszcze nie zakończyło ładowania
                return;
            }

            // Teraz, po załadowaniu Auth, wykonaj logikę
            if (!user) {
                setStatus("Użytkownik nie zalogowany. Przekierowuję...");
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            if (!sessionId) {
                setStatus("Brak danych sesji. Przekierowuję...");
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            try {
                const stripe = await stripePromise;
                const session = await stripe.retrieveCheckoutSession(sessionId);

                if (session.error) {
                    setStatus(`Błąd Stripe: ${session.error.message}. Przekierowuję...`);
                    setTimeout(() => navigate('/'), 3000);
                    return;
                }

                if (session.status === 'complete' && session.payment_status === 'paid') {
                    const restaurantDocRef = doc(db, "restaurants", user.uid);
    
                    // Sprawdź, czy dokument istnieje, a jeśli nie, utwórz go
                    const docSnap = await getDoc(restaurantDocRef);

                    if (docSnap.exists()) {
                        // Jeśli dokument istnieje, zaktualizuj go
                        await setDoc(restaurantDocRef, {
                            isVerified: true,
                            paidAt: new Date(),
                            stripeSessionId: sessionId,
                        }, { merge: true });
                    } else {
                        // Jeśli dokument nie istnieje, utwórz go z danymi płatności
                        // i danymi domyślnymi
                        await setDoc(restaurantDocRef, {
                            ownerId: user.uid,
                            isVerified: true,
                            paidAt: new Date(),
                            stripeSessionId: sessionId,
                            // Możesz dodać inne domyślne pola, jeśli ich potrzebujesz
                        });
                    }

                    // Pozostała część kodu
                    setStatus("Płatność powiodła się! Twój plan jest aktywny. Przekierowuję do panelu...");
                    setTimeout(() => navigate('/Main'), 3000);
                    // const restaurantDocRef = doc(db, "restaurants", user.uid);
                    // await setDoc(restaurantDocRef, {
                    //     isVerified: true,
                    //     paidAt: new Date(),
                    //     stripeSessionId: sessionId,
                    // }, { merge: true });

                    // setStatus("Płatność powiodła się! Twój plan jest aktywny. Przekierowuję do panelu...");
                    // setTimeout(() => navigate('/Main'), 3000);
                } else {
                    setStatus("Płatność nie została zakończona. Przekierowuję...");
                    setTimeout(() => navigate('/'), 3000);
                }
            } catch (error) {
                console.error("Błąd podczas weryfikacji płatności:", error);
                setStatus("Wystąpił błąd w trakcie weryfikacji. Przekierowuję...");
                setTimeout(() => navigate('/'), 3000);
            } finally {
                setLoading(false);
            }
        });

        // Zawsze usuwaj nasłuchiwanie po odmontowaniu komponentu
        return () => unsubscribe();
    }, [auth, db, navigate, sessionId]);

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Weryfikacja Płatności</h2>
                <p>Ładowanie...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Status Płatności</h2>
            <p>{status}</p>
        </div>
    );
}