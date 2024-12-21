// Player.js
export class Player 
{
    constructor(name, score, color) 
	{
        this.name = name;
        this.score = score;
		this.color = color;
		this.movUp = false;
		this.movDown = false;
		this.movLeft = false;
		this.movRight = false;
		this.Height;
		this.Width;
		this.Depth;
		this.maxX = 203;
		this.maxZ = 115;
		this.minX = -206;
		this.minZ = -115;
		this.geometry;
		this.material;
		this.pad;
		this.speed = 0.2;
    }

    displayInfo() 
	{
        console.log(`${this.name} has a score of ${this.score}`);
    }

	renderOn()
	{
		this.toBeRendered = true;
	}

	renderOff()
	{
		this.toBeRendered = false;
	}
}
