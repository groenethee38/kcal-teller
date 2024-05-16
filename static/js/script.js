document.addEventListener("DOMContentLoaded", function () {
  var homeButtonOffsetLeft = document.getElementById("home-button").offsetLeft;
  var homeButtonWidth = document.getElementById("home-button").offsetWidth;
  document.getElementById("header-background").style.left = homeButtonOffsetLeft + "px";
  document.getElementById("header-background").style.width = homeButtonWidth + "px";
});

function changeButton(buttonName) {
    var homeButtonOffsetLeft = document.getElementById("home-button").offsetLeft;
    var offsetLeft = document.getElementById(buttonName).offsetLeft;
    var buttonWidth = document.getElementById(buttonName).offsetWidth;
    document.getElementById("header-background").style.transform = "translateX(" + (offsetLeft - homeButtonOffsetLeft) + "px)";
    document.getElementById("header-background").style.width = buttonWidth + "px";
}

function openTab(tabName) {
  var i, tabContent;
  tabContent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].classList.remove("active");
    if (tabContent[i].id === tabName) {
      tabContent[i].classList.add("active");
    }
  }
}

/* ==========================================================================================

Chart

========================================================================================== */

var kcalDoel = document.getElementById("kcal-doel");
var kcal = 1300;
var percentage = (100 / kcalDoel.textContent * kcal).toFixed(0);

const ctx = document.getElementById("progressionChart").getContext('2d');
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, '#5e02b4');
gradient.addColorStop(1, '#1643e4');

var porgressionChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [percentage, 100 - percentage],
      backgroundColor:  [gradient, 'transparent'],
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
})

document.addEventListener("DOMContentLoaded", function() {
  var percentageText = document.getElementById("percentage-text");
  percentageText.textContent = percentage + "%";
  var kcalText = document.getElementById("kcal-text");
  kcalText.textContent = kcal + " kcal";
});

/* ==========================================================================================

KCAL Doel pop-up window

========================================================================================== */

function openDoelEditor() {
  document.getElementById("pop-up-bg").style.display = "block";
  document.getElementById("kcal-doel-editor-window").style.display = "block";
}

function closeDoelEditor() {
  document.getElementById("pop-up-bg").style.display = "none";
  document.getElementById("kcal-doel-editor-window").style.display = "none";
}

var newDoel = document.getElementById("new-doel");
var saveNewDoel = document.getElementById("save-new-doel");

saveNewDoel.onclick = function() {
  kcalDoel.textContent = newDoel.value;
  percentage = (100 / kcalDoel.textContent * kcal).toFixed(0);
  var percentageText = document.getElementById("percentage-text");
  percentageText.textContent = percentage + "%";
  porgressionChart.data.datasets[0].data[0] = percentage;
  porgressionChart.data.datasets[0].data[1] = 100 - percentage;
  porgressionChart.update();
};