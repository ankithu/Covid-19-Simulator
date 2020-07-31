/* global createCanvas, background, initializeSimulation, writeText, moveCheckInfectionDraw, simulationStep, frameRate*/
let dataUpdateCounter = 0;

function setup(){
  createCanvas(800, 600);
  //frameRate(24);
  textFont("Georgia");
  initializeSimulation();
  noLoop();
}

// mask: infect probability lower
// social distancing: travel velocity slower or keep within circle
// more random motion
// slow down

function draw(){
  background(220);
  writeText();
  simulationStep();
  
  updateScale(mySecondChart);
  if (dataUpdateCounter > frameRate() * 1){
    updateData(infectedCount);
    dataUpdateCounter = 0;
  }
  dataUpdateCounter++;
     
  //moveCheckInfectionDraw();
}
addData(mySecondChart, getDates(), getNewSimCases());