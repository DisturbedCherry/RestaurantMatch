// src/pages/PrivacyPolicy/PrivacyPolicy.jsx
import React from 'react';
import styles from './PrivacyPolicy.module.css';

function PrivacyPolicy() {
    return (
        <div className={styles.container}>
            <h1>Polityka Prywatności - RestaurantMatch</h1>
            <p>Data ostatniej aktualizacji: 12 września 2025</p>

            <h2>1. Informacje ogólne</h2>
            <p>
                Niniejsza Polityka Prywatności określa zasady przetwarzania danych osobowych użytkowników serwisu <strong>RestaurantMatch</strong>.
                Administratorem danych jest <strong>RestaurantMatch</strong>. W razie pytań możesz się z nami kontaktować pod adresem: 
                <a href="mailto:restaurantmatch@gmail.com"> restaurantmatch@gmail.com</a>.
            </p>

            <h2>2. Jakie dane zbieramy</h2>
            <ul>
                <li>Dane podawane dobrowolnie: imię, adres e-mail i hasło przy rejestracji/logowaniu</li>
                <li>Dane zbierane automatycznie: pliki cookies, które umożliwiają prawidłowe działanie serwisu, zapamiętywanie ustawień użytkownika oraz śledzenie aktywności w celu analizy ruchu na stronie</li>
            </ul>

            <h2>3. Cel przetwarzania danych</h2>
            <ul>
                <li>Umożliwienie rejestracji i logowania do serwisu</li>
                <li>Prawidłowe działanie funkcji serwisu, w tym integracja z Google Maps</li>
                <li>Obsługa płatności online dla firm korzystających z usług promocyjnych</li>
            </ul>

            <h2>4. Udostępnianie danych</h2>
            <p>
                Twoje dane mogą być udostępniane wyłącznie:
            </p>
            <ul>
                <li>Dostawcom usług niezbędnych do działania serwisu (np. Google Maps, systemy płatności)</li>
                <li>Organom państwowym, jeśli będzie to wymagane przez prawo</li>
            </ul>
            <p>Nie udostępniamy danych osobom trzecim w celach marketingowych ani reklamowych.</p>

            <h2>5. Pliki cookies</h2>
            <p>Serwis używa plików cookies w celu:</p>
            <ul>
                <li>Umożliwienia prawidłowego działania serwisu</li>
                <li>Przechowywania preferencji użytkownika</li>
                <li>Analizy ruchu na stronie</li>
            </ul>
            <p>Użytkownik może zmienić ustawienia przeglądarki, aby zablokować pliki cookies, jednak niektóre funkcje serwisu mogą przestać działać poprawnie.</p>

            <h2>6. Okres przechowywania danych</h2>
            <p>Dane osobowe przechowujemy do momentu, gdy użytkownik poprosi o ich usunięcie. Po otrzymaniu takiej prośby dane zostaną niezwłocznie usunięte.</p>

            <h2>7. Bezpieczeństwo danych</h2>
            <p>
                Dbamy o bezpieczeństwo Twoich danych, stosując odpowiednie środki techniczne i organizacyjne, aby chronić je przed nieautoryzowanym dostępem, utratą lub zmianą.
            </p>

            <h2>8. Zmiany w Polityce Prywatności</h2>
            <p>
                Polityka Prywatności może być okresowo aktualizowana. Każda zmiana będzie publikowana na tej stronie wraz z datą aktualizacji.
            </p>

            <h2>9. Kontakt</h2>
            <p>
                W przypadku pytań dotyczących polityki prywatności lub Twoich danych osobowych, skontaktuj się z nami pod adresem: 
                <a href="mailto:restaurantmatch@gmail.com"> restaurantmatch@gmail.com</a>.
            </p>
        </div>
    );
}

export default PrivacyPolicy;
