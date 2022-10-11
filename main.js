var monthTitle = document.getElementById('monthTitle');
var monthTable = document.getElementById('monthTable');
var monthSelect = document.getElementById('monthSelect');

var monthsArray = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

var weekArray = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

var currentYear = new Date().getFullYear();
var currentMonth = new Date().getMonth();
var currentWeekDay = new Date().getDay(); //0:dom - 1:seg - 2:ter - 3: qua... etc
var currentDay = new Date().getDate();

var selectedMonth;

var monthsGuide = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
var Compromissos = [];
for (var i = 0; i < 12; i++) {
    var month = monthsGuide[i];
    Compromissos[month] = new Object();
}

document.title = 'Agenda ' + currentYear;

//atribuindo dias do mês ao select de adicionar compromisso
var compromissoSelect = document.getElementById('compromissoDia');
function attCompromissoSelectNumbers(daysInMonth) {
    compromissoSelect.innerHTML = '';
    for (var i=0; i<=daysInMonth; i++) {
        var selectOption = document.createElement('option');
        var selectOptionTxt = '';
        if(i===0) {
            selectOptionTxt = document.createTextNode('');
        } else {
            selectOptionTxt = document.createTextNode(i);
            selectOption.setAttribute('value', i);
        }
        selectOption.appendChild(selectOptionTxt);
        compromissoSelect.appendChild(selectOption);
    }   
}

//preencher select dos meses para novo mês
for (var i = 0; i < 12; i++) {
    var selectOption = document.createElement('option');
    var selectOptionTxt = document.createTextNode(monthsArray[i]);
    selectOption.appendChild(selectOptionTxt);
    selectOption.setAttribute('value', i);
    monthSelect.appendChild(selectOption);
}

var totalDaysInMonth;
var firstDayOfMonth;
//descobrir numero de semanas do mês
Date.prototype.getWeekOfMonth = function () {
    firstDayOfMonth = new Date(this.setDate(1)).getDay(); //dia da semana que começa o mês
    totalDaysInMonth = new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();//numero de dias do mês
    return Math.ceil((firstDayOfMonth + totalDaysInMonth) / 7);
}

//criar titulo do mês
function createTitle() {
    var titleTxt = document.createTextNode(monthsArray[selectedMonth] + ' · ' + currentYear);
    monthTitle.appendChild(titleTxt);
}

//criar tabela do mês
//USAR PARÂMETROS
function createTable(month) {
    monthTitle.innerHTML = '';
    monthTable.innerHTML = '';
    selectedMonth = month;
    createTitle();
    var linha = document.createElement('tr');
    for (var i = 0; i < 7; i++) {
        var celula = document.createElement('th');
        var celulaTxt = document.createTextNode(weekArray[i]);
        celula.appendChild(celulaTxt);
        linha.appendChild(celula);
    }
    monthTable.appendChild(linha);

    var totalMonthWeeks = new Date(currentYear, month).getWeekOfMonth();

    attCompromissoSelectNumbers(totalDaysInMonth);

    //criando as células.
    var dayOfMonth = 1;
    for (var i = 0; i < totalMonthWeeks; i++) {
        var weekLine = document.createElement('tr');
        if (i == 0) {
            for (var j = 0; j < 7; j++) {
                if (firstDayOfMonth == 0) {
                    weekLine.appendChild(createCell(dayOfMonth));
                    dayOfMonth++;
                } else if (j < firstDayOfMonth) {
                    weekLine.appendChild(createCell())
                } else {
                    weekLine.appendChild(createCell(dayOfMonth));
                    dayOfMonth++;
                }
            }
        } else {
            for (var j = 0; j < 7; j++) {
                if (dayOfMonth <= totalDaysInMonth) {
                    weekLine.appendChild(createCell(dayOfMonth));
                    dayOfMonth++;
                } else {
                    weekLine.appendChild(createCell());
                }
            }
        }
        monthTable.appendChild(weekLine);
    }
    loadContent();
}

