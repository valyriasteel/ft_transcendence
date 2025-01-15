document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutBut");

    if (logoutButton) {
        console.log("Test")
        logoutButton.addEventListener("click", handleLogout);
    }

    // Logout işlemini gerçekleştiren fonksiyon
    async function handleLogout() {
        // Refresh token'ı ve access token'ı localStorage'dan alıyoruz
        const refreshToken = localStorage.getItem('refresh_token');
        const accessToken = localStorage.getItem('access_token');
        const csrfToken = getCookie('csrftoken');  // CSRF token'ı alıyoruz

        // Refresh token ve access token'ın varlığını kontrol ediyoruz
        if (!refreshToken || !accessToken) {
            alert('Tokenlar bulunamadı, çıkış işlemi gerçekleştirilemez!');
            return;
        }

        try {
            // Çıkış işlemi için API isteği gönderiyoruz
            const response = await fetch('/accounts/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,  // CSRF token'ı
                    'Authorization': `Bearer ${accessToken}`  // JWT access token'ı
                },
                body: JSON.stringify({ refresh_token: refreshToken })  // Refresh token'ı gönderiyoruz
            });

            const data = await response.json();

            if (response.ok) {
                // Backend çıkışı başarılı yaptıysa, frontend'den tokenları siliyoruz
                localStorage.removeItem('access_token');  // Access token'ı sil
                localStorage.removeItem('refresh_token');  // Refresh token'ı sil

                // Kullanıcıyı anasayfaya yönlendiriyoruz
                window.location.href = "/";
            } else {
                // Backend hata dönerse daha iyi bir hata mesajı
                alert(data.error || 'Çıkış yaparken bir hata oluştu!');
            }
        } catch (error) {
            console.error('Çıkış sırasında hata:', error);
            alert('Bir hata oluştu, lütfen tekrar deneyin.');
        }
    }

    // CSRF token'ı almak için yardımcı fonksiyon
    function getCookie(name) {
        const cookieArray = document.cookie.split(';');
        for (const cookie of cookieArray) {
            const trimmedCookie = cookie.trim();
            if (trimmedCookie.startsWith(name + '=')) {
                return decodeURIComponent(trimmedCookie.substring(name.length + 1));
            }
        }
        return null;
    }
});
