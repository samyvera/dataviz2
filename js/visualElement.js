class VisualElement {
    color = hslToRgb(Math.random(), 1, 0.5);
    size = 128 + Math.round(Math.random() * 128);
    offset = Math.round(Math.random() * 32);

    constructor(x, y, z, sound, category) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.sound = sound;
        this.category = category;
    }
}