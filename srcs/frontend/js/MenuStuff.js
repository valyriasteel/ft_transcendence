import * as THREE from './three.js';
export class startBut 
{
	constructor() 
	{
		this.geometry = new THREE.BoxGeometry( 50, 1, 50 );
		this.material = new THREE.MeshBasicMaterial( { color: 'green' } );
		this.cube = new THREE.Mesh( this.geometry, this.material );
		this.cube.position.x = -40;
	}
}

export class optionsBut 
{
	constructor() 
	{
		this.geometry = new THREE.BoxGeometry( 50, 1, 50 );
		this.material = new THREE.MeshBasicMaterial( { color: 'red' } );
		this.cube = new THREE.Mesh( this.geometry, this.material );
		this.cube.position.x = 40;
	}
}
