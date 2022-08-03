class Bubble {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.expanding = true;
		this.poison = false;
		this.lethal = false;
		this.nuke = false;
		this.poisonTimeout = new Timer(
			() => (this.poison = true),
			20000 / (ageSpeed * (game.level / 3))
		);
		this.lethalTimeout = new Timer(
			() => (this.lethal = true),
			60000 / (ageSpeed * (game.level / 3))
		);

		this.rate = 1;
		this.popped = false;
		this.poppedValue = 0;
		this.alpha = 0.5;
	}

	grow() {
		for (let i = 0; i < bubbles.length; i++) {
			let x1 = this.x;
			let y1 = this.y;
			let x2 = bubbles[i].x;
			let y2 = bubbles[i].y;
			if (bubbles[i] != this) {
				let distance =
					Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) -
					bubbles[i].r -
					3;

				if (distance < this.r) {
					this.expanding = false;
				}
			}
		}
		for (let i = 0; i < mines.length; i++) {
			let x1 = this.x;
			let y1 = this.y;
			let x2 = mines[i].x;
			let y2 = mines[i].y;

			if (mines[i] != this) {
				let distance =
					Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) -
					mines[i].r -
					2;

				if (distance < this.r) {
					this.expanding = false;
				}
			}
		}
	}

	bubblePop() {
		this.popped = true;
		this.poppedValue = Math.pow(this.r, 2);

		if (this.poison) {
			this.poppedValue *= -1;
		}
		if (this.lethal) {
			game.death();
		}
	}
}
