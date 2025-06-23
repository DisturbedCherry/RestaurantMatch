// OfferPopup.jsx
import styles from './OfferPopup.module.css'
import Button from '../Button/Button'
import Card from '../OfferCard/OfferCard'

function LoginPopup({onClose}) {
    return (
        <div className={styles.popupBackground}
        onClick={onClose}>
            <div className={styles.cardsContainer}>
                <div className={styles.cardWrapper}
                onClick={(e) => e.stopPropagation()}>
                    <Card 
                            title='Pakiet Free' 
                            description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean interdum, metus ut fringilla rutrum, dui risus egestas quam, id volutpat ante turpis eget justo. '
                            specialColor='#0CBA88'
                            list={[
                                "AAA",
                                "BBB",
                                "CCC",
                                "DDD"]} 
                            price='Free'   
                        />
                </div>
                <div className={styles.cardWrapper}
                onClick={(e) => e.stopPropagation()}>
                    <div className={styles.card}>
                        <Card 
                            title='Pakiet Basic' 
                            description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean interdum, metus ut fringilla rutrum, dui risus egestas quam, id volutpat ante turpis eget justo. '
                            specialColor='#D5C338'
                            list={[
                                "AAA",
                                "BBB",
                                "CCC",
                                "DDD"]} 
                            price='50 zł / msc'   
                        />
                    </div>
                </div>
                <div className={styles.cardWrapper}
                onClick={(e) => e.stopPropagation()}>
                    <div className={styles.card}>
                        <Card 
                            title='Pakiet Premium' 
                            description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean interdum, metus ut fringilla rutrum, dui risus egestas quam, id volutpat ante turpis eget justo. '
                            specialColor='#FF8680'
                            list={[
                                "AAA",
                                "BBB",
                                "CCC",
                                "DDD"]} 
                            price='100 zł / msc'   
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPopup;
