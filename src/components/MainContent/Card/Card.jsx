import Button from '../../Button/Button';
import styles from './Card.module.css';

function Card(params) {
    const handleClick = () => {
        if (params.link) {
            window.location.href = params.link;
        }
    };

    const openInGoogleMaps = () => {
        if (!params.address) return;
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(params.address)}`;
        window.open(url, "_blank");
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#1E1825',
            border: `3px solid ${params.color}`,
            borderRadius: '1rem',
            color: '#FFFFFF',
            position: 'relative', // ✅ needed for absolute positioning
            overflow: 'hidden'
        }}>
            {/* Top-right Google Maps icon button */}
            {params.address && (
                <button
                    onClick={openInGoogleMaps}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 10,
                        padding: 0,
                    }}
                    title="Otwórz w Google Maps"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="#5A7BFF" 
                        width="24px" 
                        height="24px"
                    >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                    </svg>
                </button>
            )}

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
                                onClick={handleClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
