console.log("JavaScript is connected!");
import { Player } from './Player.js'; // Import the class
import { Ball } from './Ball.js'; // Import the class
import { AuMan } from './AudioMan.js'; // Import the class
import { Camera } from './Camera.js'; // Import the class
import { Bot } from './ai.js'; // Import the class
import { FontLoader } from 'FontLoader';
import * as MENU from './MenuStuff.js'; // Import the class
import * as THREE from 'three';
import { TextGeometry } from 'TextGeo';
import { EXRLoader } from 'ExrLoader';

export function    initiateGameHtml()
{
    canvas = document.getElementById("game-canvas");

    if (!canvas)
        return;
    canvas.remove();
    initiateGlobals();
    loadElements();
    getProfile();
    eventListenerHandler();
}

window.onbeforeunload = () => {
    fullClean();
};

async function eventListenerHandler()
{
    document.addEventListener('keydown', (event) => {
        //let cam = true;
        if (event.key === '"')
            cam.enable = !cam.enable;
        if (cam.enable)
            cameraDown(event);
        else {
            p1KeyDown(event);
            p2KeyDown(event);
            if (!(modeFour))
              return;
            p3KeyDown(event);
            p4KeyDown(event);
        }
    }
    );

    document.addEventListener('keyup', (event) => {
        cameraUp(event);
        p1KeyUp(event);
        p2KeyUp(event);
        if (!(modeFour))
            return;
        p3KeyUp(event);
        p4KeyUp(event);
    }
    );

    tourney.inputBox.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            tourney.submitButton.click(); // Trigger the button click
        }
    });
    window.addEventListener("resize", resizeRenderer);
}   

function visibleControl(every, flag, display) {
    const childrenArray = Array.from(every.children);

    childrenArray.forEach(child => {
        if (flag)
            child.style.display = display;
        else
            child.style.display = "none";
    });
}

function sceneTransition(before, after) {
    const beforeArray = Array.from(before.children);
    const afterArray = Array.from(after.children);

    beforeArray.forEach(child => {
        disappearBut(child);
    });

    afterArray.forEach(child => {
        appearBut(child);
    });
}

function loadMenuElements() {
    myMenu.startBut = document.getElementById("startBut");
    myMenu.settingsBut = document.getElementById("settingsBut");

    myMenu.everything = document.getElementById("menu");
    myMenu.startBut.addEventListener("click", function () {
        /*visibleControl(myMenu.everything, false, "none");
        visibleControl(select.everything, true, "block");*/
        //renderer.setAnimationLoop(selectLoop);
        visibleControl(select.everything, true, "block");
        sceneTransition(myMenu.everything, select.everything);
    });

    myMenu.settingsBut.addEventListener("click", function () {
        visibleControl(myMenu.everything, false, "none");
        visibleControl(optMenu.everything, true, "block");
        renderer.setAnimationLoop(optionsLoop);
    });
    logoutButton.addEventListener("click", handleLogout);

}

function loadSettingsElements() {
    optMenu.everything = document.getElementById("settings");
    optMenu.volumeUpBut = document.getElementById("volumeUp");
    optMenu.volumeDownBut = document.getElementById("volumeDown");
    optMenu.optionsText = document.getElementById("optionsText");
    optMenu.ballText = document.getElementById("ballText");
    optMenu.darkModeText = document.getElementById("darkModeText");
    optMenu.volumeSlider = document.getElementById("volumeSlider");
    optMenu.volumeLabel = document.getElementById("sliderLabel");
    optMenu.volumeControl = document.getElementById("volumeControl");
    optMenu.darkModeBut = document.getElementById("darkMode");
    optMenu.backBut = document.getElementById("backBut");
    optMenu.ballSelection = document.getElementById("ballSelection");
    optMenu.leftColor = document.getElementById("leftColor");
    optMenu.rightColor = document.getElementById("rightColor");
    optMenu.wallColor = document.getElementById("wallColor");
    optMenu.background = document.getElementById("backgroundSelect");

    document.getElementById("leftColorSelection").addEventListener("change", ()=>{
        const selectedValue = document.getElementById("leftColorSelection").value;
        console.log(selectedValue);
        if (selectedValue === "colorRed")
        {
            optMenu.leftPadColor = 'red';
            optMenu.leftRainbow = false;
        }
        if (selectedValue === "colorBlue")
        {
            optMenu.leftPadColor = 'blue';
            optMenu.leftRainbow = false;
        }
        if (selectedValue === "colorGreen")
        {
            optMenu.leftPadColor = 'green';
            optMenu.leftRainbow = false;
        }
        if (selectedValue === "colorRainbow")
        {
            optMenu.leftPadColor = 'red';
            optMenu.leftRainbow = true;
        }
    });

    document.getElementById("rightColorSelection").addEventListener("change", ()=>{
        const selectedValue = document.getElementById("rightColorSelection").value;
        console.log(selectedValue);
        if (selectedValue === "colorRed")
        {
            optMenu.rightPadColor = 'red';
            optMenu.rightRainbow = false;
        }
        if (selectedValue === "colorBlue")
        {
            optMenu.rightPadColor = 'blue';
            optMenu.rightRainbow = false;
        }
        if (selectedValue === "colorGreen")
        {
            optMenu.rightPadColor = 'green';
            optMenu.rightRainbow = false;
        }
        if (selectedValue === "colorRainbow")
        {
            optMenu.rightPadColor = 'blue';
            optMenu.rightRainbow = true;
        }
    });

    document.getElementById("wallColorSelection").addEventListener("change", ()=>{
        const selectedValue = document.getElementById("wallColorSelection").value;
        console.log(selectedValue);
        if (selectedValue === "colorRed")
            optMenu.colorWall = 'red';
        if (selectedValue === "colorBlue")
            optMenu.colorWall = 'blue';
        if (selectedValue === "colorGreen")
            optMenu.colorWall = 'green';
    });

    document.getElementById("backgroundSelection").addEventListener("change", () =>{
        const selectedValue = document.getElementById("backgroundSelection").value;
        if (selectedValue === "on")
        {
            scene.background = mode.texture;
            scene.environment = mode.texture;
        }
        else
        {
            console.log("off");
            scene.background = null;
            scene.environment = null;
        }
    });


    optMenu.backBut.addEventListener("click", function () {
        end.winner.style.display = "none";
        if (mode.isTourney) {
            mode.isTourney = false;
            end.champ.style.display = "none";
            end.nextBut.style.display = "none";
            tourney.playerArray = [];
            tourney.MatchArray = [];
            tourney.inPlayers.innerHTML = `Players:<br>`;
            p1.name = "P1";
            p2.name = "P2";
        }
        visibleControl(myMenu.everything, 1, "block");
        visibleControl(optMenu.everything, 0, "none");
        renderer.setAnimationLoop(menuLoop);
    });

    optMenu.volumeUpBut.addEventListener("click", function () {
        mode.volume += 0.1;
        if (mode.volume > 1)
            mode.volume = 1;
        mode.volume = Math.round(mode.volume * 100) / 100;
        Aud.volumeChange(mode.volume);
        optMenu.volumeLabel.textContent = `Volume: %${mode.volume * 100}`
        optMenu.volumeSlider.value = mode.volume * 100;
    });

    optMenu.volumeDownBut.addEventListener("click", function () {
        mode.volume -= 0.1;
        if (mode.volume < 0)
            mode.volume = 0;
        mode.volume = Math.round(mode.volume * 100) / 100;
        Aud.volumeChange(mode.volume);
        optMenu.volumeLabel.textContent = `Volume: %${mode.volume * 100}`
        optMenu.volumeSlider.value = mode.volume * 100;
    });

    optMenu.ballSelection.addEventListener('change', function () {
        const selectedValue = ballSelection.value;
        if (selectedValue === "football")
            ball.texture = soccerBallTexture;
        else if (selectedValue === "basketball")
            ball.texture = basketBallTexture;
    });

    optMenu.volumeSlider.addEventListener('input', function () {
        mode.volume = Math.round(optMenu.volumeSlider.value * 100) / 10000;
        optMenu.volumeLabel.textContent = `Volume: %${Math.floor(mode.volume * 100)}`
        Aud.volumeChange(mode.volume);
    });

    optMenu.darkModeBut.addEventListener('click', function () {
        mode.darkMode = !mode.darkMode;
        if (mode.darkMode)
            optMenu.darkModeText.textContent = "Dark mode: on";
        else
            optMenu.darkModeText.textContent = "Dark mode: off";
        if (mode.darkMode)
        {
            ambientLight.intensity = 0;
            scene.remove(spotLight);
            scene.add(pointLight);
            scene.environment = null;
            scene.background = null;
        }
        else
        {
            scene.environment = mode.background;
            scene.background = mode.background;
            scene.remove(pointLight);
            scene.add(spotLight);       
            ambientLight.intensity = 0.3;
        }
    });
}

