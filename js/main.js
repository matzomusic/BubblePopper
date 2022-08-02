//* Get device type

//* Canvas

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
const width = rect.width;
const height = rect.height;

//* Audio

// const AudioContext = window.AudioContext || window.webkitAudioContext;
// const audioContext = new AudioContext();
const audio = document.querySelectorAll("audio");
const goodPop = document.getElementById("good-pop");
const badPop = document.getElementById("bad-pop");
const levelUp = document.getElementById("level-up");
const zapp = document.getElementById("zapp");
const explodeSound = document.getElementById("explode");
const deathSound = document.getElementById("death");

let muted = true;

//* Public variables

const mult = 1;

const gravity = 0.0000005;

const frameRate = 30;
const ageSpeed = 1;

const LEVELS = {
	LEVEL1: 200000 / mult,
	LEVEL2: 1000000 / mult,
	LEVEL3: 2000000 / mult,
	LEVEL4: 5000000 / mult,
	LEVEL5: 10000000 / mult,
	LEVEL6: 50000000 / mult,
	LEVEL7: 100000000 / mult,
	LEVEL8: 200000000 / mult,
	LEVEL9: 500000000 / mult,
	LEVEL10: 1000000000 / mult,
};

const muteButtonMap = [0, 30, 70, 30];
const pauseButtonMap = [0, 60, 70, 30];

let bubbles = [];
let poppers = [];
let mines = [];
let missiles = [];
let highScore = 0;

let paused = false;
let dead = false;

//* Public functions

function getRandomPos() {
	let x = Math.floor(Math.random() * width);
	let y = Math.floor(Math.random() * height);

	return [x, y];
}

//Check if a given coordinate is within a bubble or mine and returns either the object or a boolean
function checkValid(x, y, returnBubble, list) {
	if (list.length != 0) {
		for (let i = 0; i < list.length; i++) {
			let x1 = x;
			let y1 = y;
			let x2 = list[i].x;
			let y2 = list[i].y;

			let distance =
				Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) - 10;

			if (distance < list[i].r) {
				if (!returnBubble) {
					return false;
				} else {
					return list[i];
				}
			}
		}
	}
	if (!returnBubble) {
		return true;
	}
}

//Check all the neighbors of a given cell using its position and radius
function checkNeighbors(xPos, yPos, r) {
	let neighbors = [];
	let mineNeighbors = [];
	let x, y;
	let rX = r * 1.2;
	for (let i = 0; i < 360; i++) {
		let angle = (i * Math.PI * 2) / 360 + Math.PI / 2;
		x = Math.cos(angle) * rX + xPos;
		y = Math.sin(angle) * rX + yPos;
		let neighbor = checkValid(x, y, true, bubbles);
		if (neighbor) {
			neighbors.push(neighbor);
		}
		let mine = checkValid(x, y, true, mines);
		if (mine) {
			mineNeighbors.push(mine);
		}
	}

	return [neighbors, mineNeighbors];
}

//For scaling/mapping numbers to a range
function scaleMap(input, lowIn, highIn, lowOut, highOut) {
	let result =
		lowOut + ((highOut - lowOut) / (highIn - lowIn)) * (input - lowIn);
	return result;
}

function pauseBubbles() {
	if (bubbles != []) {
		bubbles.forEach((bubble) => {
			bubble.poisonTimeout.pause();
			bubble.lethalTimeout.pause();
		});
	}
}

function resumeBubbles() {
	if (bubbles != []) {
		bubbles.forEach((bubble) => {
			bubble.poisonTimeout.resume();
			bubble.lethalTimeout.resume();
		});
	}
}

class Timer {
	constructor(callback, delay) {
		var timerId,
			start,
			remaining = delay;

		this.pause = function () {
			window.clearTimeout(timerId);
			timerId = null;
			remaining -= Date.now() - start;
		};

		this.resume = function () {
			if (timerId) {
				return;
			}

			start = Date.now();
			timerId = window.setTimeout(callback, remaining);
		};

		this.resume();
	}
}

