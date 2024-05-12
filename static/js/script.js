function changeButton(buttonName) {
    var i;
    var buttons = document.getElementsByClassName("header-button-bg")
    for (i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    document.getElementById(buttonName).classList.add("active");
}

function openTab(tabName) {
    var i, tabContent;
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].classList.remove("active", "next");
      if (tabContent[i].id === tabName) {
        tabContent[i].classList.add("active");
      } else {
        tabContent[i].classList.add("next");
      }
    }
  }