class Missile {
	constructor(x, y, heading) {
		this.x = x;
		this.y = y;
		this.heading = heading;
		this.velocity = 45;
		this.radius = 5;
		// console.log("hello popper");
	}

	move() {
		if (this.x < 0 || this.x > width || this.y < 0 || this.x > width) {
			missiles.splice(missiles.indexOf(this), 1);
		}
		// this.x -= cos(this.velocity) * ;
		// this.y -= this.vector[1] * this.velocity;
		// let x = Math.floor(Math.random() * 2) * this.velocity;
		// let y = Math.floor(Math.random() * 2) * this.velocity;
		let x = Math.cos(this.heading) * this.velocity;
		let y = Math.sin(this.heading) * this.velocity;
		this.x -= x;
		this.y -= y;

		let withinBubble = !checkValid(this.x, this.y, false, bubbles);
		if (withinBubble) {
			let bubble = checkValid(this.x, this.y, true, bubbles);
			bubbles.splice(bubbles.indexOf(bubble), 1);
		}
	}

	draw() {
		context.beginPath();
		// context.moveTo(posX - r, posY - r);

		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

		context.fillStyle = "white";
		context.fill();
	}
}
