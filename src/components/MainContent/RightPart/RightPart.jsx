import styles from './RightPart.module.css';
import Image from '../../../assets/food_placeholder.png'
import Card from './Card/Card.jsx';

function RightPart() {
    const cards = [
        { title: 'McDonalds', image: Image, link: 'https://example.com/1' },
        { title: 'KFC', image: Image, link: 'https://example.com/2' },
        { title: 'Dagrasso', image: Image, link: 'https://example.com/3' },
        { title: 'Pizzanova', image: Image, link: 'https://example.com/4' },
        { title: 'Shamo', image: Image, link: 'https://example.com/5' },
    ];

    return (
        <div className={styles.rightContent}>
            <h2 className={styles.header}>Nowości</h2>
            <div className={styles.cardList}>
                {cards.map((card, index) => (
                    <Card 
                        key={index}
                        title={card.title}
                        image={card.image}
                        link={card.link}
                    />
                ))}
            </div>
        </div>
    );
}

export default RightPart;
