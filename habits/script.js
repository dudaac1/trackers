var monthYearTitle = document.getElementById("monthYearTitle");
var trackerTable = document.getElementById("tracker");
var firstLineTable = document.getElementById("firstLine");
var habitBody = document.getElementById("habit");
var addHabitInput = document.getElementById("addHabitInput");

var currentMonth = new Date().getMonth();
var currentYear = new Date().getFullYear();

var monthArray = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
var habits = [];

var lastHabitIndex = 0;
var daysInMonth = new Date(currentYear, (currentMonth+1), 0).getDate()

function start() {
  addHabitInput.focus();
  addHabitInput.addEventListener("keyup", function(event){
    if (event.key === "Enter") addHabit();
  });

  var trackerTitleTxt = document.createTextNode(monthArray[currentMonth] + "/" + currentYear); 
  monthYearTitle.appendChild(trackerTitleTxt); // titulo: mês/ano
  createHeadCells();

  // criando células da primeira linha
  function createHeadCells() {
    for (var i = 1; i <= daysInMonth; i++) {
      var cell = document.createElement("th");
      var cellTxt;
      if (i > 9) 
        cellTxt = document.createTextNode(i);
      else 
        cellTxt = document.createTextNode("0" + i);
      cell.appendChild(cellTxt);
      cell.classList = "tableRow";
      firstLineTable.appendChild(cell);
    }
  }

  // checando local storage
  habits = getDataFromStorage();
  console.log(habits);

  // adicionando habitos na tela
  habits.forEach(habit => {
    var tableLine = document.createElement("tr");
    showHabitTitle(tableLine, habit.name);
    for (var i = 0; i < habit.days.length; i++) 
      showHabitCheckbox(tableLine, habit.name, i+1, habit.days[i]);
    habitBody.appendChild(tableLine);
  });

}

// função para adicionar uma nova linha de checkboxes e o nome do hábito a ser rastreado
function addHabit() {
  var habit = {name: "", days: []};
  habit.name = addHabitInput.value;
  addHabitInput.value = "";
  
  if (habit.name == "") //não aceitar habitos sem titulos
    return; 
  else if (habits.length != 0)  //não aceitar habitos com titulos iguais
    for (var i = 0; i < habits.length; i++) 
      if (habits[i].name === habit.name) 
        return;
  
  var tableLine = document.createElement("tr");
  showHabitTitle(tableLine, habit.name);
  for (var i = 1; i <= daysInMonth; i++) {
    showHabitCheckbox(tableLine, habit.name, i, false);
    habit.days.push(false);
  }
  habitBody.appendChild(tableLine);
  
  // var id = "habit" + lastHabitIndex;
  // line.setAttribute("id", id);
  // lastHabitIndex++;
  
  habits.push(habit);
  saveDataInStorage();
}

function showHabitTitle(line, habitTitle) {
  var cellContent = document.createElement("span");
  var cellTxt = document.createTextNode(habitTitle);
  cellContent.appendChild(cellTxt);
  var cell = document.createElement("td");
  cell.classList = "habitTitle";
  cell.appendChild(cellContent);
  line.appendChild(cell);
}

function showHabitCheckbox(line, habitTitle, day, isDone) {
  var cellContent = document.createElement("input");
  cellContent.setAttribute("type", "checkbox");
  cellContent.setAttribute("onclick", `setCheckbox("${habitTitle}", "${day}")`);
  cellContent.classList = "habitCheckbox";
  cellContent.checked = isDone;
  var cell = document.createElement("td");
  cell.appendChild(cellContent);
  line.appendChild(cell);
}

function setCheckbox(habitTitle, dayNumber) {
  console.log(habitTitle, dayNumber);
  for (var i = 0; i < habits.length; i++)
    if (habits[i].name == habitTitle) {
      habits[i].days[dayNumber-1] = !(habits[i].days[dayNumber-1]);
      break;
    }
  saveDataInStorage();
}

function getDataFromStorage() {
  return JSON.parse(localStorage.getItem("habits")) || [];
}

function saveDataInStorage() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

start();