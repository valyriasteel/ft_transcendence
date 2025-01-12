console.log("JavaScript is connected!");
import { Player } from './Player.js'; // Import the class
import { Ball } from './Ball.js'; // Import the class
import { AuMan } from './AudioMan.js'; // Import the class
import { Camera } from './Camera.js'; // Import the class
import { Bot } from './ai.js'; // Import the class
import { FontLoader } from 'FontLoader';
import * as MENU from './MenuStuff.js'; // Import the class
import * as THREE from 'three';
import { ray } from './CursorDetect.js'; // Import the class
import { mouse } from './CursorDetect.js'; // Import the class
import { TextGeometry } from 'TextGeo';
import { EXRLoader  } from 'ExrLoader';

const   p1 = new Player('P1', 2, 'blue');
const   p2 = new Player('P2', 2, 'red');
const   p3 = new Player('Blank', 0, 'purple');
const   p4 = new Player('Khonvoum', 0, 'yellow');
const   bot = new Bot();
const   ball = new Ball('orange');
const   Aud = new AuMan();
const   cam = new Camera();
const   start = new MENU.startBut();
const   opt = new MENU.optionsBut();
const   select = new MENU.selectMenu();
const   mode = new MENU.Mode();
const   optMenu = new MENU.optionsMenu();
const   tourney = new MENU.tourneyMenu();
const   raycaster = new ray();
const   cursor = new mouse(); 
const   board = new MENU.scoreBoard();
const   end = new MENU.endScreen();
const   myMenu = new MENU.mainMenu();

function visibleControl(every ,flag)
{
    const childrenArray = Array.from(every.children);
    
    childrenArray.forEach(child => {
        if (flag)
            child.style.display = "inline-block";
        else
            child.style.display = "none";
    });
}

function loadMenuElements()
{
    myMenu.startBut = document.getElementById("startBut");
    myMenu.settingsBut = document.getElementById("settingsBut");
    myMenu.everything = document.getElementById("menu");
    myMenu.startBut.addEventListener("click", function()
    {
        mode.inMenu = false;
        mode.inSelect = true;
        visibleControl(myMenu.everything, false);
        visibleControl(select.everything, true);
        renderer.setAnimationLoop(selectLoop);
    });

    myMenu.settingsBut.addEventListener("click", function()
    {
        mode.inMenu = false;
        mode.inOptions = true;
        visibleControl(myMenu.everything, false);
        visibleControl(optMenu.everything, true);
        renderer.setAnimationLoop(optionsLoop);
    });
}

function loadSettingsElements()
{
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

    optMenu.backBut.addEventListener("click", function()
    {
        end.winner.style.display = "none";
        if (mode.isTourney)
        {
            mode.isTourney = false;
            end.champ.style.display = "none";
            end.nextBut.style.display = "none";
            tourney.playerArray = [];
            tourney.MatchArray = [];
            p1.name = "P1";
            p2.name = "P2";
        }
        visibleControl(myMenu.everything, 1);
        visibleControl(optMenu.everything, 0);
        renderer.setAnimationLoop(menuLoop);
    });

    optMenu.volumeUpBut.addEventListener("click", function()
    {
        mode.volume += 0.1;
        if (mode.volume > 1)
            mode.volume = 1;
        mode.volume = Math.round(mode.volume * 100) / 100;
        Aud.volumeChange(mode.volume);
        optMenu.volumeLabel.textContent = `Volume: %${mode.volume * 100}`
        optMenu.volumeSlider.value = mode.volume * 100;
    });

    optMenu.volumeDownBut.addEventListener("click", function()
    {
        mode.volume -= 0.1;
        if (mode.volume < 0)
            mode.volume = 0;
        mode.volume = Math.round(mode.volume * 100) / 100;
        Aud.volumeChange(mode.volume);
        optMenu.volumeLabel.textContent = `Volume: %${mode.volume * 100}`
        optMenu.volumeSlider.value = mode.volume * 100;
    });

    optMenu.ballSelection.addEventListener('change', function() 
    {
        const selectedValue = ballSelection.value;
        if (selectedValue === "football")
            ball.texture = soccerBallTexture;
        else if (selectedValue === "basketball")
            ball.texture = basketBallTexture;
    });

    optMenu.volumeSlider.addEventListener('input', function() 
    {
        mode.volume = Math.round(optMenu.volumeSlider.value * 100) / 10000;
        optMenu.volumeLabel.textContent = `Volume: %${Math.floor(mode.volume * 100)}`
        Aud.volumeChange(mode.volume);
    });

    optMenu.darkModeBut.addEventListener('click', function() 
    {
        mode.darkMode = !mode.darkMode;
        if (mode.darkMode)
            optMenu.darkModeText.textContent = "Dark mode: on";
        else
            optMenu.darkModeText.textContent = "Dark mode: off";
        if (mode.darkMode)
            ambientLight.intensity = 0;
        else
            ambientLight.intensity = 0.1;
    });
}

function loadSelectElements()
{
    select.everything = document.getElementById("select");
    select.oneVsOneBut = document.getElementById("oneVsone");
    select.twoVsTwoBut = document.getElementById("twoVstwo");
    select.vsimpBut = document.getElementById("pVsimp");
    select.tourneyBut = document.getElementById("tourney");
    select.backBut = document.getElementById("backSelect");

    select.oneVsOneBut.addEventListener('click', function() 
    {
        modeSingle = false;
        modeFour = false;
        mode.inSelect = false;
        mode.inGame = true;
        visibleControl(select.everything, false);
        startGame();
    });

    select.twoVsTwoBut.addEventListener('click', function() 
    {
        modeSingle = false;
        modeFour = true;
        mode.inSelect = false;
        mode.inGame = true;
        visibleControl(select.everything, false);
        startGame();
    });

    select.vsimpBut.addEventListener('click', function() 
    {
        modeSingle = true;
        modeFour = false;
        mode.inSelect = false;
        mode.inGame = true;
        visibleControl(select.everything, false);
        startGame();
    });

    select.tourneyBut.addEventListener('click', function() 
    {
        modeSingle = false;
        modeFour = false;
        mode.inTourney = true;
        mode.inSelect = false;
        tourney.inputBox.style.display = "block";
        tourney.submitButton.style.display = "block";
        tourney.showButton.style.display = "block";
        tourney.lockBut.style.display = "block";
        visibleControl(select.everything, false);

        renderer.setAnimationLoop(tourneyLoop);
    });

    select.backSelect.addEventListener('click', function() 
    {
        visibleControl(select.everything, false);
        startGame();
    });
}

