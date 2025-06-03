import styles from './WelcomePage.module.css'
import Header from '../../components/Header/Header'
import About from '../../components/About/About'
import Banner from '../../components/Banner/Banner'
import Introduction from '../../components/Introduction/Introduction'
import Strip from '../../components/Strip/Strip'
import Offer from '../../components/Offer/Offer'
import Footer from '../../components/Footer/Footer'
import Background from '../../components/Background/Background'

function WelcomePage() {
    return (
        <div className={styles.welcomePage}>
            <Header />
            <About />
            <Banner />
            <Introduction />
            <Strip />
            <Offer />
            <Footer />
            <Background />
        </div>
    )
}

export default WelcomePage