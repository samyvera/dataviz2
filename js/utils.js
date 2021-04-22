// Fonction to convert colors from hsl to rbg
const hslToRgb = (h, s, l) => {
    let r, g, b;
    if(s === 0) r = g = b = l;
    else {
        const hue2rgb = (p, q, t) => {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Class for a plane that extends to infinity.
class IntersectPlane {
	constructor(n1, n2, n3, p1, p2, p3) {
		this.normal = createVector(n1, n2, n3); // The normal vector of the plane
		this.point = createVector(p1, p2, p3); // A point on the plane
		this.d = this.point.dot(this.normal);
	}
    
	getLambda = (Q, v) => (-this.d - this.normal.dot(Q)) / this.normal.dot(v);
}

// Function to calculate the distance between to points
const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);

// p5.js function that auto resize the canvas
function windowResized() {
	resizeCanvas(innerWidth, innerHeight);
}