function loadTourneyElements()
{
    tourney.lockBut = document.getElementById("lockBut");
    tourney.statusText = document.getElementById("statusTourney");
    tourney.lockBut.addEventListener("click", function()
    {
        tourney.statusText.style.display = "block";
        if (tourney.playerArray.length < 3)
        {
            tourney.statusText.innerText = `Please submit atleast 3 players.`;
            return;
        }
        mode.isTourney = true;
        matchMaker();
        tourney.inputBox.style.display = "none";
        tourney.submitButton.style.display = "none";
        tourney.showButton.style.display = "none";
        tourney.lockBut.style.display = "none";
        tourney.startTourneyBut.style.display = "block";
        tourney.statusText.innerText = `Next Match: ${tourney.MatchArray[0].leftSide} vs ${tourney.MatchArray[0].rightSide}`;
    });
}

function loadEndElements()
{
    end.winner = document.getElementById("winner");
    end.nextBut = document.getElementById("nextMatchBut");
    end.champ = document.getElementById("champ");

    end.nextBut.addEventListener("click", function()
    {
        end.nextBut.style.display = "none";
        end.winner.style.display = "none";
        end.champ.style.display = "none";
        playNextMatch();
    });
}


window.onload = function() 
{
    loadMenuElements();

    loadSettingsElements();

    loadSelectElements();

    loadTourneyElements();

    loadEndElements();

}


// Create scene, camera, and renderer
const   scene = new THREE.Scene();
const   mainMenu = new THREE.Scene();
const   optionsMenu = new THREE.Scene();
const   selectMenu = new THREE.Scene();
const   gameEnd = new THREE.Scene();
const   tournamentMenu = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.autoClear = true; // Ensures the canvas is cleared before rendering
renderer.shadowMap.enabled = true;
const textureLoader = new THREE.TextureLoader();
const soccerBallTexture = textureLoader.load('../images/ball.jpg')
const basketBallTexture = textureLoader.load('../images/basketball.png')
ball.texture = soccerBallTexture;    
const pointLight = new THREE.PointLight(0xffffff, 1000, 100);  // Color, intensity, distance
pointLight.position.set(10, 10, 10);  // Position the light in the scene
pointLight.castShadow = true;  // Enable shadow casting
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // White light with intensity 1
scene.add(ambientLight);
document.body.appendChild(renderer.domElement);
let loadedFont;
const fontLoader = new FontLoader();
Aud.volumeChange(mode.volume);

function loadFont() {
    return new Promise((resolve, reject) => {
        const fontLoader = new FontLoader();
        fontLoader.load(
            'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
            (font) => {
                loadedFont = font; // Store the loaded font
                resolve(font); // Resolve the promise
            },
            undefined,
            (err) => reject(err) // Handle loading errors
        );
    });
}

// Function to resize and center the canvas
function resizeRenderer() {
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
  }
  

// Initial resize and on window resize

window.addEventListener("resize", resizeRenderer);


let modeFour = false; 
let modeSingle = false;

//camera.position.z = 50;

cam.camera.position.y = 100;
cam.camera.lookAt(0,0,0);

renderer.setAnimationLoop(menuLoop);  // Start the animation loop
resizeRenderer();
//loadEXREnvironment();
//initiateStartBut();
//initiateOpt();
//initiateSelect();
initiateTourney();
initWinScreen();

let lastTime = 0; // Tracks the last time the loop   ran

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
            scene.environment = envMap;
            
            // If you want the background too
            mainMenu.background = envMap;
            scene.background = envMap;
            
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
            console.error('Error loading EXR:', error);
        }
    );
}

async function initiateStartBut()
{
    if (!loadedFont)
        await loadFont(); // Wait for the font to load
    mainMenu.add(start.cube);
    mainMenu.add(opt.cube);
    start.startText = createText("Play", 10, start.cube.position.x - 12, 1, 5, mainMenu);
    opt.optText = createText("Options", 10, opt.cube.position.x - 24, 1, 5, mainMenu);
    start.cube.updateMatrixWorld();
    opt.cube.updateMatrixWorld();
}

async function initiateOpt()
{
    if (!loadedFont)
        await loadFont(); // Wait for the font to load

    optMenu.volumeUpBut = new MENU.myButton('green', 10, 0, 10);
    optMenu.volumeDownBut = new MENU.myButton('red', 10, 0, 10);
    optMenu.backBut = new MENU.myButton('blue', 20, 0, 10);
    optMenu.ballTextureBut = new MENU.myButton('yellow', 10, 0, 10);
    optMenu.darkModeBut = new MENU.myButton('orange', 10, 0, 10);

    optMenu.volumeUpBut.cube.position.x = 40;
    optMenu.volumeUpBut.cube.position.z = -37;
    optMenu.volumeDownBut.cube.position.x = 20;
    optMenu.volumeDownBut.cube.position.z = -37;
    optMenu.ballTextureBut.cube.position.x = 20;
    optMenu.ballTextureBut.cube.position.z = -22;
    optMenu.darkModeBut.cube.position.x = 20;
    optMenu.volumeUpBut.text = createText("+", 5, optMenu.volumeUpBut.cube.position.x - 2.2, 1, optMenu.volumeUpBut.cube.position.z + 2, optionsMenu);
    optMenu.volumeDownBut.text = createText("-", 5, optMenu.volumeDownBut.cube.position.x - 1, 1, optMenu.volumeDownBut.cube.position.z + 2, optionsMenu);
    optMenu.soccerText = createText("SoccerBall", 5, optMenu.ballTextureBut.cube.position.x - 45, 0, optMenu.ballTextureBut.cube.position.z + 2, optionsMenu);
    optMenu.basketText = createText("BasketBall", 5, optMenu.ballTextureBut.cube.position.x - 45, 0, optMenu.ballTextureBut.cube.position.z + 2, optionsMenu);
    optMenu.onText = createText("On", 5, optMenu.darkModeBut.cube.position.x - 35, 0, optMenu.darkModeBut.cube.position.z + 2, optionsMenu);
    optMenu.offText = createText("Off", 5, optMenu.darkModeBut.cube.position.x - 35, 0, optMenu.darkModeBut.cube.position.z + 2, optionsMenu);
    optMenu.basketText.visible = false;
    optMenu.onText.visible = false;
    optMenu.backBut.cube.position.x = -110;
    optMenu.backBut.cube.position.z = -60;
    createText("Volume:", 5, -55, 0, -35, optionsMenu);
    createText("Ball Skin:", 5 , -55, 0, -20, optionsMenu);
    createText("Options", 5, -7, 0, -55, optionsMenu);
    createText("Dark Mode:", 5, -55, 0, 2, optionsMenu);
    createText("Back", 5, -117, 0, -57, optionsMenu);
    optMenu.volumeText = createText(mode.volume.toString(), 5, -27, 0, -34.5, optionsMenu);
    optionsMenu.add(optMenu.volumeUpBut.cube);
    optionsMenu.add(optMenu.volumeDownBut.cube);
    optionsMenu.add(optMenu.backBut.cube);
    optionsMenu.add(optMenu.ballTextureBut.cube);
    optionsMenu.add(optMenu.darkModeBut.cube);
}

