class Mine {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.expanding = true;
		this.rate = 1;
		this.popped = false;
		this.poppedValue = 0;
		this.alpha = 0.5;
		this.blastR = 1.1 * game.blastRadius;
	}

	grow() {
		for (let i = 0; i < bubbles.length; i++) {
			let x1 = this.x;
			let y1 = this.y;
			let x2 = bubbles[i].x;
			let y2 = bubbles[i].y;
			let distance =
				Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) -
				bubbles[i].r -
				3;

			if (distance < this.r) {
				this.expanding = false;
			}
		}
		for (let i = 0; i < mines.length; i++) {
			if (mines[i] != this) {
				let x1 = this.x;
				let y1 = this.y;
				let x2 = mines[i].x;
				let y2 = mines[i].y;
				let distance =
					Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) -
					mines[i].r -
					3;

				if (distance < this.r) {
					this.expanding = false;
				}
			}
		}
	}

	explode() {
		playExplode();
		this.popped = true;
		this.poppedValue = Math.pow(this.r, 2);
		let neighbors = checkNeighbors(this.x, this.y, this.r)[0];
		let mineNeighbors = checkNeighbors(this.x, this.y, this.r)[1];
		if (neighbors != []) {
			neighbors.forEach((neighbor) => {
				mousePop(neighbor.x, neighbor.y);
			});
		}
		if (mineNeighbors != []) {
			mineNeighbors.forEach((neighbor) => {
				mousePop(neighbor.x, neighbor.y);
			});
		}
	}
}
