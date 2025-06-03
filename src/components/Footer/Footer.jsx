import styles from './Footer.module.css'
import Logo from '../../assets/restaurant_match_logo_white_noborder.svg'

function Footer() {
    return (
        <div className={styles.footerContent}>
            <div className={styles.imageWrapper}>
                <img src={Logo} alt="RestaurantMatch Logo" className={styles.image}/>
            </div>
            <div className={styles.linksWrapper}>
                <ul>
                    <li>O nas</li>
                    <li>Polityka prywatności</li>
                    <li>Regulamin</li>
                    <li>Pricing</li>
                    <li>Dane kontaktowe</li>
                </ul>
            </div>
            <div className={styles.authorsWrapper}>
                Aleksandra Pindral
                <br />
                Jakub Wiślicki
            </div>
        </div>
    )
}

export default Footer;