async function initiateSelect()
{
    if (!loadedFont) 
        await loadFont(); // Wait for the font to load

    //initiate Buttons
    select.oneVsOneBut = new MENU.myButton('grey', 30, 0, 30);
    select.twoVsTwoBut = new MENU.myButton('grey', 30, 0, 30);
    select.vsimpBut = new MENU.myButton('grey', 30, 0, 30);
    select.tourneyBut = new MENU.myButton('grey', 30, 0, 30);
    select.backBut = new MENU.myButton('blue', 20, 0, 10);

    //Position Buttons
    select.oneVsOneBut.cube.position.x = -90;
    select.twoVsTwoBut.cube.position.x = -30;
    select.vsimpBut.cube.position.x = 29;
    select.tourneyBut.cube.position.x = 89;
    select.oneVsOneBut.cube.position.z = 40;
    select.twoVsTwoBut.cube.position.z = 40;
    select.vsimpBut.cube.position.z = 40;
    select.tourneyBut.cube.position.z = 40;
    select.backBut.cube.position.x = -110;
    select.backBut.cube.position.z = -60;

    //Create Text
    select.oneVsOneBut.text = createText("1v1", 5, select.oneVsOneBut.cube.position.x - 5.5, 1, select.oneVsOneBut.cube.position.z + 2, selectMenu);
    select.twoVsTwoBut.text = createText("2v2", 5, select.twoVsTwoBut.cube.position.x - 5.5, 1, select.twoVsTwoBut.cube.position.z + 2, selectMenu);
    select.vsimpBut.text = createText("vsAI", 5, select.vsimpBut.cube.position.x - 7, 1, select.vsimpBut.cube.position.z + 2, selectMenu);
    select.tourneyBut.text = createText("Tournament", 3, select.tourneyBut.cube.position.x - 12, 1, select.tourneyBut.cube.position.z + 1.5, selectMenu);
    createText("Back", 5, -117, 0, -57, selectMenu);
    
    //Add objects to scene
    selectMenu.add(select.oneVsOneBut.cube);
    selectMenu.add(select.twoVsTwoBut.cube);
    selectMenu.add(select.vsimpBut.cube);
    selectMenu.add(select.tourneyBut.cube);
    selectMenu.add(select.backBut.cube);
}

function initiateTourney()
{
    tourney.inputBox = document.getElementById("userInput");
    tourney.submitButton = document.getElementById("submitBut");
    tourney.showButton = document.getElementById("showBut");
    tourney.startTourneyBut = document.getElementById("startTourneyBut");
}

async function initWinScreen()
{
    if (!loadedFont)
        await loadFont(); // Wait for the font to load

    //end.backBut = new MENU.myButton('blue', 20, 0, 10);
    //end.backBut.cube.position.x = -123;
    //end.backBut.cube.position.z = -60;
    //end.backBut.text = createText("Back", 5, -130, 0, -57, gameEnd);
    //createText("Wins!", 10, 0, 0, 0, gameEnd);
    //gameEnd.add(end.backBut.cube);
}

function winScreen()
{
    if (p1.score == 3)
        end.winner.innerText = p1.name + " Wins!";
    else
        end.winner.innerText = p2.name + " Wins!";
    
    end.winner.style.display = "block";
    optMenu.backBut.style.display = "block";
    if (mode.isTourney)
    {
        tourney.playerArray.push(end.winner.innerText);
        end.nextBut.style.display = "block";
        end.champ.style.display = "block";
        if (tourney.MatchArray.length < 1)
        {
            if (tourney.playerArray.length >= 2)
            matchMaker();
        }
        if (tourney.MatchArray.length > 0)
        {
            end.champ.innerText = `Next Match: ${tourney.MatchArray[0].leftSide} vs ${tourney.MatchArray[0].rightSide}`;
        }
        if (tourney.MatchArray.length < 1 && tourney.playerArray.length <= 1)
        {
            end.champ.style.display = "block";
            end.champ.innerText = "Tourney is over!";
            end.nextBut.style.display = "none";
        }
    }
    cleanGameObj();
}

async function menuLoop()
{
    renderer.render( mainMenu, cam.camera );
}

async function optionsLoop()
{
    renderer.render( optionsMenu, cam.camera );
}

async function selectLoop()
{
    renderer.render( selectMenu, cam.camera );
}

async function endLoop()
{
    renderer.render( gameEnd, cam.camera );
}

async function tourneyLoop()
{
    renderer.render( tournamentMenu, cam.camera );
}

async function gameLoop(currentTime) 
{
    const deltaTime = currentTime - lastTime; // Time difference between frames
    lastTime = currentTime;
    
    update(deltaTime); // Update game state
    render();          // Render the game
}

