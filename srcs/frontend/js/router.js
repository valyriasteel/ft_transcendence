	import { waitForBallElement } from './background.js';
import { initiateGameHtml } from './script.js';
import { fullClean } from './script.js';

window.history.replaceState({ path: '/' }, '', '/');
let lastPushedState = null;

const route = (event, path) => {
    //console.log("path:", path);
    if (event) {
        event.preventDefault();  // Prevent the default link behavior
        path = event.target.href;  // Get the link's target href
    }

    if (path) {
        // Correctly push the state with the path in the state object
        window.history.pushState({ path }, "", "");  // Add new history entry and set state
		lastPushedState = window.history.state;
        handleLocation(path);  // Update the page content based on the new path
    }
};

// This handles browser back/forward navigation
window.onpopstate = (event) => {
    if (event.state && event.state.path) {
        console.log("popstate path:", event.state.path); // Log the state path
        handleLocation(event.state.path); // Update page content based on the URL stored in the history state
    } else {
        console.log("popstate state is null or doesn't contain path");
    }
	console.log("state path:", event.state.path);
	if (event.state.path === "/")
		waitForBallElement();
		
    // Handle "/game" specific logic
    if (event.state && (lastPushedState?.path === "/game" || event.state.path === "/game")) {
        console.log("oyundan cıktım");
        fullClean();
    }

    // Update the lastPushedState after processing the event
    lastPushedState = event.state || null;
};

const routes = {
    "/": "/html/index2.html",
    "/game": "/html/game.html",
    "/verify-2fa": "/html/verify-2fa.html"
};

const handleLocation = async (path = window.location.pathname) => {
    //console.log("handleLocation path:", path);  // Log the current path
    const route = routes[path];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;
    if (path === "/game") {
        initiateGameHtml();
    }
};
handleLocation(window.location.pathname);
// Initial load - Ensure this runs immediately to handle the first page load

window.route = route;
