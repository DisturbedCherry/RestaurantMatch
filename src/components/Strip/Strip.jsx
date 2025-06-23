import styles from './Strip.module.css'
import Image from '../../assets/restaurant_match_logo_white_noborder.svg'

function Strip() {
    return (
        <div className={styles.stripWrapper}>
            <div className={styles.image}><img src={Image} className={styles.logo}/></div>
            <div className={styles.image}><img src={Image} className={styles.logo}/></div>
            <div className={styles.image}><img src={Image} className={styles.logo}/></div>
            <div className={styles.image}><img src={Image} className={styles.logo}/></div>
        </div>
    )
}

export default Strip;