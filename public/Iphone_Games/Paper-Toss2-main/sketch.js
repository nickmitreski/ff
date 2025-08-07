
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
var paper,paperImg;
var paperSprite,dustbinSprite,dustBinImg;

function preload(){

    paperImg=loadImage("paper.png");
	dustBinImg=loadImage("dustbingreen.png");
	
}

let touchStartY = null;
let touchStartX = null;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    // Prevent page scrolling on mobile
    document.body.style.overflow = 'hidden';

    engine = Engine.create();
    world = engine.world;

    // Adjust positions and sizes for landscape
    let paperRadius = Math.floor(width * 0.025);
    let groundHeight = Math.floor(height * 0.03);
    let binWidth = Math.floor(width * 0.12);
    let binHeight = Math.floor(height * 0.22);
    let binX = width * 0.75;
    let binY = height - groundHeight - binHeight / 2;

    paper = new Paper(width * 0.25, height - groundHeight - paperRadius, paperRadius);
    ground = new Ground(width / 2, height - groundHeight / 2, width, groundHeight);
    leftDustbin = new dustBin(binX - binWidth / 2, binY, 20, binHeight);
    bottomDustbin = new dustBin(binX, binY + binHeight / 2, binWidth, 20);
    rightDustbin = new dustBin(binX + binWidth / 2, binY, 20, binHeight);

    paperSprite = createSprite(20, 20, 20, 20);
    paperSprite.addImage(paperImg);
    paperSprite.scale = 0.3;

    dustbinSprite = createSprite(binX, binY);
    dustbinSprite.addImage(dustBinImg);
    dustbinSprite.scale = 0.6;

    Engine.run(engine);
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    // Optionally, reposition objects here if needed
}

function draw() {
    rectMode(CENTER);
    background("white");
    Engine.update(engine);
    paper.display();
    ground.display();
    leftDustbin.display();
    bottomDustbin.display();
    rightDustbin.display();
    paperSprite.x = paper.body.position.x;
    paperSprite.y = paper.body.position.y;
    drawSprites();
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        Matter.Body.applyForce(paper.body, paper.body.position, { x: 50, y: -48 });
    }
}

function touchStarted() {
    touchStartX = mouseX;
    touchStartY = mouseY;
    return false;
}

function touchEnded() {
    if (touchStartY !== null && mouseY < touchStartY - 30) { // swipe up
        // Calculate force based on swipe distance and direction
        let forceX = (mouseX - touchStartX) * 0.0025; // scale for landscape
        let forceY = (mouseY - touchStartY) * 0.0025;
        Matter.Body.applyForce(paper.body, paper.body.position, { x: forceX, y: forceY });
    }
    touchStartY = null;
    touchStartX = null;
    return false;
}
