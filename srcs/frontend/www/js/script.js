console.log("JavaScript is connected!");
import { Player } from './Player.js'; // Import the class
import { Ball } from './Ball.js'; // Import the class
import { AuMan } from './AudioMan.js'; // Import the class
import { Camera } from './Camera.js'; // Import the class
import * as MENU from './MenuStuff.js'; // Import the class
import * as THREE from './three.js';
import { ray } from './CursorDetect.js'; // Import the class
import { mouse } from './CursorDetect.js'; // Import the class

const p1 = new Player('Tanez', 1000, 'blue');
const p2 = new Player('Elvishky', 1000, 'red');
const p3 = new Player('Blank', 1000, 'purple');
const p4 = new Player('Khonvoum', 1000, 'yellow');
const ball = new Ball('orange');
const Aud = new AuMan();
const cam = new Camera();
const start = new MENU.startBut();
const opt = new MENU.optionsBut();
const raycaster = new ray();
const cursor = new mouse(); 

window.onload = function() 
{
    /*initiateBall(canvas);
    initiateP1(canvas);
    initiateP2(canvas); */
}

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const mainMenu = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
const textureLoader = new THREE.TextureLoader();
const soccerBallTexture = textureLoader.load('../images/ball.jpg')
const pointLight = new THREE.PointLight(0xffffff, 1, 100);  // Color, intensity, distance
pointLight.position.set(10, 10, 10);  // Position the light in the scene
pointLight.castShadow = true;  // Enable shadow casting
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // White light with intensity 1
scene.add(ambientLight);
document.body.appendChild(renderer.domElement);

// Function to resize and center the canvas
function resizeRenderer() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;

  if (width / height > aspect) {
    // Wider than 16:9, adjust width
    renderer.setSize(height * aspect, height);
  } else {
    // Taller than 16:9, adjust height
    renderer.setSize(width, width / aspect);
  }

  // Center canvas
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = `${(window.innerHeight - renderer.domElement.height) / 2}px`;
  renderer.domElement.style.left = `${(window.innerWidth - renderer.domElement.width) / 2}px`;

  // Update camera aspect ratio
  cam.camera.aspect = aspect;
  cam.camera.updateProjectionMatrix();
}

// Initial resize and on window resize

window.addEventListener("resize", resizeRenderer);

THREE.Text

let modeFour = false; 
let modeSingle = true;

//camera.position.z = 50;

cam.camera.position.y = 100;
cam.camera.lookAt(0,0,0);

renderer.setAnimationLoop(menuLoop);  // Start the animation loop
resizeRenderer();
initiateStartBut();

let lastTime = 0; // Tracks the last time the loop   ran


function initiateStartBut()
{
    mainMenu.add(start.cube);
    mainMenu.add(opt.cube);
    start.cube.updateMatrixWorld();
    opt.cube.updateMatrixWorld();
}

async function menuLoop()
{
    renderer.render( mainMenu, cam.camera );
}

async function gameLoop(currentTime) 
{
    const deltaTime = currentTime - lastTime; // Time difference between frames
    lastTime = currentTime;
    
    update(deltaTime); // Update game state
    render();          // Render the game
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    p1.maxX = -39;
    if (modeFour)
    {
        p1.pad.position.z = -45
        p1.maxZ = 0;
    }
    scene.add( p1.pad );
}

function initiateP2(canvas)
{
    p2.Width = 10;
    p2.Height = 10;
    if (modeFour)
        p2.Depth = 30;
    else
        p2.Depth = 50;
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
    ball.material = new THREE.MeshStandardMaterial( { map:soccerBallTexture } );
    ball.sphere =  new THREE.Mesh( ball.geometry, ball.material );
    ball.sphere.position.z = Math.floor(Math.random() * 230) - 115;
    ball.sphere.castShadow = true;
    ball.sphere.receiveShadow = true;
    scene.add(ball.sphere);
    console.log(ball.sphere.position.x);
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
    bottomWall.position.z = 120;
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
        if (collideP2() || (modeFour && collideP4()))
        {
            ball.dirX = -1;
            Aud.ping2.play();
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
        Aud.lose.play();
        ball.speed = 0;
        ball.sphere.position.x = ball.startX;
        ball.sphere.position.z = ball.startZ;
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
    ball.sphere.rotation.x += 0.001 * deltaTime;
    ball.sphere.rotation.y += 0.001 * deltaTime;
    ball.sphere.position.x += ball.dirX * ball.speed * deltaTime;
    ball.sphere.position.z += ball.dirZ * ball.speed * deltaTime;
    ball.speed += 0.00001 * deltaTime;
    checkBallColl();
}

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

function impBot(deltaTime)
{
    let posZ;
    let posX;
    let dirX;
    let dirZ;

    
}

function update(deltaTime) 
{
	movementCam(deltaTime);
    movementUpdate(deltaTime, p1);
    if (modeSingle)
        impBot(deltaTime);
    else
    {
        movementUpdate(deltaTime, p2);
        if (modeFour == true)
        {
            movementUpdate(deltaTime, p3);
            movementUpdate(deltaTime, p4);
        }
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
	if (event.key === 'c')
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
    if (modeSingle)
        return;
    p2KeyUp(event);
    p3KeyUp(event);
    p4KeyUp(event);
}
);

document.addEventListener('mousemove', (event) => {
    cursor.vec.x = (event.clientX / window.innerWidth) * 2 - 1;
    cursor.vec.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
  
  // Function to detect click on the button
  function onClick(event) {
    start.cube.updateMatrixWorld();
    opt.cube.updateMatrixWorld();
    raycaster.caster.setFromCamera(cursor.vec, cam.camera);
    const intersects = raycaster.caster.intersectObjects(mainMenu.children);
    if (intersects.length > 0) {
        if (intersects[0].object === start.cube)
        {
            cam.camera.position.y = 180;
            lastTime = performance.now();
            renderer.setAnimationLoop(gameLoop);  // Start the animation loop
            initiateBall(renderer.domElement);
            initiateP1(renderer.domElement);
            initiateP2(renderer.domElement);
            initiateP3(renderer.domElement);
            initiateP4(renderer.domElement);
            initiatePlane(renderer.domElement);
            makeWall();
            resizeRenderer();
        }
        if (intersects[0].object === opt.cube)
            alert("second");
    }
    
}
  
  // Add event listener for mouse click
  document.addEventListener('click', onClick);