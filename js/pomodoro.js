var minutesSpan, secondsSpan, activitySpan, timerBtn; //html 
var curMinutes, curSeconds, interval, curActivity; //script
var areStatsVisible = false, baseActivityName = "no project"; 

var pomodoro;

// get elements from DOM, get data from local storage, set activity as "pomodoro",
// its initial time and configure timer button to start
function start() {
  activitySpan = document.getElementById("activitySpan"); 
  minutesSpan = document.getElementById("minutesSpan");
  secondsSpan = document.getElementById("secondsSpan");
  timerBtn = document.getElementById("timerBtn");
  
  window.onblur = saveDataInStorage;  
  window.onbeforeunload = saveDataInStorage;

  pomodoro = getDataFromStorage();
  console.log(pomodoro);
  if (pomodoro) { // process if empty/undefined before continues
    pomodoro.break = 5;
    pomodoro.pomo = 25;
    pomodoro.times = [{name: baseActivityName, minutes: 0}];
    pomodoro.times.push({name: "noproject1", minutes: 1});
    pomodoro.times.push({name: "noproject12", minutes: 2});
  }

  setActivity();
  showTimerValues();
  timerBtnStart();

  document.getElementById("statsBtn").addEventListener("click", showStats);
  document.getElementById("changeTimesBtn").addEventListener("click", changeTimerValues); 
}

// change activity based on the current activity displayed
function setActivity() {
  if (!curActivity || curActivity == "intervalo") {
    curActivity = "pomodoro";
    curMinutes = pomodoro.pomo;
  } else {
    curActivity = "intervalo";
    curMinutes = pomodoro.break;
  }
  activitySpan.innerHTML = curActivity;
  curSeconds = 0;
}

function showTimerValues() {
  secondsSpan.textContent = (curSeconds < 10) ? "0" + curSeconds : curSeconds;
  minutesSpan.textContent = (curMinutes < 10) ? "0" + curMinutes : curMinutes;
}

function timerBtnStart() {
  timerBtn.innerHTML = "INICIAR";
  timerBtn.onclick = startTimer;
}

function timerBtnPause() {
  timerBtn.innerHTML = "PAUSAR";
  timerBtn.onclick = pauseTimer;
}

function startTimer() {
  interval = setInterval(timer, 1000);
  timerBtnPause();
}

function timer() {
  curSeconds--;
  if (curSeconds < 0) {
    
    pomodoro.times[0].minutes++;
    if (areStatsVisible) {
      var statDiv = document.getElementById("stats#"+baseActivityName);
      console.log(statDiv.input);
    //   var stats = document.getElementById("stats-no project");
    //   stats.value = pomodoro.times[0].minutes;
    }

    curMinutes--;
    curSeconds = 59;
    if (curMinutes < 0) {
      pauseTimer(); // clear interval and change timer button text
      setActivity(); //change activity to "break/intervalo"
    }
  }
  showTimerValues();
}

function pauseTimer() {
  clearInterval(interval);
  timerBtnStart();
}

showStats = () => {
  areStatsVisible = true;
  if (!statsContainer.innerHTML)
    createStats();
  else
    updateStats();

  var statsBtn = document.getElementById("statsBtn");
  statsBtn.removeEventListener("click", showStats);
  statsBtn.addEventListener("click", hideStats);
  statsBtn.textContent = "esconder estatísticas";
  statsContainer.classList = "pomodoro-stats flex";
}
  
hideStats = () => {
  areStatsVisible = false;
  var statsBtn = document.getElementById("statsBtn");
  statsBtn.removeEventListener("click", hideStats);
  statsBtn.addEventListener("click", showStats);
  statsBtn.innerHTML = "mostrar estatísticas";
  statsContainer.classList = "hidden";
}

function createStats() {
  statsContainer.innerHTML = "<h3>Clique no nome da atividade para editar.</h3>"
  pomodoro.times.forEach(time => {
    var statDiv = document.createElement("div");
    statDiv.setAttribute("id", "stats#"+time.name);
    var input = document.createElement("input");
    input.setAttribute("value", time.name);
    input.setAttribute("onblur", "editStats(event)");
    var label = document.createElement("label");
    label.textContent = `${time.minutes} min`;
    statDiv.appendChild(input);
    statDiv.appendChild(label);
    statsContainer.appendChild(statDiv);
  });
}

function updateStats() {
  // get 2nd part of id (defined previously as "stats#name")
  // to compare with the times stored in pomodoro.times

  // PODE TER ERROS
  // SE O NOME DA ATIVIDADE TER SIDO ALTERADO
  // E PORTANTO
  // TER INFOS DESATUALIZADAS
  // TIPO A ID DA DIV
  var statsDivsList = statsContainer.querySelectorAll("div");
  statsDivsList.forEach(statDiv => {
    var inputId = statDiv.id.split("#")[1]; 
    for (var i = 0; i < pomodoro.times.length; i++) 
      if (pomodoro.times[i].name == inputId) {
        statDiv.children[1].textContent = `${pomodoro.times[i].minutes} min`;
        break;
      }
  });
}

editStats = (event) => {
  var timerName = event.target.value;
  console.log(event.target.value);
  if (timerName !== baseActivityName && pomodoro.times[0].minutes != 0) {
    pomodoro.times.push({name: timerName, minutes: pomodoro.times[0].minutes});
    pomodoro.times[0].minutes = 0;
    setStats();
    console.log(pomodoro.times);  } 
}

changeTimerValues = () => {
  if (confirm("Você deseja alterar os tempos do pomodoro e do intervalo?")) {
    pauseTimer();
    pomodoro.pomo = prompt("Tempo do pomodoro (em minutos):", pomodoro.pomo);
    pomodoro.break = prompt("Tempo do intervalo (em minutos):", pomodoro.break);
    curMinutes = pomodoro.pomo;
    showTimerValues();
  } 
}

function getDataFromStorage() {
  return JSON.parse(localStorage.getItem("pomodoro")) || {};
}

function saveDataInStorage() {
  localStorage.setItem("pomodoro", JSON.stringify(pomodoro));
}

start();