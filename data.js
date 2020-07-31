/*global raw_data*/

let covidDataObj = null;
let loaded = false;
let dailyTotalCases = [];
let dates = [];
//capita = 100k
let dailyPerCapitaCases = [];
const US_POPULATION = 3282000;
let simCases = [0, 0];
let simDays = [0];
let newSimCases = [0, 0];

//loads json object
 function loadJSON() {   
   covidDataObj = JSON.parse(raw_data);
   console.log('Done loading');
 }

//runs loadJSON function to build the object
function build(){
  if (!loaded){
    loadJSON();
    loaded = true;
  } 
}

//gets the array of dates for real data
function getDates(){
  if (!loaded){
    build();
    while(!covidDataObj){}
  }
  if (dates == []){
    getDailyTotalCases();
  }
  return dates;
}

//gets the array of total daily cases (real data)
function getDailyTotalCases(){
  console.log(dailyTotalCases.length);
  if (dailyTotalCases.length == 0){
    console.log('adf');
    console.log('tring to load');
    dailyTotalCases = [];
    for (let i = 0; i < covidDataObj.length; i ++){
      dailyTotalCases.push(covidDataObj[i]['total_cases']);
      dailyPerCapitaCases.push(covidDataObj[i]['total_cases']*100000/US_POPULATION);
      dates.push(covidDataObj[i]['date']);
    }
  }
  console.log('out');
  return dailyTotalCases;
}

//gets the array of total daily per capita cases (real data)
function getDailyPerCapitaCases(){
  if (!loaded){
    build();
    while(!covidDataObj){}
  }
  if (dailyPerCapitaCases == []){
    getDailyTotalCases();
  }
  return dailyPerCapitaCases;
}

//gets the array of total cases per day (real data)
function getSimTotalCases(){
  return simCases
}

//gets the array of new cases per day (real data)
function getNewSimCases(){
  return newSimCases;
}

function getSimDays(){
  return simDays;
}

//updates the data arrays for the simulation (should be called every "day" from the loop)
function updateData(infected){
  console.log('update')
  simCases.push(infected);
  newSimCases.push(simCases[simCases.length-1]-simCases[simCases.length-2]);
  simDays.push(simDays[simDays.length-1]+1);
  infectedArray.push(infectedCount);
}

function resetData(){
  simCases = [];
  newSimCases = [];
  simDays = [];
  infectedArray = [];
}


//builds json object
build();

