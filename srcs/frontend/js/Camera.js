// Player.js
import { PerspectiveCamera } from "three";
export class Camera 
{
    constructor() 
	{
		this.camera = new PerspectiveCamera(75, 16 / 9, 0.1, 1000);
		this.movUp = false;
		this.movDown = false;
		this.movLeft = false;
		this.movRight = false;
		this.lookUp = false;
		this.lookDown = false;
		this.lookRight = false;
		this.lookLeft = false;
		this.moving = false;
		this.speed = 0.1;
		this.enable = false;
    }
}
