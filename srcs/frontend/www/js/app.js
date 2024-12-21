document.addEventListener('DOMContentLoaded', () => { 
    const content = document.getElementById('content'); 
    const routes = {
        home: '../html/home.html',
        tournament: '../html/tournament.html',
        game: '../html/game.html',
    };
    const router = async (state) => {
        console.log('Router called with state:', state);
        const page = routes[state] || routes['home']; 
        try {
            const response = await fetch(page); 
            console.log('Fetch response:', response);
            if (response.ok) {
                const html = await response.text(); 
                content.innerHTML = html; 
                console.log('Page loaded successfully:', page);
                initializePage(state); 
            } else {
                console.error(`Failed to load page: ${response.statusText}`);
                content.innerHTML = `<p>Error loading page: ${response.statusText}</p>`; 
            }
        } catch (error) {
            console.error(`Error during fetch: ${error.message}`);
            content.innerHTML = `<p>Error loading page: ${error.message}</p>`; 
        }
    };
    const initializePage = (state) => {
        console.log('Initializing page for state:', state);
        if (state === 'tournament') {
            document.getElementById('tournament-form').addEventListener('submit', (e) => {
                e.preventDefault(); 
                alert(`Thank you, ${document.getElementById('player-name').value}, for registering!`);
            });
        }
        if (state === 'game') {
            console.log('Game page initialized');
            const content = document.getElementById('content');
            content.innerHTML = `
                <div id="pong-game-container">
                    <canvas id="gameCanvas"></canvas>
                </div>
            `;
            const scripts = [
                '/js/three.js',
                '/js/Player.js',
                '/js/Ball.js',
                '/js/Camera.js',
                '/js/AudioMan.js',
                '/js/MenuStuff.js',
                '/js/script.js',
            ];
            scripts.forEach((src) => {
                const script = document.createElement('script');
                script.src = src;
                script.type = 'module';
                document.body.appendChild(script);
            });
        }                 
    };
    const navigateTo = (state) => {
        window.history.pushState({ state }, '', ''); 
        router(state); 
    };
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.nav-link.active')?.classList.remove('active'); 
            link.classList.add('active'); 
        });
    });
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
        console.log("Navigating to game page...");
        navigateTo('game'); 
    });
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.state) {
            router(event.state.state); 
        } else {
            router('home'); 
        }
    });
    const initialState = window.history.state ? window.history.state.state : 'home'; 
    router(initialState); 
});