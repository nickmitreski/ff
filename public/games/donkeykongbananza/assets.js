export class AssetManager {
    constructor() {
        this.images = {};
        this.loadedCount = 0;
        this.totalCount = 0;
        this.callback = null;
    }

    queueImage(name, path) {
        this.totalCount++;
        const img = new Image();
        img.onload = () => {
            this.loadedCount++;
            if (this.isDone() && this.callback) {
                this.callback();
            }
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${path}`);
            this.loadedCount++; // Still increment to avoid getting stuck
            if (this.isDone() && this.callback) {
                this.callback();
            }
        };
        img.src = path;
        this.images[name] = img;
    }

    isDone() {
        return this.loadedCount === this.totalCount;
    }

    onDone(callback) {
        this.callback = callback;
        if (this.isDone()) { // In case assets loaded before callback was set
            this.callback();
        }
    }

    getImage(name) {
        return this.images[name];
    }
}