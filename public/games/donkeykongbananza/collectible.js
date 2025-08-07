import { AABB } from './utils.js';

export class Collectible {
    constructor(x, y, type, assetManager, tileSize) {
        this.x = x;
        this.y = y;
        this.type = type; // e.g., 'gold'
        this.active = true;
        this.assetManager = assetManager;
        this.tileSize = tileSize; // Store tileSize to calculate draw position

        // Set size based on type
        if (this.type === 'banandium_gem') {
            this.width = tileSize * 0.9; // Make Banandium Gems larger
            this.height = tileSize * 0.9;
        } else {
            this.width = tileSize * 0.6; // Gold and other collectibles are smaller
            this.height = tileSize * 0.6;
        }
    }

    // Collectibles don't move or have complex updates on their own currently
    update(deltaTime) {
        // No movement logic for a static collectible
    }

    draw(ctx) {
        if (!this.active) return;
        const image = this.assetManager.getImage(this.type);
        if (image) {
            // Adjust position to center the collectible within its "tile" space
            const drawX = this.x + (this.tileSize - this.width) / 2; 
            const drawY = this.y + (this.tileSize - this.height) / 2; 
            ctx.drawImage(image, drawX, drawY, this.width, this.height);
        } else {
            ctx.fillStyle = 'yellow'; // Fallback
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        // ctx.strokeStyle = 'purple'; // Debug bounding box
        // ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}