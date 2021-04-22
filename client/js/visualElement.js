class VisualElement {
    size = 128 + Math.round(Math.random() * 128);
    offset = Math.round(Math.random() * 32);

    constructor(x, y, z, sound, category, subCategory, texture) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.sound = sound;
        this.category = category;
        this.texture = texture;
        this.color = hslToRgb(subCategory.length / 16, 1, 0.5);
    }
}