function playGoodPop() {
	if (!muted) {
		goodPop.currentTime = 0;
		goodPop.play();
	}
}
function playBadPop() {
	if (!muted) {
		badPop.currentTime = 0;
		badPop.play();
	}
}
function playLevelUp() {
	if (!muted) {
		levelUp.currentTime = 0;
		levelUp.play();
	}
}
function playZapp() {
	if (!muted) {
		zapp.currentTime = 0;
		zapp.play();
	}
}
function playExplode() {
	if (!muted) {
		explodeSound.currentTime = 0;
		explodeSound.play();
	}
}
function playDeath() {
	if (!muted) {
		deathSound.currentTime = 0;
		deathSound.play();
	}
}

function mousePop(xPos, yPos) {
	let x = Math.floor(xPos);
	let y = Math.floor(yPos);

	if (!checkValid(x, y, false, bubbles)) {
		let bubble = checkValid(x, y, true, bubbles);
		if (!bubble.popped) {
			bubble.bubblePop();
			game.addToScore(bubble.poppedValue);
			if (bubble.poppedValue > 0) {
				playGoodPop();
			} else {
				playBadPop();
			}
		}

		let anim1 = setTimeout(() => disposeBubble(bubble, x, y), 500);
	}

	if (!checkValid(x, y, false, mines)) {
		let mine = checkValid(x, y, true, mines);
		if (!mine.popped) {
			mine.explode();
			game.addToScore(mine.poppedValue);
		}
		let anim2 = setTimeout(() => disposeMine(mine, x, y), 500);
	}
}

function disposeBubble(bubble, x, y) {
	if (!checkValid(x, y, false, bubbles)) {
		bubbles.splice(bubbles.indexOf(bubble), 1);
	}
}
function disposeMine(mine, x, y) {
	if (!checkValid(x, y, false, mines)) {
		mines.splice(mines.indexOf(mine), 1);
	}
}

function mute() {
	audio.forEach((output) => {
		output.muted = true;
	});
}
function unMute() {
	audio.forEach((output) => {
		output.muted = false;
	});
}

let game = new Game();

//* User input

window.addEventListener("mousedown", () => {
	if (dead) {
		game.setup();
	}
});

canvas.addEventListener("mousemove", (e) => {
	if (!paused && !dead) {
		mousePop(e.offsetX, e.offsetY);
		if (game.score >= LEVELS.LEVEL8) {
			let rand = Math.random() * 100;
			let angle = Math.random() * 360;

			if (rand < game.level / 4) {
				playZapp();
				let missile = new Missile(e.offsetX, e.offsetY, angle);
				missiles.push(missile);
			}
		}
	}
});

canvas.addEventListener(
	"touchmove",
	(e) => {
		if (!paused && !dead) {
			mousePop(e.offsetX, e.offsetY);
			if (game.score >= LEVELS.LEVEL8) {
				let rand = Math.random() * 100;
				let angle = Math.random() * 360;

				if (rand < game.level / 4) {
					playZapp();
					let missile = new Missile(e.offsetX, e.offsetY, angle);
					missiles.push(missile);
				}
			}
		}
	},
	false
);

canvas.addEventListener("mousedown", (e) => {
	let x = e.offsetX;
	let y = e.offsetY;

	if (
		x > muteButtonMap[0] &&
		x < muteButtonMap[2] &&
		y > muteButtonMap[1] &&
		y < muteButtonMap[3] + muteButtonMap[2]
	) {
		if (!muted) {
			mute();
			muted = true;
		} else {
			unMute();
			muted = false;
		}
	}
	if (
		x > pauseButtonMap[0] &&
		x < pauseButtonMap[2] &&
		y > pauseButtonMap[1] &&
		y < pauseButtonMap[3] + pauseButtonMap[2]
	) {
		if (!paused) {
			paused = true;

			pauseBubbles();
		} else {
			paused = false;

			resumeBubbles();
		}
	}
});

document.addEventListener("keydown", (e) => {
	switch (e.key) {
		case "p":
		case "P":
			if (!paused) {
				paused = true;

				pauseBubbles();
			} else {
				paused = false;

				resumeBubbles();
			}
			break;
		case "m":
		case "M":
			if (!muted) {
				mute();
				muted = true;
			} else {
				unMute();
				muted = false;
			}
	}
});
