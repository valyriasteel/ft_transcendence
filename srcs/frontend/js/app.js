document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");

    // Giriş başlatma işlemi !!!!!Buralara bakilacak
    document.getElementById("start-button").addEventListener("click", async () => {
        try {
            // Game sayfasına istek at ve kullanıcı verilerini al
            const tokenResponse = await fetch('/accounts/test/', {
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
        });

    // Doğrulama sayfasını yükle
    async function loadVerificationPage() {
        try {
            removeCSSById('css');
            removeScript('../js/background.js');
            addCSSById('css', '../css/verify-2fa.css');
            // verify2-fa.html içeriğini yükle
            const response = await fetch("../html/verify-2fa.html");
            if (!response.ok) {
                throw new Error("Failed to load verification page!");
            }

            const html = await response.text();
            app.innerHTML = html;

            // Sayfa başlığını değiştir
            document.title = "2FA Verification - Pong Game";
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
                body: JSON.stringify({ email, code }),
            });

            // Yanıtı işle
            const result = await response.json();

            // Mesajları göstermek için bir div oluştur
            const messageDiv = document.createElement("div");
            messageDiv.id = "messageDiv"; // Mesaj div'ine benzersiz bir ID ver

            if (response.ok) {
                // Başarılı yanıt
                messageDiv.innerHTML = `<p style="color: green;">Verification successful! Redirect to the game page...</p>`;
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
            removeCSSById('css');
            // 1. Önce game.html içeriğini yükle
            const response = await fetch("../html/game.html");
            if (!response.ok) {
                throw new Error("Failed to load game page.");
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const gameHtml = doc.body.innerHTML;

            document.body.classList.remove('d-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'vh-100');

            document.title = "Pong Game"; // Sayfa başlığını değiştir

            // 2. ImportMap'i ekle
            const importMap = document.createElement('script');
            importMap.type = 'importmap';
            importMap.id = 'map';
            importMap.textContent = JSON.stringify({
                imports: {
                    "three": "https://cdn.jsdelivr.net/npm/three@0.172.0/build/three.module.js",
                    "FontLoader": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/loaders/FontLoader.js",
                    "TextGeo": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/geometries/TextGeometry.js",
                    "ExrLoader": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/loaders/EXRLoader.js",
                    "OrbitControl": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/controls/OrbitControls.js"
                }
            });
            document.head.appendChild(importMap);

            // 6. Info div'ini ekle
            const infoDiv = document.createElement('div');
            infoDiv.id = 'info';
            infoDiv.textContent = 'Description';
            document.body.appendChild(infoDiv);

            // game2.html içeriğini app elementine ekle
            app.innerHTML = gameHtml;
            // 3. CSS yükle
            addCSSById('css', '../css/game.css');
            // 5. Diğer script'leri yükle
            loadScript('../js/script.js');
            loadScript('../js/ai.js');
            loadScript('../js/AudioMan.js');
            loadScript('../js/Ball.js');
            loadScript('../js/Camera.js');
            loadScript('../js/CursorDetect.js');
            loadScript('../js/MenuStuff.js');
            loadScript('../js/Player.js');
        } catch (error) {
            console.error("Error loading game page:", error);
        }
    }

    window.loadIndexPage = async function loadIndexPage() {
        try {
            removeCSSById('css');
            const importmap = document.getElementById('map');
            if (importmap) {
                importmap.remove(); // DOM'dan kaldırır
            }
            const infoDiv = document.getElementById('info');
            if (infoDiv) {
                infoDiv.remove(); // DOM'dan kaldırır
            }
            document.body.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'vh-100');
            removeScript('../js/script.js');
            removeScript('../js/ai.js');
            removeScript('../js/AudioMan.js');
            removeScript('../js/Ball.js');
            removeScript('../js/Camera.js');
            removeScript('../js/CursorDetect.js');
            removeScript('../js/MenuStuff.js');
            removeScript('../js/Player.js');
            addCSSById('css', '../css/background.css');
            revertIndexScript('../js/background.js');
            // 1. Önce index.html içeriğini yükle
            const response = await fetch("../html/index2.html");
            if (!response.ok) {
                throw new Error("Failed to load game page.");
            }
            const html = await response.text();
            const app = document.getElementById('app');
            app.innerHTML = html;
            ball();


        } catch (error) {
            console.error("Error loading game page:", error);
        }
        document.getElementById("start-button").addEventListener("click", async () => {
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

    function removeCSSById(id) {
        const linkElement = document.getElementById(id);
        if (linkElement) {
            linkElement.parentNode.removeChild(linkElement);
        }
    }
    
    function loadScript(scriptPath) {
        const script = document.createElement("script");
        script.src = scriptPath;
        script.type = "module";
        script.defer = true;
        document.body.appendChild(script);
    }
    
    function removeScript(scriptPath) {
        const scripts = document.querySelectorAll(`script[src="${scriptPath}"]`);
        scripts.forEach(script => script.parentNode.removeChild(script));
    }
    
    function addCSSById(id, href) {
        // Aynı id ile yeni bir link öğesi oluşturuyoruz
        const newLink = document.createElement('link');
        newLink.id = id;  // id'yi tekrar tanımlıyoruz
        newLink.rel = 'stylesheet';
        newLink.href = href;
    
        // Yeni link öğesini head kısmına ekliyoruz
        document.head.appendChild(newLink);
    }

    function revertIndexScript(scriptPath) {
        const script = document.createElement("script");
        script.src = scriptPath;
        document.body.appendChild(script);
    }
});

