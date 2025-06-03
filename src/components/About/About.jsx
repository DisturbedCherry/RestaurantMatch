import Button from '../Button/Button.jsx'
import styles from './About.module.css'

function About() {
    return (
        <div className={styles.aboutContent}>
            <div className={styles.textWrapper}>
                Chcesz się wybrać do restauracji, ale nie wiesz na co masz ochotę? My znajdziemy dla Ciebie najlepsze rekomendacje restauracji w Twojej okolicy!
            </div>
            <div className={styles.buttonContainer}>
                <div className={styles.registerWrapper}>
                    <Button backgroundColor='#0CBA88' color='#010102' text='Zarejestruj się'/>
                </div>
                <div className={styles.moreWrapper}>
                    <Button backgroundColor='#010102' color='#F5F5FF' borderColor='#FF8680' text='Dowiedz się więcej'/>
                </div>
            </div>
        </div>
    )
}

export default About;