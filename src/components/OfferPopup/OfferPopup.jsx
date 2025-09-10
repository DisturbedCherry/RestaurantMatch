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
                        description='Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                        specialColor='#0CBA88'
                        list={["AAA", "BBB", "CCC", "DDD"]} 
                        price='Free'   
                        onClick={() => handleClick("Free")}
                    />
                </div>

                <div className={styles.cardWrapper}>
                    <Card 
                        title='Pakiet Basic' 
                        description='Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                        specialColor='#D5C338'
                        list={["AAA", "BBB", "CCC", "DDD"]} 
                        price='50 zł / msc'   
                        onClick={() => handleClick("Basic")}
                    />
                </div>

                <div className={styles.cardWrapper}>
                    <Card 
                        title='Pakiet Premium' 
                        description='Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                        specialColor='#FF8680'
                        list={["AAA", "BBB", "CCC", "DDD"]} 
                        price='100 zł / msc'   
                        onClick={() => handleClick("Premium")}
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