function loadSelectElements() {
    select.everything = document.getElementById("select");
    select.oneVsOneBut = document.getElementById("oneVsone");
    select.twoVsTwoBut = document.getElementById("twoVstwo");
    select.vsimpBut = document.getElementById("pVsimp");
    select.tourneyBut = document.getElementById("tourney");
    select.backBut = document.getElementById("backSelect");

    select.oneVsOneBut.addEventListener('click', function () {
        modeSingle = false;
        modeFour = false;
        mode.inSelect = false;
        mode.inGame = true;
        visibleControl(select.everything, false, "none");
        startGame();
    });

    select.twoVsTwoBut.addEventListener('click', function () {
        modeSingle = false;
        modeFour = true;
        mode.inSelect = false;
        mode.inGame = true;
        visibleControl(select.everything, false, "none");
        startGame();
    });

    select.vsimpBut.addEventListener('click', function () {
        modeSingle = true;
        modeFour = false;
        mode.inSelect = false;
        mode.inGame = true;
        visibleControl(select.everything, false, "none");
        startGame();
    });

    select.tourneyBut.addEventListener('click', function () {
        modeSingle = false;
        modeFour = false;
        mode.inTourney = true;
        mode.inSelect = false;
        tourney.inputBox.style.display = "block";
        tourney.submitButton.style.display = "block";
        tourney.lockBut.style.display = "block";
        tourney.backToSelectBut.style.display = "block";
        sceneTransition(select.everything, tourney.everything);
    });

    select.backBut.addEventListener('click', function () {
        sceneTransition(select.everything, myMenu.everything);
    });
}

function loadTourneyElements() {
    tourney.everything = document.getElementById("Tourney");
    tourney.lockBut = document.getElementById("lockBut");
    tourney.statusText = document.getElementById("statusTourney");
    tourney.inPlayers = document.getElementById("inPlayers");
    tourney.backToSelectBut = document.getElementById("backToSelect");
    tourney.lockBut.addEventListener("click", function () {
        tourney.statusText.style.display = "block";
        if (tourney.playerArray.length < 3) {
            tourney.statusText.innerText = `Please submit ${3 - tourney.playerArray.length} more players.`;
            return;
        }
        mode.isTourney = true;
        matchMaker();
        tourney.inputBox.style.display = "none";
        tourney.submitButton.style.display = "none";
        tourney.lockBut.style.display = "none";
        tourney.startTourneyBut.style.display = "block";
        tourney.statusText.innerText = `Match ${tourney.MatchArray[0].id}: ${tourney.MatchArray[0].leftSide} vs ${tourney.MatchArray[0].rightSide}`;
        if (tourney.MatchArray.length > 1)
            tourney.inPlayers.innerHTML = `Following Matches: ${announceNextMatches()}`;
        else
            tourney.inPlayers.innerHTML = "";
    });

    tourney.backToSelectBut.addEventListener("click", function () {
        tourney.playerArray = [];
        tourney.MatchArray = [];
        tourney.inPlayers.innerHTML = `Players:<br>`;
        p1.name = "P1";
        p2.name = "P2";
        sceneTransition(tourney.everything, select.everything);
    });
    tourney.submitButton.addEventListener("click", function () {
        if (tourney.inputBox.value == "")
            return;
        if (tourney.inputBox.value.length > 12) {
            tourney.statusText.innerText = "Player name is too long";
            tourney.statusText.style.display = "block";
            return;
        }
        if (!(/^[\x20-\x7E]*$/.test(tourney.inputBox.value))) {
            tourney.statusText.innerText = "Unsupported characters found";
            tourney.statusText.style.display = "block";
            return;
        }
    
        if (tourney.playerArray.length == 8) {
            tourney.statusText.innerText = "Maximum number of players are 8.";
            tourney.statusText.style.display = "block";
            tourney.inputBox.value = "";
            return;
        }
        tourney.playerArray.push(tourney.inputBox.value);
        tourney.inPlayers.innerHTML += tourney.inputBox.value + "<br>";
        tourney.inPlayers.style.display = "block";
        tourney.inputBox.value = "";
    });
    
    
    tourney.startTourneyBut.addEventListener("click", function () {
        visibleControl(tourney.everything, false, "none");
        playNextMatch();
    });    
}

function loadElements()
{
    loadMenuElements();
    loadSettingsElements();
    loadSelectElements();
    loadTourneyElements();
    loadEndElements();
    loadScoreElements();
}

function announceNextMatches() {
    let i = 1;
    let text = "";
    while (i < tourney.MatchArray.length) {
        text += `<br>Match ${tourney.MatchArray[i].id}: ${tourney.MatchArray[i].leftSide} vs ${tourney.MatchArray[i].rightSide}`;
        i++;
    }
    console.log(text);
    return text;
}

function loadEndElements() {
    end.winner = document.getElementById("winner");
    end.nextBut = document.getElementById("nextMatchBut");
    end.champ = document.getElementById("champ");
    end.backBut = document.getElementById("endBackBut");

    end.nextBut.addEventListener("click", function () {
        end.nextBut.style.display = "none";
        end.winner.style.display = "none";
        end.champ.style.display = "none";
        end.backBut.style.display = "none";
        tourney.inPlayers.style.display = "none";
        playNextMatch();
    });
    end.backBut.addEventListener("click", function () {
        mode.isTourney = false;
        end.champ.style.display = "none";
        end.nextBut.style.display = "none";
        tourney.playerArray = [];
        tourney.MatchArray = [];
        tourney.inPlayers.innerHTML = `Players:<br>`;
        p1.name = "P1";
        p2.name = "P2";
        end.winner.style.display = "none";
        end.backBut.style.display = "none";
        sceneTransition(myMenu.everything, myMenu.everything);
        renderer.setAnimationLoop(menuLoop);
    });
}

