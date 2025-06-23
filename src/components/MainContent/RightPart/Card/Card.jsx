import styles from './Card.module.css';

function Card({ title, image, link }) {
    return (
        <a href={link} className={styles.card} target="_blank" rel="noopener noreferrer">
            <h3 className={styles.cardTitle}>{title}</h3>
            <img src={image} alt={title} className={styles.cardImage} />
        </a>
    );
}

export default Card;
