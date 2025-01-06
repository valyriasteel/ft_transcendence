// Dinamik base URL oluşturma
const BASE_URL = window.location.origin;

// Start Game butonuna tıklama olayını ekliyoruz
document.querySelector('.start-button').addEventListener('click', async () => {
    try {
        // API çağrısını başlatıyoruz
        const response = await fetch(`${BASE_URL}/accounts/loginintra42/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('42 Intra Login API başarısız oldu.');
        }

        // Gelen yanıtın URL'ini alıyoruz
        const data = await response.json();
        console.log('Login URL:', data.url);

        // Kullanıcıyı 42 Login sayfasına yönlendiriyoruz
        window.location.href = data.url;

    } catch (error) {
        console.error('API Hatası:', error);
        alert('Başlangıç sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
});