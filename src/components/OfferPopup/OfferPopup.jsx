import { useState } from "react";
import styles from './OfferPopup.module.css'
import Card from '../OfferCard/OfferCard'
import RegisterPopup from '../RegisterPopup/RegisterPopup'

function OfferPopup({ onClose }) {
    const [registerOpen, setRegisterOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Open RegisterPopup with plan
    const handleClick = (plan) => {
        setSelectedPlan(plan);
        setRegisterOpen(true);
    }

    // Close RegisterPopup
    const handleRegisterClose = () => {
        setRegisterOpen(false);
    }

    // Only allow closing OfferPopup if RegisterPopup is not open
    const handleBackgroundClick = () => {
        if (!registerOpen) {
            onClose();
        }
    }

    return (
        <div className={styles.popupBackground} onClick={handleBackgroundClick}>
            <div className={styles.cardsContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.cardWrapper}>
                    <Card 
                        title='Pakiet Free' 
                        description='Spraw, że Twoja restauracja zostanie zauważona przez innych.'
                        specialColor='#0CBA88'
                        list={["- Dostęp do panelu kontrolnego", "- Promocja nowych restauracji", "- Wyświetlanie w wyszukiwarce", "- Przekierowanie do strony"]} 
                        price='Free'   
                        onClick={() => handleClick("Free")}
                    />
                </div>

                <div className={styles.cardWrapper}>
                    <Card 
                        title='Pakiet Basic' 
                        description='Chcesz zwiększyć swoje obroty? Postaw na pakiet Basic!'
                        specialColor='#D5C338'
                        list={["- Promocja na stronie głównej", "- Możliwość wyświetlania opisu", "- Możliwość dodania adresu", "- Wszystko z pakietu free"]} 
                        price='899.99 zł'   
                        onClick={() => handleClick("Basic")}
                    />
                </div>

                <div className={styles.cardWrapper}>
                    <Card 
                        title='Pakiet Premium' 
                        description='Pakiet planowany na przyszłe wersje.'
                        specialColor='#6b6b6bff'
                        list={["- ", "- ", "- ", "- "]} 
                        price='???'   
                        onClick={() => handleClick("Premium")}
                        disabled
                    />
                </div>
            </div>

            {/* RegisterPopup */}
            {registerOpen && (
                <RegisterPopup
                    onClose={handleRegisterClose}
                    userType="owner"            // pass userType
                    selectedPlan={selectedPlan} // pass selected plan
                />
            )}
        </div>
    )
}

export default OfferPopup;