function loadScoreElements() {
    board.scoreLeft = document.getElementById("leftScore");
    board.scoreRight = document.getElementById("rightScore");
}

//--------------------------------------------------------------------------------------------//
//---------------------BACKEND----------------------------------------------------------------//



async function handleLogout() {

    try {
        // Çıkış işlemi için API isteği gönderiyoruz
        const response = await fetch('/accounts/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'  // Cookie'lerin gönderilmesini sağlamak için
        });

        const data = await response.json();

        fullClean();
        route(null, "/");

    } catch (error) {
        console.log("Error logging out:", error);
        fullClean();
        route(null, "/");
    }


}

async function  getProfile()
{
    try {
        const gameResponse = await fetch('/accounts/get_profile/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (gameResponse.ok) {
            const data = await gameResponse.json();
            if (data.status === 'error')
            {
                console.log("error testi");
                return;
            }
            // Kullanıcı bilgilerini göster
            if (data.user) {
                document.getElementById('username').textContent = data.user.username || 'N/A';
                document.getElementById('userEmail').textContent = data.user.email || 'N/A';
                document.getElementById('userName').textContent = `${data.user.name || ''} ${data.user.surname || ''}`;
                if (data.user.avatar) {
                    document.getElementById('userAvatar').src = "https://" + data.user.avatar.slice(10);
                }
            }
        }
    } catch (error) {
        console.log("Error loading profile:", error);
    }
}

//--------------------------------------------------------------------------------------------//
//---------------------BACKEND----------------------------------------------------------------//


// Create scene, camera, and renderer
function    initiateGlobals()
{
    p1 = new Player('P1', 0);
    p2 = new Player('P2', 0);
    p3 = new Player('Blank', 0);
    p4 = new Player('Khonvoum', 0);
    bot = new Bot();
    ball = new Ball('orange');
    Aud = new AuMan();
    cam = new Camera();
    select = new MENU.selectMenu();
    mode = new MENU.Mode();
    optMenu = new MENU.optionsMenu();
    tourney = new MENU.tourneyMenu();
    board = new MENU.scoreBoard();
    end = new MENU.endScreen();
    myMenu = new MENU.mainMenu();

    scene = new THREE.Scene();
    mainMenu = new THREE.Scene();
    optionsMenu = new THREE.Scene();
    gameEnd = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.autoClear = true; // Ensures the canvas is cleared before rendering
    renderer.shadowMap.enabled = true;
    textureLoader = new THREE.TextureLoader();
    soccerBallTexture = textureLoader.load('../images/ball.jpg')
    basketBallTexture = textureLoader.load('../images/basketball.png')
    ball.texture = soccerBallTexture;
    pointLight = new THREE.SpotLight(0xffffff, 1000);  // Color, intensity, distance
    pointLight.position.set(0, 60, 0); // Position the light
    pointLight.angle = Math.PI / 3; // Cone angle (in radians)
    pointLight.penumbra = 0.2; // Soft edges
    //spotLight.decay = 2; // Light decay
    pointLight.distance = 200; // Maximum range of the light

    // Step 2: Enable Shadows
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 4096; // Shadow map resolution
    pointLight.shadow.mapSize.height = 4096;
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 400;

    // Step 3: Add the Spotlight to the Scene
    scene.add(pointLight);

    // Optional: Add a Spotlight Helper
    //pointLightHelper = new THREE.SpotLightHelper(pointLight);
    //scene.add(pointLightHelper);
    ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // White light with intensity 1
    scene.add(ambientLight);
    document.body.appendChild(renderer.domElement);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    Aud.volumeChange(mode.volume);

    //Spot light
    // Step 1: Create a Spotlight
    spotLight = new THREE.SpotLight(0xffffff, 30000); // White light, intensity of 1
    spotLight.position.set(0, 150, -100); // Position the light
    spotLight.angle = Math.PI / 2.5; // Cone angle (in radians)
    spotLight.penumbra = 0.2; // Soft edges
    //spotLight.decay = 2; // Light decay
    spotLight.distance = 400; // Maximum range of the light

    // Step 2: Enable Shadows
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 512; // Shadow map resolution
    spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 400;

    // Step 3: Add the Spotlight to the Scene
    scene.add(spotLight);

    // Optional: Add a Spotlight Helper
    spotLightHelper = new THREE.SpotLightHelper(spotLight);
    //scene.add(spotLightHelper);

    modeFour = false;
    modeSingle = false;
    cam.camera.position.y = 100;
    cam.camera.lookAt(0, 0, 0);

    renderer.setAnimationLoop(menuLoop);  // Start the animation loop
    resizeRenderer();
    //loadEXREnvironment();
    initiateTourney();
    skybox = new THREE.TextureLoader();
    skybox.load(
        '../images/kloppenheim_02_puresky_4k.png',
        function (texture) {
            // Apply the texture as the environment map or background
            scene.background = texture;
            scene.environment = texture;
            mainMenu.background = texture;
            mainMenu.environment = texture;
            mode.background = texture;

            // You can apply transformations to this PNG texture as needed
        },
        undefined, // progress callback
        function (error) {
            console.log('Error loading PNG:', error);
        }
    );
    flag = false;
    cam.camera.rotateX(Math.PI / 2);
    clock = new THREE.Clock();

    fpsDisplay = document.getElementById('fps-counter');

    // KEY PRESS MIMIC
    upArrowKeyDown = new KeyboardEvent("keydown", {
        key: "ArrowUp",
        code: "ArrowUp",
        keyCode: 38,
        which: 38,
        bubbles: true,
        cancelable: true
    });

    // Create KeyboardEvent for Up Arrow key (keyup)
    upArrowKeyUp = new KeyboardEvent("keyup", {
        key: "ArrowUp",
        code: "ArrowUp",
        keyCode: 38,
        which: 38,
        bubbles: true,
        cancelable: true
    });

    // Create KeyboardEvent for Down Arrow key (keydown)
    downArrowKeyDown = new KeyboardEvent("keydown", {
        key: "ArrowDown",
        code: "ArrowDown",
        keyCode: 40,
        which: 40,
        bubbles: true,
        cancelable: true
    });

    // Create KeyboardEvent for Down Arrow key (keyup)
    downArrowKeyUp = new KeyboardEvent("keyup", {
        key: "ArrowDown",
        code: "ArrowDown",
        keyCode: 40,
        which: 40,
        bubbles: true,
        cancelable: true
    });

    logoutButton = document.getElementById("logoutBut");
}
let p1;
let p2;
let p3;
let p4;
let bot;
let ball;
let Aud;
let cam;
let select;
let mode;
let optMenu;
let tourney;
let board;
let end ;
let myMenu;

let logoutButton;


