class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.gameState = 'startScreen'; // startScreen, difficulty, waveStartDisplay, levelStartDisplay, setup, playing, paused, levelComplete, gameOver
        this.difficulty = null;
        this.level = 1;
        this.maxLevel = 25;
        this.health = 100;
        this.money = 500;
        this.wave = 1;
        this.maxWaves = 5;
        this.waveInProgress = false;
        this.selectedTowerType = null;
        this.selectedTower = null;
        this.gameSpeed = 1;
        this.isPaused = false;
        
        /* @tweakable auto-start wave timer duration in seconds */
        this.waveAutoStartDelay = 20;
        this.waveAutoStartTimer = 0;
        this.waveAutoStartActive = false;
        
        /* @tweakable level start display duration in seconds */
        this.levelStartDisplayDuration = 4;
        /* @tweakable wave start display duration in seconds */
        this.waveStartDisplayDuration = 3;
        
        // Tower unlock system
        this.unlockedTowers = ['machinegun', 'sniper']; // Start with first 2 towers
        this.towerUnlockOrder = ['machinegun', 'sniper', 'tank', 'rocket', 'artillery', 'laser'];
        
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.enemyProjectiles = []; // Add enemy projectiles array
        this.effects = [];
        this.particles = [];
        this.scenery = []; // Add scenery array
        
        this.path = [];
        this.enemySpawnTimer = 0;
        this.enemySpawnInterval = 30; // Reduced from 60 to spawn faster
        this.enemiesInWave = 0;
        this.enemiesSpawned = 0;
        this.waveDelay = 120; // Reduced from 180 for faster waves
        this.waveTimer = 0;
        
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Mouse position tracking
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.initializeEventListeners();
        this.initializeTowerTypes();
        this.initializeEnemyTypes();
        this.initializeSounds();
        this.initializeScenery();
        
        this.gameLoop();
    }
    
    initializeTowerTypes() {
        this.towerTypes = {
            machinegun: {
                name: 'Machine Gun',
                cost: 100,
                damage: 20,
                range: 80,
                fireRate: 10,
                projectileSpeed: 8,
                color: '#95a5a6',
                /* @tweakable machine gun burst mode duration in frames */
                specialPower: {
                    name: 'Burst Mode',
                    cooldown: 300, // 5 seconds
                    duration: 120, // 2 seconds
                    fireRateMultiplier: 3
                },
                upgrades: {
                    damage: [30, 45, 60],
                    range: [90, 100, 120],
                    fireRate: [8, 6, 4]
                }
            },
            sniper: {
                name: 'Sniper',
                cost: 200,
                damage: 100,
                range: 200,
                fireRate: 60,
                projectileSpeed: 15,
                color: '#e67e22',
                /* @tweakable sniper undetectable duration in frames */
                specialPower: {
                    name: 'Undetectable',
                    cooldown: 600, // 10 seconds
                    duration: 300, // 5 seconds
                    effect: 'stealth'
                },
                upgrades: {
                    damage: [150, 200, 300],
                    range: [220, 250, 280],
                    fireRate: [50, 40, 30]
                }
            },
            tank: {
                name: 'Tank',
                cost: 300,
                damage:  200,
                range: 120,
                fireRate: 90,
                projectileSpeed: 6,
                splashRadius:  30,
                color: '#2e7d32',
                /* @tweakable tank armor piercing damage multiplier */
                specialPower: {
                    name: 'Armor Piercing',
                    cooldown: 450, // 7.5 seconds
                    duration: 180, // 3 seconds
                    damageMultiplier: 2.5
                },
                upgrades: {
                    damage: [250, 300, 400],
                    range: [140, 160, 180],
                    fireRate: [70, 60, 45],
                    splashRadius: [50, 60, 80]
                }
            },
            rocket: {
                name: 'Rocket',
                cost: 400,
                damage: 200,
                range:  250,
                fireRate: 30,
                projectileSpeed: 12,
                splashRadius:  40,
                color: '#e74c3c',
                /* @tweakable rocket homing missile turn speed */
                specialPower: {
                    name: 'Homing Missiles',
                    cooldown: 360, // 6 seconds
                    duration: 240, // 4 seconds
                    homingStrength: 0.2
                },
                upgrades: {
                    damage: [300, 400, 500],
                    range: [230, 250, 270],
                    fireRate: [25, 20, 15],
                    splashRadius: [70, 80, 100]
                }
            },
            artillery: {
                name: 'Artillery',
                cost: 600,
                damage: 300,
                range: 250,
                fireRate: 120,
                projectileSpeed: 8,
                splashRadius:  40,
                color: '#8b4513',
                /* @tweakable artillery shockwave stun duration in frames */
                specialPower: {
                    name: 'Shockwave',
                    cooldown: 480, // 8 seconds
                    duration: 1, // Instant effect
                    stunDuration: 180, // 3 seconds
                    shockwaveRadius: 80
                },
                upgrades: {
                    damage: [400, 550, 750],
                    range: [280, 320, 350],
                    fireRate: [100, 80, 60],
                    splashRadius: [100, 120, 150]
                }
            },
            laser: {
                name: 'Laser',
                cost: 800,
                damage: 400,
                range: 180,
                fireRate: 20,
                projectileSpeed: 20,
                piercing: true,
                color: '#ff00ff',
                /* @tweakable laser overcharge damage multiplier */
                specialPower: {
                    name: 'Overcharge',
                    cooldown: 420, // 7 seconds
                    duration: 150, // 2.5 seconds
                    damageMultiplier: 3,
                    rangeMultiplier: 1.5
                },
                upgrades: {
                    damage: [550, 700, 900],
                    range: [200, 220, 250],
                    fireRate: [15, 12, 8]
                }
            }
        };
    }
    
    initializeEnemyTypes() {
        this.enemyTypes = {
            infantry: {
                name: 'Infantry',
                health: 100, // Doubled from 50
                speed: 1.2, // Increased from 1
                reward: 10,
                color: '#2c3e50',
                size: 8
            },
            vehicle: {
                name: 'Vehicle',
                health: 300, // Doubled from 150
                speed: 0.9, // Increased from 0.7
                reward: 25,
                color: '#8e44ad',
                size: 12
            },
            tank: {
                name: 'Tank',
                health: 600, // Doubled from 300
                speed: 0.7, // Increased from 0.5
                reward: 50,
                color: '#27ae60',
                size: 16
            },
            aircraft: {
                name: 'Aircraft',
                health: 200, // Doubled from 100
                speed: 2.0, // Increased from 1.5
                reward: 40,
                color: '#f39c12',
                size: 10,
                flying: true
            },
            heavyTank: {
                name: 'Heavy Tank',
                health: 800,
                speed: 0.5,
                reward: 75,
                color: '#34495e',
                size: 18
            },
            helicopter: {
                name: 'Helicopter',
                health: 350,
                speed: 1.8,
                reward: 60,
                color: '#e67e22',
                size: 14,
                flying: true
            },
            armoredVehicle: {
                name: 'Armored Vehicle',
                health: 450,
                speed: 0.8,
                reward: 35,
                color: '#9b59b6',
                size: 14
            },
            boss: {
                name: 'War Machine',
                health: 2000, // Doubled from 1000
                speed: 0.5, // Increased from 0.3
                reward: 200,
                color: '#e74c3c',
                size: 24,
                fireRate:  120,
                damage:  25,
                range:  100,
                projectileSpeed:  2
            }
        };
    }
    
    initializeSounds() {
        this.sounds = {
            shoot: new Audio('shoot-sound.mp3'),
            explosion: new Audio('explosion-sound.mp3'),
            enemyHit: new Audio('enemy-hit-sound.mp3'),
            towerPlace: new Audio('tower-place-sound.mp3'),
            waveStart: new Audio('wave-start-sound.mp3'),
            levelComplete: new Audio('level-complete-sound.mp3'),
            gameOver: new Audio('game-over-sound.mp3')
        };
        
        // Set volumes
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.3;
        });
    }
    
    initializeScenery() {
        // Generate static scenery objects
        this.scenery = [
            // Rocks
            { x: 150, y: 100, size: 25, type: 'rock' },
            { x: 650, y: 200, size: 30, type: 'rock' },
            { x: 300, y: 450, size: 20, type: 'rock' },
            { x: 500, y: 350, size: 35, type: 'rock' },
            { x: 100, y: 300, size: 15, type: 'rock' },
            { x: 700, y: 450, size: 25, type: 'rock' },
            { x: 400, y: 150, size: 20, type: 'rock' },
            { x: 550, y: 500, size: 30, type: 'rock' },
            // Trees
            { x: 200, y: 80, size: 35, type: 'tree' },
            { x: 600, y: 120, size: 40, type: 'tree' },
            { x: 120, y: 520, size: 30, type: 'tree' },
            { x: 680, y: 380, size: 35, type: 'tree' },
            { x: 450, y: 50, size: 25, type: 'tree' },
            { x: 750, y: 250, size: 30, type: 'tree' },
            // Buildings/Bunkers
            { x: 80, y: 180, size: 40, type: 'bunker' },
            { x: 720, y: 480, size: 45, type: 'bunker' },
            { x: 350, y: 80, size: 35, type: 'bunker' },
            { x: 480, y: 520, size: 40, type: 'bunker' },
            // Craters
            { x: 250, y: 250, size: 30, type: 'crater' },
            { x: 580, y: 320, size: 25, type: 'crater' },
            { x: 180, y: 380, size: 20, type: 'crater' },
            { x: 620, y: 150, size: 35, type: 'crater' },
            // Debris
            { x: 320, y: 200, size: 15, type: 'debris' },
            { x: 520, y: 280, size: 18, type: 'debris' },
            { x: 420, y: 420, size: 12, type: 'debris' },
            { x: 160, y: 450, size: 20, type: 'debris' },
            { x: 680, y: 320, size: 16, type: 'debris' }
        ];
    }
    
    generatePath() {
        const pathTypes = [
            'straight', 'zigzag', 'spiral', 'wave', 'complex'
        ];
        
        const pathType = pathTypes[this.level % pathTypes.length];
        const path = [];
        
        switch(pathType) {
            case 'straight':
                path.push(
                    { x: 0, y: this.canvas.height / 2 },
                    { x: this.canvas.width / 4, y: this.canvas.height / 2 },
                    { x: this.canvas.width / 2, y: this.canvas.height / 2 },
                    { x: 3 * this.canvas.width / 4, y: this.canvas.height / 2 },
                    { x: this.canvas.width, y: this.canvas.height / 2 }
                );
                break;
                
            case 'zigzag':
                path.push(
                    { x: 0, y: this.canvas.height / 2 },
                    { x: this.canvas.width / 6, y: 100 },
                    { x: this.canvas.width / 3, y: this.canvas.height - 100 },
                    { x: this.canvas.width / 2, y: 100 },
                    { x: 2 * this.canvas.width / 3, y: this.canvas.height - 100 },
                    { x: 5 * this.canvas.width / 6, y: 100 },
                    { x: this.canvas.width, y: this.canvas.height / 2 }
                );
                break;
                
            case 'spiral':
                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                const maxRadius = Math.min(centerX, centerY) - 50;
                
                path.push({ x: 0, y: centerY });
                
                for (let i = 0; i < 20; i++) {
                    const angle = (i / 20) * Math.PI * 4;
                    const radius = (i / 20) * maxRadius;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    path.push({ x, y });
                }
                
                path.push({ x: this.canvas.width, y: centerY });
                break;
                
            case 'wave':
                const amplitude = 150;
                const frequency = 3;
                
                for (let i = 0; i <= 20; i++) {
                    const progress = i / 20;
                    const x = progress * this.canvas.width;
                    const y = this.canvas.height / 2 + Math.sin(progress * Math.PI * frequency) * amplitude;
                    path.push({ x, y });
                }
                break;
                
            case 'complex':
                path.push(
                    { x: 0, y: this.canvas.height / 2 },
                    { x: this.canvas.width / 8, y: 100 },
                    { x: this.canvas.width / 4, y: 200 },
                    { x: 3 * this.canvas.width / 8, y: 50 },
                    { x: this.canvas.width / 2, y: this.canvas.height - 100 },
                    { x: 5 * this.canvas.width / 8, y: 300 },
                    { x: 3 * this.canvas.width / 4, y: 150 },
                    { x: 7 * this.canvas.width / 8, y: this.canvas.height - 50 },
                    { x: this.canvas.width, y: this.canvas.height / 2 }
                );
                break;
        }
        
        return path;
    }
    
    initializeEventListeners() {
        // Start game button
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.showDifficultyScreen();
        });
        
        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.difficulty = btn.dataset.difficulty;
                this.startGame();
            });
        });
        
        // Tower selection
        document.querySelectorAll('.tower-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectedTowerType = option.dataset.type;
                this.selectedTower = null;
                this.updateTowerSelection();
            });
        });
        
        // Canvas clicks
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Scale coordinates to canvas resolution
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const canvasX = x * scaleX;
            const canvasY = y * scaleY;
            
            this.handleCanvasClick(canvasX, canvasY);
        });
        
        // Right click to deselect
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.selectedTowerType = null;
            this.selectedTower = null;
            this.updateTowerSelection();
        });
        
        // Mouse movement tracking
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            this.mouseX = x * scaleX;
            this.mouseY = y * scaleY;
        });
        
        // Control buttons
        document.getElementById('start-wave-btn').addEventListener('click', () => {
            this.startWave();
        });
        
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('speed-btn').addEventListener('click', () => {
            this.toggleSpeed();
        });
        
        document.getElementById('next-level-btn').addEventListener('click', () => {
            this.nextLevel();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('upgrade-btn').addEventListener('click', () => {
            this.upgradeTower();
        });
        
        document.getElementById('sell-btn').addEventListener('click', () => {
            this.sellTower();
        });
    }
    
    showDifficultyScreen() {
        this.gameState = 'difficulty';
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('difficulty-screen').style.display = 'block';
    }
    
    startGame() {
        this.applyDifficultySettings();
        this.showLevelStartDisplay();
    }
    
    showLevelStartDisplay() {
        this.gameState = 'levelStartDisplay';
        /* @tweakable level start display timer in frames (60fps) */
        this.displayTimer = this.levelStartDisplayDuration * 60;
        
        const displayElement = document.getElementById('wave-level-display');
        const imageElement = document.getElementById('wave-level-image');
        const titleElement = document.getElementById('wave-level-title');
        const subtitleElement = document.getElementById('wave-level-subtitle');
        
        imageElement.src = 'level-start.png';
        titleElement.textContent = `LEVEL ${this.level}`;
        subtitleElement.textContent = `Prepare for battle - ${this.difficultySettings[this.difficulty].name} difficulty`;
        
        displayElement.style.display = 'flex';
        displayElement.classList.add('active');
        document.getElementById('difficulty-screen').style.display = 'none';
    }
    
    showWaveStartDisplay() {
        this.gameState = 'waveStartDisplay';
        /* @tweakable wave start display timer in frames (60fps) */
        this.displayTimer = this.waveStartDisplayDuration * 60;
        
        const displayElement = document.getElementById('wave-level-display');
        const imageElement = document.getElementById('wave-level-image');
        const titleElement = document.getElementById('wave-level-title');
        const subtitleElement = document.getElementById('wave-level-subtitle');
        
        imageElement.src = 'wave-start.png';
        titleElement.textContent = `WAVE ${this.wave}`;
        subtitleElement.textContent = `Enemy forces incoming - ${this.calculateEnemiesInWave()} units detected`;
        
        displayElement.style.display = 'flex';
        displayElement.classList.add('active');
    }
    
    hideWaveLevelDisplay() {
        const displayElement = document.getElementById('wave-level-display');
        if (displayElement) {
            displayElement.style.display = 'none';
            displayElement.classList.remove('active');
        }
    }
    
    applyDifficultySettings() {
        this.difficultySettings = {
            easy: {
                /* @tweakable enemy health multiplier for easy difficulty */
                enemyHealthMultiplier: 0.5,
                /* @tweakable enemy speed multiplier for easy difficulty */
                enemySpeedMultiplier: 0.6,
                /* @tweakable money reward multiplier for easy difficulty */
                moneyMultiplier: 2.0,
                name: 'RECRUIT'
            },
            normal: {
                /* @tweakable enemy health multiplier for normal difficulty */
                enemyHealthMultiplier: 1.0,
                /* @tweakable enemy speed multiplier for normal difficulty */
                enemySpeedMultiplier: 1.0,
                /* @tweakable money reward multiplier for normal difficulty */
                moneyMultiplier: 1.0,
                name: 'SOLDIER'
            },
            hard: {
                /* @tweakable enemy health multiplier for hard difficulty */
                enemyHealthMultiplier: 2.0,
                /* @tweakable enemy speed multiplier for hard difficulty */
                enemySpeedMultiplier: 1.8,
                /* @tweakable money reward multiplier for hard difficulty */
                moneyMultiplier: 2.5,
                name: 'VETERAN'
            }
        };
    }
    
    startWaveAutoTimer() {
        if (!this.waveInProgress && this.gameState === 'setup') {
            /* @tweakable auto-start timer duration in frames (60fps) */
            this.waveAutoStartTimer = this.waveAutoStartDelay * 60;
            this.waveAutoStartActive = true;
        }
    }
    
    handleCanvasClick(x, y) {
        // Check if clicking on existing tower
        const clickedTower = this.towers.find(tower => {
            const dist = Math.sqrt((x - tower.x) ** 2 + (y - tower.y) ** 2);
            return dist < 20;
        });
        
        if (clickedTower) {
            this.selectedTower = clickedTower;
            this.selectedTowerType = null;
            this.updateTowerSelection();
            this.showUpgradePanel();
            return;
        }
        
        // Place new tower
        if (this.selectedTowerType && this.canPlaceTower(x, y)) {
            this.placeTower(x, y);
        }
    }
    
    canPlaceTower(x, y) {
        const towerType = this.towerTypes[this.selectedTowerType];
        if (!towerType || this.money < towerType.cost) return false;
        
        // Check if too close to path with improved collision detection
        const minDistanceToPath =  35;
        for (let i = 0; i < this.path.length - 1; i++) {
            const point1 = this.path[i];
            const point2 = this.path[i + 1];
            
            // Check distance to line segment
            const distToSegment = this.pointToLineDistance(x, y, point1.x, point1.y, point2.x, point2.y);
            if (distToSegment < minDistanceToPath) return false;
        }
        
        // Check if too close to other towers
        const minDistanceToTowers =  20;
        for (let tower of this.towers) {
            const dist = Math.sqrt((x - tower.x) ** 2 + (y - tower.y) ** 2);
            if (dist < minDistanceToTowers) return false;
        }
        
        // Check if overlapping with scenery
        const towerRadius = 20; // Tower placement radius
        for (let sceneryItem of this.scenery) {
            const dist = Math.sqrt((x - sceneryItem.x) ** 2 + (y - sceneryItem.y) ** 2);
            if (dist < sceneryItem.size + towerRadius) return false;
        }
        
        return true;
    }
    
    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        if (lenSq === 0) return Math.sqrt(A * A + B * B);
        
        let param = dot / lenSq;
        
        if (param < 0) {
            return Math.sqrt(A * A + B * B);
        } else if (param > 1) {
            const E = px - x2;
            const F = py - y2;
            return Math.sqrt(E * E + F * F);
        } else {
            const projX = x1 + param * C;
            const projY = y1 + param * D;
            const G = px - projX;
            const H = py - projY;
            return Math.sqrt(G * G + H * H);
        }
    }
    
    placeTower(x, y) {
        const towerType = this.towerTypes[this.selectedTowerType];
        if (!towerType || this.money < towerType.cost) return;
        
        const tower = {
            x, y,
            type: this.selectedTowerType,
            level: 1,
            damage: towerType.damage,
            range: towerType.range,
            fireRate: towerType.fireRate,
            projectileSpeed: towerType.projectileSpeed,
            color: towerType.color,
            lastShot: 0,
            target: null,
            /* @tweakable special power cooldown timer */
            specialPowerCooldown: 0,
            specialPowerActive: false,
            specialPowerTimer: 0,
            isStealthed: false,
            ...towerType
        };
        
        this.towers.push(tower);
        this.money -= towerType.cost;
        this.updateUI();
        
        // Play sound effect
        this.playSound('towerPlace');
    }
    
    startWave() {
        if (this.waveInProgress) return;
        
        /* @tweakable prevent starting wave if game state is invalid */
        if (this.gameState !== 'setup' && this.gameState !== 'playing') {
            console.warn('Cannot start wave in current game state:', this.gameState);
            return;
        }
        
        this.showWaveStartDisplay();
    }
    
    actuallyStartWave() {
        /* @tweakable ensure wave can only start in valid states */
        if (this.waveInProgress) {
            console.warn('Wave already in progress, skipping start');
            return;
        }
        
        this.waveInProgress = true;
        this.waveAutoStartActive = false;
        this.waveAutoStartTimer = 0;
        this.enemiesInWave = this.calculateEnemiesInWave();
        this.enemiesSpawned = 0;
        this.enemySpawnTimer = 0;
        
        this.playSound('waveStart');
        this.updateUI();
    }
    
    calculateEnemiesInWave() {
        /* @tweakable base number of enemies per wave */
        const baseEnemies = 10;
        /* @tweakable level multiplier for enemy count */
        const levelMultiplier = Math.floor(this.level / 2) + 2;
        /* @tweakable wave multiplier for enemy count */
        const waveMultiplier = this.wave * 2;
        return baseEnemies + levelMultiplier * waveMultiplier;
    }
    
    spawnEnemy() {
        if (this.enemiesSpawned >= this.enemiesInWave) return;
        
        const enemyTypeNames = Object.keys(this.enemyTypes);
        let enemyTypeName;
        
        // Spawn multiple bosses at the end of each wave based on level
        const bossCount = Math.min(this.level, 5);
        const bossStartIndex = this.enemiesInWave - bossCount;
        
        if (this.enemiesSpawned >= bossStartIndex) {
            enemyTypeName = 'boss';
        } else {
            // Different enemy types based on level and wave
            if (this.level >= 20) {
                // All enemy types including new ones
                const availableTypes = ['infantry', 'vehicle', 'tank', 'aircraft', 'heavyTank', 'helicopter', 'armoredVehicle'];
                enemyTypeName = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            } else if (this.level >= 15) {
                // Include heavy tanks and helicopters
                const availableTypes = ['infantry', 'vehicle', 'tank', 'aircraft', 'heavyTank', 'helicopter'];
                enemyTypeName = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            } else if (this.level >= 12) {
                // Include armored vehicles
                const availableTypes = ['infantry', 'vehicle', 'tank', 'aircraft', 'armoredVehicle'];
                enemyTypeName = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            } else if (this.level >= 10) {
                // Include aircraft starting from level 10
                const availableTypes = ['infantry', 'vehicle', 'tank', 'aircraft'];
                enemyTypeName = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            } else if (this.level >= 8) {
                // Include aircraft starting from level 8
                const availableTypes = ['infantry', 'vehicle', 'tank', 'aircraft'];
                enemyTypeName = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            } else if (this.level >= 5) {
                // Ground units only
                const availableTypes = ['infantry', 'vehicle', 'tank'];
                enemyTypeName = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            } else {
                // Early levels - basic units only
                const availableTypes = ['infantry', 'vehicle'];
                enemyTypeName = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            }
        }
        
        const enemyType = this.enemyTypes[enemyTypeName];
        /* @tweakable level-based health scaling factor */
        const levelMultiplier = 1 + (this.level - 1) * 0.2;
        const difficultySettings = this.difficultySettings[this.difficulty];
        
        const enemy = {
            id: Date.now() + Math.random(),
            x: this.path[0].x,
            y: this.path[0].y,
            type: enemyTypeName,
            health: enemyType.health * levelMultiplier * difficultySettings.enemyHealthMultiplier,
            maxHealth: enemyType.health * levelMultiplier * difficultySettings.enemyHealthMultiplier,
            /* @tweakable level-based speed scaling factor */
            speed: enemyType.speed * (1 + this.level * 0.04) * difficultySettings.enemySpeedMultiplier,
            reward: Math.floor(enemyType.reward * difficultySettings.moneyMultiplier),
            color: enemyType.color,
            size: enemyType.size,
            pathIndex: 0,
            pathProgress: 0,
            flying: enemyType.flying || false,
            lastShot: 0, // Add shooting timer for bosses
            target: null, // Add target for bosses
            ...enemyType
        };
        
        this.enemies.push(enemy);
        this.enemiesSpawned++;
    }
    
    updateTowers() {
        this.towers.forEach(tower => {
            // Update disabled tower timer
            if (tower.disabled) {
                tower.disabledTimer--;
                if (tower.disabledTimer <= 0) {
                    tower.disabled = false;
                    tower.health = tower.maxHealth *  0.5; // Reactivate with 50% health
                }
                return; // Skip targeting and shooting for disabled towers
            }
            
            // Update special power timers
            this.updateTowerSpecialPowers(tower);
            
            this.updateTowerTargeting(tower);
            this.updateTowerShooting(tower);
        });
    }
    
    updateTowerSpecialPowers(tower) {
        // Update special power cooldown
        if (tower.specialPowerCooldown > 0) {
            tower.specialPowerCooldown--;
        }
        
        // Update active special power
        if (tower.specialPowerActive) {
            tower.specialPowerTimer--;
            if (tower.specialPowerTimer <= 0) {
                tower.specialPowerActive = false;
                tower.isStealthed = false;
                // Reset any modified stats
                this.resetTowerStats(tower);
            }
        }
        
        // Auto-activate special powers when available
        if (tower.specialPowerCooldown === 0 && !tower.specialPowerActive) {
            // Check if conditions are met for activation
            if (this.shouldActivateSpecialPower(tower)) {
                this.activateSpecialPower(tower);
            }
        }
    }
    
    shouldActivateSpecialPower(tower) {
        const specialPower = tower.specialPower;
        
        switch (specialPower.name) {
            case 'Burst Mode':
                // Activate when there are multiple enemies in range
                return this.getEnemiesInRange(tower).length >= 3;
            
            case 'Undetectable':
                // Activate when being targeted by bosses
                return this.enemies.some(enemy => 
                    enemy.type === 'boss' && 
                    enemy.target === tower &&
                    this.getDistance(tower, enemy) <= enemy.range
                );
            
            case 'Armor Piercing':
                // Activate when targeting heavily armored enemies
                return tower.target && 
                       (tower.target.type === 'tank' || 
                        tower.target.type === 'heavyTank' || 
                        tower.target.type === 'boss');
            
            case 'Homing Missiles':
                // Activate when targeting fast-moving enemies
                return tower.target && 
                       (tower.target.type === 'aircraft' || 
                        tower.target.type === 'helicopter' ||
                        tower.target.speed > 1.5);
            
            case 'Shockwave':
                // Activate when multiple enemies are clustered
                return this.getEnemiesInRange(tower).length >= 4;
            
            case 'Overcharge':
                // Activate when targeting bosses or when health is low
                return tower.target && 
                       (tower.target.type === 'boss' || this.health < 50);
            
            default:
                return false;
        }
    }
    
    activateSpecialPower(tower) {
        const specialPower = tower.specialPower;
        
        tower.specialPowerActive = true;
        tower.specialPowerTimer = specialPower.duration;
        tower.specialPowerCooldown = specialPower.cooldown;
        
        // Create visual effect
        this.createSpecialPowerEffect(tower);
        
        // Apply special power effects
        switch (specialPower.name) {
            case 'Burst Mode':
                tower.originalFireRate = tower.fireRate;
                tower.fireRate = Math.max(1, tower.fireRate / specialPower.fireRateMultiplier);
                break;
            
            case 'Undetectable':
                tower.isStealthed = true;
                break;
            
            case 'Armor Piercing':
                tower.originalDamage = tower.damage;
                tower.damage = Math.floor(tower.damage * specialPower.damageMultiplier);
                break;
            
            case 'Homing Missiles':
                // Homing effect handled in projectile update
                break;
            
            case 'Shockwave':
                this.createShockwave(tower);
                break;
            
            case 'Overcharge':
                tower.originalDamage = tower.damage;
                tower.originalRange = tower.range;
                tower.damage = Math.floor(tower.damage * specialPower.damageMultiplier);
                tower.range = Math.floor(tower.range * specialPower.rangeMultiplier);
                break;
        }
        
        this.playSound('towerPlace'); // Use as special power activation sound
    }
    
    resetTowerStats(tower) {
        // Reset modified stats after special power ends
        if (tower.originalFireRate) {
            tower.fireRate = tower.originalFireRate;
            delete tower.originalFireRate;
        }
        if (tower.originalDamage) {
            tower.damage = tower.originalDamage;
            delete tower.originalDamage;
        }
        if (tower.originalRange) {
            tower.range = tower.originalRange;
            delete tower.originalRange;
        }
    }
    
    getEnemiesInRange(tower) {
        return this.enemies.filter(enemy => {
            const dist = this.getDistance(tower, enemy);
            return dist <= tower.range;
        });
    }
    
    getDistance(obj1, obj2) {
        return Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2);
    }
    
    createSpecialPowerEffect(tower) {
        const effect = {
            x: tower.x,
            y: tower.y,
            life: 60,
            maxLife: 60,
            color: tower.color,
            size: 30,
            type: 'specialPower',
            powerName: tower.specialPower.name
        };
        this.effects.push(effect);
    }
    
    createShockwave(tower) {
        const shockwaveRadius = tower.specialPower.shockwaveRadius;
        const stunDuration = tower.specialPower.stunDuration;
        
        // Damage and stun all enemies in radius
        this.enemies.forEach(enemy => {
            const dist = this.getDistance(tower, enemy);
            if (dist <= shockwaveRadius) {
                // Damage enemy
                this.hitEnemy(enemy, tower.damage);
                
                // Stun enemy
                enemy.stunned = true;
                enemy.stunTimer = stunDuration;
                enemy.originalSpeed = enemy.speed;
                enemy.speed = 0;
            }
        });
        
        // Create shockwave visual effect
        const shockwaveEffect = {
            x: tower.x,
            y: tower.y,
            life: 30,
            maxLife: 30,
            color: '#ffa500',
            size: 0,
            maxSize: shockwaveRadius,
            type: 'shockwave'
        };
        this.effects.push(shockwaveEffect);
    }
    
    updateTowerTargeting(tower) {
        let bestTarget = null;
        let bestScore = -1;
        
        this.enemies.forEach(enemy => {
            const dist = Math.sqrt((tower.x - enemy.x) ** 2 + (tower.y - enemy.y) ** 2);
            
            if (dist <= tower.range) {
                // Skip ground units for anti-air towers
                if (tower.antiAir && !enemy.flying) return;
                // Skip flying units for non-anti-air towers
                if (!tower.antiAir && enemy.flying) return;
                
                // Prioritize enemies further along the path
                const score = enemy.pathProgress + (1 - enemy.health / enemy.maxHealth);
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = enemy;
                }
            }
        });
        
        tower.target = bestTarget;
    }
    
    updateTowerShooting(tower) {
        if (!tower.target || Date.now() - tower.lastShot < tower.fireRate * 16.67) return;
        
        const target = tower.target;
        const dist = Math.sqrt((tower.x - target.x) ** 2 + (tower.y - target.y) ** 2);
        
        if (dist > tower.range) {
            tower.target = null;
            return;
        }
        
        this.shootProjectile(tower, target);
        tower.lastShot = Date.now();
        
        // Create muzzle flash effect
        this.createMuzzleFlash(tower.x, tower.y, tower);
        
        this.playSound('shoot');
    }
    
    shootProjectile(tower, target) {
        const dx = target.x - tower.x;
        const dy = target.y - tower.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Lead target for better accuracy
        const leadTime = distance / tower.projectileSpeed;
        const leadX = target.x + (target.pathIndex < this.path.length - 1 ? target.speed * leadTime : 0);
        const leadY = target.y;
        
        const leadDx = leadX - tower.x;
        const leadDy = leadY - tower.y;
        const leadDistance = Math.sqrt(leadDx * leadDx + leadDy * leadDy);
        
        const projectile = {
            x: tower.x,
            y: tower.y,
            vx: (leadDx / leadDistance) * tower.projectileSpeed,
            vy: (leadDy / leadDistance) * tower.projectileSpeed,
            damage: tower.damage,
            splashRadius: tower.splashRadius || 0,
            piercing: tower.piercing || false,
            color: tower.color,
            target: target,
            tower: tower,
            type: tower.type,
            /* @tweakable homing missile tracking strength */
            homing: tower.specialPowerActive && tower.specialPower.name === 'Homing Missiles',
            homingStrength: tower.specialPower ? tower.specialPower.homingStrength : 0
        };
        
        this.projectiles.push(projectile);
    }
    
    updateProjectiles() {
        this.projectiles = this.projectiles.filter(projectile => {
            // Apply homing behavior
            if (projectile.homing && projectile.target && this.enemies.includes(projectile.target)) {
                const dx = projectile.target.x - projectile.x;
                const dy = projectile.target.y - projectile.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    const targetVx = (dx / distance) * projectile.tower.projectileSpeed;
                    const targetVy = (dy / distance) * projectile.tower.projectileSpeed;
                    
                    projectile.vx += (targetVx - projectile.vx) * projectile.homingStrength;
                    projectile.vy += (targetVy - projectile.vy) * projectile.homingStrength;
                }
            }
            
            projectile.x += projectile.vx;
            projectile.y += projectile.vy;
            
            // Check collision with target
            if (projectile.target && this.enemies.includes(projectile.target)) {
                const dist = Math.sqrt((projectile.x - projectile.target.x) ** 2 + (projectile.y - projectile.target.y) ** 2);
                if (dist < 15) {
                    // Handle piercing projectiles (laser)
                    if (projectile.piercing) {
                        this.hitEnemy(projectile.target, projectile.damage);
                        // Continue through multiple enemies
                        let hitCount = 1;
                        this.enemies.forEach(enemy => {
                            if (enemy !== projectile.target && hitCount < 3) {
                                const enemyDist = Math.sqrt((projectile.x - enemy.x) ** 2 + (projectile.y - enemy.y) ** 2);
                                if (enemyDist < 25) {
                                    this.hitEnemy(enemy, projectile.damage * 0.7);
                                    hitCount++;
                                }
                            }
                        });
                    } else {
                        this.hitEnemy(projectile.target, projectile.damage);
                    }
                    
                    if (projectile.splashRadius > 0) {
                        this.createSplashDamage(projectile.x, projectile.y, projectile.splashRadius, projectile.damage * 0.5);
                    }
                    
                    this.createExplosion(projectile.x, projectile.y, projectile.type);
                    return false;
                }
            }
            
            // Remove projectiles that are off screen
            return projectile.x >= 0 && projectile.x <= this.canvas.width &&
                   projectile.y >= 0 && projectile.y <= this.canvas.height;
        });
    }
    
    createSplashDamage(x, y, radius, damage) {
        this.enemies.forEach(enemy => {
            const dist = Math.sqrt((x - enemy.x) ** 2 + (y - enemy.y) ** 2);
            if (dist <= radius) {
                const damageMultiplier = 1 - (dist / radius);
                this.hitEnemy(enemy, damage * damageMultiplier);
            }
        });
    }
    
    hitEnemy(enemy, damage) {
        enemy.health -= damage;
        
        if (enemy.health <= 0) {
            this.killEnemy(enemy);
        }
        
        this.playSound('enemyHit');
    }
    
    killEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
            this.money += enemy.reward;
            
            // Create different death effects based on enemy type
            if (enemy.type === 'infantry') {
                this.createBloodEffect(enemy.x, enemy.y);
            } else {
                this.createExplosionEffect(enemy.x, enemy.y);
            }
            
            this.updateUI();
        }
    }
    
    createBloodEffect(x, y) {
        // Create red blood particles for infantry
        for (let i = 0; i < 15; i++) {
            const particle = {
                x,
                y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 40,
                maxLife: 40,
                color: `hsl(${Math.random() * 20}, 100%, ${25 + Math.random() * 25}%)`, // Dark red variations
                size: Math.random() * 4 + 1
            };
            this.particles.push(particle);
        }
        
        this.playSound('enemyHit');
    }
    
    createExplosionEffect(x, y) {
        // Create fire and explosion particles for vehicles
        for (let i = 0; i < 20; i++) {
            const particle = {
                x,
                y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 60,
                maxLife: 60,
                color: `hsl(${Math.random() * 60 + 10}, 100%, ${40 + Math.random() * 40}%)`, // Orange/red fire colors
                size: Math.random() * 8 + 3
            };
            this.particles.push(particle);
        }
        
        // Add black smoke particles
        for (let i = 0; i < 10; i++) {
            const particle = {
                x,
                y,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 8 - 2, // Smoke rises
                life: 80,
                maxLife: 80,
                color: `hsl(0, 0%, ${10 + Math.random() * 20}%)`, // Dark gray/black smoke
                size: Math.random() * 12 + 6
            };
            this.particles.push(particle);
        }
        
        this.playSound('explosion');
    }
    
    updateEnemies() {
        this.enemies = this.enemies.filter(enemy => {
            // Update stun timer
            if (enemy.stunned) {
                enemy.stunTimer--;
                if (enemy.stunTimer <= 0) {
                    enemy.stunned = false;
                    enemy.speed = enemy.originalSpeed;
                }
                // Skip movement if stunned
                return true;
            }
            
            this.moveEnemyAlongPath(enemy);
            
            // Update boss AI for shooting
            if (enemy.type === 'boss') {
                this.updateBossAI(enemy);
            }
            
            // Check if enemy reached the end
            if (enemy.pathIndex >= this.path.length - 1) {
                this.health -= 10;
                this.updateUI();
                
                if (this.health <= 0) {
                    this.gameOver();
                }
                
                return false;
            }
            
            return true;
        });
    }
    
    moveEnemyAlongPath(enemy) {
        if (enemy.pathIndex >= this.path.length - 1) return;
        
        const currentPoint = this.path[enemy.pathIndex];
        const nextPoint = this.path[enemy.pathIndex + 1];
        
        if (!nextPoint) return;
        
        // Calculate direction to next point
        const dx = nextPoint.x - enemy.x;
        const dy = nextPoint.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Move towards next point
        if (distance >  5) {
            const moveX = (dx / distance) * enemy.speed;
            const moveY = (dy / distance) * enemy.speed;
            
            enemy.x += moveX;
            enemy.y += moveY;
        } else {
            // Reached current target, move to next path point
            enemy.pathIndex++;
            enemy.pathProgress = enemy.pathIndex / (this.path.length - 1);
        }
    }
    
    updateBossAI(boss) {
        // Find nearest tower to target (excluding stealthed towers)
        let nearestTower = null;
        let nearestDistance = Infinity;
        
        this.towers.forEach(tower => {
            // Skip stealthed towers
            if (tower.isStealthed) return;
            
            const dist = Math.sqrt((boss.x - tower.x) ** 2 + (boss.y - tower.y) ** 2);
            if (dist < boss.range && dist < nearestDistance) {
                nearestDistance = dist;
                nearestTower = tower;
            }
        });
        
        boss.target = nearestTower;
        
        // Shoot at target if in range and cooldown is ready
        if (boss.target && Date.now() - boss.lastShot > boss.fireRate * 16.67) {
            this.bossShoots(boss, boss.target);
            boss.lastShot = Date.now();
        }
    }
    
    bossShoots(boss, target) {
        const dx = target.x - boss.x;
        const dy = target.y - boss.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const enemyProjectile = {
            x: boss.x,
            y: boss.y,
            vx: (dx / distance) * boss.projectileSpeed,
            vy: (dy / distance) * boss.projectileSpeed,
            damage: boss.damage,
            color: '#ff4444',
            size: 6,
            trail: []
        };
        
        this.enemyProjectiles.push(enemyProjectile);
        this.createMuzzleFlash(boss.x, boss.y, { color: '#ff0000' });
        this.playSound('shoot');
    }
    
    updateEnemyProjectiles() {
        this.enemyProjectiles = this.enemyProjectiles.filter(projectile => {
            projectile.x += projectile.vx;
            projectile.y += projectile.vy;
            
            // Add trail effect
            projectile.trail.push({ x: projectile.x, y: projectile.y });
            if (projectile.trail.length > 5) {
                projectile.trail.shift();
            }
            
            // Check collision with towers
            for (let tower of this.towers) {
                const dist = Math.sqrt((projectile.x - tower.x) ** 2 + (projectile.y - tower.y) ** 2);
                if (dist < 20) {
                    // Damage tower (reduce its effectiveness temporarily)
                    this.damageTower(tower, projectile.damage);
                    this.createExplosion(projectile.x, projectile.y, 'enemyHit');
                    return false;
                }
            }
            
            // Remove projectiles that are off screen
            return projectile.x >= 0 && projectile.x <= this.canvas.width &&
                   projectile.y >= 0 && projectile.y <= this.canvas.height;
        });
    }
    
    damageTower(tower, damage) {
        // Reduce tower health (add health property if not exists)
        if (!tower.health) {
            tower.health =  200;
            tower.maxHealth = tower.health;
        }
        
        tower.health -= damage;
        
        // Temporarily reduce tower effectiveness when damaged
        const originalDamage = tower.originalDamage || tower.damage;
        const originalRange = tower.originalRange || tower.range;
        const originalFireRate = tower.originalFireRate || tower.fireRate;
        
        // Store original values if not already stored
        if (!tower.originalDamage) {
            tower.originalDamage = tower.damage;
            tower.originalRange = tower.range;
            tower.originalFireRate = tower.fireRate;
        }
        
        // Calculate damage reduction based on health percentage
        const healthPercent = Math.max(0, tower.health / tower.maxHealth);
        const effectivenessMultiplier = Math.max( 0.5, healthPercent);
        
        tower.damage = originalDamage * effectivenessMultiplier;
        tower.range = originalRange * effectivenessMultiplier;
        tower.fireRate = originalFireRate / effectivenessMultiplier; // Slower fire rate when damaged
        
        // Disable tower if health reaches zero
        if (tower.health <= 0) {
            tower.disabled = true;
            tower.disabledTimer =  300; // 5 seconds at 60fps
        }
        
        // Create damage effect
        this.createTowerDamageEffect(tower.x, tower.y);
        
        // Repair tower over time if not destroyed
        if (tower.health > 0 && !tower.repairInterval) {
            tower.repairInterval = setInterval(() => {
                if (tower.health < tower.maxHealth) {
                    tower.health +=  5;
                    tower.health = Math.min(tower.health, tower.maxHealth);
                    
                    // Update effectiveness as health recovers
                    const newHealthPercent = tower.health / tower.maxHealth;
                    const newEffectiveness = Math.max(0.3, newHealthPercent);
                    
                    tower.damage = originalDamage * newEffectiveness;
                    tower.range = originalRange * newEffectiveness;
                    tower.fireRate = originalFireRate / newEffectiveness;
                } else {
                    // Fully repaired
                    clearInterval(tower.repairInterval);
                    tower.repairInterval = null;
                }
            }, 1000);
        }
        
        this.playSound('enemyHit');
    }
    
    createTowerDamageEffect(x, y) {
        // Create sparks and damage particles
        for (let i = 0; i < 10; i++) {
            const particle = {
                x,
                y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 30,
                maxLife: 30,
                color: '#ffa500',
                size: Math.random() * 3 + 1
            };
            this.particles.push(particle);
        }
    }
    
    createExplosion(x, y, towerType = 'default') {
        let particleCount = 10;
        let colors = ['#ff6b35', '#f7931e', '#ffdc00'];
        
        // Different explosion effects based on tower type
        if (towerType === 'tank') {
            particleCount = 15;
            colors = ['#ff4444', '#ff8800', '#ffaa00'];
        } else if (towerType === 'rocket') {
            particleCount = 20;
            colors = ['#ff0000', '#ff6600', '#ffcc00'];
        } else if (towerType === 'artillery') {
            particleCount = 25;
            colors = ['#cc3300', '#ff4400', '#ff7700'];
        } else if (towerType === 'laser') {
            particleCount = 12;
            colors = ['#ff00ff', '#cc00cc', '#9900cc'];
        }
        
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                x,
                y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 30 + Math.random() * 20,
                maxLife: 30 + Math.random() * 20,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 6 + 2
            };
            this.particles.push(particle);
        }
        
        this.playSound('explosion');
    }
    
    createMuzzleFlash(x, y, tower) {
        const effect = {
            x,
            y,
            life: 5,
            maxLife: 5,
            color: '#fff',
            size: 15,
            type: 'muzzleFlash'
        };
        this.effects.push(effect);
    }
    
    updateEffects() {
        this.effects = this.effects.filter(effect => {
            effect.life--;
            return effect.life > 0;
        });
        
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.3; // gravity
            particle.life--;
            return particle.life > 0;
        });
    }
    
    checkWaveComplete() {
        if (this.waveInProgress && this.enemies.length === 0 && this.enemiesSpawned >= this.enemiesInWave) {
            this.waveInProgress = false;
            this.waveAutoStartActive = false;
            this.waveAutoStartTimer = 0;
            this.wave++;
            
            if (this.wave > this.maxWaves) {
                this.levelComplete();
            } else {
                this.waveTimer = this.waveDelay;
                this.startWaveAutoTimer();
            }
            
            this.updateUI();
        }
    }
    
    levelComplete() {
        this.gameState = 'levelComplete';
        const bonus = 100 + this.level * 25;
        this.money += bonus;
        
        document.getElementById('bonus-amount').textContent = bonus;
        document.getElementById('level-complete').style.display = 'block';
        
        this.playSound('levelComplete');
        this.updateUI();
    }
    
    nextLevel() {
        this.level++;
        this.wave = 1;
        this.health = Math.min(this.health + 20, 100);
        
        // Unlock new towers after level 2
        this.updateTowerUnlocks();
        
        // Generate new path for new level
        this.path = this.generatePath();
        
        // Clear enemies, projectiles, and towers
        this.enemies = [];
        this.projectiles = [];
        this.enemyProjectiles = [];
        this.effects = [];
        this.particles = [];
        this.towers = [];
        this.selectedTower = null;
        
        document.getElementById('level-complete').style.display = 'none';
        document.getElementById('upgrade-panel').style.display = 'none';
        
        this.updateTowerAvailability();
        
        if (this.level > this.maxLevel) {
            this.victory();
        } else {
            this.showLevelStartDisplay();
        }
    }
    
    updateTowerUnlocks() {
        // Unlock towers progressively after level 2
        if (this.level >= 2) {
            /* @tweakable minimum level to start unlocking additional towers */
            const minLevelForUnlocks = 2;
            /* @tweakable how many levels between each tower unlock */
            const levelsPerUnlock = 1;
            
            const additionalUnlocks = Math.min(
                Math.floor((this.level - minLevelForUnlocks) / levelsPerUnlock),
                this.towerUnlockOrder.length - 2 // -2 because we start with 2 towers
            );
            
            this.unlockedTowers = this.towerUnlockOrder.slice(0, 2 + additionalUnlocks);
        }
    }
    
    updateTowerAvailability() {
        // Show/hide towers based on unlock status
        document.querySelectorAll('.tower-option').forEach(option => {
            const towerType = option.dataset.type;
            if (this.unlockedTowers.includes(towerType)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
    }
    
    victory() {
        this.gameState = 'victory';
        alert('Congratulations! You completed all 25 levels!');
        this.restartGame();
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('final-level').textContent = this.level;
        document.getElementById('game-over').style.display = 'block';
        
        this.playSound('gameOver');
    }
    
    restartGame() {
        this.level = 1;
        this.health = 100;
        this.money = 500;
        this.wave = 1;
        this.gameState = 'startScreen';
        this.difficulty = null;
        this.waveInProgress = false;
        this.selectedTowerType = null;
        this.selectedTower = null;
        this.gameSpeed = 1;
        this.isPaused = false;
        this.displayTimer = 0;
        
        // Reset tower unlock system
        this.unlockedTowers = ['machinegun', 'sniper'];
        this.waveAutoStartActive = false;
        this.waveAutoStartTimer = 0;
        
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.enemyProjectiles = [];
        this.effects = [];
        this.particles = [];
        this.path = [];
        
        this.enemySpawnTimer = 0;
        this.enemiesInWave = 0;
        this.enemiesSpawned = 0;
        this.waveTimer = 0;
        
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('level-complete').style.display = 'none';
        document.getElementById('upgrade-panel').style.display = 'none';
        document.getElementById('difficulty-screen').style.display = 'none';
        document.getElementById('wave-level-display').style.display = 'none';
        document.getElementById('start-screen').style.display = 'block';
        
        this.updateUI();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        document.getElementById('pause-btn').textContent = this.isPaused ? 'RESUME' : 'PAUSE';
    }
    
    toggleSpeed() {
        this.gameSpeed = this.gameSpeed === 1 ? 2 : this.gameSpeed === 2 ? 4 : 1;
        document.getElementById('speed-btn').textContent = `SPEED x${this.gameSpeed}`;
    }
    
    upgradeTower() {
        if (!this.selectedTower) return;
        
        const tower = this.selectedTower;
        const towerType = this.towerTypes[tower.type];
        const upgradeCost = tower.cost * tower.level;
        
        if (this.money >= upgradeCost && tower.level < 4) {
            this.money -= upgradeCost;
            tower.level++;
            
            // Apply upgrades
            if (towerType.upgrades.damage) {
                tower.damage = towerType.upgrades.damage[tower.level - 2];
            }
            if (towerType.upgrades.range) {
                tower.range = towerType.upgrades.range[tower.level - 2];
            }
            if (towerType.upgrades.fireRate) {
                tower.fireRate = towerType.upgrades.fireRate[tower.level - 2];
            }
            if (towerType.upgrades.splashRadius) {
                tower.splashRadius = towerType.upgrades.splashRadius[tower.level - 2];
            }
            
            this.updateUI();
            this.showUpgradePanel();
        }
    }
    
    sellTower() {
        if (!this.selectedTower) return;
        
        const tower = this.selectedTower;
        const sellPrice = Math.floor(tower.cost * tower.level * 0.7);
        
        // Clear any repair intervals
        if (tower.repairInterval) {
            clearInterval(tower.repairInterval);
        }
        
        this.money += sellPrice;
        this.towers = this.towers.filter(t => t !== tower);
        this.selectedTower = null;
        
        document.getElementById('upgrade-panel').style.display = 'none';
        this.updateUI();
    }
    
    showUpgradePanel() {
        if (!this.selectedTower) return;
        
        const tower = this.selectedTower;
        const towerType = this.towerTypes[tower.type];
        const upgradeCost = tower.cost * tower.level;
        const sellPrice = Math.floor(tower.cost * tower.level * 0.7);
        
        const panel = document.getElementById('upgrade-panel');
        const info = document.getElementById('selected-tower-info');
        
        info.innerHTML = `
            <div class="tower-name">${towerType.name} (Level ${tower.level})</div>
            <div class="tower-stats">
                <div>Damage: ${tower.damage}</div>
                <div>Range: ${tower.range}</div>
                <div>Fire Rate: ${tower.fireRate}</div>
                ${tower.splashRadius ? `<div>Splash: ${tower.splashRadius}</div>` : ''}
            </div>
            <div class="upgrade-cost">Upgrade: $${upgradeCost}</div>
            <div class="sell-price">Sell: $${sellPrice}</div>
        `;
        
        const upgradeBtn = document.getElementById('upgrade-btn');
        upgradeBtn.disabled = this.money < upgradeCost || tower.level >= 4;
        upgradeBtn.textContent = tower.level >= 4 ? 'MAX LEVEL' : 'UPGRADE';
        
        panel.style.display = 'block';
    }
    
    updateTowerSelection() {
        document.querySelectorAll('.tower-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        if (this.selectedTowerType) {
            const option = document.querySelector(`[data-type="${this.selectedTowerType}"]`);
            if (option) option.classList.add('selected');
        }
        
        if (!this.selectedTower) {
            document.getElementById('upgrade-panel').style.display = 'none';
        }
    }
    
    updateUI() {
        document.getElementById('level-display').textContent = this.level;
        document.getElementById('health-display').textContent = this.health;
        document.getElementById('money-display').textContent = this.money;
        document.getElementById('wave-display').textContent = `${this.wave}/${this.maxWaves}`;
        
        const startBtn = document.getElementById('start-wave-btn');
        startBtn.disabled = this.waveInProgress;
        
        if (this.waveInProgress) {
            startBtn.textContent = 'WAVE IN PROGRESS';
        } else if (this.waveAutoStartActive) {
            const secondsLeft = Math.ceil(this.waveAutoStartTimer / 60);
            startBtn.textContent = `AUTO START IN ${secondsLeft}s`;
        } else {
            startBtn.textContent = 'START WAVE';
        }
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => {
                // Handle audio play errors silently
                console.warn('Audio play failed:', e);
            });
        }
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background terrain
        this.drawTerrain();
        
        // Draw path
        this.drawPath();
        
        // Draw towers
        this.drawTowers();
        
        // Draw enemies
        this.drawEnemies();
        
        // Draw projectiles
        this.drawProjectiles();
        
        // Draw effects
        this.drawEffects();
        
        // Draw particles
        this.drawParticles();
        
        // Draw UI elements
        this.drawUI();
    }
    
    drawTerrain() {
        // Draw improved grass texture with multiple layers
        const grassColor1 =  '#2d4a2e';
        const grassColor2 =  '#3a5a3d';
        
        // Base grass layer
        this.ctx.fillStyle = grassColor1;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add static grass texture pattern (using deterministic positioning)
        this.ctx.fillStyle = grassColor2;
        for (let x = 0; x < this.canvas.width; x += 40) {
            for (let y = 0; y < this.canvas.height; y += 40) {
                // Use deterministic pattern instead of random
                if ((x + y) % 80 === 0) {
                    this.ctx.beginPath();
                    this.ctx.arc(x + 20, y + 20,  4, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
        
        // Add static dirt patches with deterministic positioning
        const dirtColor =  '#4a3429';
        this.ctx.fillStyle = dirtColor;
        const dirtPatches = [
            {x: 150, y: 80, size: 25},
            {x: 400, y: 200, size: 30},
            {x: 600, y: 150, size: 35},
            {x: 200, y: 350, size: 20},
            {x: 500, y: 450, size: 25},
            {x: 350, y: 100, size: 28},
            {x: 700, y: 300, size: 22},
            {x: 100, y: 500, size: 32}
        ];
        
        dirtPatches.forEach(patch => {
            this.ctx.beginPath();
            this.ctx.arc(patch.x, patch.y, patch.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw all scenery elements
        this.scenery.forEach(sceneryItem => {
            this.ctx.save();
            this.ctx.translate(sceneryItem.x, sceneryItem.y);
            
            switch(sceneryItem.type) {
                case 'rock':
                    this.drawRock(sceneryItem);
                    break;
                case 'tree':
                    this.drawTree(sceneryItem);
                    break;
                case 'bunker':
                    this.drawBunker(sceneryItem);
                    break;
                case 'crater':
                    this.drawCrater(sceneryItem);
                    break;
                case 'debris':
                    this.drawDebris(sceneryItem);
                    break;
            }
            
            this.ctx.restore();
        });
    }
    
    drawRock(scenery) {
        this.ctx.fillStyle = '#4a4a4a';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, scenery.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add rock texture
        this.ctx.fillStyle = '#3a3a3a';
        this.ctx.beginPath();
        this.ctx.arc(-scenery.size * 0.3, -scenery.size * 0.2, scenery.size * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#5a5a5a';
        this.ctx.beginPath();
        this.ctx.arc(scenery.size * 0.2, scenery.size * 0.3, scenery.size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawTree(scenery) {
        // Tree trunk
        this.ctx.fillStyle = '#8b4513';
        this.ctx.fillRect(-scenery.size * 0.15, -scenery.size * 0.3, scenery.size * 0.3, scenery.size * 0.6);
        
        // Tree foliage
        this.ctx.fillStyle = '#228b22';
        this.ctx.beginPath();
        this.ctx.arc(0, -scenery.size * 0.2, scenery.size * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Additional foliage layers
        this.ctx.fillStyle = '#32cd32';
        this.ctx.beginPath();
        this.ctx.arc(-scenery.size * 0.3, -scenery.size * 0.1, scenery.size * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(scenery.size * 0.25, -scenery.size * 0.15, scenery.size * 0.35, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawBunker(scenery) {
        // Main bunker structure
        this.ctx.fillStyle = '#696969';
        this.ctx.fillRect(-scenery.size * 0.6, -scenery.size * 0.4, scenery.size * 1.2, scenery.size * 0.8);
        
        // Bunker door
        this.ctx.fillStyle = '#2c2c2c';
        this.ctx.fillRect(-scenery.size * 0.2, -scenery.size * 0.3, scenery.size * 0.4, scenery.size * 0.5);
        
        // Bunker details
        this.ctx.fillStyle = '#808080';
        this.ctx.fillRect(-scenery.size * 0.5, -scenery.size * 0.35, scenery.size * 1.0, scenery.size * 0.1);
        
        // Sandbags
        this.ctx.fillStyle = '#daa520';
        for (let i = -2; i <= 2; i++) {
            this.ctx.beginPath();
            this.ctx.arc(i * scenery.size * 0.2, scenery.size * 0.35, scenery.size * 0.15, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawCrater(scenery) {
        // Crater rim
        this.ctx.fillStyle = '#654321';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, scenery.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Crater hole
        this.ctx.fillStyle = '#2c1810';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, scenery.size * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Crater shadows
        this.ctx.fillStyle = '#1a0f08';
        this.ctx.beginPath();
        this.ctx.arc(scenery.size * 0.2, scenery.size * 0.2, scenery.size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawDebris(scenery) {
        // Scattered debris pieces
        this.ctx.fillStyle = '#696969';
        
        // Main debris piece
        this.ctx.save();
        this.ctx.rotate(Math.PI / 4);
        this.ctx.fillRect(-scenery.size * 0.4, -scenery.size * 0.2, scenery.size * 0.8, scenery.size * 0.4);
        this.ctx.restore();
        
        // Smaller debris pieces
        this.ctx.fillStyle = '#4a4a4a';
        this.ctx.beginPath();
        this.ctx.arc(-scenery.size * 0.3, scenery.size * 0.3, scenery.size * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(scenery.size * 0.4, -scenery.size * 0.2, scenery.size * 0.15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Rust/damage effects
        this.ctx.fillStyle = '#8b4513';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, scenery.size * 0.1, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawPath() {
        /* @tweakable prevent drawing path when not initialized or invalid */
        if (!this.path || this.path.length < 2) {
            console.warn('Path not properly initialized, skipping path rendering');
            return;
        }
        
        /* @tweakable ensure all path points are valid before drawing */
        const validPath = this.path.filter(point => 
            point && typeof point.x === 'number' && typeof point.y === 'number'
        );
        
        if (validPath.length < 2) {
            console.warn('Invalid path points detected, regenerating path');
            this.path = this.generatePath();
            return;
        }
        
        const pathWidth = 28;
        const borderWidth = 32;
        
        // Draw path border (darker)
        this.ctx.strokeStyle = '#4a3429';
        this.ctx.lineWidth = borderWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        
        this.ctx.stroke();
        
        // Draw main path (lighter brown)
        this.ctx.strokeStyle = '#6b4e3d';
        this.ctx.lineWidth = pathWidth;
        this.ctx.stroke();
        
        // Add road markings
        this.ctx.strokeStyle = '#8b6f47';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawTowers() {
        this.towers.forEach(tower => {
            // Draw range indicator for selected tower
            if (tower === this.selectedTower) {
                this.ctx.strokeStyle = 'rgba(231, 76, 60, 0.3)';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([5, 5]);
                this.ctx.beginPath();
                this.ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }
            
            // Determine tower visual state based on health/status
            let towerColor = tower.color;
            let baseColor = '#34495e';
            
            // Special power visual effects
            if (tower.specialPowerActive) {
                switch (tower.specialPower.name) {
                    case 'Burst Mode':
                        towerColor = '#ff6b35';
                        baseColor = '#ff4444';
                        break;
                    case 'Undetectable':
                        towerColor = 'rgba(231, 126, 34, 0.3)';
                        baseColor = 'rgba(52, 73, 94, 0.3)';
                        break;
                    case 'Armor Piercing':
                        towerColor = '#2ecc71';
                        baseColor = '#27ae60';
                        break;
                    case 'Homing Missiles':
                        towerColor = '#e74c3c';
                        baseColor = '#c0392b';
                        break;
                    case 'Shockwave':
                        towerColor = '#f39c12';
                        baseColor = '#e67e22';
                        break;
                    case 'Overcharge':
                        towerColor = '#ff00ff';
                        baseColor = '#cc00cc';
                        break;
                }
            }
            
            if (tower.disabled) {
                towerColor = '#666';
                baseColor = '#333';
                // Add sparks and damage effects for disabled towers
                if (Math.random() < 0.2) {
                    this.createTowerDamageEffect(tower.x, tower.y);
                }
            } else if (tower.health && tower.health < tower.maxHealth) {
                // Damaged but functioning - slightly darker
                const healthPercent = tower.health / tower.maxHealth;
                towerColor = this.darkenColor(tower.color, 1 - healthPercent * 0.5);
            }
            
            // Draw tower base
            this.ctx.fillStyle = baseColor;
            this.ctx.beginPath();
            this.ctx.arc(tower.x, tower.y, 18, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw tower
            this.ctx.fillStyle = towerColor;
            this.ctx.beginPath();
            this.ctx.arc(tower.x, tower.y, 15, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw tower barrel/gun (only if not disabled)
            if (tower.target && !tower.disabled) {
                const angle = Math.atan2(tower.target.y - tower.y, tower.target.x - tower.x);
                const barrelLength = 20;
                
                this.ctx.strokeStyle = '#2c3e50';
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.moveTo(tower.x, tower.y);
                this.ctx.lineTo(
                    tower.x + Math.cos(angle) * barrelLength,
                    tower.y + Math.sin(angle) * barrelLength
                );
                this.ctx.stroke();
            }
            
            // Draw health bar for damaged towers
            if (tower.health && tower.health < tower.maxHealth) {
                const barWidth = 30;
                const barHeight = 4;
                const healthPercent = tower.health / tower.maxHealth;
                
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(tower.x - barWidth/2, tower.y - 25, barWidth, barHeight);
                
                this.ctx.fillStyle = healthPercent > 0.5 ? '#27ae60' : healthPercent > 0.25 ? '#f39c12' : '#e74c3c';
                this.ctx.fillRect(tower.x - barWidth/2, tower.y - 25, barWidth * healthPercent, barHeight);
            }
            
            // Draw special power cooldown indicator
            if (tower.specialPowerCooldown > 0) {
                const cooldownPercent = tower.specialPowerCooldown / tower.specialPower.cooldown;
                const barWidth = 20;
                const barHeight = 3;
                
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(tower.x - barWidth/2, tower.y + 25, barWidth, barHeight);
                
                this.ctx.fillStyle = '#3498db';
                this.ctx.fillRect(tower.x - barWidth/2, tower.y + 25, barWidth * (1 - cooldownPercent), barHeight);
            }
            
            // Draw level indicator
            this.ctx.fillStyle = tower.disabled ? '#666' : '#f39c12';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(tower.disabled ? 'OFF' : tower.level, tower.x, tower.y + 30);
        });
    }
    
    darkenColor(color, factor) {
        // Simple color darkening function
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            const newR = Math.floor(r * factor);
            const newG = Math.floor(g * factor);
            const newB = Math.floor(b * factor);
            
            return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        }
        return color;
    }
    
    drawEnemies() {
        this.enemies.forEach(enemy => {
            this.ctx.save();
            this.ctx.translate(enemy.x, enemy.y);
            
            // Draw different enemy types with distinct visuals
            switch(enemy.type) {
                case 'infantry':
                    this.drawInfantry(enemy);
                    break;
                case 'vehicle':
                    this.drawVehicle(enemy);
                    break;
                case 'tank':
                    this.drawTank(enemy);
                    break;
                case 'aircraft':
                    this.drawAircraft(enemy);
                    break;
                case 'heavyTank':
                    this.drawHeavyTank(enemy);
                    break;
                case 'helicopter':
                    this.drawHelicopter(enemy);
                    break;
                case 'armoredVehicle':
                    this.drawArmoredVehicle(enemy);
                    break;
                case 'boss':
                    this.drawBoss(enemy);
                    break;
            }
            
            this.ctx.restore();
            
            // Draw health bar
            const barWidth = enemy.size * 2;
            const barHeight = 4;
            const healthPercent = enemy.health / enemy.maxHealth;
            
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(enemy.x - barWidth/2, enemy.y - enemy.size - 10, barWidth, barHeight);
            
            this.ctx.fillStyle = healthPercent > 0.5 ? '#27ae60' : healthPercent > 0.25 ? '#f39c12' : '#e74c3c';
            this.ctx.fillRect(enemy.x - barWidth/2, enemy.y - enemy.size - 10, barWidth * healthPercent, barHeight);
        });
    }
    
    drawInfantry(enemy) {
        // Draw soldier figure
        this.ctx.fillStyle = enemy.color;
        // Head
        this.ctx.beginPath();
        this.ctx.arc(0, -4, 3, 0, Math.PI * 2);
        this.ctx.fill();
        // Body
        this.ctx.fillRect(-2, -2, 4, 8);
        // Legs
        this.ctx.fillRect(-3, 6, 2, 4);
        this.ctx.fillRect(1, 6, 2, 4);
        // Weapon
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(-1, -1, 1, 6);
    }
    
    drawVehicle(enemy) {
        // Draw jeep/vehicle
        this.ctx.fillStyle = enemy.color;
        // Main body
        this.ctx.fillRect(-6, -4, 12, 8);
        // Wheels
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.beginPath();
        this.ctx.arc(-4, 4, 2, 0, Math.PI * 2);
        this.ctx.arc(4, 4, 2, 0, Math.PI * 2);
        this.ctx.fill();
        // Windshield
        this.ctx.fillStyle = '#87ceeb';
        this.ctx.fillRect(-2, -3, 4, 2);
    }
    
    drawTank(enemy) {
        // Draw tank
        this.ctx.fillStyle = enemy.color;
        // Main body
        this.ctx.fillRect(-8, -6, 16, 12);
        // Turret
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 6, 0, Math.PI * 2);
        this.ctx.fill();
        // Barrel
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, -1, 12, 2);
        // Tracks
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(-8, -8, 16, 3);
        this.ctx.fillRect(-8, 5, 16, 3);
    }
    
    drawHeavyTank(enemy) {
        // Draw heavy tank - larger and more armored
        this.ctx.fillStyle = enemy.color;
        // Main body - larger
        this.ctx.fillRect(-10, -8, 20, 16);
        // Turret - larger
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 8, 0, Math.PI * 2);
        this.ctx.fill();
        // Barrel - thicker and longer
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, -2, 16, 4);
        // Tracks - wider
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(-10, -10, 20, 4);
        this.ctx.fillRect(-10, 6, 20, 4);
        // Armor plates
        this.ctx.strokeStyle = '#1a1a1a';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-10, -8, 20, 16);
        // Additional armor details
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(-8, -6, 4, 12);
        this.ctx.fillRect(4, -6, 4, 12);
    }
    
    drawHelicopter(enemy) {
        // Draw helicopter
        this.ctx.fillStyle = enemy.color;
        // Main body
        this.ctx.fillRect(-8, -3, 16, 6);
        // Cockpit bubble
        this.ctx.fillStyle = '#87ceeb';
        this.ctx.beginPath();
        this.ctx.arc(-4, 0, 4, 0, Math.PI * 2);
        this.ctx.fill();
        // Tail
        this.ctx.fillStyle = enemy.color;
        this.ctx.fillRect(8, -1, 6, 2);
        // Main rotor (spinning effect)
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-12, 0);
        this.ctx.lineTo(12, 0);
        this.ctx.moveTo(0, -12);
        this.ctx.lineTo(0, 12);
        this.ctx.stroke();
        // Tail rotor
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(14, 0, 3, 0, Math.PI * 2);
        this.ctx.stroke();
        // Landing skids
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(-6, 3, 12, 1);
    }
    
    drawArmoredVehicle(enemy) {
        // Draw armored personnel carrier
        this.ctx.fillStyle = enemy.color;
        // Main body - more angular
        this.ctx.fillRect(-8, -5, 16, 10);
        // Armor sloping
        this.ctx.beginPath();
        this.ctx.moveTo(-8, -5);
        this.ctx.lineTo(-6, -7);
        this.ctx.lineTo(6, -7);
        this.ctx.lineTo(8, -5);
        this.ctx.closePath();
        this.ctx.fill();
        // Wheels - more of them
        this.ctx.fillStyle = '#2c3e50';
        for (let i = -6; i <= 6; i += 4) {
            this.ctx.beginPath();
            this.ctx.arc(i, 5, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        // Gun mount
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.beginPath();
        this.ctx.arc(0, -3, 3, 0, Math.PI * 2);
        this.ctx.fill();
        // Gun barrel
        this.ctx.fillRect(0, -4, 8, 2);
        // Armor plating details
        this.ctx.strokeStyle = '#1a1a1a';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(-8, -5, 16, 10);
        this.ctx.strokeRect(-6, -3, 12, 6);
    }
    
    drawAircraft(enemy) {
        // Draw aircraft
        this.ctx.fillStyle = enemy.color;
        // Main body
        this.ctx.fillRect(-6, -2, 12, 4);
        // Wings
        this.ctx.fillRect(-4, -8, 8, 3);
        this.ctx.fillRect(-4, 5, 8, 3);
        // Cockpit
        this.ctx.fillStyle = '#87ceeb';
        this.ctx.fillRect(-2, -1, 4, 2);
        // Propeller (optional visual effect)
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(-6, 0, 3, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    drawBoss(enemy) {
        // Draw large battle robot war machine
        this.ctx.fillStyle = enemy.color;
        
        // Main body - more angular and robotic
        this.ctx.fillRect(-12, -8, 24, 16);
        
        // Robot head/cockpit
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(-6, -12, 12, 8);
        
        // Glowing eyes
        this.ctx.fillStyle =  '#ff0000';
        this.ctx.fillRect(-4, -10, 2, 2);
        this.ctx.fillRect(2, -10, 2, 2);
        
        // Mechanical arms with weapons
        this.ctx.fillStyle = '#2c3e50';
        // Left arm
        this.ctx.fillRect(-16, -6, 8, 4);
        this.ctx.fillRect(-20, -5, 6, 2); // weapon barrel
        // Right arm  
        this.ctx.fillRect(8, -6, 8, 4);
        this.ctx.fillRect(14, -5, 6, 2); // weapon barrel
        
        // Central weapon system
        this.ctx.fillStyle = '#34495e';
        this.ctx.beginPath();
        this.ctx.arc(0, -2, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Main cannon
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, -3,  14, 2);
        
        // Mechanical legs
        this.ctx.fillStyle = '#2c3e50';
        // Left leg
        this.ctx.fillRect(-8, 8, 4, 8);
        this.ctx.fillRect(-10, 16, 8, 3); // foot
        // Right leg
        this.ctx.fillRect(4, 8, 4, 8);
        this.ctx.fillRect(2, 16, 8, 3); // foot
        
        // Armor plating details
        this.ctx.strokeStyle = '#1a1a1a';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-12, -8, 24, 16);
        
        // Mechanical joints
        this.ctx.fillStyle = '#34495e';
        this.ctx.beginPath();
        this.ctx.arc(-6, 4, 2, 0, Math.PI * 2); // left shoulder
        this.ctx.arc(6, 4, 2, 0, Math.PI * 2); // right shoulder
        this.ctx.arc(-6, 8, 2, 0, Math.PI * 2); // left hip
        this.ctx.arc(6, 8, 2, 0, Math.PI * 2); // right hip
        this.ctx.fill();
        
        // Energy core in chest
        this.ctx.fillStyle =  '#00ffff';
        this.ctx.beginPath();
        this.ctx.arc(0, 2, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Antenna/sensors
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(-3, -12);
        this.ctx.lineTo(-3, -16);
        this.ctx.moveTo(3, -12);
        this.ctx.lineTo(3, -16);
        this.ctx.stroke();
        
        // Battle damage indicators (sparks and wear)
        if (Math.random() < 0.3) { // Random sparks
            this.ctx.fillStyle = '#ffff00';
            this.ctx.fillRect(Math.random() * 24 - 12, Math.random() * 16 - 8, 1, 1);
        }
        
        // War machine designation
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '6px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('WAR-BOT', 0, 6);
    }
    
    drawProjectiles() {
        this.projectiles.forEach(projectile => {
            // Different projectile visuals based on tower type
            if (projectile.type === 'laser') {
                // Draw laser beam
                this.ctx.strokeStyle = projectile.color;
                this.ctx.lineWidth = 4;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = projectile.color;
                this.ctx.beginPath();
                this.ctx.moveTo(projectile.x - projectile.vx * 2, projectile.y - projectile.vy * 2);
                this.ctx.lineTo(projectile.x, projectile.y);
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
            } else {
                // Regular projectile
                this.ctx.fillStyle = projectile.color;
                this.ctx.beginPath();
                this.ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Draw projectile trail
                this.ctx.strokeStyle = projectile.color;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(projectile.x, projectile.y);
                this.ctx.lineTo(projectile.x - projectile.vx * 3, projectile.y - projectile.vy * 3);
                this.ctx.stroke();
            }
        });
        
        // Draw enemy projectiles
        this.enemyProjectiles.forEach(projectile => {
            // Draw main projectile
            this.ctx.fillStyle = projectile.color;
            this.ctx.beginPath();
            this.ctx.arc(projectile.x, projectile.y, projectile.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw trail
            if (projectile.trail && projectile.trail.length > 1) {
                this.ctx.strokeStyle = projectile.color;
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(projectile.trail[0].x, projectile.trail[0].y);
                for (let i = 1; i < projectile.trail.length; i++) {
                    this.ctx.lineTo(projectile.trail[i].x, projectile.trail[i].y);
                }
                this.ctx.stroke();
            }
        });
    }
    
    drawEffects() {
        this.effects.forEach(effect => {
            if (effect.type === 'muzzleFlash') {
                const alpha = effect.life / effect.maxLife;
                this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(effect.x, effect.y, effect.size * alpha, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (effect.type === 'specialPower') {
                const alpha = effect.life / effect.maxLife;
                this.ctx.strokeStyle = effect.color;
                this.ctx.lineWidth = 3;
                this.ctx.setLineDash([5, 5]);
                this.ctx.globalAlpha = alpha;
                this.ctx.beginPath();
                this.ctx.arc(effect.x, effect.y, effect.size * (1 - alpha), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
                this.ctx.setLineDash([]);
                
                // Draw power name
                this.ctx.fillStyle = effect.color;
                this.ctx.font = '10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(effect.powerName, effect.x, effect.y - 35);
            } else if (effect.type === 'shockwave') {
                const alpha = effect.life / effect.maxLife;
                const currentSize = effect.maxSize * (1 - alpha);
                
                this.ctx.strokeStyle = effect.color;
                this.ctx.lineWidth = 5;
                this.ctx.globalAlpha = alpha;
                this.ctx.beginPath();
                this.ctx.arc(effect.x, effect.y, currentSize, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
                
                effect.size = currentSize;
            }
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color.replace('50%)', `50%, ${alpha})`);
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawUI() {
        // Draw cursor preview for tower placement
        if (this.selectedTowerType) {
            const towerType = this.towerTypes[this.selectedTowerType];
            const canPlace = this.canPlaceTower(this.mouseX, this.mouseY);
            
            // Draw range indicator
            this.ctx.strokeStyle = canPlace ? 'rgba(46, 204, 113, 0.5)' : 'rgba(231, 76, 60, 0.5)';
            this.ctx.fillStyle = canPlace ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(this.mouseX, this.mouseY, towerType.range, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.setLineDash([]);
            
            // Draw splash radius for towers with area of effect
            if (towerType.splashRadius) {
                this.ctx.strokeStyle = canPlace ? 'rgba(255, 165, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)';
                this.ctx.fillStyle = canPlace ? 'rgba(255, 165, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
                this.ctx.lineWidth = 3;
                this.ctx.setLineDash([3, 3]);
                this.ctx.beginPath();
                this.ctx.arc(this.mouseX, this.mouseY, towerType.splashRadius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.setLineDash([]);
            }
            
            // Draw tower preview
            this.ctx.fillStyle = canPlace ? 'rgba(46, 204, 113, 0.7)' : 'rgba(231, 76, 60, 0.7)';
            this.ctx.beginPath();
            this.ctx.arc(this.mouseX, this.mouseY, 15, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw cost indicator
            this.ctx.fillStyle = canPlace ? '#27ae60' : '#e74c3c';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`$${towerType.cost}`, this.mouseX, this.mouseY - 25);
            
            // Draw splash damage indicator if applicable
            if (towerType.splashRadius) {
                this.ctx.fillStyle = canPlace ? '#f39c12' : '#e74c3c';
                this.ctx.font = '12px Arial';
                this.ctx.fillText(`AoE: ${towerType.splashRadius}`, this.mouseX, this.mouseY - 40);
            }
        }
    }
    
    update() {
        if (this.isPaused) return;
        
        const now = Date.now();
        this.deltaTime = now - this.lastTime;
        this.lastTime = now;
        
        // Apply game speed
        const speedMultiplier = this.gameSpeed;
        
        // Handle display timer for wave/level screens
        if (this.gameState === 'waveStartDisplay' || this.gameState === 'levelStartDisplay') {
            /* @tweakable ensure display timer doesn't go negative */
            this.displayTimer = Math.max(0, this.displayTimer - speedMultiplier);
            if (this.displayTimer <= 0) {
                this.hideWaveLevelDisplay();
                if (this.gameState === 'waveStartDisplay') {
                    this.gameState = 'playing';
                    this.actuallyStartWave();
                } else if (this.gameState === 'levelStartDisplay') {
                    this.gameState = 'setup';
                    /* @tweakable ensure path is always available before proceeding */
                    try {
                        this.path = this.generatePath();
                        this.applyDifficultySettings();
                        this.updateTowerAvailability();
                        this.startWaveAutoTimer();
                        this.updateUI();
                    } catch (error) {
                        console.error('Error during level setup:', error);
                        this.gameState = 'setup';
                        this.path = this.generatePath(); // Fallback path generation
                    }
                }
            }
            return;
        }
        
        // Update wave auto-start timer
        if (this.waveAutoStartActive && !this.waveInProgress) {
            this.waveAutoStartTimer -= speedMultiplier;
            if (this.waveAutoStartTimer <= 0) {
                this.startWave();
            }
        }
        
        // Update wave timer
        if (this.waveTimer > 0) {
            this.waveTimer -= speedMultiplier;
        }
        
        // Spawn enemies
        if (this.waveInProgress) {
            this.enemySpawnTimer += speedMultiplier;
            if (this.enemySpawnTimer >= this.enemySpawnInterval) {
                this.spawnEnemy();
                this.enemySpawnTimer = 0;
            }
        }
        
        // Update game objects
        for (let i = 0; i < speedMultiplier; i++) {
            this.updateTowers();
            this.updateEnemies();
            this.updateProjectiles();
            this.updateEnemyProjectiles(); // Add enemy projectile updates
            this.updateEffects();
            this.checkWaveComplete();
        }
    }
    
    gameLoop() {
        try {
            if (this.gameState !== 'startScreen') {
                this.update();
                this.render();
            }
        } catch (error) {
            /* @tweakable prevent game lockup from rendering errors */
            console.error('Game loop error:', error);
            // Reset to a safe state if there's an error
            if (this.gameState === 'waveStartDisplay' || this.gameState === 'levelStartDisplay') {
                this.hideWaveLevelDisplay();
                this.gameState = 'setup';
            }
        }
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Asset creation requests
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});