import { AABB } from './utils.js';

export class BouncerEnemy {
    constructor(x, y, width, height, assetManager, terrain, soundManager, tileSize, game) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velX = 150; // pixels per second
        this.velY = -10; // Initial upward bounce velocity, negative for up
        this.bounceStrength = 10; // Magnitude of bounce velocity when hitting ground/ceiling
        this.assetManager = assetManager;
        this.terrain = terrain;
        this.soundManager = soundManager;
        this.tileSize = tileSize;
        this.game = game;
        this.active = true; // True if enemy is alive

        this.flickerTimer = 0; // For visual feedback when hit (even if 1-hit kill)
        this.flickerDuration = 0.1;
        this.isHitVisual = false;
    }

    update(deltaTime, gravity) {
        if (!this.active) return;

        // Apply gravity
        this.velY += gravity;

        // Calculate potential new position
        let newX = this.x + this.velX * deltaTime;
        let newY = this.y + this.velY;

        // Horizontal collision (for walls)
        this.x = newX;
        let collidedTileX = this.checkCollisionX(this.terrain);
        if (collidedTileX) {
            const tileX = collidedTileX[0] * this.tileSize;
            if (this.velX > 0) { // Moving right, hit left side of tile
                this.x = tileX - this.width;
            } else if (this.velX < 0) { // Moving left, hit right side of tile
                this.x = tileX + this.tileSize;
            }
            this.velX *= -1; // Reverse horizontal direction
        }

        // Vertical collision (for ground/ceiling)
        this.y = newY;
        let collidedTileY = this.checkCollisionY(this.terrain);
        if (collidedTileY) {
            const tileY = collidedTileY[1] * this.tileSize;
            if (this.velY > 0) { // Falling and hit ground
                this.y = tileY - this.height;
                this.velY = -this.bounceStrength; // Bounce up
            } else if (this.velY < 0) { // Moving up and hit ceiling
                this.y = tileY + this.tileSize;
                this.velY = 0; // Stop vertical movement, will fall next frame
            }
        }

        // Update hit visual timer
        if (this.isHitVisual) {
            this.flickerTimer += deltaTime;
            if (this.flickerTimer >= this.flickerDuration) {
                this.isHitVisual = false;
                this.flickerTimer = 0;
            }
        }
    }

    checkCollisionX(terrain) {
        const enemyLeft = this.x;
        const enemyRight = this.x + this.width;
        const enemyTop = this.y;
        const enemyBottom = this.y + this.height;

        const startCol = Math.floor(enemyLeft / this.tileSize);
        const endCol = Math.ceil(enemyRight / this.tileSize) - 1;
        const startRow = Math.floor(enemyTop / this.tileSize);
        const endRow = Math.ceil(enemyBottom / this.tileSize) - 1;

        for (let row = Math.max(0, startRow); row <= Math.min(terrain.rows - 1, endRow); row++) {
            for (let col = Math.max(0, startCol); col <= Math.min(terrain.currentMaxCol - 1, endCol); col++) {
                const tileType = terrain.map[row]?.[col];
                if (tileType === 1 || tileType === 2) { // Solid or breakable block
                    const tileX = col * this.tileSize;
                    const tileY = row * this.tileSize;
                    if (AABB(enemyLeft, enemyTop, this.width, this.height, tileX, tileY, this.tileSize, this.tileSize)) {
                        return [col, row];
                    }
                }
            }
        }
        return null;
    }

    checkCollisionY(terrain) {
        const enemyLeft = this.x;
        const enemyRight = this.x + this.width;
        const enemyTop = this.y;
        const enemyBottom = this.y + this.height;

        const startCol = Math.floor(enemyLeft / this.tileSize);
        const endCol = Math.ceil(enemyRight / this.tileSize) - 1;
        const startRow = Math.floor(enemyTop / this.tileSize);
        const endRow = Math.ceil(enemyBottom / this.tileSize) - 1;

        for (let row = Math.max(0, startRow); row <= Math.min(terrain.rows - 1, endRow); row++) {
            for (let col = Math.max(0, startCol); col <= Math.min(terrain.currentMaxCol - 1, endCol); col++) {
                const tileType = terrain.map[row]?.[col];
                if (tileType === 1 || tileType === 2) { // Solid or breakable block
                    const tileX = col * this.tileSize;
                    const tileY = row * this.tileSize;
                    if (AABB(enemyLeft, enemyTop, this.width, this.height, tileX, tileY, this.tileSize, this.tileSize)) {
                        return [col, row];
                    }
                }
            }
        }
        return null;
    }

    takeHit(type) {
        this.active = false;
        this.isHitVisual = true; // For immediate visual feedback before removal
        console.log(`Bouncer Enemy defeated by ${type}!`);
        this.soundManager.playSound('enemy_defeat');
        this.game.incrementEnemiesDefeated();
    }

    draw(ctx) {
        if (!this.active) return; // Don't draw if inactive

        const image = this.assetManager.getImage('bouncer_enemy');
        
        // Simple flicker effect when hit
        if (this.isHitVisual && Math.floor(this.flickerTimer / 0.05) % 2 === 0) {
            // Don't draw every other frame during flicker
            return;
        }

        if (image) {
            ctx.save();
            // Bouncer doesn't need to flip, it's symmetrical or rotates implicitly
            ctx.drawImage(image, this.x, this.y, this.width, this.height);
            ctx.restore();
        } else {
            ctx.fillStyle = 'blue'; // Fallback color
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        // ctx.strokeStyle = 'cyan'; // Debug bounding box
        // ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}