let canvas;
let scene;
let mainMenu;
let optionsMenu;
let gameEnd;
let renderer;
let textureLoader;
let soccerBallTexture;
let basketBallTexture;
let pointLight;
let ambientLight;
let loadedFont;
let spotLight;
let spotLightHelper;
let plane;

let modeFour;
let modeSingle;

let skybox;
let lastTime = 0; // Tracks the last time the loop   ran
let flag;
let clock;
let fpsDisplay;

// KEY PRESS MIMIC
let upArrowKeyDown;
let upArrowKeyUp;
let downArrowKeyDown
let downArrowKeyUp;

let leftWall;
let rightWall;
let topWall;
let bottomWall;
let animationRequestId;

//const originalZPosition = cam.camera.position.z;
// Function to resize and center the canvas
/*function resizeRenderer() {
    const targetAspect = 16 / 9; // Target aspect ratio (16:9)

    // Determine the maximum size for the renderer while preserving the aspect ratio
    let width = window.innerWidth;
    let height = window.innerHeight;

    if (width / height > targetAspect) {
        // Window is too wide, adjust width
        width = height * targetAspect;
    } else {
        // Window is too tall, adjust height
        height = width / targetAspect;
    }

    // Set the renderer size
    renderer.setSize(width, height);

    // Center canvas
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = `${(window.innerHeight - height) / 2}px`;
    renderer.domElement.style.left = `${(window.innerWidth - width) / 2}px`;


    // Update camera aspect ratio
    cam.camera.aspect = targetAspect;
    cam.camera.updateProjectionMatrix();
}*/

/*const baseFOV = 75; // Default FOV
const adjustFOV = () => {
  const aspect = window.innerWidth / window.innerHeight;
  cam.camera.fov = baseFOV / aspect; // Adjust FOV proportionally
  console.log(cam.camera.fov);
  cam.camera.updateProjectionMatrix();
};

function resizeRenderer()
{
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.left = "0%";
    renderer.domElement.style.top = "0%";
    adjustFOV();
}*/

function resizeRenderer() {
    // Update canvas dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    //console.log("width", width, "height", height);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.left = "0%";
    renderer.domElement.style.top = "0%";
    // Update renderer
    renderer.setSize(width, height);

    // Update camera aspect ratio and projection matrix
    cam.camera.aspect = width / height;
    cam.camera.updateProjectionMatrix();
}


// Initial resize and on window resize


function loadEXREnvironment() {
    const exrLoader = new EXRLoader();
    exrLoader.setDataType(THREE.FloatType);
    exrLoader.load(
        '../images/kloppenheim_02_puresky_4k.exr',
        function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;

            // Set the environment map
            mainMenu.environment = texture;

            // If you want to use it as background too
            mainMenu.background = texture;

            // Optional: create a PMREMGenerator for better performance
            const pmremGenerator = new THREE.PMREMGenerator(renderer);
            pmremGenerator.compileEquirectangularShader();

            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            mainMenu.environment = envMap;
            //scene.environment = envMap;

            // If you want the background too
            mainMenu.background = envMap;
            //scene.background = envMap;

            // Clean up
            texture.dispose();
            pmremGenerator.dispose();

        },

        // Progress callback
        function (progress) {
            console.log('Loading: ', (progress.loaded / progress.total * 100) + '%');
        },
        // Error callback
        function (error) {
            console.log('Error loading EXR:', error);
        }
    );
}

function initiateTourney() {
    tourney.inputBox = document.getElementById("userInput");
    tourney.submitButton = document.getElementById("submitBut");
    tourney.startTourneyBut = document.getElementById("startTourneyBut");
}

function winScreen() {
    let tmpWinner = "";

    if (p1.score == 3) {
        end.winner.innerText = p1.name + " Wins!";
        tmpWinner = p1.name;
    }
    else {
        end.winner.innerText = p2.name + " Wins!";
        tmpWinner = p2.name;
    }
    end.winner.style.display = "block";
    end.backBut.style.display = "block";
    board.scoreLeft.style.display = "none";
    board.scoreRight.style.display = "none";
    if (mode.isTourney) {
        tourney.playerArray.push(tmpWinner);
        end.nextBut.style.display = "block";
        end.champ.style.display = "block";
        if (tourney.MatchArray.length < 1) {
            if (tourney.playerArray.length >= 2)
                matchMaker();
        }
        if (tourney.MatchArray.length > 0) {
            end.champ.innerText = `Match ${tourney.MatchArray[0].id}: ${tourney.MatchArray[0].leftSide} vs ${tourney.MatchArray[0].rightSide}`;
            if (tourney.MatchArray.length > 1) {
                tourney.inPlayers.style.display = "block";
                tourney.inPlayers.innerHTML = `Following Matches: ${announceNextMatches()}`;
            }
            else
                tourney.inPlayers.style.display = "none";
        }
        if (tourney.MatchArray.length < 1 && tourney.playerArray.length <= 1) {
            end.champ.style.display = "block";
            end.champ.innerText = "Tourney is over!";
            end.nextBut.style.display = "none";
        }
    }
    cleanGameObj();
}

async function menuLoop() {
    animationRequestId = renderer.render(mainMenu, cam.camera);
}

async function optionsLoop() {
    animationRequestId = renderer.render(optionsMenu, cam.camera);
}


async function endLoop() {
    animationRequestId = renderer.render(gameEnd, cam.camera);
}

async function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime; // Time difference between frames
    lastTime = currentTime;
    const elapsedTime = clock.getElapsedTime();
    const fps = Math.round(1000 / deltaTime);

    fpsDisplay.textContent = `FPS: ${fps}`
    // Change color based on elapsed time
    if (optMenu.leftRainbow)
    {
        p1.pad.material.color.setHSL(((elapsedTime / 8) % 100), 1, 0.5);
    }
    if (optMenu.rightRainbow)
        p2.pad.material.color.setHSL(((elapsedTime / 8) % 100), 1, 0.5);

    update(deltaTime); // Update game state
    render();          // Render the game
}

export function fullClean()
{
    if (canvas) {
        canvas.remove();
    }
    if (renderer && renderer.dispose) {
        renderer.dispose();
    }
    if (animationRequestId !== null) {
        cancelAnimationFrame(animationRequestId);
        animationRequestId = null;  // Reset the request ID after stopping
        console.log("Rendering loop stopped");
    }
    if (!mode || !mode.gameMeshesCreated)
        return;

    if (mainMenu.environment) {
        mainMenu.environment.dispose();
        mainMenu.environment = null;
        scene.environment = null;
    }
    
    if (mainMenu.background) {
        mainMenu.background.dispose();
        mainMenu.background = null;
        scene.background = null;
    }

    disposer(p1.pad, scene);
    disposer(p2.pad, scene);
    disposer(p3.pad, scene);
    disposer(p4.pad, scene);
    disposer(ball.sphere, scene);
    disposer(plane, scene);
    disposer(leftWall, scene);
    disposer(rightWall, scene);
    disposer(topWall, scene);
    disposer(bottomWall, scene);
    
    mode.gameMeshesCreated = false;  // Ensure the state is reset
    console.log("Game fully cleaned.");
}

