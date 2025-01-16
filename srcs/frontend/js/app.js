document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    const style = document.getElementById("test");

    // Giriş başlatma işlemi !!!!!Buralara bakilacak
    document.getElementById("startLogin").addEventListener("click", async () => {
            try {
                // Game sayfasına istek at ve kullanıcı verilerini al
                const tokenResponse = await fetch('/accounts/tokencheck/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                const index_data = await tokenResponse.json();
                if (tokenResponse.ok) {
                    console.log(index_data);
                    window.loadGamePage();
                } else {
                    throw new Error('Game sayfası yüklenemedi');
                }
            } catch (error) {
                console.error('Hata:', error.message || error);
                // Token ile ilgili bir sorun varsa token'ları temizle
                // 42 login'e yönlendir
                const loginResponse = await fetch('/accounts/loginintra42/');
                const loginData = await loginResponse.json();
                window.location.href = loginData.url;
            }
        

            //try {
            //    // Giriş API'sine istek gönder
            //    const loginApi = `${window.location.protocol}//${window.location.host}/accounts/loginintra42/`;
            //    const response = await fetch(loginApi);
            //    
            //    if (!response.ok) {
            //        throw new Error("Login request failed!");
            //    }
            //    
            //    // API'den dönen URL'ye yönlendirme
            //    const data = await response.json();
            //    if (data.url) {
            //        window.location.href = data.url; // 42'nin login sayfasına yönlendir
            //    }
            //} catch (error) {
            //    console.error("Login error:", error);
            //}
        
        });

    // Doğrulama sayfasını yükle
    async function loadVerificationPage() {
        try {
            // verify2-fa.html içeriğini yükle
            const response = await fetch("../html/verify2fa.html");
            if (!response.ok) {
                throw new Error("Failed to load verification page!");
            }

            const html = await response.text();
            app.innerHTML = html;

            // Doğrulama formunu dinle
            const form = document.getElementById("verifyForm");
            form.addEventListener("submit", handleVerification);
        } catch (error) {
            console.error("Error loading verification page:", error);
        }
    }

    // Doğrulama işlemi
    async function handleVerification(event) {
        event.preventDefault(); // Formun varsayılan davranışını durdur
    
        const form = document.getElementById("verifyForm"); // Formu seç
        const code = document.getElementById("code").value; // Kullanıcının girdiği kod
        const email = document.getElementById("email").value; // Kullanıcının girdiği e-posta
    
        // Daha önce gösterilen mesajları temizle
        const existingMessage = document.getElementById("messageDiv");
        if (existingMessage) {
            existingMessage.remove(); // Eğer bir mesaj zaten varsa, kaldır
        }
    
        try {
            // Doğrulama API'sine istek gönder
            const verifyApi = `${window.location.protocol}//${window.location.host}/accounts/verify-2fa/`;
            const response = await fetch(verifyApi, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code, email }),
            });
    
            // Yanıtı işle
            const result = await response.json();
    
            // Mesajları göstermek için bir div oluştur
            const messageDiv = document.createElement("div");
            messageDiv.id = "messageDiv"; // Mesaj div'ine benzersiz bir ID ver
    
            if (response.ok) {
                // Başarılı yanıt
                messageDiv.innerHTML = `<p style="color: green;">Verification successful! Access token: ${result.access || 'No access token provided.'}</p>`;
                form.reset(); // Formu temizle
                window.loadGamePage(); // Oyun sayfasını yükle
            } else {
                // Backend'den gelen hata mesajını göster
                const errorMessage = result.error || "An unexpected error occurred.";
                messageDiv.innerHTML = `<p style="color: red;">Error: ${errorMessage}</p>`;
            }
    
            // Mesajı forma ekle
            form.parentNode.appendChild(messageDiv);
        } catch (error) {
            console.error("Verification error:", error);
    
            // Beklenmeyen hatalar için kullanıcıya mesaj göster
            const messageDiv = document.createElement("div");
            messageDiv.id = "messageDiv";
            messageDiv.innerHTML = `<p style="color: red;">An unexpected error occurred. Please try again later.</p>`;
            form.parentNode.appendChild(messageDiv);
        }
    }
    

    function checkCallback() {
        // Cookie'yi kontrol et
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});
    
        // Eğer "callback_complete" cookie'si varsa doğrulama sayfasını yükle
        if (cookies.callback_complete === 'true') {
            loadVerificationPage(); // Doğrulama sayfasını yükle
    
            // Cookie'yi temizle (tek seferlik kontrol için)
            document.cookie = "callback_complete=; Max-Age=0; path=/";
        }
    }
    
    // Sayfa yüklendiğinde callback kontrolü
    checkCallback();

    window.loadGamePage = async function loadGamePage() {
        try {
            style.remove();
            // 1. Önce game2.html içeriğini yükle
            const response = await fetch("../html/game2.html");
            if (!response.ok) {
                throw new Error("Failed to load game page.");
            }
    
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const game2Html = doc.body.innerHTML;
    
            // 2. ImportMap'i ekle
            const importMap = document.createElement('script');
            importMap.type = 'importmap';
            importMap.textContent = JSON.stringify({
                imports: {
                    "three": "https://cdn.jsdelivr.net/npm/three@0.172.0/build/three.module.js",
                    "FontLoader": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/loaders/FontLoader.js",
                    "TextGeo": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/geometries/TextGeometry.js",
                    "ExrLoader": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/loaders/EXRLoader.js"
                }
            });
            document.head.appendChild(importMap);
    

    
            // 6. Info div'ini ekle
            const infoDiv = document.createElement('div');
            infoDiv.id = 'info';
            infoDiv.textContent = 'Description';
            document.body.appendChild(infoDiv);
    
            // game2.html içeriğini app elementine ekle
            app.innerHTML = game2Html;
            // 3. CSS yükle
            await loadCSS()
            // 5. Diğer script'leri yükle
            await loadModules();
        } catch (error) {
            console.error("Error loading game page:", error);
        }
    }
    
    // Modül script'lerini yükleme fonksiyonu
    function loadModules() {
        const modules = [
            '../js/script.js',
            '../js/ai.js',
            '../js/AudioMan.js',
            '../js/Ball.js',
            '../js/Camera.js',
            '../js/CursorDetect.js',
            '../js/MenuStuff.js',
            '../js/Player.js',
        ];
    
        return Promise.all(modules.map(src => {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = src;
            return new Promise((resolve, reject) => {
                script.onload = () => {
                    console.log(`${src} loaded`);
                    resolve();
                };
                script.onerror = () => reject(new Error(`Module load error: ${src}`));
                document.body.appendChild(script);
            });
        }));
    }
    
    function loadCSS() {
        return new Promise((resolve) => {
            if (!document.querySelector('link[href="../css/game.css"]')) {
                const cssLink = document.createElement("link");
                cssLink.rel = "stylesheet";
                cssLink.href = "../css/game.css";
                cssLink.onload = () => resolve();
                document.head.appendChild(cssLink);
            } else {
                resolve();
            }
        });
    }

    function loadIndexCSS() {
        return new Promise((resolve) => {
            if (!document.querySelector('link[href="../css/style.css"]')) {
                const cssLink = document.createElement("link");
                cssLink.rel = "stylesheet";
                cssLink.href = "../css/style.css";
                cssLink.onload = () => resolve();
                document.head.appendChild(cssLink);
            } else {
                resolve();
            }
        });
    }

    window.loadIndexPage = async function loadIndexPage() {
        try {
            // 1. Önce game2.html içeriğini yükle
            const response = await fetch("../html/index.html");
            if (!response.ok) {
                throw new Error("Failed to load game page.");
            }
    
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const indexHtml = doc.body.innerHTML;
    
            // 6. Info div'ini ekle
            const infoDiv = document.createElement('div');
            infoDiv.id = 'info';
            infoDiv.textContent = 'Description';
            document.body.appendChild(infoDiv);
    
            // game2.html içeriğini app elementine ekle
            app.innerHTML = indexHtml;
            // 3. CSS yükle
            await loadIndexCSS();
            // 5. Diğer script'leri yükle
            await loadIndexModules();
        } catch (error) {
            console.error("Error loading game page:", error);
        }
        document.getElementById("startLogin").addEventListener("click", async () => {
            try {
                // Giriş API'sine istek gönder
                const loginApi = `${window.location.protocol}//${window.location.host}/accounts/loginintra42/`;
                const response = await fetch(loginApi);
    
                if (!response.ok) {
                    throw new Error("Login request failed!");
                }
    
                // API'den dönen URL'ye yönlendirme
                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url; // 42'nin login sayfasına yönlendir
                }
            } catch (error) {
                console.error("Login error:", error);
            }
        });
    }


    function loadIndexModules()
    {
        const modules = [
            '../js/app.js'
        ];
    
        return Promise.all(modules.map(src => {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = src;
            return new Promise((resolve, reject) => {
                script.onload = () => {
                    console.log(`${src} loaded`);
                    resolve();
                };
                script.onerror = () => reject(new Error(`Module load error: ${src}`));
                document.body.appendChild(script);
            });
        }));
    }
    
    function loadCSS() {
        return new Promise((resolve) => {
            if (!document.querySelector('link[href="../css/game.css"]')) {
                const cssLink = document.createElement("link");
                cssLink.rel = "stylesheet";
                cssLink.href = "../css/game.css";
                cssLink.onload = () => resolve();
                document.head.appendChild(cssLink);
            } else {
                resolve();
            }
        });
    }
});

 