//criar célula; usado em >>createTable<<
createCell = function (day) {
    var cellDay = document.createElement('td');
    if (day !== undefined) {
        var cellTxt = document.createTextNode(day);
        cellDay.setAttribute('id', 'dia' + day);
        if (day === currentDay && selectedMonth === currentMonth) {
            cellDay.className = 'currentDay';
            cellDay.setAttribute('title', 'Dia Atual');
        }
    } else {
        var cellTxt = document.createTextNode('');
    }
    cellDay.appendChild(cellTxt);
    return cellDay;
}

createTable(currentMonth);

//para adicionar compromisso ao calendário
function addCompromisso() {
    var dia = '', compromisso = '';
    dia = compromissoSelect.value;
    compromisso = document.getElementById('compromissoTxt').value;
    if (dia !== '' && compromisso !== '') {
        //posição do compromisso no array = dia + 00 + X + counter
        var arrayCounter = 0;
        var posicao = 'dia' + dia + 'X' + arrayCounter;
        var month = monthsGuide[selectedMonth];
        while (Compromissos[month][posicao] !== undefined) {
            if (arrayCounter < 4) {
                arrayCounter++;
                posicao = 'dia' + dia + 'X' + arrayCounter;
            } else {
                alert('Limite de compromissos por dia excedido.', arrayCounter);
                return false;
            }
        }
        //adicionar compromisso ao array de compromissos
        Compromissos[month][posicao] = compromisso;
        createCompromisso(dia, posicao, compromisso);
        saveToStorage(posicao, compromisso);
    } else {
        alert('Preencha os campos corretamente.');
    }
}

//carregar conteúdo armazenado
function loadContent() {
    var monthContent = JSON.parse(localStorage.getItem(monthsGuide[selectedMonth]));
    if (monthContent !== null) {
        for (item of monthContent) {
            var posicao = '', texto = '', dia = '';
            for (var i = 0; i < item.indexOf(":"); i++) {
                while (i < item.indexOf("X")) {
                    dia += item[i];
                    break;
                }
                posicao += item[i];
            }
            for (var i = item.indexOf(":") + 1; i < item.length; i++) {
                texto += item[i];
            }
            dia = dia.slice(3);
            Compromissos[monthsGuide[selectedMonth]][posicao] = texto;
            createCompromisso(dia, posicao, texto);
        }
    } 
}

function createCompromisso(dia, posicao, compromisso) {
    var compromissoP = document.createElement('p');
    var compromissoTxt = document.createTextNode(compromisso);
    compromissoP.appendChild(compromissoTxt);
    compromissoP.setAttribute('title', 'Remover compromisso.');
    compromissoP.className = 'compromisso';

    //adicionando evento para remover elemento
    compromissoP.setAttribute('onclick', 'removeCompromisso("' + posicao + '")');

    var cellDay = document.getElementById('dia'+dia);
    cellDay.appendChild(compromissoP);
    compromissoSelect.value = '';
    document.getElementById('compromissoTxt').value = '';
}

//remover compromisso
function removeCompromisso(posicao) {
    var monthContent = JSON.parse(localStorage.getItem(monthsGuide[selectedMonth]));
    for (index in monthContent) {
        if (monthContent[index] === posicao + ':' + Compromissos[monthsGuide[selectedMonth]][posicao]) {
            monthContent.splice(index, 1)
        }
    }
    delete Compromissos[monthsGuide[selectedMonth]][posicao];
    localStorage.setItem(monthsGuide[selectedMonth], JSON.stringify(monthContent));

    createTable(selectedMonth);
}

//função para mostrar outro mês
function showMonth() {
    var selectedMonth = '';
    selectedMonth = document.getElementById("monthSelect").value;

    if (selectedMonth !== '') {
        createTable(selectedMonth);
    } else {
        alert("Selecione o mês antes de tentar carregá-lo.")
    }
}

function saveToStorage(posicao, compromisso) {
    var monthContent = JSON.parse(localStorage.getItem(monthsGuide[selectedMonth])) || [];
    monthContent.push(posicao + ':' + compromisso)
    localStorage.setItem(monthsGuide[selectedMonth], JSON.stringify(monthContent));
}