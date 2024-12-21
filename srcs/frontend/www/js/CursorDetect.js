import { Raycaster } from "./three.js";
import { Vector2 } from "./three.js";


export class ray
{
    constructor() 
	{
		this.caster = new Raycaster();
    }

}

export class mouse
{
    constructor() 
	{
		this.vec = new Vector2();
    }

}