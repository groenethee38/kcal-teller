document.addEventListener("DOMContentLoaded", function () {
  var homeButtonOffsetTop = document.getElementById("home-button").offsetTop;
  var homeButtonOffsetLeft = document.getElementById("home-button").offsetLeft;
  var homeButtonWidth = document.getElementById("home-button").offsetWidth;
  document.getElementById("header-background").style.top = homeButtonOffsetTop + "px";
  document.getElementById("header-background").style.left = homeButtonOffsetLeft + "px";
  document.getElementById("header-background").style.width = homeButtonWidth + "px";

  var kcalDoel = document.getElementById("kcal-doel");
  var kcalText = document.getElementById("kcal-text");
  var percentageText = document.getElementById("percentage-text");
  var mainChart = document.getElementById("progression-chart").getContext('2d');
  var progressionChart = null;

  function initializeChart() {
    const gradient = mainChart.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#510499');
    gradient.addColorStop(1, '#2041B6');

    progressionChart = new Chart(mainChart, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [0, 100],
          backgroundColor: [gradient, 'transparent'],
          borderWidth: 0
        }]
      },
      options: {
        cutout: '85%',
        responsive: true,
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        }
      }
    });
  }

  function updateChart(kcal) {
    if (kcalDoel && kcalDoel.textContent !== 'None') {
      var targetKcal = parseInt(kcalDoel.textContent, 10);
      var percentage = (100 / targetKcal * kcal).toFixed(0);

      progressionChart.data.datasets[0].data[0] = percentage;
      progressionChart.data.datasets[0].data[1] = 100 - percentage;
      progressionChart.update();
      
      percentageText.textContent = percentage + "%";
      kcalText.textContent = kcal + " kcal";
    } else {
        console.error("kcal-doel element not found or its content is None.");
    }
  }

  initializeChart();
  updateChart(totalKcal || 0);  
});


/*--- Tabs ------------------------------*/

function changeButton(buttonName) {
  var homeButtonOffsetLeft = document.getElementById("home-button").offsetLeft;
  var offsetLeft = document.getElementById(buttonName).offsetLeft;
  var buttonWidth  =  document.getElementById(buttonName).offsetWidth;
  document.getElementById("header-background").style.transform = "translateX(" + (offsetLeft - homeButtonOffsetLeft) + "px)";
  document.getElementById("header-background").style.width = buttonWidth + "px";
}

function openTab(tabName) {
  var i, tabContent;
  tabContent = document.getElementsByClassName("tab-content");
  for (i = 0; i <tabContent.length; i++) {
    tabContent[i].classList.remove("active");
    if (tabContent[i].id === tabName) {
      tabContent[i].classList.add("active");
    } 
  }
}


/* ==========================================================================================

Nieuwe doel berekenen pop-up window

========================================================================================== */


/* ==========================================================================================

KCAL Doel pop-up window

========================================================================================== */

var newDoel = document.getElementById("new-doel");
var saveNewDoel = document.getElementById("save-new-doel");

function openDoelEditor() {
  document.getElementById("doel-editor-pop-up").style.display = "block";
}

function closeDoelEditor() {
  document.getElementById("doel-editor-pop-up").style.display = "none";
  newDoel.value = "";
}

document.addEventListener("click", (event) => {
  const popup = document.getElementById("doel-editor-pop-up");
  if (event.target === popup) {
    closeDoelEditor();
  }
})

saveNewDoel.onclick = function() {
  if (newDoel.value != NaN) {
    kcalDoel.textContent = newDoel.value;
    percentage = (100 / kcalDoel.textContent * kcal).toFixed(0);
    var percentageText = document.getElementById("percentage-text");
    percentageText.textContent = percentage + "%";
    porgressionChart.data.datasets[0].data[0] = percentage;
    porgressionChart.data.datasets[0].data[1] = 100 - percentage;
    porgressionChart.update();
    closeDoelEditor();
  }
};

/* ==========================================================================================

Add food pop-up window

========================================================================================== */

var productName = document.getElementById("product-name");
var productWeight = document.getElementById("product-weight");
var productKcal = document.getElementById("product-kcal");

function openAddFood() {
  document.getElementById("add-food-pop-up").style.display = "block";
}

function closeAddFood() {
  document.getElementById("add-food-pop-up").style.display = "none";
  productName.value = "";
  productWeight.value = "";
  productKcal.value = "";
}

document.addEventListener("click", (event) => {
  const popup = document.getElementById("add-food-pop-up");
  if (event.target === popup) {
    closeAddFood();
  }
})  





/* ==========================================================================================

Data

========================================================================================== */

function shortenDict(maxLength) {
  let shortened = {}

  let sortedKeys = Object.keys(dataDict).sort((a, b) => {
    let dateA = new Date(a.split('-').reverse().join('-'));
    let dateB = new Date(b.split('-').reverse().join('-'));
    return dateA - dateB; 
  });

  let recentKeys = sortedKeys.slice(-maxLength);

  for (let key of recentKeys) {
    shortened[key] = dataDict[key];
  }

  return shortened;
}


document.addEventListener("DOMContentLoaded", function () {
  var barChart = document.getElementById("bar-chart").getContext('2d');
  var barColors = ["#386eb0", "#a053a6"]

  dataBarChart = new Chart(barChart, {
    type: "bar",
    data: {
      labels: Object.keys(shortenDict(7)),
      datasets: [{
        backgroundColor: barColors,
        data: Object.values(shortenDict(7))
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 2500,
          grid: {
            display: false
          }
        },
        x: {
          grid: {
            display: true
          }
        }
      },
      plugins: {
        legend: {display: false},
      }
    }
  });
})

function updateChart(maxLength) {
  var newDict = shortenDict(maxLength);

  dataBarChart.data.labels = Object.keys(newDict);
  dataBarChart.data.datasets[0].data = Object.values(newDict);
  dataBarChart.update();
}

document.getElementById('6maanden').addEventListener('click', function() {
  updateChart(365);
  document.getElementById('6maanden').style.boxShadow = 'inset 2px 2px 8px #00000034';
  document.getElementById('1maand').style.boxShadow = 'none';
  document.getElementById('1week').style.boxShadow = 'none';
})
document.getElementById('1maand').addEventListener('click', function() {
  updateChart(30);
  document.getElementById('6maanden').style.boxShadow = 'none';
  document.getElementById('1maand').style.boxShadow = 'inset 2px 2px 8px #00000034';
  document.getElementById('1week').style.boxShadow = 'none';
})
document.getElementById('1week').addEventListener('click', function() {
  updateChart(7);
  document.getElementById('6maanden').style.boxShadow = 'none';
  document.getElementById('1maand').style.boxShadow = 'none';
  document.getElementById('1week').style.boxShadow = 'inset 2px 2px 8px #00000034';
})