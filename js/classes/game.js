class Game {
	constructor() {
		this.score = 0;
		this.level = 1;
		this.probability = 10;
		// this.blastRadius = 1;

		this.setup();
		this.animate = setInterval(() => this.draw(), 1000 / frameRate);
	}

	setup() {
		bubbles = [];
		poppers = [];
		mines = [];
		this.score = 0;
		this.level = 1;
		this.probability = 10;
		// this.blastRadius = 1;
		paused = false;
		// speed = 1;
		dead = false;
		// mouseDown = false;
	}

	// pause() {
	// 	clearInterval(this.animate);
	// }

	addToScore(amount) {
		this.score += amount;
	}

	drawDisplayUI() {
		let displayString = `High Score: ${highScore}     Score: ${this.score}     Level: ${this.level}     p: pause`;
		context.fillStyle = "rgb(255,255,255,0.4)";
		context.fillRect(0, 0, displayString.length * 11 - 110, 30);
		context.fillStyle = "black";
		context.font = "20px arial";

		context.fillText(displayString, 13, 21);
	}
	draw() {
		if (!paused && !dead) {
			context.fillStyle = "rgb(0,0,0,0.3)";

			context.fillRect(0, 0, width, height);

			this.createBubble();
			this.createPopper();
			this.createMine();
			this.drawBubbles();
			this.drawPoppers();
			this.drawMines();
			this.drawMissiles();

			this.levels();

			this.drawDisplayUI();
		} else if (paused) {
			context.fillStyle = "rgb(0,0,0,0.03)";

			context.fillRect(0, 0, width, height);

			context.fillStyle = "white";
			context.font = "100px Arial";
			context.fillText("PAUSED", width / 2 - 200, height / 2 + 50);
			context.strokeStyle = "red";
			context.font = "100px Arial";
			context.strokeText("PAUSED", width / 2 - 200, height / 2 + 50);
		}
	}

	death() {
		context.fillStyle = "rgb(0,0,0,0.3)";
		const deathMessage = "BAD BUBBLE";
		const restartMessage = "CLICK TO RESTART";
		context.fillRect(0, 0, width, height);
		context.fillStyle = "white";
		context.font = "100px Arial";
		context.fillText(deathMessage, width / 2 - 270, height / 2 + 50);
		context.font = "50px Arial";
		context.fillText(restartMessage, width / 2 - 200, height / 2 + 100);

		context.strokeStyle = "red";
		context.font = "100px Arial";
		context.strokeText(deathMessage, width / 2 - 270, height / 2 + 50);
		context.font = "50px Arial";
		context.strokeText(restartMessage, width / 2 - 200, height / 2 + 100);

		this.paused = true;
		dead = true;
		if (this.score > highScore) {
			highScore = this.score;
		}
	}

	levels() {
		if (this.score > LEVELS.LEVEL1 && this.score < LEVELS.LEVEL2) {
			this.level = 2;
			this.probability += this.level / 100;
		}
		if (this.score > LEVELS.LEVEL2 && this.score < LEVELS.LEVEL3) {
			this.level = 3;
			this.probability += this.level / 50;
		}
		if (this.score > LEVELS.LEVEL3 && this.score < LEVELS.LEVEL4) {
			this.level = 3;
			this.probability += this.level / 25;
		}
		if (this.score > LEVELS.LEVEL4 && this.score < LEVELS.LEVEL5) {
			this.level = 4;
			this.probability += this.level / 5;
		}
		if (this.score > LEVELS.LEVEL5 && this.score < LEVELS.LEVEL6) {
			this.level = 5;

			this.probability += this.level;
		}
		if (this.score > LEVELS.LEVEL6 && this.score < LEVELS.LEVEL7) {
			this.level = 6;

			this.probability += this.level;
		}
		if (this.score > LEVELS.LEVEL7 && this.score < LEVELS.LEVEL8) {
			this.level = 7;

			this.probability += this.level * 2;
		}
		if (this.score > LEVELS.LEVEL8 && this.score < LEVELS.LEVEL9) {
			this.level = 8;

			this.probability += this.level * 2;
		}
		if (this.score > LEVELS.LEVEL9 && this.score < LEVELS.LEVEL10) {
			this.level = 9;

			this.probability += this.level * 2;
		}
	}

	drawBubbles() {
		if (bubbles != []) {
			for (let i = 0; i < bubbles.length; i++) {
				if (bubbles[i].expanding) {
					bubbles[i].grow();
					bubbles[i].r += bubbles[i].rate;
				}

				if (bubbles[i].popped) {
					context.beginPath();
					context.arc(bubbles[i].x, bubbles[i].y, bubbles[i].r, 0, Math.PI * 2);
					if (bubbles[i].poppedValue > 0) {
						context.strokeStyle = "lightblue";
					} else {
						context.strokeStyle = "red";
					}

					context.stroke();
					bubbles[i].alpha -= 0.01;

					context.fillStyle = `rgb(155,155,155,${bubbles[i].alpha})`;
					context.fill();
					let x = bubbles[i].x;
					let y = bubbles[i].y;
					let plusMinus = bubbles[i].poppedValue > 0 ? "+" : "";
					let text = plusMinus + `${Math.floor(bubbles[i].poppedValue)}`;

					let fontSize = scaleMap(bubbles[i].r, 0, 1000, 5, 100);
					if (bubbles[i].poppedValue > 0) {
						context.fillStyle = "lightblue";
					} else {
						context.fillStyle = "red";
					}
					context.font = `${fontSize}px arial`;

					context.fillText(text, x - fontSize * 1.5, y + fontSize / 2);

					continue;
				}
				context.beginPath();
				context.arc(bubbles[i].x, bubbles[i].y, bubbles[i].r, 0, Math.PI * 2);
				context.strokeStyle = "white";

				context.stroke();
				if (bubbles[i].poison) {
					if (bubbles[i].lethal) {
						context.fillStyle = "rgb(255,0,0, 0.7)";
						context.fill();
					}
					context.fillStyle = "rgb(255,0,0,0.1)";
					context.fill();
				}

				// console.log(bubbles[i]);
			}
		}
	}

	createBubble() {
		let rand = Math.random() * 100;
		let pos = getRandomPos();
		// console.log(checkValid(pos[0], pos[1]));
		// console.log(pos);
		if (rand < this.probability) {
			if (
				checkValid(pos[0], pos[1], false, bubbles) &&
				checkValid(pos[0], pos[1], false, mines)
			) {
				let bubble = new Bubble(pos[0], pos[1], 1);
				bubbles.push(bubble);
			}
		}
	}

	drawPoppers() {
		if (poppers.length != 0) {
			for (let i = 0; i < poppers.length; i++) {
				poppers[i].draw();
				poppers[i].move();
			}
		}
	}

	createPopper() {
		if (this.level >= 3) {
			let rand = Math.random() * 100;

			if (rand < this.level / 4) {
				let popper = new Popper();
				poppers.push(popper);
			}
		}
	}
	drawMines() {
		if (mines != []) {
			for (let i = 0; i < mines.length; i++) {
				if (mines[i].expanding) {
					mines[i].grow();
					mines[i].r += mines[i].rate;
				}

				if (mines[i].popped) {
					// context.beginPath();
					// context.arc(mines[i].x, mines[i].y, mines[i].r, 0, Math.PI * 2);
					context.moveTo(mines[i].x, mines[i].y);

					context.beginPath();
					// context.moveTo(posX - r, posY - r);

					let verts = Math.floor(mines[i].r) + 3;
					for (let j = 0; j < verts; j++) {
						let angle = (j * Math.PI * 2) / verts + Math.PI / 2;
						let rX = mines[i].r + Math.random() * 10 - 5;

						let x = Math.cos(angle) * rX + mines[i].x;
						let y = Math.sin(angle) * rX + mines[i].y;
						context.lineTo(x, y);
					}
					mines[i].alpha -= 0.01;
					context.closePath();
					context.strokeStyle = "lightblue";
					// context.lineWidth = (1 - mines[i].alpha) * 10;

					context.stroke();

					context.fillStyle = `rgb(155,155,155,${mines[i].alpha})`;
					context.fill();
					let x = mines[i].x;
					let y = mines[i].y;
					let text = `${Math.floor(mines[i].poppedValue)}`;
					let fontSize = scaleMap(mines[i].r, 0, 1000, 5, 100);
					context.fillStyle = "lightblue";
					context.font = `${fontSize}px arial`;

					context.fillText(text, x - fontSize * 1.5, y + fontSize / 2);

					continue;
				}
				context.moveTo(mines[i].x, mines[i].y);

				context.beginPath();
				// context.moveTo(posX - r, posY - r);

				let x, y;
				let verts = Math.floor(mines[i].r) + 3;
				for (let j = 0; j < verts; j++) {
					let angle = (j * Math.PI * 2) / verts + Math.PI / 2;
					let rX = mines[i].r + Math.random() * 2 - 1;

					x = Math.cos(angle) * rX + mines[i].x;
					y = Math.sin(angle) * rX + mines[i].y;
					context.lineTo(x, y);
				}
				context.closePath();
				context.strokeStyle = "green";
				context.stroke();

				// console.log(bubbles[i]);
			}
		}
	}

	createMine() {
		if (this.level >= 4) {
			let rand = Math.random() * 100;
			let pos = getRandomPos();
			if (rand < this.level) {
				let valid =
					checkValid(pos[0], pos[1], false, bubbles) &&
					checkValid(pos[0], pos[1], false, mines);
				if (valid) {
					let mine = new Mine(pos[0], pos[1], 1);
					mines.push(mine);
				}
			}
		}
	}
	drawMissiles() {
		if (missiles != []) {
			for (let i = 0; i < missiles.length; i++) {
				missiles[i].draw();
				missiles[i].move();
			}
		}
	}
}