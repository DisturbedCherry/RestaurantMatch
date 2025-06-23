import Header from '../../components/HeaderMain/Header'
import Background from '../../components/Background/Background'
import MainContent from '../../components/MainContent/MainContent'
import styles from './MainPage.module.css'

function MainPage() {
    return (
        <div className={styles.mainPage}>
            <Background />
            <Header />
            <MainContent />
        </div>
    )
}

export default MainPage;