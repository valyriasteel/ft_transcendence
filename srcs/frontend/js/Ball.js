// Ball.js
export class Ball
{
    constructor(color) 
	{
		this.color = color;
		this.Radius = 10;
		this.widthSegments = 32;
		this.heightSegments = 16;
		this.maxX = 204;
		this.maxZ = 114;
		this.minX = -206;
		this.minZ = -115;
		this.dirX;
		this.dirZ;
		this.speed = 0.1;
		this.freeze = false;
		this.counter = 0;
		this.fourMode = false;
		this.startX = 0;
		this.startZ = 0;
		this.geometry;
		this.material;
		this.sphere;
		this.flag = true;
		this.texture;
    }

}