function disposer(obj, scene) {
    if (!obj || !scene)
        return;
    if (obj.geometry)
        obj.geometry.dispose();
    if (obj.material)
        obj.material.dispose();
    if (obj.material.map) {
        obj.material.map.dispose();
    }

    scene.remove(obj);
}

function cleanGameObj() {
    disposer(p1.pad, scene);
    disposer(p2.pad, scene);
    if (p3.geometry)
        disposer(p3.pad, scene);
    if (p4.geometry)
        disposer(p4.pad, scene);
    disposer(ball.sphere, scene);
    p1.score = 0;
    p2.score = 0;
}

function initiateP1(canvas) {
    p1.Width = 10;
    p1.Height = 10;
    if (modeFour)
        p1.Depth = 30;
    else
        p1.Depth = 50;
    p1.geometry = new THREE.BoxGeometry(p1.Width, p1.Height, p1.Depth);
    if (mode.darkMode)
        p1.material = new THREE.MeshBasicMaterial({ color: optMenu.leftPadColor })
    else
    {
        p1.material = new THREE.MeshStandardMaterial({ color: optMenu.leftPadColor })
    }
    p1.pad = new THREE.Mesh(p1.geometry, p1.material);
    p1.pad.castShadow = true;
    p1.pad.receiveShadow = true;
    p1.pad.position.x = -190;
    p1.pad.position.y = 20;
    p1.maxX = -40;
    if (modeFour) {
        p1.pad.position.z = -45
        p1.maxZ = 0;
    }
    else {
        p1.pad.position.z = 0;
        p1.maxZ = 115;
    }
    scene.add(p1.pad);
}

function initiateP2(canvas) {
    p2.Width = 10;
    p2.Height = 10;
    if (modeFour)
        p2.Depth = 30;
    else
        p2.Depth = 50;
    if (modeSingle)
        p2.name = "Bot";
    p2.geometry = new THREE.BoxGeometry(p2.Width, p2.Height, p2.Depth);
    if (mode.darkMode)
        p2.material = new THREE.MeshBasicMaterial({ color: optMenu.rightPadColor });
    else
        p2.material = new THREE.MeshStandardMaterial({ color: optMenu.rightPadColor });
    p2.pad = new THREE.Mesh(p2.geometry, p2.material);
    p2.pad.position.x = 189;
    p2.pad.position.y = 20;
    p2.pad.castShadow = true;
    p2.pad.receiveShadow = true;
    p2.minX = 39;
    if (modeFour) {
        p2.pad.position.z = -45;
        p2.maxZ = 0;
    }
    else {
        p2.pad.position.z = 0;
        p2.maxZ = 115;
    }
    scene.add(p2.pad);
}

function initiatePlane(canvas) {
    if (mode.gameInitialized)
        return;
    let geo;
    let mat;
    let plane;

    geo = new THREE.BoxGeometry(410, 1, 229);
    mat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    plane = new THREE.Mesh(geo, mat);
    plane.material.transparent = true;
    plane.material.opacity = 0.4;
    plane.material.color.setHSL(60, 1, 0.5);
    plane.position.x = -1;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);
}

function initiateP3(canvas) {
    if (!modeFour)
        return;
    p3.Width = 10;
    p3.Height = 10;
    p3.Depth = 30;
    p3.geometry = new THREE.BoxGeometry(p3.Width, p3.Height, p3.Depth);
    p3.pad = new THREE.Mesh(p3.geometry, p1.material);
    p3.pad.castShadow = true;
    p3.pad.receiveShadow = true;
    p3.pad.position.x = -190;
    p3.pad.position.y = 20;
    p3.pad.position.z = 44;
    p3.maxX = -40;
    p3.minZ = 0;
    scene.add(p3.pad);
}

function initiateP4(canvas) {
    if (!modeFour)
        return;
    p4.Width = 10;
    p4.Height = 10;
    p4.Depth = 30;
    p4.geometry = new THREE.BoxGeometry(p4.Width, p4.Height, p4.Depth);
    p4.pad = new THREE.Mesh(p4.geometry, p2.material);
    p4.minX = 39;
    p4.pad.castShadow = true;
    p4.pad.receiveShadow = true;
    p4.pad.position.x = 189;
    p4.pad.position.y = 20;
    p4.pad.position.z = 44;
    p4.minZ = 0;
    scene.add(p4.pad);
}

function initiateBot() {
    if (!modeSingle)
        return;
    bot.dirX = ball.dirX;
    bot.dirZ = ball.dirZ;
    bot.speed = ball.speed;
    bot.ballZ = ball.sphere.position.z;
    bot.padZ = p2.pad.position.z;
    bot.padSpeed = p2.speed;
}

function initiateBall(canvas) {

    if (Math.random() <= 0.5)
        ball.dirX = 1;
    else
        ball.dirX = -1;
    if (Math.random() <= 0.5)
        ball.dirZ = 1;
    else
        ball.dirZ = -1;

    ball.geometry = new THREE.SphereGeometry(ball.Radius, ball.widthSegments, ball.heightSegments);
    ball.material = new THREE.MeshStandardMaterial({ map: ball.texture });
    ball.sphere = new THREE.Mesh(ball.geometry, ball.material);
    ball.sphere.position.z = Math.floor(Math.random() * 230) - 115;
    ball.sphere.position.x = 0;
    ball.sphere.position.y = 20;
    ball.sphere.castShadow = true;
    ball.sphere.receiveShadow = true;
    scene.add(ball.sphere);
    console.log(ball.sphere.position.x);
}

function updateScores() {
    board.scoreLeft.innerText = `${p1.name}: ${p1.score}`;
    board.scoreRight.innerText = `${p2.name}: ${p2.score}`;
}

function initiateScoreBoard() {
    updateScores();
    board.scoreLeft.style.display = "block";
    board.scoreRight.style.display = "block";
}

function makeWall() {
    if (mode.gameInitialized)
        return;
    let material;
    if (mode.darkMode)
        material = new THREE.MeshBasicMaterial({ color: optMenu.colorWall });
    else
        material = new THREE.MeshStandardMaterial({ color: optMenu.colorWall })
    let vertGeo = new THREE.BoxGeometry(10, 50, 250);
    let horiGeo = new THREE.BoxGeometry(415, 50, 10);
    leftWall = new THREE.Mesh(vertGeo, material);
    rightWall = new THREE.Mesh(vertGeo, material);
    topWall = new THREE.Mesh(horiGeo, material);
    bottomWall = new THREE.Mesh(horiGeo, material);

    leftWall.position.x = -211;
    rightWall.position.x = 209;
    topWall.position.z = -120;
    bottomWall.position.z = 119;
    topWall.castShadow = true;
    topWall.receiveShadow = true;
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    bottomWall.castShadow = true;
    bottomWall.receiveShadow = true;
    scene.add(leftWall);
    scene.add(rightWall);
    scene.add(topWall);
    scene.add(bottomWall);
}

