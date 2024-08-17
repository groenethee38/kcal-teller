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
  var ctx = document.getElementById("progressionChart").getContext('2d');
  var progressionChart = null;

  function initializeChart() {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#510499');
    gradient.addColorStop(1, '#2041B6');

    progressionChart = new Chart(ctx, {
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

      if (progressionChart) {
      progressionChart.data.datasets[0].data[0] = percentage;
      progressionChart.data.datasets[0].data[1] = 100 - percentage;
      progressionChart.update();
      } else {
      initializeChart();
      progressionChart.data.datasets[0].data[0] = percentage;
      progressionChart.data.datasets[0].data[1] = 100 - percentage;
      progressionChart.update();
      }
      
      percentageText.textContent = percentage + "%";
      kcalText.textContent = kcal + " kcal";
    } else {
        console.error("kcal-doel element not found or its content is None.");
    }
  }

  changeDay = function(date, kcal) {
    totalKcal = kcal;
    updateChart(totalKcal);
  }

  if (totalKcal) {
    initializeChart();
    updateChart(totalKcal);
  }
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

Zie recept pop-up window

========================================================================================== */

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