// Data tables
let esc50Table, categoryTable;
let categories;
// Sound elements
const soundElements = [];
// Images
let playerSprite, floorTexture;
// Raycasting data
let eyeZ, floor;
const floorOffset = -100;
// Sound amplitude data
let volHistory, amp;
// Visual elements
let visualElements = [];
const yOrigin = -400;
const zOffset = 500;
// Player
player = new Player(zOffset);
// Select
let select;
let selectOptions;
// Slider
let slider;

function preload() {
	// Load data tables then sounds & textures
	esc50Table = loadTable('../asset/esc50.csv', 'csv', 'header', () => {
		// 50 unique category values
		categories = esc50Table.getColumn('category').filter((value, index, categoryArray) => categoryArray.indexOf(value) === index);
		selectOptions = ["default", ...categories];
		categoryTable = loadTable('../asset/Category.csv', 'csv', 'header', () => {
			// Load X random sound elements
			soundFormats('wav');
			for (let i = 0; i < 400; i++) {
				// From the loaded tables attach a category to each sound element
				const tableObj = esc50Table.getRow(Math.floor(Math.random() * esc50Table.rows.length)).obj;
				const subCategory = tableObj.category;
				soundElements.push({
					sound: loadSound('../asset/audio/' + tableObj.filename),
					subCategory: subCategory,
					category: categoryTable.findRow(subCategory, 'Type').obj.Category,
					texture: loadImage('../asset/PICTOS/' + subCategory + '.png'),
				});
			}
		});
	});

	// Load other textures
	playerSprite = loadImage('../asset/player.png');
	floorTexture = loadImage('../asset/floor.jpg');
}

function setup() {
	// Create canvas with 3D context
	createCanvas(innerWidth, innerHeight, WEBGL);
	frameRate(30);

	// The default distance the camera is away from the origin (used for raycasting)
	eyeZ = height / 2 / tan((30 * PI) / 180);

	// Floor plane (used for raycasting)
	floor = new IntersectPlane(0, 1, 0, 0, floorOffset, 0);

	// Array to keep track of the sound amplitude
	volHistory = Array(width).fill(0);
	amp = new p5.Amplitude();

	// Global visual parameters
	ambientMaterial(255);
	noStroke();

	// Create select
	select = createSelect();
	select.position(8, 16);
	selectOptions.forEach(category => select.option(category));

	// Create slider
	slider = createSlider(0, 100, 20);
	slider.position(8, 48);
	slider.style('width', '100px');
}

// Visual wave representation with special textures for sound elements
const targetShadow = (pos, baseSize, color, offset = 0, textureImg = null) => {
	push();
	noFill();
	translate(pos);
	rotateX((90 * PI) / 180);

	// Display the sound category texture
	if (textureImg) {
		push();
		translate(0,0,1);
		texture(textureImg);
		plane(baseSize)
		pop();
	}

	translate(0,0,4);
	const cursorCircles = 4;
	const cursorTotalFrame = 180;
	// Display multiple waves with different sizes
	for (let i = 0; i < cursorCircles; i++) {
		const cursorFrame = (frameCount + offset + i * cursorTotalFrame / cursorCircles) % cursorTotalFrame;
		stroke(`rgba(${color[0]}%, ${color[1]}%, ${color[2]}%, ${1 - cursorFrame / cursorTotalFrame})`);
		ellipse(Math.round((Math.random() * 20 - 10) * amp.getLevel()), Math.round((Math.random() * 20 - 10) * amp.getLevel()), baseSize + cursorFrame / 4, baseSize + cursorFrame / 4);
	}
	pop();
}

