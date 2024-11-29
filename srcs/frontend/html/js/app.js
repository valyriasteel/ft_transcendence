document.addEventListener('DOMContentLoaded', () => { 
    // DOM yüklendiğinde çalıştırılacak kod bloğu.

    const content = document.getElementById('content'); 
    // Dinamik içeriğin yükleneceği ana konteyner.

    // Routes
    const routes = {
        home: 'home.html',         // Anasayfa için HTML dosyası.
        tournament: 'tournament.html', // Turnuva sayfası için HTML dosyası.
        game: 'game.html',         // Oyun sayfası için HTML dosyası.
    };

    // Router Function
    const router = async (state) => {
        // Sayfaları yüklemek için yönlendirme işlevi.
        const page = routes[state] || routes['home']; 
        // Geçersiz bir state gönderilirse varsayılan olarak 'home' yüklenir.
        try {
            const response = await fetch(page); 
            // Belirtilen HTML dosyasını getir.
            if (response.ok) {
                const html = await response.text(); 
                // HTML içeriğini metin olarak al.
                content.innerHTML = html; 
                // İçeriği sayfada göster.
                initializePage(state); 
                // Yüklenen sayfa için özel işlemleri çalıştır.
            } else {
                content.innerHTML = `<p>Error loading page: ${response.statusText}</p>`; 
                // Sayfa yüklenemezse hata mesajı göster.
            }
        } catch (error) {
            content.innerHTML = `<p>Error loading page: ${error.message}</p>`; 
            // Ağ hatası durumunda hata mesajı göster.
        }
    };

    // Sayfa Özel İşlemleri
    const initializePage = (state) => {
        // Sayfa bazında yapılacak ek işlemler.
        if (state === 'tournament') {
            // Turnuva sayfasında, form gönderimini yakala.
            document.getElementById('tournament-form').addEventListener('submit', (e) => {
                e.preventDefault(); 
                // Formun normal gönderim işlemini engelle.
                alert(`Thank you, ${document.getElementById('player-name').value}, for registering!`);
                // Kayıt için teşekkür mesajı göster.
            });
        }
    };

    // Navigation Function (URL değişmeden)
    const navigateTo = (state) => {
        // Sayfayı yönlendirirken tarayıcı URL'sini değiştirme.
        window.history.pushState({ state }, '', ''); 
        // State'i tarayıcı geçmişine ekle.
        router(state); 
        // Sayfayı yükle.
    };

    // Navbar Link Highlighting
    document.querySelectorAll('.nav-link').forEach(link => {
        // Navbar'daki tüm bağlantılar için tıklama olaylarını dinle.
        link.addEventListener('click', () => {
            document.querySelector('.nav-link.active')?.classList.remove('active'); 
            // Önceki aktif bağlantıyı temizle.
            link.classList.add('active'); 
            // Tıklanan bağlantıya 'active' sınıfı ekle.
        });
    });

    // Event Listeners for Navigation Links
    document.getElementById('home-link').addEventListener('click', (e) => {
        e.preventDefault(); 
        // Varsayılan bağlantı davranışını engelle.
        navigateTo('home'); 
        // Anasayfaya yönlendir.
    });

    document.getElementById('tournament-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('tournament'); 
        // Turnuva sayfasına yönlendir.
    });

    document.getElementById('game-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('game'); 
        // Oyun sayfasına yönlendir.
    });

    // Handle Browser Navigation (Back/Forward Buttons)
    window.addEventListener('popstate', (event) => {
        // Tarayıcı geri/ileri düğmelerine basıldığında çalışır.
        if (event.state && event.state.state) {
            router(event.state.state); 
            // Geçerli state'e göre sayfayı yükle.
        } else {
            router('home'); 
            // Varsayılan olarak anasayfayı yükle.
        }
    });

    // Initial Route
    const initialState = window.history.state ? window.history.state.state : 'home'; 
    // Tarayıcı geçmişindeki mevcut state'i kontrol et.
    router(initialState); 
    // Başlangıç rotasını yükle.
});
