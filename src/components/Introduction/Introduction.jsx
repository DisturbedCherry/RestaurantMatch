import styles from './Introduction.module.css'
import Button from '../Button/Button'

function Introduction({onRegisterClick}) {
    return (
        <div className={styles.introductionContent}>
            <div className={styles.titleWrapper}>
                Użytkownicy
            </div>
            <div className={styles.invitationWrapper}>
                Nie wiesz na co masz ochotę? My ci pomożemy!
            </div>
            <div className={styles.informationContainer}>
                <div className={styles.halfContainer}>
                    <div className={styles.textWrapper}>
                        <span style={{color:'#D5C338'}}>Spersonalizowane rekomendacje</span> - wybieraj restauracje na podstawie swoich preferencji.
                    </div>
                    <div className={styles.textWrapper}>
                        <span style={{color:'#D5C338'}}>Szybkie decyzje</span> - swipe'uj restauracje tak jak w aplikacjach randkowych i wybierz to, co Cię zainteresuje.
                    </div>
                    <div className={styles.textWrapper}>
                        <span style={{color:'#D5C338'}}>Łatwa rezerwacja stolika</span> - zarezerwuj miejsce bezpośrednio przez aplikację, bez dzwonienia i czekania na potwierdzenie.
                    </div>
                    <div className={styles.textWrapper}>
                        <span style={{color:'#D5C338'}}>Opinie i oceny</span> - sprawdzaj recenzje innych użytkowników i dodawaj własne, aby pomóc innym w wyborze.
                    </div>
                </div>
                <div className={styles.halfContainer}>
                    <div className={styles.textWrapper}>
                        <span style={{color:'#D5C338'}}>Lista ulubionych restauracji</span> - zapisuj swoje najlepsze odkrycia i wracaj do nich, kiedy chcesz.
                    </div>
                    <div className={styles.textWrapper}>
                        <span style={{color:'#D5C338'}}>Nowości i promocje</span> - bądź na bieżąco z nowymi miejscami oraz specjalnymi ofertami.
                    </div>
                    <div className={styles.textWrapper}>
                        <span style={{color:'#D5C338'}}>Nie trać czasu na niekończące się wyszukiwania</span> - Zarejestruj się i znajdź restaurację idealną dla siebie.
                    </div>
                    <div className={styles.textWrapper}>
                        <span style={{color:'#D5C338'}}></span>Dołącz do RestaurantMatch już teraz!
                    </div>
                </div>
            </div>
            <div className={styles.registerWrapper}>
                <Button color='#010102' backgroundColor='#E5E4EF' text='Zarejestruj się' fontSize='1.5rem' onClick={onRegisterClick}/>
            </div>
        </div>
    )
}

export default Introduction;