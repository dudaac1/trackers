var yearTitle, yearInput, yearplanContainer, hideDaysBtn;
var yearplan;

function start() {
  yearTitle = document.getElementById("yearTitle");
  yearInput = document.getElementById("year");
  yearplanContainer = document.getElementById("yearplan");
  hideDaysBtn = document.getElementById("hideDays");

  window.onblur = saveDataInStorage;  
  window.onbeforeunload = saveDataInStorage;
  
  yearplan = getDataFromStorage();
  if (yearplan) { // process if empty/undefined before continues
    yearplan.year = new Date().getFullYear();
    yearplan.month = Array(12).fill("");
    yearplan.days = Array(12).fill([]);
  }
  
  yearInput.value = yearplan.year;
  yearTitle.textContent = yearplan.year;

  var monthArray = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  
    for (var i = 0; i < monthArray.length; i++) {
      var fullMonth = document.createElement("section");
      fullMonth.setAttribute("name", "fullMonth");
      fullMonth.innerHTML = "<h3>" + monthArray[i] + "</h3>";

      var monthText = document.createElement("textarea");
      monthText.classList = "month-textarea normal";
      monthText.textContent = yearplan.month[i];
      monthText.addEventListener("blur", addContentInMonth);
      monthText.month = i;
      fullMonth.appendChild(monthText);

      var monthDays = document.createElement("section");
      monthDays.classList = "month-days";
      monthDays.setAttribute("name", "monthDays");
      generateDays(monthDays, i);
      fullMonth.appendChild(monthDays);
      yearplanContainer.appendChild(fullMonth);
  }
}

function generateDays(monthDays, currMonth) {
  var day, dayNumber, dayIndex, dayInput;
  var daysInMonth = new Date(yearplan.year, (currMonth+1), 0).getDate();

  for (dayIndex = 1; dayIndex <= daysInMonth; dayIndex++) {
    day = document.createElement("div");
    day.classList = "flex";
    
    dayNumber = (dayIndex < 10) ? "0" + dayIndex : + dayIndex;
    dayInput = document.createElement("input");
    dayInput.addEventListener("blur", addContentInDay);
    dayInput.month = currMonth;
    dayInput.day = dayIndex;
    dayInput.value = yearplan.days[currMonth][dayIndex] === undefined ? "" : yearplan.days[currMonth][dayIndex];
    day.innerHTML = dayNumber;
    day.appendChild(dayInput);
    monthDays.appendChild(day);
  }
}

addContentInMonth = (event) => {
  var target = event.target;
  if (target.value) {
    var month = target.month;
    yearplan.month[month] = target.value;
    alert("Dados adicionados ao mês especificado.");
  }
}

addContentInDay = (event) => {
  var target = event.target;
  if (target.value) {
    var month = target.month;
    var day = target.day;
    yearplan.days[month][day] = target.value;
    alert("Dados adicionados ao dia especificado.");
  }
}

showDays = () => {
  hideDaysBtn.setAttribute("onclick", "hideDays()");
  hideDaysBtn.innerHTML = "esconder dias";
  
  var allMonths = document.getElementsByName("fullMonth");
  allMonths.forEach(month => {
    month.style.width = "200px";
    month.children[1].classList = "month-textarea normal";
    month.children[2].classList = "month-days";
  });
}

hideDays = () => {
  hideDaysBtn.setAttribute("onclick", "showDays()");
  hideDaysBtn.innerHTML = "mostrar dias";
  
  var allMonths = document.getElementsByName("fullMonth");
  allMonths.forEach(month => {
    month.style.width = "300px";
    month.children[1].classList = "month-textarea bigger";
    month.children[2].classList = "hidden";
  });
}

function getDataFromStorage() {
  return JSON.parse(localStorage.getItem("yearplan")) || {};
}

function saveDataInStorage() {
  localStorage.setItem("yearplan", JSON.stringify(yearplan));
}

start();