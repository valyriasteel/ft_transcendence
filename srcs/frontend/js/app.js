console.log("app.js loaded");
document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    if (!app) {
        console.error("app element not found");
        return;
    }

    document.getElementById("start-button").addEventListener("click", async () => {
        try {
            const tokenResponse = await fetch('/accounts/test/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            await tokenResponse.json();

            if (tokenResponse.ok) {
                window.loadGamePage();
            } else {
                console.log("Not logged in, redirecting to 42 login page...");
                const loginpage = `${window.location.protocol}//${window.location.host}/accounts/loginintra42/`;
                const loginResponse = await fetch(loginpage);
                const loginData = await loginResponse.json();
                window.location.href = loginData.url;
            }

        } catch (error) {
            console.error("Error loading game page:", error);
        }
        });

    async function loadVerificationPage() {
        try {
            removeCSSById('css');
            removeScript('../js/background.js');
            addCSSById('css', '../css/verify-2fa.css');

            const response = await fetch("../html/verify-2fa.html");

            if (response.ok) {
                console.log("Loaded verification page");
            }

            const html = await response.text();
            app.innerHTML = html;

            document.title = "2FA Verification - Pong Game";

            const form = document.getElementById("verifyForm");
            form.addEventListener("submit", handleVerification);
        } catch (error) {
            console.error("Error loading verification page:", error);
        }
    }

    async function handleVerification(event) {
        event.preventDefault();

        const form = document.getElementById("verifyForm");
        const code = document.getElementById("code").value;
        const email = document.getElementById("email").value;

        const existingMessage = document.getElementById("messageDiv");
    
        if (existingMessage) {
            existingMessage.remove();
        }

        try {
            const verifyApi = `${window.location.protocol}//${window.location.host}/accounts/verify-2fa/`;
            const response = await fetch(verifyApi, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, code }),
            });

            const result = await response.json();

            const messageDiv = document.createElement("div");
            messageDiv.id = "messageDiv";

            if (response.ok) {
                messageDiv.innerHTML = `<p style="color: green;">Verification successful! Redirect to the game page...</p>`;
                form.reset();
                setTimeout(() => {
                    window.loadGamePage();
                }, 2000);
            } else {
                const errorMessage = result.error || "An unexpected error occurred.";
                messageDiv.innerHTML = `<p style="color: red;">Error: ${errorMessage}</p>`;
            }

            form.parentNode.appendChild(messageDiv);
        } catch (error) {
            console.error("Verification error:", error);
        }
    }

    function checkCallback() {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});

        if (cookies.callback_complete === 'true') {
            loadVerificationPage();
        }
    }

    checkCallback();

    window.loadGamePage = async function loadGamePage() {
        try {
            removeCSSById('css');
            const response = await fetch("../html/game.html");
            if (response.ok) {
                console.log("Loaded game page");
            }

            const html = await response.text();

            document.body.classList.remove('d-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'vh-100');

            document.title = "Pong Game";

            const importMap = document.createElement('script');
            importMap.type = 'importmap';
            importMap.id = 'map';
            importMap.textContent = JSON.stringify({
                imports: {
                    "three": "https://cdn.jsdelivr.net/npm/three@0.172.0/build/three.module.js",
                    "FontLoader": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/loaders/FontLoader.js",
                    "TextGeo": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/geometries/TextGeometry.js",
                    "ExrLoader": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/loaders/EXRLoader.js",
                }
            });
            document.body.appendChild(importMap);

            app.innerHTML = html;
            addCSSById('css', '../css/game.css');
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
                importmap.remove();
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
            loadScript('../js/background.js');

            const response = await fetch("../html/index2.html");
            if (response.ok) {
                console.log("Back to index page");
            }

            const html = await response.text();
            const app = document.getElementById('app');
            app.innerHTML = html;

            ball();
        } catch (error) {
            console.error("Error loading index page:", error);
        }

        document.getElementById("start-button").addEventListener("click", async () => {
        try {
            const tokenResponse = await fetch('/accounts/test/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            await tokenResponse.json();

            if (tokenResponse.ok) {
                window.loadGamePage();
            } else {
                console.log("Not logged in, redirecting to 42 login page...");
                const loginpage = `${window.location.protocol}//${window.location.host}/accounts/loginintra42/`;
                const loginResponse = await fetch(loginpage);
                const loginData = await loginResponse.json();
                window.location.href = loginData.url;
            }

        } catch (error) {
            console.error("Error loading game page:", error);
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
        const newLink = document.createElement('link');
        newLink.id = id;
        newLink.rel = 'stylesheet';
        newLink.href = href;
        document.head.appendChild(newLink);
    }
});