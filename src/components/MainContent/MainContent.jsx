import CentralPart from './CentralPart/CentralPart';
import RightPart from './RightPart/RightPart'
import styles from './MainContent.module.css'

function MainContent() {
    return (
        <div className={styles.contentWrapper}>
            <div className={styles.centralWrapper}>
                <CentralPart />
            </div>
            <div className={styles.sideWrapper}>
                <RightPart />
            </div>
        </div>
    )
}

export default MainContent;