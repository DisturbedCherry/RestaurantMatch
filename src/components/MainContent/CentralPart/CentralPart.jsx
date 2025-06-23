import styles from './CentralPart.module.css'
import Card from '../Card/Card'
import Image from '../../../assets/food_placeholder.png'
import Button from '../../Button/Button'

function CentralPart() {
    return (
        <div className={styles.centralContent}>
            <div className={styles.cardContainer}>
                <div className={styles.cardWrapper}>
                    <Card 
                        color='#8E5AFF'
                        name='Pizzanova'
                        image={Image}
                        description='Skomponowaną ze składników na które macie akurat ochotę! Nie musicie już zamawiać Capriccioso, Diavolo itp.'
                    />
                </div>
                <div className={styles.cardWrapper}>
                    <Card 
                        color='#0CBA88'
                        name='Dagrasso'
                        image={Image}
                        description='Skomponowaną ze składników na które macie akurat ochotę! Nie musicie już zamawiać Capriccioso, Diavolo itp.'
                    />
                </div>
                <div className={styles.cardWrapper}>
                    <Card 
                        color='#FF8680'
                        name='Mcdonalds'
                        image={Image}
                        description='Skomponowaną ze składników na które macie akurat ochotę! Nie musicie już zamawiać Capriccioso, Diavolo itp.'
                    />
                </div>
                <div className={styles.cardWrapper}>
                    <Card 
                        color='#D5C338'
                        name='KFC'
                        image={Image}
                        description='Skomponowaną ze składników na które macie akurat ochotę! Nie musicie już zamawiać Capriccioso, Diavolo itp.'
                    />
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <div className={styles.buttonWrapper}>
                    <Button 
                        backgroundColor='#5A7BFF'
                        color='#FFFFFF'
                        fontSize='2rem'
                        text='Chce znaleźć restaurację'
                    />
                </div>
            </div>
        </div>
    )
}

export default CentralPart;