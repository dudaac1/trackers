var pomodoroInput, intervalInput, minutesSpan, secondsSpan, activitySpan, timerBtn, statsDiv, statsBtn; //html 
var curMinutes, curSeconds, interval, curActivity = null; //script

var timerArray = [{name: "no project", minutes: 0}];

function start() {
  minutesSpan = document.getElementById("minutesTxt");
  secondsSpan = document.getElementById("secondsTxt");
  activitySpan = document.getElementById("activityTxt");
  pomodoroInput = document.getElementById("pomodoroSize");
  intervalInput = document.getElementById("intervalSize");
  timerBtn = document.getElementById("timerBtn");
  statsDiv = document.getElementById("stats");
  statsBtn = document.getElementById("statsBtn")

  storageTimes = getDataFromStorage();
  pomodoroInput.value = storageTimes[0];
  intervalInput.value = storageTimes[1];

  saveValues();
  setActivity();
  setStartBtn();
  setStats();


}

function setActivity() {
  console.log(activitySpan.innerHTML);
  if (curActivity == null || curActivity == "intervalo") {
    curActivity = "pomodoro";
    curMinutes = pomodoroInput.value;
  }
  else {
    curActivity = "intervalo";
    curMinutes = intervalInput.value;
  }
  activitySpan.innerHTML = curActivity;
  curSeconds = 0;
}

function setStartBtn() {
  timerBtn.innerHTML = "INICIAR";
  timerBtn.onclick = startTimer;
}

function setPauseBtn() {
  timerBtn.innerHTML = "PAUSAR";
  timerBtn.onclick = pauseTimer;
}

function setTimerValues() {
  secondsSpan.innerHTML = (curSeconds < 10) ? "0" + curSeconds : curSeconds;
  minutesSpan.innerHTML = (curMinutes < 10) ? "0" + curMinutes : curMinutes;
}


function startTimer() {
  // getDataFromStorage();
  interval = setInterval(timer, 1000);
  setPauseBtn();

  function timer() {
    curSeconds--;
    if (curSeconds < 0) {
      mainCountIncrem();
      curMinutes--;
      curSeconds = 59;
      if (curMinutes < 0) {
        pauseTimer(); // limpa Interval e troca botao
        setActivity(); //troca atividade para "intervalo"
      }
    }
    setTimerValues();
  }

}

function pauseTimer() {
  clearInterval(interval);
  setStartBtn();
}

function saveValues() {
  curMinutes = pomodoroInput.value;
  curSeconds = 0;
  pauseTimer();
  setTimerValues();
  saveDataInStorage();
}

function getDataFromStorage() {
  return JSON.parse(localStorage.getItem("timeValues"));
  // ou valores pré-estabelecidos caso esteja vazio
}

function saveDataInStorage() {
  localStorage.setItem("timeValues", JSON.stringify([pomodoroInput.value, intervalInput.value]));
}

function addNewTime() {
  
}

function mainCountIncrem() {
  timerArray[0].minutes++;
  setStats();
}

function setStats() {
  timerArray.forEach(timer => {
    var timeInHours = Math.round(timer.minutes/60, -2);
    var minutes = document.createTextNode(`${timer.minutes}min (${timeInHours}h): `);
    var nameInput = document.createElement("input");
    // nameInput.setAttribute("onclick", "edit(event)");
    nameInput.setAttribute("onblur", "edit(event)");
    // nameInput.onclick = "edit(event)";
    nameInput.setAttribute("value", timer.name);
    nameInput.classList = "inputTextLine";
    // statsDiv.innerHTML = minutes;
    statsDiv.append(minutes);
    statsDiv.appendChild(nameInput);
  });
}

function edit(event) {
  // console.log(event);
  console.log(event.target);
  console.log(event.target.value);
  var timerName = event.target.value;
  if (timerName !== "no project" && timerArray[0].minutes != 0) {
    timerArray.push({name: timerName, minutes: timerArray[0].minutes});
    timerArray[0] = {name: "no project", minutes: 0};
    console.log(timerArray);
    setStats();
  } 
}

function showStats() {
  statsBtn.setAttribute("onclick", "hideStats()");
  statsBtn.innerHTML = "esconder<br>estatísticas";
  statsDiv.classList = "stats flex";
}
  
function hideStats() {
  statsBtn.setAttribute("onclick", "showStats()");
  statsBtn.innerHTML = "mostrar<br>estatísticas";
  statsDiv.classList = "hidden";
}


start();