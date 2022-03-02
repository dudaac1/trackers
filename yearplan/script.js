var yearTitle = document.getElementById("yearTitle");
var yearInput = document.getElementById("year");
var yearInMonthsDiv = document.getElementById("yearInMonths");
var showMonthsBtn = document.getElementById("showMonths");

var monthArray = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

function start() {
  saveYear();

  for (var i = 0; i < monthArray.length; i++) {
    var monthArticle = document.createElement("article");
    monthArticle.setAttribute("name", "monthArticle");
    monthArticle.innerHTML = "<h3>" + monthArray[i] + "</h3>";
    monthArticle.innerHTML += `<textarea class="monthBox normal"></textarea>`;

    var monthView = document.createElement("section");
    monthView.classList = "monthSection";
    monthView.setAttribute("name", "monthView");
    monthView.innerHTML = "";
  
    for (var j = 1; j <= daysInMonth(i); j++) {
      var number = (j < 10) ? "0" + j : + j;
      monthView.innerHTML +=  number + "<input class=\"inputTextLine\"/>";
    }
    monthArticle.appendChild(monthView);
    yearInMonthsDiv.appendChild(monthArticle);
  }

  function daysInMonth(month) {
    return new Date(yearInput.value, (month+1), 0).getDate();
  }

}

function saveYear() {
  console.log(yearInput.value);
  yearTitle.innerHTML = yearInput.value;
}

function showMonths() {
  showMonthsBtn.setAttribute("onclick", "hideMonths()");
  showMonthsBtn.innerHTML = "esconder dias";
  
  var monthArticles = document.getElementsByName("monthArticle");
  monthArticles.forEach(article => {
    article.style.width = "200px";
    article.children[1].classList = "monthBox normal";
    article.children[2].classList = "monthSection";
  });
}

function hideMonths() {
  showMonthsBtn.setAttribute("onclick", "showMonths()");
  showMonthsBtn.innerHTML = "mostrar dias";
  
  var monthArticles = document.getElementsByName("monthArticle");
  monthArticles.forEach(article => {
    article.style.width = "300px";
    article.children[1].classList = "monthBox bigger";
    article.children[2].classList = "hidden";
  });
}

start();