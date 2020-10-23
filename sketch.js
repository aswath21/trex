var trexAnimation, trex, groundAnimation, ground, iGround, cloudGroup, cloudAnimation, obsDist, gameState, trexCollide, gameOverAnimation, end, restartAnimation, score, checkPoint, die, jumpSound;

var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstacleGroup;

function preload () {
  trexAnimation = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  trexCollide = loadImage("trex_collided.png")
  restartAnimation = loadImage("restart.png")
  
  checkPoint = loadSound("checkPoint.mp3")
  die = loadSound("die.mp3")
  jumpSound = loadSound("jump.mp3")
  
  groundAnimation = loadImage("ground2.png")
  
  cloudAnimation = loadImage("cloud.png")
  
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  
  gameOverAnimation = loadImage("gameOver.png")
}

function setup() {
  createCanvas(600, 300);
  
  trex = createSprite(150, 240, 1, 1)
  trex.addAnimation("run", trexAnimation)
  trex.addAnimation("collided", trexCollide)
  
  if (localStorage.highScore===undefined) {
      localStorage.highScore=0;
    }
  
  ground = createSprite(400, 280, 1, 1)
  ground.addImage("floor", groundAnimation)
  
  iGround = createSprite(200, 285, 400, 2)
  iGround.visible = false
  
  cloudGroup = new Group()
  obsDist = 0
  
  obstacleGroup = new Group()
  
  end = new Group()
  
  gameState = "start"
  
  score = 0
}

function draw() {
  background("white");
  trex.collide(iGround)
  
  if (keyDown("space") && gameState === "start") {
    gameState = "play"
  }
  
  if (gameState === "play") {
    ground.velocityX = -4
    resetGround()
    jump()
    generateCloud()
    generateObstacles()
    score = score+Math.round(frameCount/frameRate())
    trex.changeAnimation("run")
    
    if (score%100 === 0 && score !== 0) {
      checkPoint.play()
    }
    
    if (trex.isTouching(obstacleGroup)) {
      gameState = "end"
      die.play()
    }
  }
  
  if (gameState === "end") {
     ground.velocityX = 0; 
     trex.changeAnimation("collided");
     trex.velocityY = 0;
     cloudGroup.setVelocityXEach(0);
     obstacleGroup.setVelocityXEach(0);
     obstacleGroup.setLifetimeEach(1/0);
     cloudGroup.setLifetimeEach(1/0);
     var gameOver = createSprite(300, 150, 200, 50);
     gameOver.addImage("gameOver", gameOverAnimation);
     end.add(gameOver);
    
    rematch()
  }
  
  drawSprites()
  textSize(15);
  text("score = "+score, 30, 30);
  
  textSize(15);
  text("high score = "+localStorage.highScore, 400, 30);
}

function jump () {
  if (keyDown('space') && trex.isTouching(ground)) {
    trex.velocityY = -13;
    jumpSound.play()
  }
  trex.velocityY = trex.velocityY + 0.5;
}

function resetGround () {
  if (ground.x<=0) {
    ground.x = ground.width/2
  }
}

function generateCloud () {
  //writing logic to give space b'tween two clouds
  if (frameCount%60 === 0) {
       var cloud = createSprite(600, 50, 5, 5);
       cloud.addImage("cloud", cloudAnimation);
    cloud.velocityX = -4;
    // giving the trex more depth than cloud so that when trex jumps its in front of cloud
    trex.depth = cloud.depth + 1; 
    //generating clouds at random Y positions
    var rand = random(100, 200);
    cloud.y = rand;
    cloud.lifetime = 150;
    cloudGroup.add(cloud);
    
  }
}

function generateObstacles () {
  var rand = Math.round(random(170, 250));
  if (frameCount%rand === 0) {
    if (frameCount - obsDist >= 80) {
      obsDist = frameCount;
      var obs = createSprite(600, 255, 1, 1);
      var a = Math.round(random(1, 6))
      switch (a) {
        case 1:obs.addImage("obs1", obstacle1)
          break
        case 2:obs.addImage("obs2", obstacle2)
          break
        case 3:obs.addImage("obs3", obstacle3)
          break
        case 4:obs.addImage("obs4", obstacle4)
          break
        case 5:obs.addImage("obs5", obstacle5)
          break
        case 6:obs.addImage("obs6", obstacle6)
          break
          
      }
      obs.scale = 0.7;
      obs.lifetime = 150;
      obstacleGroup.add(obs);
      obs.velocityX = -4;
   }
  }
}
  
  function rematch () {
  var restart = createSprite(300, 200, 50, 50);
  restart.addImage("restart", restartAnimation);
  end.add(restart);
  if (mousePressedOver(restart)) {
    if (localStorage.highScore<score) {
      localStorage.highScore=score
    }
    cloudGroup.destroyEach();
    obstacleGroup.destroyEach();
    end.destroyEach();
    score = 0;
  
    gameState = "play";
  //  night.visible = false;
  }
}