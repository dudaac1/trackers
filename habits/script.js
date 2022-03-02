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

// it gets elements from DOM, update month/year title, adds focus and event listener on input
// get data from storage and show habits in screen
function start() {
  // getting elements from DOM
  habitsContainer = document.getElementById("habits");
  addHabitInput = document.getElementById("addHabitInput");
  monthTitle = document.getElementById("monthTitle");

  // updating month/year title
  monthTitle.textContent = monthArray[currentMonth] + "/" + currentYear;

  // input events
  addHabitInput.focus();
  addHabitInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") addHabit();
  });
  
  // getting data from storage and showing in screen if existent
  habits = getDataFromStorage();
  if (habits !== []) {
    numberOfWeeks = new Date(currentYear, currentMonth).getWeekOfMonth();
    habits.forEach(habit => showHabit(habit));
  }
  else 
    showEmptyMessage();
  
  // for each habit returned, creates habit header, habit body and a container for them
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

  // if there's nothing in local storage, it shows a message in screen
  function showEmptyMessage() {
    // console.log("nao há hábitos para serem mostrados. comece agora!");
    var message = document.createElement("h2");
    message.textContent = "nao há hábitos para serem mostrados. comece agora!";
    habitsContainer.appendChild(message);
  }
}

// creates a div element with habit's name and a delete button
// returns the first created div
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

// creates a div element with 7 p elements for every day of week
// returns the first created div
function createHabitWeekDays() {
  var habitBody = document.createElement("div");
  habitBody.classList = "habit-body grid my-1";
  smallWeekDays.forEach(weekDay => {
    habitBody.innerHTML += `<p class="bold upper">${weekDay}</p>`;
  });
  return habitBody;
}

// creates a label and a checkbox input for the day
// it is required an outside loop (as done in addHabit and showHabit)
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

// creates a div with a header and a body for a habit
// it must be done with the returns from createHabitHead and createHabitWeekDays
function createHabitBox(habitHead, habitBody) {
  var habitBox = document.createElement("div");
  habitBox.classList = "habit-box";
  habitBox.appendChild(habitHead);
  habitBox.appendChild(habitBody);
  habitsContainer.appendChild(habitBox);
}

// called when day in habit is clicked
// changes the value of that day to !day and saves in localStorage
checkDay = (checkbox) => {
  var id = checkbox.id.split(";"); // [0] = name; [1] = day
  for (var i = 0; i < habits.length; i++)
    if (habits[i].name == id[0]) {
      habits[i].days[id[1]-1] = !(habits[i].days[id[1]-1]);
      break;
    }
  saveDataInStorage();
}

// called when delete button on habit box is clicked
// it deletes the habit from habits array and localstorage
deleteHabit = (habitName) => {
  console.log(habitName);
}

// called when plus button on footer clicked or enter key pressed
// it adds the new habit in screen and in localstorage
function addHabit() {
  // var habit = {name: "", days: []};
  var habit = {name: addHabitInput.value, days: []};
  addHabitInput.value = "";
  addHabitInput.focus();
  
  // doesn't accept:
  if (habit.name == "") // empty habits names
    return; 
  else if (habits.length != 0)  // equals habits names
    for (var i = 0; i < habits.length; i++) 
      if (habits[i].name === habit.name) 
        return;

  var habitHead = createHabitHead(habit.name);
  var habitBody = createHabitWeekDays();
  for (var i = 1; i <= daysInMonth; i++) {
    createHabitDay(habitBody, habit.name, i, false);
    habit.days.push(false);
  }
  createHabitBox(habitBody, habitHead);
  habits.push(habit);
  saveDataInStorage();
}

// getting and saving data from/in storage
function getDataFromStorage() {
  return JSON.parse(localStorage.getItem("habits")) || [];
}

function saveDataInStorage() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

start();