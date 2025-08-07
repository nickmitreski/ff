import { AABB } from './utils.js';

export class Chunk {
    constructor(x, y, size, assetManager) {
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
        this.velX = 0;
        this.velY = 0;
        this.assetManager = assetManager;
        this.active = true; // True if it's in play (thrown or held), false if it landed and can be ignored
        this.held = false; // True if currently held by player
        this.bouncing = false; // For a slight bounce effect on landing
        this.bounceMagnitude = 0.5; // Percentage of velY to retain for bounce
    }

    hold() {
        this.held = true;
        this.active = true;
        this.velX = 0;
        this.velY = 0;
    }

    release(initialVelX, initialVelY) {
        this.held = false;
        this.velX = initialVelX;
        this.velY = initialVelY;
    }

    update(deltaTime, gravity, terrain) {
        if (!this.active) return;

        if (this.held) {
            // Position is updated by player.js
            return;
        }

        // Apply gravity
        this.velY += gravity;

        // Update position
        let newX = this.x + this.velX * deltaTime;
        let newY = this.y + this.velY;

        // Horizontal collision
        this.x = newX;
        let collidedTileX = this.checkTerrainCollision(terrain);
        if (collidedTileX) {
            const tileX = collidedTileX[0] * terrain.tileSize;
            if (this.velX > 0) { // Moving right
                this.x = tileX - this.width;
            } else if (this.velX < 0) { // Moving left
                this.x = tileX + terrain.tileSize;
            }
            this.velX = 0; // Stop horizontal movement
        }

        // Vertical collision
        this.y = newY;
        let collidedTileY = this.checkTerrainCollision(terrain);
        if (collidedTileY) {
            const tileY = collidedTileY[1] * terrain.tileSize;
            if (this.velY > 0) { // Falling and hit ground
                this.y = tileY - this.height; // Snap to ground
                if (Math.abs(this.velY) > gravity * 2) { // Only bounce if falling fast enough
                    this.velY *= -this.bounceMagnitude; // Bounce
                    this.bouncing = true;
                } else {
                    this.velY = 0; // Stop
                    this.active = false; // Chunk becomes inactive once settled
                }
            } else if (this.velY < 0) { // Moving up and hit ceiling
                this.y = tileY + terrain.tileSize; // Snap to ceiling
                this.velY = 0; // Stop
            }
        }
        
        // If bouncing, reduce velX over time
        if (this.bouncing) {
            this.velX *= 0.98; // Dampen horizontal speed
            if (Math.abs(this.velX) < 10 && Math.abs(this.velY) < 10) {
                this.bouncing = false;
                this.active = false; // Settle after bounce
            }
        }

        // Optionally, remove chunk if it falls off screen (for more complex levels)
        if (this.y > terrain.canvasHeight + this.height) {
             this.active = false;
        }
    }

    checkTerrainCollision(terrain) {
        const chunkLeft = this.x;
        const chunkRight = this.x + this.width;
        const chunkTop = this.y;
        const chunkBottom = this.y + this.height;

        const startCol = Math.floor(chunkLeft / terrain.tileSize);
        const endCol = Math.ceil(chunkRight / terrain.tileSize) - 1;
        const startRow = Math.floor(chunkTop / terrain.tileSize);
        const endRow = Math.ceil(chunkBottom / terrain.tileSize) - 1;

        for (let row = Math.max(0, startRow); row <= Math.min(terrain.map.length - 1, endRow); row++) {
            for (let col = Math.max(0, startCol); col <= Math.min(terrain.map[0].length - 1, endCol); col++) {
                const tileType = terrain.map[row][col];
                if (tileType === 1 || tileType === 2) { // Solid or breakable block
                    const tileX = col * terrain.tileSize;
                    const tileY = row * terrain.tileSize;
                    if (AABB(chunkLeft, chunkTop, this.width, this.height, tileX, tileY, terrain.tileSize, terrain.tileSize)) {
                        return [col, row]; // Return the grid coordinates of the colliding tile
                    }
                }
            }
        }
        return null; // No collision found
    }

    draw(ctx) {
        if (!this.active) return;
        const chunkImage = this.assetManager.getImage('chunk');
        if (chunkImage) {
            ctx.drawImage(chunkImage, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'grey'; // Fallback color
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        // ctx.strokeStyle = 'blue'; // Debug bounding box
        // ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}