function checkCollision() {
    //P1
    if (p1.pad.position.x - p1.Width / 2 < p1.minX)
        p1.pad.position.x = p1.minX + p1.Width / 2;
    if (p1.pad.position.x + p1.Width / 2 > p1.maxX)
        p1.pad.position.x = p1.maxX - p1.Width / 2;

    if (p1.posX < p1.minX)
        p1.posX = p1.minX;
    if (p1.pad.position.z - p1.Depth / 2 < p1.minZ)
        p1.pad.position.z = p1.minZ + p1.Depth / 2;
    if (p1.pad.position.z + p1.Depth / 2 > p1.maxZ)
        p1.pad.position.z = p1.maxZ - p1.Depth / 2;

    //P2
    if (p2.pad.position.x - p2.Width / 2 < p2.minX)
        p2.pad.position.x = p2.minX + p2.Width / 2;
    if (p2.pad.position.x + p2.Width / 2 > p2.maxX)
        p2.pad.position.x = p2.maxX - p2.Width / 2;

    if (p2.posX < p2.minX)
        p2.posX = p2.minX;
    if (p2.pad.position.z - p2.Depth / 2 < p2.minZ)
        p2.pad.position.z = p2.minZ + p2.Depth / 2;
    if (p2.pad.position.z + p2.Depth / 2 > p2.maxZ)
        p2.pad.position.z = p2.maxZ - p2.Depth / 2;
    if (!modeFour)
        return;
    //P3
    if (p3.pad.position.x - p3.Width / 2 < p3.minX)
        p3.pad.position.x = p3.minX + p3.Width / 2;
    if (p3.pad.position.x + p3.Width / 2 > p3.maxX)
        p3.pad.position.x = p3.maxX - p3.Width / 2;
    if (p3.posX < p3.minX)
        p3.posX = p3.minX;
    if (p3.pad.position.z - p3.Depth / 2 < p3.minZ)
        p3.pad.position.z = p3.minZ + p3.Depth / 2;
    if (p3.pad.position.z + p3.Depth / 2 > p3.maxZ)
        p3.pad.position.z = p3.maxZ - p3.Depth / 2;

    //P4
    if (p4.pad.position.x - p4.Width / 2 < p4.minX)
        p4.pad.position.x = p4.minX + p4.Width / 2;
    if (p4.pad.position.x + p4.Width / 2 > p4.maxX)
        p4.pad.position.x = p4.maxX - p4.Width / 2;
    if (p4.posX < p4.minX)
        p4.posX = p4.minX;
    if (p4.pad.position.z - p4.Depth / 2 < p4.minZ)
        p4.pad.position.z = p4.minZ + p4.Depth / 2;
    if (p4.pad.position.z + p4.Depth / 2 > p4.maxZ)
        p4.pad.position.z = p4.maxZ - p4.Depth / 2;
}

function collideP1() {
    if (ball.sphere.position.x - ball.Radius / 2 <= p1.pad.position.x + p1.Width && p1.pad.position.x + p1.Width / 2 <= ball.sphere.position.x && ball.sphere.position.z + ball.Radius / 2 >= p1.pad.position.z - p1.Depth / 2 && ball.sphere.position.z - ball.Radius / 2 <= p1.pad.position.z + p1.Depth / 2) {
        return true;
    }
    else
        return false;
}

function collideP3() {
    if (ball.sphere.position.x - ball.Radius / 2 <= p3.pad.position.x + p3.Width && p3.pad.position.x + p3.Width / 2 <= ball.sphere.position.x && ball.sphere.position.z + ball.Radius / 2 >= p3.pad.position.z - p3.Depth / 2 && ball.sphere.position.z - ball.Radius / 2 <= p3.pad.position.z + p3.Depth / 2) {
        return true;
    }
    else
        return false;
}

function collideP2() {
    if (ball.sphere.position.x + ball.Radius / 2 >= p2.pad.position.x - p2.Width && p2.pad.position.x - p2.Width / 2 >= ball.sphere.position.x && ball.sphere.position.z + ball.Radius / 2 >= p2.pad.position.z - p2.Depth / 2 && ball.sphere.position.z - ball.Radius / 2 <= p2.pad.position.z + p2.Depth / 2)
        return true;
    else
        return false;
}

function collideP4() {
    if (ball.sphere.position.x + ball.Radius / 2 >= p4.pad.position.x - p4.Width && p4.pad.position.x - p4.Width / 2 >= ball.sphere.position.x && ball.sphere.position.z + ball.Radius / 2 >= p4.pad.position.z - p4.Depth / 2 && ball.sphere.position.z - ball.Radius / 2 <= p4.pad.position.z + p4.Depth / 2)
        return true;
    else
        return false;
}

function checkBallColl() {
    if (ball.sphere.position.x + ball.Radius / 2 < -20 && ball.dirX == -1) {
        if (collideP1() || modeFour && collideP3()) {
            ball.dirX = 1;
            Aud.ping2.play();
        }
    }
    else if (ball.sphere.position.x + ball.Radius / 2 > 20 && ball.dirX == 1) {
        if (ball.sphere.position.x + ball.Radius / 2 >= p2.pad.position.x - p2.Width / 2 && ball.flag) {
            ball.flag = false;
        }
        if (collideP2() || (modeFour && collideP4())) {
            ball.dirX = -1;
            Aud.ping2.play();
        }
    }

    if (ball.sphere.position.z - ball.Radius / 2 < ball.minZ) {
        ball.sphere.position.z = ball.minZ + ball.Radius / 2;
        ball.dirZ *= -1;
        Aud.ping3.play();
    }
    if (ball.sphere.position.z + ball.Radius / 2 > ball.maxZ) {
        ball.sphere.position.z = ball.maxZ - ball.Radius / 2;
        ball.dirZ *= -1;
        Aud.ping4.play();
    }
    if (ball.sphere.position.x + ball.Radius / 2 <= ball.minX || ball.sphere.position.x >= ball.maxX) {
        if (ball.sphere.position.x > 0)
            p1.score++;
        else
            p2.score++;
        updateScores();
        Aud.lose.play();
        if (Math.random() <= 0.5)
            ball.dirX = 1;
        else
            ball.dirX = -1;
        if (Math.random() <= 0.5)
            ball.dirZ = 1;
        else
            ball.dirZ = -1;
        ball.speed = 0.1;
        ball.sphere.position.x = ball.startX;
        ball.sphere.position.z = ball.startZ;
        if (p1.score == 3 || p2.score == 3) {
            cam.camera.position.y = 100;
            winScreen();
            renderer.setAnimationLoop(endLoop);
        }
        else
            ball.freeze = true;
    }
}

function ballUpdate(deltaTime) {
    if (ball.freeze) {
        ball.counter += deltaTime;
        if (ball.counter > 3000) {
            ball.freeze = false;
            ball.speed = 0.1;
            ball.counter = 0;
        }
        return;
    }
    ball.sphere.rotation.x += 0.001 * deltaTime;
    ball.sphere.rotation.y += 0.001 * deltaTime;
    ball.sphere.position.x += ball.dirX * ball.speed * deltaTime;
    ball.sphere.position.z += ball.dirZ * ball.speed * deltaTime;
    ball.speed += 0.00001 * deltaTime;
    checkBallColl();
}

function movementUpdate(deltaTime, player) {

    if (player.movUp) {
        player.pad.position.z -= player.speed * deltaTime;
    }

    if (player.movLeft) {
        player.pad.position.x -= player.speed * deltaTime;
    }

    if (player.movRight) {
        player.pad.position.x += player.speed * deltaTime;
    }

    if (player.movDown) {
        player.pad.position.z += player.speed * deltaTime;
    }
}

