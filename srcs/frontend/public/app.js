document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');

    // Routes
    const routes = {
        home: loadHomePage,
        tournament: loadTournamentPage,
        game: loadGamePage,
    };

    // Router Function
    const router = (state) => {
        const loadPage = routes[state] || routes['home'];
        loadPage();
    };

    // Navigation Function (URL değişmeden)
    const navigateTo = (state) => {
        window.history.pushState({ state }, '', ''); // URL'yi değiştirmeden state kaydet
        router(state); // Sayfayı yükle
    };

    // Home Page
    function loadHomePage() {
        content.innerHTML = `
            <div class="jumbotron text-center">
                <h1 class="display-4">Welcome to Pong Game!</h1>
                <p class="lead">Join tournaments, compete with AI, and enjoy custom game modes!</p>
                <button class="btn btn-light btn-lg mt-3" id="start-game">Start Game</button>
            </div>
            <div class="row text-center mt-4">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Multiplayer Tournaments</h5>
                            <p class="card-text">Compete with players from around the world!</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">AI Opponent</h5>
                            <p class="card-text">Test your skills against an advanced AI player!</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Custom Game Modes</h5>
                            <p class="card-text">Enjoy unique gameplay with customizable settings!</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Tournament Page
    function loadTournamentPage() {
        content.innerHTML = `
            <div class="container">
                <h2 class="text-center mb-4">Tournament Registration</h2>
                <form id="tournament-form">
                    <div class="mb-3">
                        <label for="player-name" class="form-label">Player Name</label>
                        <input type="text" class="form-control" id="player-name" placeholder="Enter your name" required>
                    </div>
                    <button type="submit" class="btn btn-success">Register</button>
                </form>
            </div>
        `;
        document.getElementById('tournament-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert(`Thank you, ${document.getElementById('player-name').value}, for registering!`);
        });
    }

    // Game Page
    function loadGamePage() {
        content.innerHTML = `
            <h2 class="text-center">Game Area</h2>
            <div class="game-area">
                <div class="paddle" id="player1" style="top: 50px; left: 10px;"></div>
                <div class="paddle" id="player2" style="top: 50px; right: 10px;"></div>
                <div class="ball"></div>
            </div>
            <p class="text-center">Use arrow keys or WASD to play!</p>
        `;
    }

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
