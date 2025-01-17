// Player.js
export class AuMan
{
    constructor() 
	{
		this.ping = new Audio('../audio/live.wav');
		this.ping2 = new Audio('../audio/live.wav');
		this.ping3 = new Audio('../audio/live.wav');
		this.ping4 = new Audio('../audio/live.wav');
		this.lose = new Audio ('../audio/lose.wav')
	}

	volumeChange(vol)
	{
		this.ping.volume = vol;
		this.ping2.volume = vol;
		this.ping3.volume = vol;
		this.ping4.volume = vol;
		this.lose.volume = vol;
	}
}
