/* global random, width, height, noStroke, fill, circle, collideCircleCircle, createVector, p5, abs, frameRate, quarantinePolicy*/

let globalSocialDistancing = false;
const DIAMETER = 3;
const INCUBATION_PERIOD = 10;
const Q_ZONE_X = 800-100;
const Q_ZONE_Y = 600-100;
const Q_ZONE_W = 100;
const Q_ZONE_H = 100;


//checks if a vector is within the canvas
function isWithinCanvas(vec){
  return (vec.x < width && vec.x > 0 && vec.y > 0 && vec.y < height);
}

//checks if a vector is within the quarentine zone
function isWithinQZone(vec){
  return (vec.x < Q_ZONE_X + Q_ZONE_W && vec.x > Q_ZONE_X && vec.y < Q_ZONE_Y + Q_ZONE_H && vec.y > Q_ZONE_Y);
}


class Person {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.infected = false;
    this.xVel = random(0, 2);
    this.yVel = random(0, 2);
    this.lastCollision = undefined;
    
    //variables required for levy type motion
    this.dest = createVector(this.x, this.y);
    this.velocity = createVector(this.xVel, this.yVel);
    this.velocityMagnitude = this.velocity.mag();
    this.largeJumpProbability = 0.03;
    
    //variables regarding incubation period
    this.incubating = false;
    this.willIsolate = false;
    
  }
  
  //different type of random motion that emulates natural movement.
  //employs the use of a destination point which the person will move in a straight line towards. Once the destination is reached, another one is generated
  //generally destination points are a small (2-5 px) away from the current location and are in a random direction but ocassionally, destinations are far away (25-100px) as this is emulating
  //a person going far away sometimes
  moveLevy(){
    this.willIsolate = quarantinePolicy;
    
    let curPose = createVector(this.x, this.y);
    
    //person has reached their destination, so generate a new one.
    if (abs(p5.Vector.sub(this.dest, curPose).mag()) < 2){
      //if the person is infected and his isolation property is true, send him to quarentine.
      if (this.infected && !this.incubating && this.willIsolate){
        //set the destination vector to a random point in the quarentine zone
        this.dest.set(createVector(random(Q_ZONE_X, Q_ZONE_X+Q_ZONE_W), random(Q_ZONE_Y, Q_ZONE_Y+Q_ZONE_H)))
      }
      else{
        //set the destination to be the current pose for ease of calculation
        this.dest.set(curPose);
        //generate a random small distance for the person to travel
        let destinationDistance = random(3, 6);
        //randomly assign a large distance a small percentage of the time
        if (random() < this.largeJumpProbablity){
          destinationDistance = random(25, 100);
        }
        //add to the destination vector (which was set to the current position) a vector pointing in a random direction the lenght of the predetermined destination distance
        this.dest.add(p5.Vector.random2D().mult(destinationDistance));
        //if the generated destination is outside of the canvas, artificially just move towards the center of the screen (but still the same random distance)
        if (!isWithinCanvas(this.dest)){
          this.dest.add(p5.Vector.sub(createVector(width/2, height/2), curPose).normalize().mult(destinationDistance));
        }
        //if quarentine policy is active and the generated destination is within the quarentine zone, go somewhere else.
        while (this.willIsolate && isWithinQZone(this.dest)){
          this.dest = createVector(random(width), random(height));
        }
      }
      
    }
    //person is enroute to destination so calculate desired velocity vector and follow it
    else{
      //keep a copy of the last velocity vector to check if the person is bouncing back and forth
      let lastVel = this.velocity.copy();
      //calculate a new velocity vector by subtracting the current pose from the distance then scaling it so that it is the length of the persons velocity magnitude
      this.velocity = p5.Vector.sub(this.dest, curPose).normalize().mult(this.velocityMagnitude);
      //if the person is bouncing between points (osciallating) just set his or her x, y position to the destination so that it generates a new one next loop.
      if (abs(lastVel.angleBetween(this.velocity)) > 90){
        this.x = this.dest.x;
        this.y = this.dest.y;
      }
      else{
        this.x += this.velocity.x;
        this.y += this.velocity.y;
      }
      
    }
  }
  
  move() {
    this.x += this.xVel;
    this.y += this.yVel;
    if (this.x < 0 || this.x > width) {
      this.xVel *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.yVel *= -1;
    }
    
    this.xVel += 0.1 * ((random() * 2) - 1);
    this.yVel += 0.1 * ((random() * 2) - 1);
  }
  
  draw() {
    noStroke();
    if (this.incubating == true){
      fill("yellow");
      if (this.incubationCount > INCUBATION_PERIOD * frameRate()){
        this.incubating = false;
      }
      this.incubationCount++;
    }
    else if (this.infected) {
      fill("red");
    } else {
      fill("blue");
    }
    circle(this.x, this.y, DIAMETER);
  }
  
  checkCollision(that) {
    return collideCircleCircle(this.x, this.y, DIAMETER, that.x, that.y, DIAMETER);
  }
  
  infect(){
    this.infected = true;
    this.incubating = true;
    this.incubationCount = 0;
  }
  
}