import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig'; 
import styles from './RightPart.module.css';
import Image from '../../../assets/food_placeholder.png'
import Card from './Card/Card.jsx';

function RightPart() {
    const [latestRestaurants, setLatestRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestRestaurants = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Tworzymy zapytanie do Firestore
                const restaurantsRef = collection(db, "restaurants");
                const q = query(restaurantsRef, orderBy("__name__", "asc"), limit(5));
                const querySnapshot = await getDocs(q);
                
                const restaurants = [];
                querySnapshot.forEach((doc) => {
                    restaurants.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                setLatestRestaurants(restaurants);
            } catch (err) {
                console.error("Błąd podczas pobierania restauracji:", err);
                setError("Nie udało się pobrać danych. Spróbuj ponownie później.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestRestaurants();
    }, []); // Pusta tablica zależności zapewnia, że hook wykona się tylko raz

    if (isLoading) {
        return <div className={styles.rightContent}>Ładowanie...</div>;
    }

    if (error) {
        return <div className={styles.rightContent}>Błąd: {error}</div>;
    }

    return (
        <div className={styles.rightContent}>
            <h2 className={styles.header}>Nowości</h2>
            <div className={styles.cardList}>
                {latestRestaurants.map((restaurant, index) => (
                    <Card 
                        key={restaurant.id}
                        title={restaurant.nameOfRestaurant} // Zastąp `title` nazwą pola w Twojej bazie
                        image={restaurant.image || Image} // Użyj obrazka z bazy, jeśli istnieje, lub zastępczego
                        link={restaurant.website}
                    />
                ))}
            </div>
        </div>
    );
}

export default RightPart;