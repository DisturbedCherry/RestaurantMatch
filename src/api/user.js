async function fetchProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Brak tokena, użytkownik niezalogowany');
        return;
    }

    const res = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        const data = await res.json();
        console.log('Profil użytkownika:', data);
    } else {
        console.error('Błąd przy pobieraniu profilu:', await res.json());
    }
}