function movementCam(deltaTime) {
    const forward = new THREE.Vector3();
    if (cam.lookUp) {
        cam.camera.rotateX(0.001 * deltaTime);
    }
    if (cam.lookDown) {
        cam.camera.rotateX(-0.001 * deltaTime);
    }
    if (cam.lookLeft) {
        cam.camera.rotateY(0.001 * deltaTime);
    }
    if (cam.lookRight) {
        cam.camera.rotateY(-0.001 * deltaTime);
    }

    if (cam.movUp) {
        cam.camera.getWorldDirection(forward);
        cam.camera.position.x += forward.x * cam.speed * deltaTime; // Move forward
        cam.camera.position.y += forward.y * cam.speed * deltaTime; // Adjust if needed for vertical movement
        cam.camera.position.z += forward.z * cam.speed * deltaTime;
    }

    if (cam.movDown) {
        cam.camera.getWorldDirection(forward);
        cam.camera.position.x -= forward.x * cam.speed * deltaTime; // Move forward
        cam.camera.position.y -= forward.y * cam.speed * deltaTime; // Adjust if needed for vertical movement
        cam.camera.position.z -= forward.z * cam.speed * deltaTime;
    }

    if (cam.movLeft) {
        cam.camera.getWorldDirection(forward);
        cam.camera.position.y += -forward.x * cam.speed * deltaTime
        cam.camera.position.x += forward.y * cam.speed * deltaTime;
    }

    if (cam.movRight) {
        cam.camera.getWorldDirection(forward);
        cam.camera.position.y -= -forward.x * cam.speed * deltaTime
        cam.camera.position.x -= forward.y * cam.speed * deltaTime;
    }
}

function solveQuadratic(a, b, c) {
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
        return "No real solutions"; // Handle the case for negative discriminant
    }
    const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    return root1; // Return both roots
}

function calculateZ(dist) {
    if (bot.dirZ < 0) {
        if (bot.ballZ + dist < -110) {
            bot.bounceCount = Math.floor(((-dist) + (-110 - bot.ballZ)) / 219);
            if (bot.bounceCount % 2 == 0) {
                bot.targetZ = -110 + (-dist + (-110 - bot.ballZ) - (219 * bot.bounceCount));
                bot.dirZ *= -1;
            }
            else
                bot.targetZ = 109 - (-dist + (-110 - bot.ballZ) - (219 * bot.bounceCount));
        }
        else
            bot.targetZ = bot.ballZ + dist;
    }
    else {
        if (bot.ballZ - dist > 109) {
            bot.bounceCount = Math.floor(((-dist) - (109 - bot.ballZ)) / 219);
            if (bot.bounceCount % 2 == 0) {
                bot.targetZ = 109 - (-dist - (109 - bot.ballZ) - (219 * bot.bounceCount));
                bot.dirZ *= -1;
            }
            else
                bot.targetZ = -110 + (-dist - (109 - bot.ballZ) - (219 * bot.bounceCount));
        }
        else
            bot.targetZ = bot.ballZ - dist;
    }

    if (bot.targetZ - p2.Width < -110)
        bot.targetZ = -110 + p2.Width;
    else if (bot.targetZ + p2.Width > 109)
        bot.targetZ = 109 - p2.Width;

    bot.timeMove = Math.abs(bot.padZ - bot.targetZ) / (bot.padSpeed * 1000);
    bot.clock2 = 0;
}

function updateBot() {
    bot.ballX = ball.sphere.position.x;
    bot.ballZ = ball.sphere.position.z;
    bot.dirX = ball.dirX;
    bot.dirZ = ball.dirZ;
    bot.speed = ball.speed;
    bot.padZ = p2.pad.position.z;
    bot.calculate = true;
}

function impBot(deltaTime) {
    let dist;
    if (ball.freeze || bot.clock > 0) {
        bot.clock = -3000;
        return;
    }
    bot.clock += deltaTime;
    bot.clock2 += deltaTime;
    bot.clock3 += deltaTime;
    bot.speed += 0.00001 * deltaTime;
    if (bot.clock3 > 1000) {
        updateBot();
        bot.clock3 = 0;
    }
    if (bot.calculate) {
        if (bot.dirX > 0)
            dist = -(174 - bot.ballX);
        else
            dist = ((-175 - bot.ballX) - 349);
        calculateZ(dist);
        bot.timeHit = solveQuadratic(5, (bot.speed * 1000), dist);
        bot.calculate = false;
        bot.dirX = -1;
    }

    if (bot.padZ < bot.targetZ && bot.clock2 < bot.timeMove) {
        document.dispatchEvent(downArrowKeyDown);
    }
    else if (bot.padZ > bot.targetZ && bot.clock2 < bot.timeMove) {
        document.dispatchEvent(upArrowKeyDown);
    }
    else if (bot.clock2 >= bot.timeMove * 1000) {
        document.dispatchEvent(upArrowKeyUp);
        document.dispatchEvent(downArrowKeyUp);
    }

    if (bot.clock >= bot.timeHit * 1000) {
        bot.ballX = 174;
        bot.clock = 0;
        bot.clock2 = 0;
        bot.ballZ = bot.targetZ;
        bot.calculate = true;
        bot.padZ = bot.targetZ;
    }
}

function update(deltaTime) {
    movementCam(deltaTime);
    movementUpdate(deltaTime, p1);
    if (modeSingle) {
        impBot(deltaTime);
    }
    movementUpdate(deltaTime, p2);
    if (modeFour == true) {
        movementUpdate(deltaTime, p3);
        movementUpdate(deltaTime, p4);
    }
    checkCollision();
    ballUpdate(deltaTime);
}

// Render the game
function render() {
    animationRequestId =  renderer.render(scene, cam.camera);
}

function p1KeyDown(event) {
    if (event.key === 'w') {
        p1.movUp = true;
    }

    if (event.key === 'a') {
        //p1.movLeft = true;
    }

    if (event.key === 'd') {
        //p1.movRight = true;
    }

    if (event.key === 's') {
        p1.movDown = true;
    }
}

function p2KeyDown(event) {
    if (event.key === 'ArrowUp') {
        p2.movUp = true;
    }

    if (event.key === 'ArrowLeft') {
        //p2.movLeft = true;
    }

    if (event.key === 'ArrowRight') {
        //p2.movRight = true;
    }

    if (event.key === 'ArrowDown') {
        p2.movDown = true;
    }
}

function p3KeyDown(event) {
    if (event.key === 'c')
        p3.movUp = true;
    if (event.key === 'v')
        p3.movDown = true;
}

function p4KeyDown(event) {
    if (event.key === 'o')
        p4.movUp = true;
    if (event.key === 'p')
        p4.movDown = true;
}