function disposer(obj, scene)
{
    if (obj.geometry)
        obj.geometry.dispose();
    if (obj.material)
        obj.material.dispose();

    scene.remove(obj);
}

function cleanGameObj()
{
    disposer(p1.pad, scene);
    disposer(p2.pad, scene);
    if (p3.geometry)    
        disposer(p3.pad, scene);
    if (p4.geometry)
        disposer(p4.pad, scene);
    disposer(ball.sphere, scene);
    disposer(board.scoreLeft, scene);
    disposer(board.scoreRight, scene);
    disposer(board.nickLeft, scene);
    disposer(board.nickRight, scene);
    p1.score = 2;
    p2.score = 2;
}

function initiateP1(canvas)
{
    p1.Width = 10;
    p1.Height = 10;
    if (modeFour)
        p1.Depth = 30;
    else
        p1.Depth = 50;
    p1.geometry = new THREE.BoxGeometry( p1.Width, p1.Height, p1.Depth );
    p1.material = new THREE.MeshBasicMaterial( { color: p1.color})
    p1.pad = new THREE.Mesh( p1.geometry, p1.material );
	p1.pad.position.x = -190;
	p1.pad.position.y = -4;
    p1.maxX = -40;
    if (modeFour)
    {
        p1.pad.position.z = -45
        p1.maxZ = 0;
    }
    else
    {
        p1.pad.position.z = 0;
        p1.maxZ = 115;
    }
    scene.add( p1.pad );
}
//p1.pad.position.x = -190; >> -180 >> -175
//p2.pad.position.x = 189; >>  179 >> 174
//p1.Width = 10;

function initiateP2(canvas)
{
    p2.Width = 10;
    p2.Height = 10;
    if (modeFour)
        p2.Depth = 30;
    else
        p2.Depth = 50;
    if (modeSingle)
        p2.name = "Bot";
    p2.geometry = new THREE.BoxGeometry( p2.Width, p2.Height, p2.Depth );
    p2.material = new THREE.MeshBasicMaterial( { color: p2.color})
    p2.pad = new THREE.Mesh( p2.geometry, p2.material );
	p2.pad.position.x = 189;
	p2.pad.position.y = -4;
    p2.minX = 39;
    if (modeFour)
    {
        p2.pad.position.z = -45;
        p2.maxZ = 0;
    }
    else
    {
        p2.pad.position.z = 0;
        p2.maxZ = 115;
    }

    scene.add( p2.pad );
}

function initiatePlane(canvas)
{
	let geo;
	let mat;
	let plane;

	geo = new THREE.BoxGeometry(410, 1, 229);
	mat = new THREE.MeshStandardMaterial ( { color: 0x00ff00});
	plane = new THREE.Mesh( geo, mat);
	plane.position.x = -1;
	plane.position.z = 0;
    plane.receiveShadow = true;
	scene.add(plane);
}

function initiateP3(canvas)
{
    if (!modeFour)
        return;
    p3.Width = 10;
    p3.Height = 10;
    p3.Depth = 30;
    p3.geometry = new THREE.BoxGeometry( p3.Width, p3.Height, p3.Depth );
    p3.material = new THREE.MeshBasicMaterial( { color: p3.color})
    p3.pad = new THREE.Mesh( p3.geometry, p3.material );
	p3.pad.position.x = -190;
	p3.pad.position.y = -4;
	p3.pad.position.z = 44;
    p3.maxX = -40;
    p3.minZ = 0;
    scene.add( p3.pad );
}

function initiateP4(canvas)
{
    if (!modeFour)
        return;
    p4.Width = 10;
    p4.Height = 10;
    p4.Depth = 30;
    p4.geometry = new THREE.BoxGeometry( p4.Width, p4.Height, p4.Depth );
    p4.material = new THREE.MeshBasicMaterial( { color: p4.color})
    p4.pad = new THREE.Mesh( p4.geometry, p4.material );
    p4.minX = 39;
	p4.pad.position.x = 189;
	p4.pad.position.y = -4;
	p4.pad.position.z = 44;
    p4.minZ = 0;
    scene.add( p4.pad );
}

function initiateBot()
{
    if (!modeSingle)
        return;
    bot.dirX = ball.dirX;
    bot.dirZ = ball.dirZ;
    bot.speed = ball.speed;
    bot.ballZ = ball.sphere.position.z;
    bot.padZ = p2.pad.position.z;
    bot.padSpeed = p2.speed;
}   

function initiateBall(canvas)
{

    if (Math.random() <= 0.5)
        ball.dirX = 1;
    else
        ball.dirX = -1;
    if (Math.random() <= 0.5)
        ball.dirZ = 1;
    else
        ball.dirZ = -1;

    ball.geometry = new THREE.SphereGeometry( ball.Radius, ball.widthSegments, ball.heightSegments );
    ball.material = new THREE.MeshStandardMaterial( { map:ball.texture } );
    ball.sphere =  new THREE.Mesh( ball.geometry, ball.material );
    ball.sphere.position.z = Math.floor(Math.random() * 230) - 115;
    ball.sphere.position.x = 0;
    ball.sphere.castShadow = true;
    ball.sphere.receiveShadow = true;
    scene.add(ball.sphere);
    console.log(ball.sphere.position.x);
}

function initiateScoreBoard()
{
    board.scoreLeft = createText(p1.score.toString(), 10, -125, 1, -150, scene);
    board.scoreRight = createText(p2.score.toString(), 10, 175, 1, -150, scene);
    board.nickLeft = createText(p1.name, 10, -150, 1, -150, scene);
    board.nickRight = createText(p2.name, 10, 149, 1, -150, scene);
}

function makeWall()
{
    let material = new THREE.MeshBasicMaterial( { color: 0x8A2BE2})
    let vertGeo = new THREE.BoxGeometry( 10, 40, 250 );
    let horiGeo = new THREE.BoxGeometry(415, 40, 10);
    let leftWall = new THREE.Mesh( vertGeo, material );
    let rightWall = new THREE.Mesh( vertGeo, material );
    let topWall = new THREE.Mesh( horiGeo, material );
    let bottomWall = new THREE.Mesh( horiGeo, material );

    leftWall.position.x = -211;
    rightWall.position.x = 209;
    topWall.position.z = -120;
    bottomWall.position.z = 119;
    scene.add(leftWall);
    scene.add(rightWall);
    scene.add(topWall);
    scene.add(bottomWall);
}

