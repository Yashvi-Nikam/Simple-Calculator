let display = document.getElementById("display");
let historyDiv = document.getElementById("history");
let currentInput = "";
let xmlDoc = null;

fetch("history.xml")
    .then(response => response.text())
    .then(str => {
        let parser = new DOMParser();
        xmlDoc = parser.parseFromString(str, "application/xml");
        displayXMLHistory();
    });


function appendNumber(num) {
    currentInput += num;
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = "";
    display.value = "";
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
}

function calculate(operator) {
    try {
        if (operator === "=") {
            let result = eval(currentInput);
            addToXMLHistory(currentInput, result);
            display.value = result;
            currentInput = result.toString();
        }
        else if (operator === "√") {
            let result = Math.sqrt(eval(currentInput));
            addToXMLHistory("√(" + currentInput + ")", result);
            display.value = result;
            currentInput = result.toString();
        }
        else if (operator === "%") {
            let result = eval(currentInput) / 100;
            addToXMLHistory(currentInput + "%", result);
            display.value = result;
            currentInput = result.toString();
        }
        else {
            currentInput += operator;
            display.value = currentInput;
        }
    } catch {
        display.value = "Error";
        currentInput = "";
    }
}

function addToXMLHistory(expression, result) {
    if (!xmlDoc) return;

    let root = xmlDoc.getElementsByTagName("calculations")[0];

    let calculation = xmlDoc.createElement("calculation");

    let exp = xmlDoc.createElement("expression");
    exp.textContent = expression;

    let res = xmlDoc.createElement("result");
    res.textContent = result;

    calculation.appendChild(exp);
    calculation.appendChild(res);
    root.appendChild(calculation);

    displayXMLHistory();
}

function displayXMLHistory() {
    historyDiv.innerHTML = "";

    let calculations = xmlDoc.getElementsByTagName("calculation");

    for (let i = calculations.length - 1; i >= 0; i--) {
        let exp = calculations[i].getElementsByTagName("expression")[0].textContent;
        let res = calculations[i].getElementsByTagName("result")[0].textContent;

        let line = document.createElement("div");
        line.textContent = `${exp} = ${res}`;

        historyDiv.appendChild(line);
    }
}

