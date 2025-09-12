import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig'; // upewnij się, że ścieżka jest poprawna
import styles from './CentralPart.module.css';
import Card from '../Card/Card';
import Image from '../../../assets/food_placeholder.png';
import Button from '../../Button/Button';
import SearchPopup from "../../SearchPopup/SearchPopup";

function CentralPart() {
    const [promotedRestaurants, setPromotedRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    
    const colors = ['#8E5AFF', '#0CBA88', '#FF8680', '#D5C338'];

    useEffect(() => {
        const fetchPromotedRestaurants = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const restaurantsRef = collection(db, "restaurants");
                const q = query(restaurantsRef, where("selectedPlan", "==", "Basic"));
                const querySnapshot = await getDocs(q);
                
                const restaurants = [];
                querySnapshot.forEach((doc) => {
                    restaurants.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                // Shuffle array
                const shuffled = restaurants.sort(() => 0.5 - Math.random());
                // Take only 4
                const limited = shuffled.slice(0, 4);
                
                setPromotedRestaurants(limited);
            } catch (error) {
                console.error("Error fetching restaurants:", error);
                setError("Nie udało się pobrać restauracji");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPromotedRestaurants();
    }, []);


    if (isLoading) {
        return <div>Ładowanie...</div>;
    }

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div className={styles.centralContent}>
            <div className={styles.cardContainer}>
                {promotedRestaurants.map((restaurant, index) => (
                    <div key={restaurant.id} className={styles.cardWrapper}>
                        <Card 
                            color={colors[index % colors.length]}
                            name={restaurant.nameOfRestaurant}
                            image={Image}
                            description={restaurant.description}
                            link={restaurant.website}
                            address={restaurant.address} // ✅ pass address here
                        />
                    </div>
                ))}
            </div>
            <div className={styles.buttonContainer}>
                <div className={styles.buttonWrapper}>
                    <Button 
                        onClick={() => setOpen(true)}
                        backgroundColor='#5A7BFF'
                        color='#FFFFFF'
                        fontSize='2rem'
                        text='Chce znaleźć restaurację'
                    />
                    <SearchPopup open={open} onClose={() => setOpen(false)} />
                </div>
            </div>
        </div>
    );
}

export default CentralPart;