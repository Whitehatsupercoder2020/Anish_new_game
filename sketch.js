var PLAY = 1;
var END = 0;
var gameState = PLAY;

var Bouncer, Bouncer_running, Bouncer_collided;
var ground, invisibleGround, groundImage;

var NinjaGroup, FirworksImage;
var FireBlastGroup, obstacle1, obstacle2
var background

var score=0;

var GameOver, restart;



function preload(){
  Bouncer_running =   loadAnimation("Bouncer stand.png", "1.png", "2.png");
  Bouncer_collided = loadAnimation("Bouncer stand.png");
  
  groundImage = loadImage("Ground.png");
  
  FireBlastImage = loadImage("Firework Explosion 2.jpg");
  
  Ninja1 = loadImage("Ninja 1.jpg");
  Ninja2 = loadImage("Ninja 2.jpg");
  //obstacle3 = loadImage("obstacle3.png");
  //obstacle4 = loadImage("obstacle4.png");
  //obstacle5 = loadImage("obstacle5.png");
  //obstacle6 = loadImage("obstacle6.png");
  
  GameOverImg = loadImage("Game Over.png");
  restartImg = loadImage("Restart.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  Bouncer = createSprite(50,180,20,50);
  
  Bouncer.addAnimation("running", Bouncer_running);
  Bouncer.addAnimation("collided", Bouncer_collided);
  Bouncer.scale = 0.5;
  
  ground = createSprite(200,windowHeight-20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  GameOver = createSprite(300,100);
  GameOver.addImage(GameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  GameOver.scale = 0.5;
  restart.scale = 0.5;

  GameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,windowHeight-10,400,10);
  invisibleGround.visible = false;
  
  FireBlastGroup = new Group();
  NinjaGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && Bouncer.y >= 159) {
      Bouncer.velocityY = -12;
    }
  
    Bouncer.velocityY = Bouncer.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    Bouncer.collide(invisibleGround);
    spawnFireBlast();
    spawnNinjas();
  
    if(NinjaGroup.isTouching(Bouncer)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    GameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    Bouncer.velocityY = 0;
    NinjaGroup.setVelocityXEach(0);
    FireBlastGroup.setVelocityXEach(0);
    
    //change the trex animation
    Bouncer.changeAnimation("collided",Bouncer_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    NinjaGroup.setLifetimeEach(-1);
    FireBlastGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnFireBlast() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var FireBlast = createSprite(600,500,40,10);
    FireBlast.y = Math.round(random(450,500));
    FireBlast.addImage(FireBlastImage);
    FireBlast.scale = 0.5;
    FireBlast.velocityX = -3;
    
     //assign lifetime to the variable
     FireBlast.lifetime = 200;
    
    //adjust the depth
    FireBlast.depth = Bouncer.depth;
    Bouncer.depth = Bouncer.depth + 1;
    
    //add each cloud to the group
    FireBlastGroup.add(FireBlast);
  }
  
}

function spawnNinjas() {
  if(frameCount % 60 === 0) {
    var Ninja = createSprite(600,500,10,40);
    //obstacle.debug = true;
    Ninja.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: Ninja.addImage(Ninja1);
              break;
      case 2: Ninja.addImage(Ninja2);
              break;
    
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    Ninja.scale = 0.5;
    Ninja.lifetime = 300;
    //add each obstacle to the group
    NinjaGroup.add(Ninja);
  }
}

function reset(){
  gameState = PLAY;
  GameOver.visible = false;
  restart.visible = false;
  
  FireBlastGroup.destroyEach();
  NinjaGroup.destroyEach();
  
  Bouncer.changeAnimation("running",Bouncer_running);
  
 
  
  score = 0;
  
}