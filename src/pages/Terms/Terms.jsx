// src/pages/Terms/Terms.jsx
import React from 'react';
import styles from './Terms.module.css';

function Terms() {
    return (
        <div className={styles.container}>
            <h1>Regulamin serwisu – RestaurantMatch</h1>
            <p>Data ostatniej aktualizacji: 12 września 2025</p>

            <h2>1. Informacje ogólne</h2>
            <p>
                Niniejszy Regulamin określa zasady korzystania z serwisu <strong>RestaurantMatch</strong>.
                Administratorem serwisu jest <strong>RestaurantMatch</strong>.
                Korzystając z serwisu, użytkownik akceptuje postanowienia niniejszego Regulaminu.
            </p>

            <h2>2. Rodzaje użytkowników</h2>
            <ul>
                <li><strong>Konsumenci:</strong> osoby korzystające z serwisu w celu wyszukiwania restauracji, przeglądania ofert oraz sprawdzania lokalizacji na Google Maps.</li>
                <li><strong>Firmy / Restauracje:</strong> użytkownicy promujący swoje restauracje w serwisie. Mogą korzystać z pakietu bezpłatnego lub płatnego, w zależności od wybranego planu promocyjnego.</li>
            </ul>

            <h2>3. Zakres korzystania z serwisu</h2>
            <ul>
                <li>Konsumenci mogą przeglądać restauracje, wyszukiwać ich lokalizację oraz przechodzić na stronę restauracji.</li>
                <li>Firmy mogą dodawać informacje o swojej restauracji, promować ją w serwisie oraz wybierać pakiety promocyjne (free lub płatne).</li>
            </ul>

            <h2>4. Rejestracja i logowanie</h2>
            <p>
                Niektóre funkcje serwisu wymagają rejestracji i logowania. Użytkownik zobowiązuje się do podawania prawdziwych danych przy rejestracji oraz do zachowania poufności hasła.
            </p>

            <h2>5. Zasady korzystania</h2>
            <p>Użytkownik zobowiązuje się do korzystania z serwisu zgodnie z prawem oraz zasadami dobrych praktyk. W szczególności zabrania się:</p>
            <ul>
                <li>Publikowania treści nielegalnych, obraźliwych lub naruszających prawa osób trzecich</li>
                <li>Rozsyłania spamu lub innych działań zakłócających funkcjonowanie serwisu</li>
                <li>Wykorzystywania serwisu w celu wyrządzenia szkody innym użytkownikom lub serwisowi</li>
            </ul>

            <h2>6. Płatności</h2>
            <p>
                Firmy korzystające z płatnych pakietów promocyjnych dokonują płatności online. Serwis nie pobiera żadnych opłat od konsumentów korzystających z funkcji wyszukiwania restauracji.
            </p>

            <h2>7. Odpowiedzialność serwisu</h2>
            <p>
                Serwis <strong>RestaurantMatch</strong> nie ponosi odpowiedzialności za treści dodawane przez użytkowników, w tym za informacje publikowane przez restauracje.
                Administrator serwisu dokłada starań, aby dane były aktualne, jednak nie gwarantuje ich kompletności ani poprawności.
            </p>

            <h2>8. Zmiany regulaminu</h2>
            <p>
                Regulamin może być okresowo aktualizowany. Każda zmiana będzie publikowana na tej stronie wraz z datą aktualizacji.
            </p>

            <h2>9. Kontakt</h2>
            <p>
                W przypadku pytań dotyczących regulaminu, użytkownik może kontaktować się pod adresem: 
                <a href="mailto:restaurantmatch@gmail.com"> restaurantmatch@gmail.com</a>.
            </p>
        </div>
    );
}

export default Terms;
