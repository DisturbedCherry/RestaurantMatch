// src/pages/RestaurantDashboard/RestaurantDashboard.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import styles from './RestaurantDashboard.module.css';

export default function RestaurantDashboard() {
    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [selectedPlan, setSelectedPlan] = useState(null);

    const addressRef = useRef(null); // Google Maps autocomplete

    // Initialize Google Maps Autocomplete
    useEffect(() => {
        if (!window.google || !window.google.maps) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
            script.onload = initAutocomplete;
        } else {
            initAutocomplete();
        }

        function initAutocomplete() {
            if (!addressRef.current) return;
            const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
                types: ["address"],
                componentRestrictions: { country: "PL" },
            });
            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                setAddress(place.formatted_address || "");
            });
        }
    }, []);

    // Fetch restaurant data
    useEffect(() => {
        const fetchRestaurantData = async () => {
            const user = auth.currentUser;
            if (!user) {
                navigate('/');
                return;
            }

            try {
                const restaurantDocRef = doc(db, "restaurants", user.uid);
                const restaurantSnap = await getDoc(restaurantDocRef);
                if (restaurantSnap.exists()) {
                    const data = restaurantSnap.data();
                    setName(data.nameOfRestaurant || "");
                    setWebsite(data.website || "");
                    setDescription(data.description || "");
                    setAddress(data.address || "");
                    setSelectedPlan(data.selectedPlan || null);
                } else {
                    setStatus("Nie znaleziono Twojej restauracji.");
                }
            } catch (error) {
                console.error(error);
                setStatus("Błąd przy pobieraniu danych.");
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, [auth, db, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;

        if (!name || !website || !address) {
            setStatus("Proszę wypełnić wszystkie wymagane pola.");
            return;
        }

        try {
            const restaurantDocRef = doc(db, "restaurants", user.uid);
            await setDoc(
                restaurantDocRef,
                { nameOfRestaurant: name, website, description, address },
                { merge: true }
            );
            setStatus("Dane zostały zaktualizowane ✅");
        } catch (error) {
            console.error(error);
            setStatus("Błąd podczas aktualizacji: " + error.message);
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

    return (
        <div className={styles.formBackground}>
            <div className={styles.formBox}>
                <div className={styles.content}>
                    <h2 className={styles.titleWrapper}>Panel Restauracji {selectedPlan && `(Plan: ${selectedPlan})`}</h2>
                    <form onSubmit={handleUpdate} className={styles.form}>
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
                                maxLength={150}
                            />
                        </div>
                        <div className={styles.formElement}>
                            <label htmlFor="address" className={styles.formLabel}>Adres *</label>
                            <input
                                id="address"
                                type="text"
                                ref={addressRef}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className={styles.formInput}
                                placeholder="Wpisz adres restauracji"
                            />
                        </div>
                        <button type="submit" className={styles.submitButton}>Zapisz zmiany</button>
                    </form>
                    {status && (
                        <p className={`${status.includes('Błąd') ? styles.error : styles.success}`}>{status}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
