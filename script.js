var monthYearTitle = document.getElementById("monthYearTitle");
var trackerTable = document.getElementById("tracker");
var firstLineTable = document.getElementById("firstLine");
var habitBody = document.getElementById("habit");
var addHabitInput = document.getElementById("addHabitInput");

var currentMonth = new Date().getMonth();
var currentYear = new Date().getFullYear();

var monthArray = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

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
      cell.classList = "table-row";
      firstLineTable.appendChild(cell);
    }
  }
  
}

// função para adicionar uma nova linha de checkboxes e o nome do hábito a ser rastreado
function addHabit() {
 
  var habitTitle = addHabitInput.value;
  addHabitInput.value = "";

  if (habitTitle == "") return; //não aceitar habitos sem titulos

  var line = document.createElement("tr");
  var cellContent;
  for (var i = 0; i <= daysInMonth; i++) {
    if (i != 0) {
      cellContent = document.createElement("input");
      cellContent.setAttribute("type", "checkbox");
      cellContent.classList = "habitCheckbox";
    }
    else {
      cellContent = document.createElement("span");
      var cellTxt = document.createTextNode(habitTitle);
      cellContent.appendChild(cellTxt);
    }
    var cell = document.createElement("td");
    cell.appendChild(cellContent);
    line.appendChild(cell);
  }
  var id = "habit" + lastHabitIndex;
  line.setAttribute("id", id);
  lastHabitIndex++;

  habitBody.appendChild(line);
}


start();