import styles from './Offer.module.css'
import Button from '../Button/Button';

function Offer({ onOfferClick }) {
    return (
        <div className={styles.offerContent}>
            <div className={styles.titleWrapper}>Restauracje</div>
            <div className={styles.aboutWrapper}>A może chcesz wypromować swoją restaurację?</div>
            <div className={styles.descriptionWrapper}>
                Co zyskujesz?
                <ul>
                    <li><span style={{color:'#8E5AFF'}}>Nowych klientów</span> - dotrzesz do osób, które aktywnie szukają restauracji w Twojej okolicy.</li>
                    <li><span style={{color:'#8E5AFF'}}>Więcej rezerwacji</span> - użytkownicy mogą rezerwować stoliki bezpośrednio przez aplikację.</li>
                    <li><span style={{color:'#8E5AFF'}}>Lepszą widoczność</span> - Twoja restauracja będzie prezentowana w systemie dopasowań na podstawie preferencji użytkowników.</li>
                    <li><span style={{color:'#8E5AFF'}}>Pozytywne opinie</span> - umożliwiaj klientom ocenianie Twojej restauracji i buduj jej reputację.</li>
                    <li><span style={{color:'#8E5AFF'}}>Dostęp do danych i analityki</span> - monitoruj liczbę odwiedzin, rezerwacji i analizuj, co działa najlepiej.</li>
                    <li><span style={{color:'#8E5AFF'}}>Możliwość promocji</span> - informuj o nowościach, specjalnych ofertach i wydarzeniach w Twoim lokalu.</li>
                </ul> 
            </div>
            <div className={styles.registerWrapper}>
                <Button 
                    backgroundColor='rgba(0, 0, 0, 0.1)' 
                    color='#F5F5FF' 
                    borderColor='#0CBA88' 
                    text='Zarejestruj swoją restaurację już dziś' 
                    fontSize='1.2rem'
                    onClick={onOfferClick}
                />
            </div>
        </div>
    )
}

export default Offer;