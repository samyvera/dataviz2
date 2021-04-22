// Class to control and keep track of a player data
class Player {
	x = 0;
	y = 0;
	left_key = false;
	up_key = false;
	right_key = false;
	down_key = false;
	speedX = 0;
	speedZ = 0;

	constructor(zOffset) {
		this.z = zOffset;
	}

	// function to call every frame that will update the players position and speed
	update = () => {
		this.x += this.speedX;
		this.z += this.speedZ;
		this.speedX *= 0.8;
		this.speedZ *= 0.8;
		if (this.left_key) this.speedX -= 0.5;
		if (this.right_key) this.speedX += 0.5;
		if (this.up_key) this.speedZ -= 0.5;
		if (this.down_key) this.speedZ += 0.5;
	}
}
let player;

// p5.js function to enable a directional deplacement when a certain input is pressed
function keyPressed() {
	if (keyCode == LEFT_ARROW) player.left_key = true;
	if (keyCode == UP_ARROW) player.up_key = true;
	if (keyCode == RIGHT_ARROW) player.right_key = true;
	if (keyCode == DOWN_ARROW) player.down_key = true;
}

// p5.js function to disable that same directional deplacement
function keyReleased() {
	if (keyCode == LEFT_ARROW) player.left_key = false;
	if (keyCode == UP_ARROW) player.up_key = false;
	if (keyCode == RIGHT_ARROW) player.right_key = false;
	if (keyCode == DOWN_ARROW) player.down_key = false;
}