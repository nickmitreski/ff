import { AABB } from './utils.js';

export class MetalEnemy {
    constructor(x, y, width, height, assetManager, terrain, soundManager, tileSize, game) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velX = 0;
        this.velY = 0;
        this.speed = 40; 
        this.assetManager = assetManager;
        this.terrain = terrain;
        this.soundManager = soundManager;
        this.tileSize = tileSize;
        this.game = game;
        this.active = true; 
        this.facing = 'left'; 
        this.onGround = false;

        this.walkAnimationTimer = 0;
        this.walkAnimationFrame = 1; 
        this.walkAnimationSpeed = 0.25; 

        this.velX = this.facing === 'right' ? this.speed : -this.speed;
    }

    update(deltaTime, gravity) {
        if (!this.active) return;

        this.velY += gravity;

        let newX = this.x + this.velX * deltaTime;
        let newY = this.y + this.velY;

        this.x = newX;
        let collidedTileX = this.checkCollisionX(this.terrain);
        if (collidedTileX) {
            const tileX = collidedTileX[0] * this.tileSize;
            if (this.velX > 0) { 
                this.x = tileX - this.width;
            } else if (this.velX < 0) { 
                this.x = tileX + this.tileSize;
            }
            this.reverseDirection(); 
        }

        this.onGround = false;
        this.y = newY;
        let collidedTileY = this.checkCollisionY(this.terrain);
        if (collidedTileY) {
            const tileY = collidedTileY[1] * this.tileSize;
            if (this.velY > 0) { 
                this.y = tileY - this.height;
                this.velY = 0;
                this.onGround = true;
            } else if (this.velY < 0) { 
                this.y = tileY + this.tileSize;
                this.velY = 0;
            }
        }

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
                if (tileType === 1 || tileType === 2) { 
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
                if (tileType === 1 || tileType === 2) { 
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
        if (type === 'chunk') {
            this.active = false;
            console.log(`Metal Enemy defeated by ${type}!`);
            this.soundManager.playSound('enemy_defeat');
            this.game.incrementEnemiesDefeated();
            return true; 
        } else if (type === 'punch') {
            console.log("Metal Enemy hit by punch, no effect.");
            this.soundManager.playSound('metal_hit');
            return false; 
        }
        return false; 
    }

    draw(ctx) {
        if (!this.active) return;

        let image;
        if (this.velX !== 0) { 
            image = this.assetManager.getImage(`metal_enemy_walk${this.walkAnimationFrame}`);
        } else {
            image = this.assetManager.getImage('metal_enemy_walk1'); 
        }
        
        let scaleX = 1;
        let translateX = this.x;

        if (this.facing === 'left') {
            scaleX = -1;
            translateX = this.x + this.width; 
        }

        if (image) {
            ctx.save();
            ctx.translate(translateX, this.y);
            ctx.scale(scaleX, 1);
            ctx.drawImage(image, 0, 0, this.width, this.height);
            ctx.restore();
        } else {
            ctx.fillStyle = 'darkgrey'; 
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}