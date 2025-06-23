import Button from '../../Button/Button'
import styles from './Card.module.css'

// Card.jsx
function Card(params) {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#1E1825',
            border: `3px solid ${params.color}`,
            borderRadius: '1rem',
            color: '#FFFFFF',
        }}>
            <div className={styles.cardTitle}>
                {params.name}
            </div>
            <div className={styles.cardContent}>
                <div className={styles.imageContainer}>
                    <img src={params.image} className={styles.image}/>
                </div>
                <div className={styles.contentContainer}>
                    <div className={styles.textWrapper}>
                        {params.description}
                    </div>
                    <div className={styles.buttonContainer}>
                        <div className={styles.buttonWrapper}>
                            <Button 
                                backgroundColor='#1E1825'
                                color='#FFFFFF'
                                borderColor={params.color}
                                text='Zamów teraz'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card;