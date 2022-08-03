class Nuke extends Bubble {
	constructor(x, y, r) {
		super();
		this.x = x;
		this.y = y;
		this.r = r;

		super.nuke = true;
	}
	bubblePop() {
		this.popped = true;
		this.poppedValue = Math.pow(this.r, 2);

		if (this.poison) {
			this.poppedValue *= -1;
		}
		if (this.nuke) {
			bubbles.forEach((bubble) => {
				if (bubble.poison || bubble.lethal) {
					bubbles.splice(bubbles.indexOf(bubble), 1);
				}
			});
		}
		if (this.lethal) {
			game.death();
		}
	}
}
