/* global createCanvas, background, Person, random, floor, textSize, fill, text, round, frameRate, sliderValue, width, height, QuadBoundary, QuadTree, DIAMETER, noStroke, sdBtn, qtBtn */

const NUM_PERSONS = 500;
let persons;
let infectedCount;
let personManager;
let infectedArray = [];
let simText = $("#simText");

let quarantinePolicy = false;

function percentInfected() {
  return round(infectedCount / NUM_PERSONS * 10000) / 100;
}

function writeText() {
  /*textSize(20);
  fill("black");
  noStroke();
  text("Number infected: " + infectedCount + " (" + percentInfected() + "%)", 15, 25);
  text("Percent wearing masks: " + sliderValue + "%", 15, 50);
  text(sdBtn.html(), 15, 75);
  text(qtBtn.html(), 15, 100);*/
  let str = "<span id='numberInfected'>Number infected: " + infectedCount + "/" + NUM_PERSONS + " (" + percentInfected() + "%)</span><br>";
  str += "Percent wearing masks: " + sliderValue + "%";
  str += " • " + sdBtn.html();
  str += " • " + qtBtn.html();
  simText.html(str);
}

function calculateRisk() {
  let maskWearingProportion = sliderValue / 100;
  let riskDecrease = 0.65 * maskWearingProportion;
  return 1 - riskDecrease;
}

function initializeSimulation() {
  persons = [];
  for (let i = 0; i < NUM_PERSONS; i++) {
    persons.push(new Person());
  }
  persons[floor(random(persons.length))].infect();
  
  infectedCount = 1;
}

function buildQuadTree(){
  let boundary = new QuadBoundary(0, 0, width, height);
  personManager = new QuadTree(boundary, 5);
  for (let i = 0; i < persons.length; i ++){
    personManager.insert(persons[i]);
  }
}


function movePeople(){
  for (let i = 0; i < persons.length; i ++){
    persons[i].moveLevy();
  }
}

function drawPeople(){
  for (let i = 0; i < persons.length; i ++){
    persons[i].draw();
  }
  if (quarantinePolicy){
    noFill();
    stroke('red');
    rect(Q_ZONE_X, Q_ZONE_Y, Q_ZONE_W, Q_ZONE_H);
  }
  //console.log(personManager.boundary);
  //personManager.draw();
}

function simulationStep(){
  movePeople();
  buildQuadTree();
  checkInfections();
  drawPeople();
}


//checks each infected person to see if they will spread the infection
function checkInfections(){
  for (let i = 0; i < persons.length; i ++){
    let range = new QuadBoundary(persons[i].x - DIAMETER * 1.5, persons[i].y - DIAMETER * 1.5, DIAMETER * 3, DIAMETER * 3);
    if (persons[i].infected){
      let possibleInfected = personManager.getPointsInRange(range);
      for (let j = 0; j < possibleInfected.length; j ++){
        if (possibleInfected[j] != persons[i] && persons[i].checkCollision(possibleInfected[j]) && !possibleInfected[j].infected && (persons[i].lastCollision !== possibleInfected[j] || possibleInfected[j].lastCollision !== persons[i])){
          if (random() < calculateRisk()){
            possibleInfected[j].infect();
            infectedCount++;
          }
          persons[i].lastCollision = possibleInfected[j];
          possibleInfected[j].lastCollision = persons[i];
        }
      }
    }
  }
}

/*function moveCheckInfectionDraw() {
  for (let i = 0; i < persons.length; i++) {
    persons[i].move();
    
    if (persons[i].infected) {
      for (let j = 0; j < persons.length; j++) {
        if (i !== j && persons[i].checkCollision(persons[j]) && !persons[j].infected) {
          if (random() < calculateRisk()) {
            persons[j].infected = true;
            infectedCount++;
          }
        }
      }  
    }
    
    persons[i].draw();
  }
}*/