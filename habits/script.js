var monthArray = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
var smallWeekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

var currentYear = new Date().getFullYear();
console.log(currentYear);
var currentMonth = new Date().getMonth();
console.log(currentMonth);
var daysInMonth = new Date(currentYear, (currentMonth+1), 0).getDate();
console.log(daysInMonth);
var firstDayOfMonth, numberOfWeeks;
Date.prototype.getWeekOfMonth = function () {
  firstDayOfMonth = new Date(this.setDate(1)).getDay(); 
  return Math.ceil((firstDayOfMonth + daysInMonth) / 7); // numero de semanas do mês
}

var habitsContainer, addHabitInput, monthTitle;
var habits = [];

function start() {
  habitsContainer = document.getElementById("habits");
  addHabitInput = document.getElementById("addHabitInput");
  monthTitle = document.getElementById("monthTitle");

  monthTitle.textContent = monthArray[currentMonth] + "/" + currentYear;

  addHabitInput.focus();
  addHabitInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") addHabit();
  });
  
  habits = getDataFromStorage();
  if (habits !== []) {
    numberOfWeeks = new Date(currentYear, currentMonth).getWeekOfMonth();
    habits.forEach(habit => showHabit(habit));
  }
  else 
    showEmptyMessage();
  
  function showHabit(habit) {
    var habitHead = createHabitHead(habit.name);
    var habitBody = createHabitWeekDays();
    habitBody.style.gridTemplateRows = numberOfWeeks+1;
    if (firstDayOfMonth != 0) 
      habitBody.appendChild(document.createElement("div"));
      habitBody.querySelector(':nth-child(8)').style.gridColumn = firstDayOfMonth;
    for (var i = 0; i < habit.days.length; i++) 
      createHabitDay(habitBody, habit.name, i+1, habit.days[i]);
    createHabitBox(habitHead, habitBody);
  }

  function showEmptyMessage() {
    console.log("nao há hábitos para serem mostrados. comece agora!");
  }
}

function createHabitHead(habitName) {
  var habitHead = document.createElement("div");
  var habitTitle = document.createElement("h3");
  habitTitle.textContent = habitName;
  var habitDelete = document.createElement("button");
  habitDelete.textContent = "X";
  habitDelete.addEventListener("click", function() {deleteHabit(habitName) });
  habitHead.appendChild(habitTitle);
  habitHead.appendChild(habitDelete);
  habitHead.classList = "habit-head";
  return habitHead;
}

function createHabitWeekDays() {
  var habitBody = document.createElement("div");
  habitBody.classList = "habit-body grid my-1";
  smallWeekDays.forEach(weekDay => {
    habitBody.innerHTML += `<p class="bold upper">${weekDay}</p>`;
  });
  return habitBody;
}

function createHabitDay(body, habitName, day, isDone) {
  var id = habitName + ";" + day;
  var checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", id);
  checkbox.checked = isDone;
  var label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = (day < 10) ? "0" + day : day;
  checkbox.addEventListener("change", function() {checkDay(checkbox)});
  body.appendChild(checkbox);
  body.appendChild(label);
}

function createHabitBox(habitHead, habitBody) {
  var habitBox = document.createElement("div");
  habitBox.classList = "habit-box";
  habitBox.appendChild(habitHead);
  habitBox.appendChild(habitBody);
  habitsContainer.appendChild(habitBox);
}

checkDay = (checkbox) => {
  var habit = checkbox.id.split(";");
  for (var i = 0; i < habits.length; i++)
    if (habits[i].name == habit[0]) {
      habits[i].days[habit[1]-1] = !(habits[i].days[habit[1]-1]);
      break;
    }
  saveDataInStorage();
}

deleteHabit = (habitName) => {
  console.log(habitName);
}

function addHabit() {
  // var habit = {name: "", days: []};
  var habit = {name: addHabitInput.value, days: []};
  // console.log(addHabitInput);
  // habit.name = addHabitInput.value;
  addHabitInput.value = "";
  addHabitInput.focus();
    
  if (habit.name == "") // nomes vazios
    return; 
  else if (habits.length != 0)  // nomes iguais
    for (var i = 0; i < habits.length; i++) 
      if (habits[i].name === habit.name) 
        return;

  var habitHead = createHabitHead(habit.name);
  var habitBody = createHabitWeekDays();
  for (var i = 1; i <= daysInMonth; i++) {
    createHabitDay(habitBody, habit.name, i, false);
    habit.days.push(false);
  }
  habits.push(habit);
  createHabitBox(habitBody, habitHead);
}

function getDataFromStorage() {
  return JSON.parse(localStorage.getItem("habits")) || [];
}

function saveDataInStorage() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

start();