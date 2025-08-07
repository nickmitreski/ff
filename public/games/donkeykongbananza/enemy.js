import { AABB } from './utils.js';

export class Enemy {
    constructor(x, y, width, height, assetManager, terrain, soundManager, tileSize, game) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velX = 0;
        this.velY = 0;
        this.speed = 50; // pixels per second
        this.assetManager = assetManager;
        this.terrain = terrain;
        this.soundManager = soundManager;
        this.tileSize = tileSize;
        this.game = game;
        this.active = true; // True if enemy is alive
        this.facing = 'left'; // Initial facing direction
        this.onGround = false;

        this.walkAnimationTimer = 0;
        this.walkAnimationFrame = 1; // 1 or 2
        this.walkAnimationSpeed = 0.2; // seconds per frame

        // Initialize velocity based on facing direction
        this.velX = this.facing === 'right' ? this.speed : -this.speed;
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
            this.reverseDirection(); // Still reverse if hit a wall directly
        }

        // Vertical collision (for ground)
        this.onGround = false;
        this.y = newY;
        let collidedTileY = this.checkCollisionY(this.terrain);
        if (collidedTileY) {
            const tileY = collidedTileY[1] * this.tileSize;
            if (this.velY > 0) { // Falling and hit ground
                this.y = tileY - this.height;
                this.velY = 0;
                this.onGround = true;
            } else if (this.velY < 0) { // Moving up and hit ceiling
                this.y = tileY + this.tileSize;
                this.velY = 0;
            }
        }

        // Update animation timer
        this.walkAnimationTimer += deltaTime;
        if (this.walkAnimationTimer >= this.walkAnimationSpeed) {
            this.walkAnimationFrame = this.walkAnimationFrame === 1 ? 2 : 1;
            this.walkAnimationTimer = 0;
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

    reverseDirection() {
        this.facing = this.facing === 'right' ? 'left' : 'right';
        this.velX = this.facing === 'right' ? this.speed : -this.speed;
    }

    takeHit(type) {
        // For now, any hit defeats the enemy
        this.active = false;
        console.log(`Enemy defeated by ${type}!`);
        this.soundManager.playSound('enemy_defeat');
        this.game.incrementEnemiesDefeated();
    }

    draw(ctx) {
        if (!this.active) return;

        let image;
        if (this.velX !== 0) { // Only animate if moving
            image = this.assetManager.getImage(`enemy_walk${this.walkAnimationFrame}`);
        } else {
            image = this.assetManager.getImage('enemy_walk1'); // Default to first frame if idle
        }
        
        let scaleX = 1;
        let translateX = this.x;

        if (this.facing === 'left') {
            scaleX = -1;
            translateX = this.x + this.width; // Adjust translation for flip
        }

        if (image) {
            ctx.save();
            ctx.translate(translateX, this.y);
            ctx.scale(scaleX, 1);
            ctx.drawImage(image, 0, 0, this.width, this.height);
            ctx.restore();
        } else {
            ctx.fillStyle = 'purple'; // Fallback color
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        // ctx.strokeStyle = 'green'; // Debug bounding box
        // ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}