var monthArray = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
var smallWeekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

var currentYear = new Date().getFullYear();
var currentMonth = new Date().getMonth();
var currentDay = new Date().getDate();
var daysInMonth = new Date(currentYear, (currentMonth+1), 0).getDate();
var firstDayOfMonth;
Date.prototype.getWeekOfMonth = function () {
  firstDayOfMonth = new Date(this.setDate(1)).getDay(); 
  return Math.ceil((firstDayOfMonth + daysInMonth) / 7); 
}

var habitsContainer, addHabitInput;
var habits = [];

// update month/year title, add focus and event listener on input, add event listener 
// on window to save datam get data from local storage and show habits on screen
function start() {
  habitsContainer = document.getElementById("habitsContainer");
  addHabitInput = document.getElementById("addHabitInput");
  var monthTitle = document.getElementById("monthTitle");

  monthTitle.textContent = monthArray[currentMonth] + "/" + currentYear;

  window.onblur = saveDataInStorage;  
  window.onbeforeunload = saveDataInStorage;

  addHabitInput.focus();
  addHabitInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") addHabit();
  });
  
  habits = getDataFromStorage();
  if (habits.length) 
    habits.forEach(habit => showHabit(habit));
  else
    showEmptyMessage();
}

 // creates habit header, habit body and a container
function showHabit(habit) {
  numberOfWeeks = new Date(currentYear, currentMonth).getWeekOfMonth();

  var habitHead = createHabitHead(habit.name);
  var habitBody = createHabitWeekDays();
  habitBody.style.gridTemplateRows = numberOfWeeks+1;
  if (firstDayOfMonth != 0) {
    habitBody.appendChild(document.createElement("div"));
    habitBody.querySelector(':nth-child(8)').style.gridColumn = firstDayOfMonth;
  }

  var i = 0;
  for (; i < currentDay-5; i++) createHabitDay(habitBody, habit.name, i+1, habit.days[i], false);
  for (; i < currentDay; i++) createHabitDay(habitBody, habit.name, i+1, habit.days[i], true);
  for (; i < daysInMonth; i++) createHabitDay(habitBody, habit.name, i+1, habit.days[i], false);
  
  createHabitBox(habitHead, habitBody, habit.name);
}

// creates header (name + delete button) 
function createHabitHead(habitName) {
  var habitHead = document.createElement("div");
  var title = document.createElement("h3");
  title.textContent = habitName;
  var deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.addEventListener("click", function() {deleteHabit(habitName) });
  habitHead.appendChild(title);
  habitHead.appendChild(deleteBtn);
  habitHead.classList = "habit-head";
  return habitHead;
}

// creates a paragraph for each day of week
function createHabitWeekDays() {
  var habitBody = document.createElement("div");
  habitBody.classList = "habit-body grid my-1";
  smallWeekDays.forEach(weekDay => {
    habitBody.innerHTML += `<p class="bold upper">${weekDay}</p>`;
  });
  return habitBody;
}

// creates a label and a checkbox input for the day
// requires an outside loop (as done in addHabit and showHabit)
function createHabitDay(habitBody, habitName, day, isChecked, canBeChecked) {
  var id = habitName + ";" + day;
  var checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", id);
  checkbox.checked = isChecked;
  var label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = (day < 10) ? "0" + day : day;
  if (canBeChecked) 
    checkbox.addEventListener("change", function() {checkDay(checkbox)});
  else 
    checkbox.disabled = true;
  habitBody.appendChild(checkbox);
  habitBody.appendChild(label);
}

// creates a div with a header and a body for a habit
// requires the returns from createHabitHead and createHabitWeekDays
function createHabitBox(habitHead, habitBody, habitName) {
  var habitBox = document.createElement("div");
  habitBox.classList = "habit-box";
  habitBox.appendChild(habitHead);
  habitBox.appendChild(habitBody);
  habitBox.setAttribute("id", habitName);
  habitsContainer.appendChild(habitBox);
}

// called when day in habit is clicked
checkDay = (checkbox) => {
  var habitInfo = checkbox.id.split(";"); // [0] = name; [1] = day
  for (var i = 0; i < habits.length; i++)
    if (habits[i].name == habitInfo[0]) {
      habits[i].days[habitInfo[1]-1] = !(habits[i].days[habitInfo[1]-1]);
      break;
    }
}

// called when add button on footer (+) is clicked or enter key pressed
// adds the new habit on screen and on local storage
addHabit = () => {
  var newHabit = {name: addHabitInput.value, days: []};
  addHabitInput.value = "";
  addHabitInput.focus();
  
  // doesn't accept:
  if (newHabit.name == "") // a. empty habits names
    return; 
  else if (habits.length) { // b. equals habits names
    for (var i = 0; i < habits.length; i++) 
      if (habits[i].name === newHabit.name) 
        return;
  } else {
    habitsContainer.innerHTML = "";
  }
    
  newHabit.days = Array(daysInMonth).fill(false);
  showHabit(newHabit);

  habits.push(newHabit);
}

// called when delete habit button is clicked
deleteHabit = (habitName) => {
  var habitBox = document.getElementById(habitName);
  habitBox.parentNode.removeChild(habitBox);
  
  if (habits.length == 1) 
    showEmptyMessage();
  else
    for (var i = 0; i < habits.length; i++)
      if (habits[i].name == habitName) {
        habits[i] = habits[habits.length-1]; //habit to be delete is overwritten by the last habit
        break;
      }
  habits.pop(); //remove last item on array 
}

function showEmptyMessage() {
  var message = document.createElement("h1");
  message.innerHTML = "<br>Não há hábitos para serem mostrados. <br>Não deixe para depois, comece agora!";
  habitsContainer.appendChild(message);
}

function getDataFromStorage() {
  return JSON.parse(localStorage.getItem("habits")) || [];
}

function saveDataInStorage() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

start();