function cameraDown(event) {
    const forward = new THREE.Vector3();
    if (event.key === 'ArrowUp') {
        cam.lookUp = true;
    }

    if (event.key === 'ArrowLeft') {
        cam.lookLeft = true;
    }

    if (event.key === 'ArrowRight') {
        cam.lookRight = true;
    }

    if (event.key === 'ArrowDown') {
        cam.lookDown = true;
    }

    if (event.key === 'w') {
        cam.movUp = true;
    }

    if (event.key === 'a') {
        cam.movLeft = true;
    }

    if (event.key === 'd') {
        cam.movRight = true;
    }

    if (event.key === 's') {
        cam.movDown = true;
    }

    if (event.key === 'r') {
        fixCam();
    }

}

function p1KeyUp(event) {
    if (event.key === 'w') {
        p1.movUp = false;
    }

    if (event.key === 'a') {
        //p1.movLeft = false;
    }

    if (event.key === 'd') {
        //p1.movRight = false;
    }

    if (event.key === 's') {
        p1.movDown = false;
    }
}

function p2KeyUp(event) {
    if (event.key === 'ArrowUp') {
        p2.movUp = false;
    }

    if (event.key === 'ArrowLeft') {
        //p2.movLeft = false;
    }

    if (event.key === 'ArrowRight') {
        //p2.movRight = false;
    }

    if (event.key === 'ArrowDown') {
        p2.movDown = false;
    }
}

function p3KeyUp(event) {
    if (event.key === 'c')
        p3.movUp = false;
    if (event.key === 'v')
        p3.movDown = false;
}

function p4KeyUp(event) {
    if (event.key === 'o')
        p4.movUp = false;
    if (event.key === 'p')
        p4.movDown = false;
}

function cameraUp(event) {
    if (event.key === 'ArrowUp') {
        cam.lookUp = false;
        cam.moving = false;
    }

    if (event.key === 'ArrowLeft') {
        cam.lookLeft = false;
        cam.moving = false;
    }

    if (event.key === 'ArrowRight') {
        cam.lookRight = false;
        cam.moving = false;
    }

    if (event.key === 'ArrowDown') {
        cam.lookDown = false;
        cam.moving = false;
    }

    if (event.key === 'w') {
        cam.movUp = false;
    }

    if (event.key === 'a') {
        cam.movLeft = false;
    }

    if (event.key === 'd') {
        cam.movRight = false;
    }

    if (event.key === 's') {
        cam.movDown = false;
    }
}

function changeText(text, mesh, size) {
    let x = mesh.position.x;
    let y = mesh.position.y;
    let z = mesh.position.z;
    let place = mesh.parent;

    place.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
    mesh = createText(text, size, x, y, z, place);
    return mesh;
}

function createText(text, size, x, y, z, place) {
    if (!loadedFont) {
        //console.log("Font not loaded");
        return;
    }

    const textGeometry = new TextGeometry(text, {
        font: loadedFont,
        size: size,
        depth: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5,
    });

    const material = new THREE.MeshBasicMaterial({ color: 0xff6347 });
    const textMesh = new THREE.Mesh(textGeometry, material);

    textMesh.rotation.x = -Math.PI / 2;
    textMesh.position.set(x, y, z);
    place.add(textMesh);
    return textMesh;
}

function fixCam() {
    cam.camera.position.x = 0;
    cam.camera.position.y = 220;
    cam.camera.position.z = 0;
    cam.camera.rotation.set(0, 0, 0);
    cam.camera.lookAt(0, 0, 0);
}

function startGame() {
    cam.camera.position.y = 220;
    lastTime = performance.now();
    renderer.setAnimationLoop(gameLoop);  // Start the animation loop
    initiateBall(renderer.domElement);
    initiateP1(renderer.domElement);
    initiateP2(renderer.domElement);
    initiateP3(renderer.domElement);
    initiateP4(renderer.domElement);
    initiatePlane(renderer.domElement);
    initiateScoreBoard();
    initiateBot();
    makeWall();
    resizeRenderer();
    fixCam();
    mode.gameMeshesCreated = true;
    //createText("Test", 5, 0, 1, 0, scene) ;
}

function createMatch(p1, p2) {
    let match = new MENU.Match();

    match.leftSide = p1;
    match.rightSide = p2;
    match.id = tourney.MatchArray.length;
    tourney.MatchArray.push(match);
    console.log(match.leftSide, "vs", match.rightSide);
}

function playNextMatch() {
    if (tourney.MatchArray.length > 0) {
        p1.name = tourney.MatchArray[0].leftSide;
        p2.name = tourney.MatchArray[0].rightSide;
        startGame();
        tourney.MatchArray.splice(0, 1);
    }
}

function matchMaker() {
    let first;
    let second;
    let leftSide;
    let rightSide;

    while (tourney.playerArray.length > 1) {
        first = Math.floor(Math.random() * tourney.playerArray.length);
        leftSide = tourney.playerArray[first];
        //console.log("first: ", first);
        tourney.playerArray.splice(first, 1);
        second = Math.floor(Math.random() * tourney.playerArray.length);
        //console.log("second: ", second);
        rightSide = tourney.playerArray[second];
        tourney.playerArray.splice(second, 1);
        createMatch(leftSide, rightSide);
    }
}

function appearBut(button) {
    let op = parseFloat(window.getComputedStyle(button).opacity); // Convert opacity to a number
    let x = parseFloat(window.getComputedStyle(button).left);

    // Check if opacity is already 0 (in case button is already invisible)
    if (op === 1) return;

    let interval = setInterval(() => {
        op += 0.05; // Decrease opacity by a small amount (you can adjust this value)
        x -= 2; // Decrease opacity by a small amount (you can adjust this value)
        button.style.left = x + "px";
        button.style.opacity = op;
        button.style.pointerEvents = "auto";
        //console.log(this.style.opacity);

        // Stop the interval when opacity reaches 0
        if (op >= 1) {
            clearInterval(interval);
            button.style.opacity = 1; // Ensure it’s exactly 0
        }
    }, 20); // Update every 20 milliseconds (adjust the interval for smoother/slower fading)

}

function disappearBut(button) {
    console.log("Clicked");
    let op = parseFloat(window.getComputedStyle(button).opacity); // Convert opacity to a number
    let x = parseFloat(window.getComputedStyle(button).left);

    // Check if opacity is already 0 (in case button is already invisible)
    if (op === 0) return;

    let interval = setInterval(() => {
        op -= 0.05; // Decrease opacity by a small amount (you can adjust this value)
        x += 2; // Decrease opacity by a small amount (you can adjust this value)
        button.style.opacity = op;
        button.style.left = x + "px";
        button.style.pointerEvents = "none";

        //console.log(this.style.opacity);

        // Stop the interval when opacity reaches 0
        if (op <= 0) {
            clearInterval(interval);
            button.style.opacity = 0; // Ensure it’s exactly 0
        }
    }, 20); // Update every 20 milliseconds (adjust the interval for smoother/slower fading)
}

//back butonu, +++++++++++++++
//  isim hala üst üste biniyor,+++++++++++++
//  show players butonu kalkıcak ++++++++++
//submite enter atılacak,++++++++
//  sağ yön tuşlarında ekran harket ediyor o fixlenicek
//2 v 2 de tek tuşla her iki tarafda hareket ediyor ++++++++
//paletlerin ileri ve geri hareketleri kaldırılacka++++++++++++++++