function draw() {
	// Get the navigator's sound volume
	const currentVolume = amp.getLevel();
	volHistory.push(currentVolume);


	// Raycasting (get the mouse relative position to the floor plane)
	const x = mouseX - width / 2;
	const y = mouseY - height / 2;
	const Q = createVector(0, 0, eyeZ); // A point on the ray and the default position of the camera.
	const v = createVector(x, y, -eyeZ); // The direction vector of the ray.
	let intersect; // The point of intersection between the ray and a plane.
	let lambda = floor.getLambda(Q, v); // The value of lambda where the ray intersects the object
	if (lambda > 0 && lambda < 1) intersect = p5.Vector.add(Q, p5.Vector.mult(v, lambda)); // Position of the intersection of the ray and the object.
	translate(0, -floorOffset, 0);


	// Lights
	pointLight(255, 255, 255, 0, 0, 500);
	colorMode(HSB);
	ambientLight((Math.cos(frameCount * 0.01 + currentVolume) / 2 + 0.5) * 255, 122, 255);


	// Achromatic background with a sound volume dependence
	push();
	colorMode(HSB);
	background(0, 0, map(currentVolume, 0, 1, 0, 100));
	pop();


	// Floor
	push();
	translate(0, 0, 20);
	rotateX((90 * PI) / 180);
	texture(floorTexture)
	plane(2000, 1500);
	pop();


	// Volume visualizer
	push();
	translate(-width / 2, -height / 2 + floorOffset, 0);
	noStroke();
	fill('#fff1');
	rect(0, 0, width, 8);
	fill('#fff');
	rect(0, 0, currentVolume * width, 8);
	pop();


	// Cursor
	push();
	translate(0, floorOffset, 0);
	if (intersect) targetShadow(intersect, 0, [255, 0, 0]);
	pop();


	// Add new random visual elements
	if (Math.random() > 1 - slider.value() / 1000) {
		const filter = soundElements.find(soundElement => soundElement.subCategory === select.value()) ? select.value() : null;
		const filteredElements = filter ? soundElements.filter(soundElement => soundElement.subCategory === filter) : soundElements;
		const randomSound = filteredElements[Math.floor(Math.random() * filteredElements.length)];
		visualElements.push(new VisualElement(
			Math.round(Math.random() * 400 - 200),
			yOrigin,
			Math.round(Math.random() * 400 - 200) + 500,
			randomSound.sound,
			randomSound.category,
			randomSound.subCategory,
			randomSound.texture
		));
	}


	// Filter used visual elements
	visualElements = visualElements.filter(visualElement => visualElement.y < 0);


	// Display current visual elements
	visualElements.forEach(visualElement => {
		visualElement.y++;
		targetShadow(createVector(visualElement.x, 0, visualElement.z), visualElement.size * (1 - map(visualElement.y, yOrigin, 0, 1, 0)), visualElement.color, visualElement.offset, visualElement.texture);
		push();
		translate(visualElement.x, visualElement.y + 90, visualElement.z);
		// // rotateZ((frameCount % 30 < 15 ? 1 : -1) * Math.PI * 0.0625);
		rotateX(frameCount * 0.05 * (visualElement.offset % 2 ? 1 : -1))
		// rotateY(frameCount * 0.1)
		rotateZ(frameCount * 0.05 * (visualElement.offset % 2 ? 1 : -1))
		specularMaterial(250);
		shininess(1);
		scale(1 + currentVolume * 3);
		const meshSize = 40;
		// Display a shape depending the sound category
		switch (visualElement.category) {
			case 'Maison':
				box(meshSize / 4, meshSize / 4, meshSize / 4);
				break;
			case 'Meteo':
				cone(meshSize / 4, meshSize / 4);
				break;
			case 'Animaux':
				sphere(meshSize / 4);
				break;
			case 'Action_Humaine':
				torus(meshSize / 6, meshSize / 12);
				break;
			case 'Exterieur':
				cylinder(meshSize / 4, meshSize / 4);
			case 'Outils':
				plane(meshSize / 4);
			default:
				break;
		}
		pop();
	});


	// Player
	player.update();
	player.x += Math.round((Math.random() * 20 - 10) * currentVolume);
	player.z += Math.round((Math.random() * 20 - 10) * currentVolume);
	targetShadow(createVector(player.x, player.y, player.z), 32, [0, 0, 255]);
	// Player sprite animation
	push();
	translate(player.x, player.y, player.z);
	rotateZ((frameCount % 16 < 8 ? 1 : -1) * Math.PI * 0.05);
	image(playerSprite, -25, -50, 50, 50);
	pop();


	// Manage sound effects and volume
	visualElements.forEach(elem => {
		const dist = distance(createVector(elem.x, player.y, elem.z), player);
		if (dist < elem.size && !elem.sound.isPlaying()) {
			elem.sound.setVolume(map(dist, elem.size, 0, 0, 1));
			elem.sound.play();
		}
	});
}