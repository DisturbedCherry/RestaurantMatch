import styles from './OfferCard.module.css'
import Button from '../Button/Button';

function Card(props) {
    const inlineStyles = {
        backgroundColor: '#1E1825',
        border: props.specialColor ? `3px solid ${props.specialColor}` : 'none',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        borderRadius: '1rem',
    }

    return (
        <div style={inlineStyles}>
            <div className={styles.titleWrapper}>
                <div style={{ color:props.specialColor }}>
                    {props.title}
                </div>
            </div>
            <div className={styles.descriptionWrapper}>
                {props.description}
            </div>
            <div className={styles.listWrapper}>
                Co zyskujesz?
                <ul>
                    {props.list && props.list.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.priceWrapper}>
                Cena: {props.price}
            </div>
            <div className={styles.buttonWrapper}>
                <Button 
                    backgroundColor={props.specialColor}
                    color="#FFFFFF"
                    borderRadius='0.5rem'
                    text='Wybieram pakiet'
                />
            </div>
        </div>
    )
}

export default Card;