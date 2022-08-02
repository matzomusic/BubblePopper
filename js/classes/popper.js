class Popper {
	constructor() {
		this.x = Math.random() * width;
		this.y = Math.random() * height;
		this.vector = [0, 0];
		this.velocity = 5;
		this.radius = 10;
		// console.log("hello popper");
	}

	move() {
		if (this.x < 0 || this.x > width || this.y < 0 || this.x > width) {
			poppers.splice(poppers.indexOf(this), 1);
		}
		this.x += this.vector[0];
		this.y += this.vector[1];
		let rX = Math.random() * this.velocity - this.velocity / 2;
		let rY = Math.random() * this.velocity - this.velocity / 2;
		this.vector[0] += rX;
		this.vector[1] += rY;
		this.gravity();

		let withinBubble = !checkValid(this.x, this.y, false, bubbles);
		if (withinBubble) {
			playBadPop();
			let bubble = checkValid(this.x, this.y, true, bubbles);
			bubbles.splice(bubbles.indexOf(bubble), 1);
		}

		this.launchMissile();
	}

	gravity() {
		bubbles.forEach((bubble) => {
			let distanceX = this.x - bubble.x;
			let distanceY = this.y - bubble.y;
			let forceX = gravity * (Math.pow(bubble.r, 2) / Math.pow(distanceX, 2));
			let forceY = gravity * (Math.pow(bubble.r, 2) / Math.pow(distanceY, 2));
			this.vector[0] -= (distanceX / Math.cos(forceX)) * bubble.r * gravity;
			this.vector[1] -= (distanceY / Math.cos(forceY)) * bubble.r * gravity;
		});
	}

	getAngle() {
		let angle = Math.atan2(this.vector[1], this.vector[0]); //radians
		// you need to devide by PI, and MULTIPLY by 180:
		let degrees = (180 * angle) / Math.PI; //degrees
		return (360 + Math.round(degrees)) % 360; //round number, avoid decimal fragments
	}

	launchMissile() {
		if (game.level >= 4) {
			let rand = Math.random() * 100;

			if (rand < game.level) {
				let missile = new Missile(this.x, this.y, this.getAngle());
				missiles.push(missile);
				playZapp();
			}
		}
	}
	draw() {
		context.beginPath();
		let x, y;
		for (let i = 0; i < 3; i++) {
			let angle = (i * Math.PI * 2) / 3 + this.getAngle() + Math.PI / 2;
			let rX = this.radius + Math.random() * 2 - 1;

			x = Math.cos(angle) * rX + this.x;
			y = Math.sin(angle) * rX + this.y;
			context.lineTo(x, y);
		}
		context.closePath();
		context.fillStyle = "white";
		context.fill();
	}
}
