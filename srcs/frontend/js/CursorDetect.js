import { Raycaster } from "three";
import { Vector2 } from "three";


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