function checkCollision()
{
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

function collideP1()
{
    if (ball.sphere.position.x - ball.Radius / 2 <= p1.pad.position.x + p1.Width && p1.pad.position.x + p1.Width / 2 <= ball.sphere.position.x && ball.sphere.position.z + ball.Radius / 2 >= p1.pad.position.z - p1.Depth / 2 && ball.sphere.position.z - ball.Radius / 2 <= p1.pad.position.z + p1.Depth / 2)
    {
        return true;
    }
    else
        return false;
}

function collideP3()
{
    if (ball.sphere.position.x - ball.Radius / 2 <= p3.pad.position.x + p3.Width && p3.pad.position.x + p3.Width / 2 <= ball.sphere.position.x && ball.sphere.position.z + ball.Radius / 2 >= p3.pad.position.z - p3.Depth / 2 && ball.sphere.position.z - ball.Radius / 2 <= p3.pad.position.z + p3.Depth / 2)
    {
        return true;
    }
    else
        return false;
}

function collideP2()
{
    if (ball.sphere.position.x + ball.Radius / 2 >= p2.pad.position.x - p2.Width && p2.pad.position.x - p2.Width / 2 >= ball.sphere.position.x && ball.sphere.position.z + ball.Radius / 2 >= p2.pad.position.z - p2.Depth / 2 && ball.sphere.position.z - ball.Radius / 2 <= p2.pad.position.z + p2.Depth / 2)
        return true;
    else
        return false;
}

function collideP4()
{
    if (ball.sphere.position.x + ball.Radius / 2 >= p4.pad.position.x - p4.Width && p4.pad.position.x - p4.Width / 2 >= ball.sphere.position.x && ball.sphere.position.z + ball.Radius / 2 >= p4.pad.position.z - p4.Depth / 2 && ball.sphere.position.z - ball.Radius / 2 <= p4.pad.position.z + p4.Depth / 2)
        return true;
    else
        return false;
}

function checkBallColl()
{
    if (ball.sphere.position.x + ball.Radius / 2 < -20 && ball.dirX == -1)
    {
        if (collideP1() || modeFour && collideP3())
        {
            ball.dirX = 1;
            Aud.ping2.play();
        }
    }
    else if (ball.sphere.position.x + ball.Radius / 2 > 20 && ball.dirX == 1)
    {
        //console.log("ballx", ball.sphere.position.x + ball.Radius / 2);
        //console.log("padx", p2.pad.position.x - p2.Width / 2)
        if (ball.sphere.position.x + ball.Radius / 2 >= p2.pad.position.x - p2.Width / 2 && ball.flag)
        {
            //console.log("Missed: ", ball.sphere.position.z);
            ball.flag = false;
        }
        if (collideP2() || (modeFour && collideP4()))
        {
            ball.dirX = -1;
            Aud.ping2.play();
            //console.log ("actual hit, ballx:", ball.sphere.position.x);
            //console.log("Pad hit: ", ball.sphere.position.z);
		}
    }
    
    if (ball.sphere.position.z - ball.Radius / 2 < ball.minZ)
    {
        ball.sphere.position.z = ball.minZ + ball.Radius / 2;
        ball.dirZ *= -1;
        Aud.ping3.play();
    }
    if (ball.sphere.position.z + ball.Radius / 2 > ball.maxZ)
    {
        ball.sphere.position.z = ball.maxZ - ball.Radius / 2 ;
        ball.dirZ *= -1;
        Aud.ping4.play();
    }
    if (ball.sphere.position.x + ball.Radius / 2 <= ball.minX || ball.sphere.position.x >= ball.maxX)
    {
        if (ball.sphere.position.x > 0)
        {
            p1.score++;
            board.scoreLeft = changeText(p1.score.toString(), board.scoreLeft, board.scoreTextSize);
        }
        else
        {
            p2.score++;
            board.scoreRight = changeText(p2.score.toString(), board.scoreRight, board.scoreTextSize);
        }
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
        if (p1.score == 3 || p2.score == 3)
        {
            cam.camera.position.y = 100;
            winScreen();
            mode.inEnd = true;
            mode.inGame = false;
            renderer.setAnimationLoop(endLoop);
        }
        else
            ball.freeze = true;
    }
}

function ballUpdate(deltaTime)
{
    if (ball.freeze)
    {
        ball.counter += deltaTime;
        if (ball.counter > 3000)
        {
            ball.freeze = false;
            ball.speed = 0.1;
            ball.counter = 0;
        }
        return;
    }
    //console.log("BALLZ: ", ball.sphere.position.z);
    ball.sphere.rotation.x += 0.001 * deltaTime;
    ball.sphere.rotation.y += 0.001 * deltaTime;
    ball.sphere.position.x += ball.dirX * ball.speed * deltaTime;
    ball.sphere.position.z += ball.dirZ * ball.speed * deltaTime;
    ball.speed += 0.00001 * deltaTime;
    checkBallColl();
}
//0.1

function movementUpdate(deltaTime, player)
{

    if (player.movUp) 
    {
        player.pad.position.z -= player.speed * deltaTime;
    }
    
    if (player.movLeft) 
    {
        player.pad.position.x -= player.speed * deltaTime;
    }
    
    if (player.movRight) 
    {
        player.pad.position.x += player.speed * deltaTime;
    }
    
    if (player.movDown) 
    {
        player.pad.position.z += player.speed * deltaTime;
    }
}

const temp = (function () 
{
    let test = 0; // Persistent variable inside the closure
    return function (deltaTime) 
    {
        test += deltaTime;
        if (test > 1) 
        {
            ballUpdate(deltaTime);
        }
    };
})();


function movementCam(deltaTime)
{
    const forward = new THREE.Vector3();
	if (cam.lookUp)
	{
		cam.camera.rotateX(0.001 * deltaTime);
	}
	if (cam.lookDown)
	{
		cam.camera.rotateX(-0.001 * deltaTime);
	}
	if (cam.lookLeft)
	{
		cam.camera.rotateY(0.001 * deltaTime);
	}
	if (cam.lookRight)
	{
		cam.camera.rotateY(-0.001 * deltaTime);
	}

	if (cam.movUp)
	{
        cam.camera.getWorldDirection(forward);
        cam.camera.position.x += forward.x * cam.speed * deltaTime; // Move forward
        cam.camera.position.y += forward.y * cam.speed * deltaTime; // Adjust if needed for vertical movement
        cam.camera.position.z += forward.z * cam.speed * deltaTime;
	}
	
	if (cam.movDown)
	{
        cam.camera.getWorldDirection(forward);
        cam.camera.position.x -= forward.x * cam.speed * deltaTime; // Move forward
        cam.camera.position.y -= forward.y * cam.speed * deltaTime; // Adjust if needed for vertical movement
        cam.camera.position.z -= forward.z * cam.speed * deltaTime;
	}
	
	if (cam.movLeft)
	{
        cam.camera.getWorldDirection(forward);
        cam.camera.position.y += -forward.x * cam.speed * deltaTime
        cam.camera.position.x += forward.y * cam.speed * deltaTime;
        //cam.camera.position.x += forward.z * cam.speed * deltaTime;
        //cam.camera.position.z += forward.x * cam.speed * deltaTime;
	}
	
	if (cam.movRight)
	{
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
    //console.log(root1, root2);
    return root1; // Return both roots
}

const a = 0.01;
const b = 100;
const c = -175;

//const t1 = solveQuadratic(a, b, c);

//console.log("t1 =", t1); // First root

function calculateZ(dist)
{
    if (bot.dirZ < 0)
    {
        if (bot.ballZ + dist < -110)
        {
            bot.bounceCount = Math.floor(((-dist) + (-110 - bot.ballZ)) / 219);
            if (bot.bounceCount % 2 == 0)
            {
                bot.targetZ = -110 + (-dist + (-110 - bot.ballZ) - (219 * bot.bounceCount));
                bot.dirZ *= -1;
                //console.log("case1");
            }
            else
            {
                bot.targetZ = 109 - (-dist + (-110 - bot.ballZ) - (219 * bot.bounceCount));
                //console.log("case2");
            }
        }
        else
        {
            bot.targetZ = bot.ballZ + dist; 
            //console.log("case6");
        }
    }
    else
    {
        if (bot.ballZ - dist > 109)
        {
            bot.bounceCount = Math.floor(((-dist) - (109 - bot.ballZ)) / 219);
            if (bot.bounceCount % 2 == 0)
            {
                bot.targetZ = 109 - (-dist - (109 - bot.ballZ) - (219 * bot.bounceCount));
                bot.dirZ *= -1;
                //console.log("case3");
            }
            else
            {
                bot.targetZ = -110 + (-dist - (109 - bot.ballZ) - (219 * bot.bounceCount));
                //console.log("case4");
            }
        }
        else
        {
            bot.targetZ = bot.ballZ - dist;
            //console.log("case5");
        }
    }

    if (bot.targetZ - p2.Width < -110)
        bot.targetZ = -110 + p2.Width;
    else if (bot.targetZ + p2.Width > 109)
        bot.targetZ = 109 - p2.Width;

    bot.timeMove = Math.abs(bot.padZ - bot.targetZ) / (bot.padSpeed * 1000);
    //console.log("timeMove: ", bot.timeMove);
    bot.clock2 = 0;
    /*
    console.log("ballZ: ", bot.ballZ);
    console.log("targetZ: ", bot.targetZ);
    console.log("dist: ", dist);
    console.log("bounceCount: ", bot.bounceCount);
    console.log("dirZ: ", bot.dirZ);*/
}

function updateBot()
{
    bot.ballX = ball.sphere.position.x;
    bot.ballZ = ball.sphere.position.z;
    bot.dirX = ball.dirX;
    bot.dirZ = ball.dirZ;
    bot.speed = ball.speed;
    bot.padZ = p2.pad.position.z;
    bot.calculate = true; 
}

function impBot(deltaTime)
{
    let dist;
    let bounceCount;
    let tempDist;
    /*
    bottom 109
    top -110
    left -175
    right 174
    */
    if (ball.freeze || bot.clock > 0)
    {
        bot.clock = -3000;
        return;
    }
    bot.clock += deltaTime;
    bot.clock2 += deltaTime;
    bot.clock3 += deltaTime;
    bot.speed += 0.00001 * deltaTime;
    if (bot.clock3 > 1000)
    {
        updateBot();
        bot.clock3 = 0;
        //console.log("update");
    }
    //console.log("ZBALL: ", ball.sphere.position.z);
    //console.log("pad: ", p1.pad.position.z);
    //console.log("clock: ", bot.clock);
    if (bot.calculate)
    {
        //console.log("Dir: ", bot.dirX);
        if (bot.dirX > 0)
            dist = -(174 - bot.ballX);
        else
            dist = ((-175 - bot.ballX) - 349);
        //console.log("dist: " ,dist);
        calculateZ(dist);
        bot.timeHit = solveQuadratic(5, (bot.speed * 1000), dist);
        bot.calculate = false;
        //console.log("hit: ", bot.timeHit);
        bot.dirX = -1; 
    }

    if (bot.padZ < bot.targetZ && bot.clock2 < bot.timeMove)
    {
        p2.movDown = true;
    }
    else if (bot.padZ > bot.targetZ && bot.clock2 < bot.timeMove)
    {
        p2.movUp = true;
    }
    else if (bot.clock2 >= bot.timeMove * 1000 && (p2.movDown || p2.movUp))
    {
        p2.movDown = false;
        p2.movUp = false;
        //console.log("target", bot.targetZ);
        //console.log("pad pos", bot.targetZ);
    }

    if (bot.clock >= bot.timeHit * 1000)
    {
        //console.log("should hit", bot.clock / 1000);
        //console.log("speed", bot.speed);
        //console.log("ball speed", ball.speed);
        bot.ballX = 174;
        bot.clock = 0;
        bot.clock2 = 0;
        bot.ballZ = bot.targetZ;
        bot.calculate = true;
        bot.padZ = bot.targetZ;
    }
    //x / v = t 
    /*
        if (ball.sphere.position.z - ball.Radius / 2 < ball.minZ)
    {
        ball.sphere.position.z = ball.minZ + ball.Radius / 2;
        ball.dirZ *= -1;
        Aud.ping3.play();
    }
    if (ball.sphere.position.z + ball.Radius / 2 > ball.maxZ)
    {
        ball.sphere.position.z = ball.maxZ - ball.Radius / 2 ;
        ball.dirZ *= -1;
        Aud.ping4.play();
    }
    */
}

function update(deltaTime) 
{
	movementCam(deltaTime);
    movementUpdate(deltaTime, p1);
    if (modeSingle)
    {
        impBot(deltaTime);
    }
    movementUpdate(deltaTime, p2);
    if (modeFour == true)
    {
        movementUpdate(deltaTime, p3);
        movementUpdate(deltaTime, p4);
    }
    checkCollision();
    ballUpdate(deltaTime);
}

// Render the game
function render() 
{
	renderer.render( scene, cam.camera );
}

function p1KeyDown(event)
{
    if (event.key === 'w') 
    {
        p1.movUp = true;
    }
    
    if (event.key === 'a') 
    {
        p1.movLeft = true;
    }
    
    if (event.key === 'd') 
    {
        p1.movRight = true;
    }
    
    if (event.key === 's') 
    {
        p1.movDown = true;
    }
}

function p2KeyDown(event)
{
    if (event.key === 'ArrowUp') 
    {
        p2.movUp = true;
    }
    
    if (event.key === 'ArrowLeft') 
    {
        p2.movLeft = true;
    }
    
    if (event.key === 'ArrowRight') 
    {
        p2.movRight = true;
    }
    
    if (event.key === 'ArrowDown') 
    {
        p2.movDown = true;
    }    
}

function p3KeyDown(event)
{
    if (event.key === 'z')
        p3.movUp = true;
    if (event.key === 'x')
        p3.movDown = true;
}

function p4KeyDown(event)
{
    if (event.key === 'z')
        p4.movUp = true;
    if (event.key === 'x')
        p4.movDown = true;    
}

function cameraDown(event)
{
    const forward = new THREE.Vector3();
    if (event.key === 'ArrowUp') 
	{
		cam.lookUp = true;
	}
	
	if (event.key === 'ArrowLeft') 
	{
		cam.lookLeft = true;
	}
	
	if (event.key === 'ArrowRight') 
	{
		cam.lookRight = true;
	}
	
	if (event.key === 'ArrowDown') 
	{
		cam.lookDown = true;
	}

	if (event.key === 'w') 
	{
		cam.movUp = true;
	}
	
	if (event.key === 'a') 
	{
		cam.movLeft = true;
	}
	
	if (event.key === 'd') 
	{
		cam.movRight = true;
	}
	
	if (event.key === 's') 
	{
		cam.movDown = true;
	}
	
    if (event.key === 'r')
	{
		cam.camera.lookAt(0, 0, 0);
	}
    if (event.key === 't')
    {
        cam.camera.getWorldDirection(forward);
    	console.log(forward.x);
    	console.log(forward.y);
    	console.log(forward.z);
    }
}

document.addEventListener('keydown', (event) => 
{
	//let cam = true;
	if (event.key === 'c' && mode.inGame)
        cam.enable = !cam.enable;
	if (cam.enable)
        cameraDown(event);
    else
    {
        p1KeyDown(event);
        if (modeSingle)
            return;
        p2KeyDown(event);
        p3KeyDown(event);
        p4KeyDown(event);
    }
}
);

function p1KeyUp(event)
{
    if (event.key === 'w') 
    {
        p1.movUp = false;
    }
    
    if (event.key === 'a') 
    {
        p1.movLeft = false;
    }
    
    if (event.key === 'd') 
    {
        p1.movRight = false;
    }
    
    if (event.key === 's') 
    {
        p1.movDown = false;
    }
}

function p2KeyUp(event)
{
    if (event.key === 'ArrowUp') 
    {
        p2.movUp = false;
    }
    
    if (event.key === 'ArrowLeft') 
    {
        p2.movLeft = false;
    }
    
    if (event.key === 'ArrowRight') 
    {
        p2.movRight = false;
    }
    
    if (event.key === 'ArrowDown') 
    {
        p2.movDown = false;
    }    
}

function p3KeyUp(event)
{
    if (event.key === 'z')
        p3.movUp = false;
    if (event.key === 'x')
        p3.movDown = false;
}

function p4KeyUp(event)
{
    if (event.key === 'z')
        p4.movUp = false;
    if (event.key === 'x')
        p4.movDown = false;    
}

function cameraUp(event)
{
    if (event.key === 'ArrowUp') 
		{
			cam.lookUp = false;
			cam.moving = false;
		}
		
		if (event.key === 'ArrowLeft') 
		{
			cam.lookLeft = false;
			cam.moving = false;
		}
		
		if (event.key === 'ArrowRight') 
		{
			cam.lookRight = false;
			cam.moving = false;
		}
		
		if (event.key === 'ArrowDown') 
		{
			cam.lookDown = false;
			cam.moving = false;
		}
	
		if (event.key === 'w') 
		{
			cam.movUp = false;
		}
		
		if (event.key === 'a') 
		{
			cam.movLeft = false;
		}
		
		if (event.key === 'd') 
		{
			cam.movRight = false;
		}
		
		if (event.key === 's') 
		{
			cam.movDown = false;
		}
}

document.addEventListener('keyup', (event) => 
{
	cameraUp(event);
    p1KeyUp(event);
    //if (modeSingle)
    //    return;
    p2KeyUp(event);
    p3KeyUp(event);
    p4KeyUp(event);
}
);

function changeText(text, mesh, size)
{
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
    if (!loadedFont)
    {
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

document.addEventListener('mousemove', (event) => {
    cursor.vec.x = (event.clientX / window.innerWidth) * 2 - 1;
    cursor.vec.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function startGame()
{
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
    cam.camera.lookAt(0,0,0);
    //createText("Test", 5, 0, 1, 0, scene);
}
  // Function to detect click on the button
/*function onClick(event) {
    let intersects
    raycaster.caster.setFromCamera(cursor.vec, cam.camera);

    if (mode.inEnd)
    {
        end.backBut.cube.updateMatrixWorld();
        intersects = raycaster.caster.intersectObjects(gameEnd.children);
    }
    else
        return;

    if (intersects.length > 0) 
    {
        if (mode.inOptions)
        {
            if (intersects[intersects.length - 1].object === optMenu.backBut.cube)
            {
                mode.inOptions = false;
                mode.inMenu = true;
                //console.log("back");
                renderer.setAnimationLoop(menuLoop);
            }

            if (intersects[intersects.length - 1].object === optMenu.volumeUpBut.cube)
            {
                mode.volume += 0.1;
                if (mode.volume > 1)
                    mode.volume = 1;
                mode.volume = Math.round(mode.volume * 10) / 10;
                Aud.volumeChange(mode.volume);
                optMenu.volumeText.geometry.dispose();
                optMenu.volumeText.material.dispose();
                optionsMenu.remove(optMenu.volumeText);
                optMenu.volumeText = createText(mode.volume.toString(), 5, -27, 0, -34.5, optionsMenu);
            }
            if (intersects[intersects.length - 1].object === optMenu.volumeDownBut.cube)
            {
                mode.volume -= 0.1;
                if (mode.volume < 0)
                    mode.volume = 0;
                mode.volume = Math.round(mode.volume * 10) / 10;
                Aud.volumeChange(mode.volume);
                optMenu.volumeText.geometry.dispose();
                optMenu.volumeText.material.dispose();
                optionsMenu.remove(optMenu.volumeText);
                optMenu.volumeText = createText(mode.volume.toString(), 5, -27, 0, -34.5, optionsMenu);
            }
            if (intersects[intersects.length - 1].object === optMenu.ballTextureBut.cube)
            {
                if (optMenu.basketText.visible)
                {
                    optMenu.basketText.visible = false;
                    optMenu.soccerText.visible = true;
                    ball.texture = soccerBallTexture;
                }
                else
                {
                    optMenu.soccerText.visible = false;
                    optMenu.basketText.visible = true;
                    ball.texture = basketBallTexture;
                }
            }
            if (intersects[intersects.length - 1].object === optMenu.darkModeBut.cube)
            {
                optMenu.onText.visible = !optMenu.onText.visible;
                optMenu.offText.visible = !optMenu.offText.visible;
                if (optMenu.onText.visible)
                    ambientLight.intensity = 0;
                else
                    ambientLight.intensity = 0.1;
            }
        }
        if (mode.inSelect)
        {
            //console.log("back");
            if (intersects[intersects.length - 1].object === select.oneVsOneBut.cube)
            {
                modeSingle = false;
                modeFour = false;
                mode.inSelect = false;
                mode.inGame = true;
                startGame();
            }
            if (intersects[intersects.length - 1].object === select.twoVsTwoBut.cube)
            {
                modeSingle = false;
                modeFour = true;
                mode.inSelect = false;
                mode.inGame = true;
                startGame();
            }
            if (intersects[intersects.length - 1].object === select.vsimpBut.cube)
            {
                modeSingle = true;
                modeFour = false;
                mode.inSelect = false;
                mode.inGame = true;
                startGame();
            }
            if (intersects[intersects.length - 1].object === select.tourneyBut.cube)
            {
                modeSingle = false;
                modeFour = false;
                mode.inTourney = true;
                mode.inSelect = false;
                tourney.inputBox.style.display = "block";
                tourney.submitButton.style.display = "block";
                tourney.showButton.style.display = "block";
                tourney.lockBut.style.display = "block";
                
                renderer.setAnimationLoop(tourneyLoop);
            }
            if (intersects[intersects.length - 1].object === select.backBut.cube)
            {
                mode.inSelect = false;
                mode.inMenu = true;
                end.champ.style.display = "none";
                renderer.setAnimationLoop(menuLoop);
            }
        }
        if (mode.inEnd)
        {
            if (intersects[intersects.length - 1].object === end.backBut.cube)
            {
                mode.isTourney = false;
                end.winner.style.display = "none";
                end.champ.style.display = "none";
                end.nextBut.style.display = "none";
                tourney.playerArray = [];
                tourney.MatchArray = [];
                p1.name = "P1";
                p2.name = "P2";
                visibleControl(myMenu.everything, 1);
                renderer.setAnimationLoop(menuLoop);
            }
        }
    }
}*/

function printPlayers()
{
    let i = 0;
    
    while (i < tourney.playerArray.length)
    {
        console.log(tourney.playerArray[i]);
        i++;
    }
}

function createMatch(p1, p2)
{
    let match = new MENU.Match();

    match.leftSide = p1;
    match.rightSide = p2;
    match.id = tourney.MatchArray.length;
    tourney.MatchArray.push(match);
    console.log(match.leftSide, "vs", match.rightSide);
}

function playNextMatch()
{
    if (tourney.MatchArray.length > 0)
    {
        p1.name = tourney.MatchArray[0].leftSide;
        p2.name = tourney.MatchArray[0].rightSide;
        startGame();
        tourney.MatchArray.splice(0, 1);
    }
}

function matchMaker()
{
    let first;
    let second;
    let leftSide;
    let rightSide;

    while (tourney.playerArray.length > 1)
    {
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

tourney.submitButton.addEventListener("click", function() 
{
    if (tourney.inputBox.value == "")
        return;
    tourney.playerArray.push(tourney.inputBox.value); 
    tourney.inputBox.value = "";
});

tourney.showButton.addEventListener("click", function()
{
    printPlayers();
});



tourney.startTourneyBut.addEventListener("click", function()
{
    tourney.startTourneyBut.style.display = "none";
    tourney.lockBut.style.display = "none";
    tourney.statusText.style.display = "none";
    playNextMatch();
});