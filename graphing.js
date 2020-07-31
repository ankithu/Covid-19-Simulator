/* global createCanvas, background,Chart,*/
var chart = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(chart, {
  type: "line",
  data: {
    labels: getDates(),
    datasets: [
      {
        label: "# of US Cases",
        data: getDailyTotalCases(),
        fill: false,
        borderColor: ["rgba(255, 0, 0, 1)"],
        pointRadius: 0,
        borderWidth: 2
      }
    ]
  },
  options: {
    scales: {
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Population"
          },
          ticks: {
            suggestedMin: 0,
            suggestedMax: NUM_PERSONS,
            display: true,
            lableLString: "Number of people infected by COVID-19"
          }
        }
      ],
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Time"
          }
        }
      ]
    },
    responsive: true,
    title: {
      display: true,
      text: "US COVID-19 graph"
  },
    hover: {
      mode: "nearest",
      intersect: true
    }
}
});
console.log(infectedCount);
var chart2 = document.getElementById("secondChart").getContext("2d");
var mySecondChart = new Chart(chart2, {
  type: "line",
  data: {
    labels: getSimDays(),
    datasets: [
      {
        label: "# of Cases",
        data: infectedArray,
        fill: false,
        borderColor: ["rgba(0, 0, 255, 1)"],
        pointRadius: 0,
        borderWidth: 2
      }
    ]
  },
  options: {
    scales: {
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Population"
          },
          ticks: {
            display: true,
            lableLString: "Number of people infected by COVID-19"
          }
        }
      ],
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Time"
          }
        }
      ]
    },
    responsive: true,
    title: {
      display: true,
      text: "COVID-19 simulation graph"
    },
    tooltips: {
      mode: "index",
      intersect: false
    },
    hover: {
      mode: "nearest",
      intersect: true
    }
  }
});



function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach(dataset => {
    dataset.data.push(data);
  });
  chart.update();
}
function removeData(chart) {
    chart.data.labels.length = 0;
    chart.data.datasets.forEach((dataset) => {
        dataset.data.length = 0;
    });
    chart.update();
}
function updateScale(chart) {
  chart.options.scales.yAxes[0] = {
    type: "line"
  };
  chart.options.scales.xAxes[0] = {
    type: "line"
  };
  chart.update();
}

