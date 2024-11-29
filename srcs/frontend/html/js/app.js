document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');

    // Routes
    const routes = {
        home: 'home.html',
        tournament: 'tournament.html',
        game: 'game.html',
    };

    // Router Function
    const router = async (state) => {
        const page = routes[state] || routes['home'];
        try {
            const response = await fetch(page); // HTML şablonunu getir
            if (response.ok) {
                const html = await response.text();
                content.innerHTML = html; // İçeriği yerleştir
                initializePage(state); // Sayfa özel işlemleri başlat
            } else {
                content.innerHTML = `<p>Error loading page: ${response.statusText}</p>`;
            }
        } catch (error) {
            content.innerHTML = `<p>Error loading page: ${error.message}</p>`;
        }
    };

    // Sayfa Özel İşlemleri
    const initializePage = (state) => {
        if (state === 'tournament') {
            document.getElementById('tournament-form').addEventListener('submit', (e) => {
                e.preventDefault();
                alert(`Thank you, ${document.getElementById('player-name').value}, for registering!`);
            });
        }
    };

    // Navigation Function (URL değişmeden)
    const navigateTo = (state) => {
        window.history.pushState({ state }, '', ''); // URL'yi değiştirmeden state kaydet
        router(state); // Sayfayı yükle
    };

    // Navbar Link Highlighting
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.nav-link.active')?.classList.remove('active'); // Önceki active sınıfını kaldır
            link.classList.add('active'); // Tıklanan linke active ekle
        });
    });

    // Event Listeners
    document.getElementById('home-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('home');
    });

    document.getElementById('tournament-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('tournament');
    });

    document.getElementById('game-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('game');
    });

    // Handle Browser Navigation (Back/Forward Buttons)
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.state) {
            router(event.state.state); // Popstate ile state'e göre sayfa yükle
        } else {
            router('home'); // Varsayılan olarak home yükle
        }
    });

    // Initial Route
    const initialState = window.history.state ? window.history.state.state : 'home'; // Mevcut state'i kontrol et
    router(initialState); // Başlangıç rotasını yükle
});
