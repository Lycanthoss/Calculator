//#region GLOBAL VARIABLES

const OPERATIONS = {
    divide: "divide",
    multiply: "multiply",
    subtract: "subtract",
    sum: "sum",
};

let clear_button = document.getElementById("clear");
let backspace = document.getElementById("backspace");
let equals = document.getElementById("equals");
let decimal = document.getElementById("decimal");
let random_num = document.getElementById("random");

const DISPLAY = document.getElementById("display");
let full_operation = [];
let accepting_decimals = false;

const NUMBER_BUTTONS = document.getElementsByClassName("number-button");
const OPERATION_BUTTONS = document.getElementsByClassName("operator-button");

//#endregion GLOBAL VARIABLES

//#region OP CONTROL

function addItemToOperation(value) {
    if (full_operation.length == 0 && typeof value == "string" || typeof full_operation[0] == "string") return;
    if (typeof full_operation[full_operation.length - 1] == typeof value) {
        full_operation.pop();
        full_operation.push(value);
    }
    else {
        full_operation.push(value);
    }
}

function addOperator(op) {
    if (full_operation.length == 0 || typeof full_operation[0] == "string") return;
    if (typeof full_operation[full_operation.length - 1] == "string") {
        full_operation.pop();
        full_operation.push(op);
    }
    else {
        full_operation.push(op);
    }
}

function addNumberToOperation(value) {
    if (typeof full_operation[0] == "string") return;
    if (typeof full_operation[full_operation.length - 1] != "string" && full_operation.length != 0) {
        let newNum = full_operation[full_operation.length - 1] + `${value}`;
        full_operation[full_operation.length - 1] = parseFloat(newNum);
    }
    else {
        full_operation.push(value);
    }
}

function reduceOperation(operation) {
    let lookingFlag = true;

    while (lookingFlag) {
        let i = full_operation.findIndex((x) => { return x == OPERATIONS[operation]; });
        if (i == -1) lookingFlag = false;
        else {
            let leftHalf = full_operation.slice(0, i - 1);

            leftHalf.push(operate(OPERATIONS[operation], full_operation[i - 1], full_operation[i + 1]));

            let rightHalf = full_operation.slice(i + 2, full_operation.length);

            full_operation = leftHalf.concat(rightHalf);
        }
    }
}

//#endregion OP CONTROL

//#region MATH FUNCTIONS

function operate(op, a, b) {
    switch(op) {
        case OPERATIONS.divide: return b == 0 ? "That's not allowed here" : a / b;
        case OPERATIONS.multiply: return a * b;
        case OPERATIONS.subtract: return a - b;
        case OPERATIONS.sum: return a + b;
    }
}

//#endregion MATH FUNCTIONS

//#region UI FUNCTIONS

function updateDisplay() {
    let current_content = "";

    for (const item of full_operation) {
        if (item == OPERATIONS.divide) {
            current_content += " / ";
        }
        else if (item == OPERATIONS.multiply) {
            current_content += " * ";
        }
        else if (item == OPERATIONS.subtract) {
            current_content += " - ";
        }
        else if (item == OPERATIONS.sum) {
            current_content += " + ";
        }
        else current_content += item;
    }

    DISPLAY.textContent = current_content;
}

function clear() {
    full_operation = [];
    updateDisplay();
    accepting_decimals = false;
}

function backspaceDelete() {
    full_operation.pop();
    updateDisplay();
    accepting_decimals = false;
}

function result() {
    let tryParse = parseFloat(full_operation[full_operation.length - 1]);
    if (typeof tryParse != "number") return;
    else full_operation[full_operation.length - 1] = tryParse;
    accepting_decimals = false;
    reduceOperation(OPERATIONS.divide);
    reduceOperation(OPERATIONS.multiply);
    reduceOperation(OPERATIONS.subtract);
    reduceOperation(OPERATIONS.sum);

    full_operation[0] = parseFloat(full_operation[0].toFixed(2));

    updateDisplay();
}

function startDecimal() {
    if (full_operation.length != 0 && !accepting_decimals && typeof full_operation[full_operation.length - 1] != "string") {
        accepting_decimals = true;
        full_operation[full_operation.length - 1] += ".";
        updateDisplay();
    }
}

function random() {
    let randomNum = Math.random() * 6;
    if (full_operation.length == 0)
        addItemToOperation(randomNum);
    updateDisplay();
}

//#endregion UI FUNCTIONS

//#region EVENTS

clear_button.addEventListener("click", () => {
    clear();
});

backspace.addEventListener("click", () => {
    backspaceDelete();
});

equals.addEventListener("click", () => {
    result();
});

decimal.addEventListener("click", () => {
    startDecimal();
});

random_num.addEventListener("click", () => {
    random();
});

for (const number of NUMBER_BUTTONS) {
    let numAttribute = parseInt(number.getAttribute("data-number"));
    number.addEventListener("click", () => {
        if(accepting_decimals) {
            full_operation[full_operation.length - 1] += numAttribute;
            updateDisplay();
        }
        else {
            addNumberToOperation(numAttribute);
            updateDisplay();
        }
    });
}

for (const operator of OPERATION_BUTTONS) {
    let opAttribute = operator.getAttribute("data-operation");
    operator.addEventListener("click", () => {
        if (accepting_decimals) {
            let numString = full_operation[full_operation.length - 1];
            if (numString[numString.length - 1] == ".") return;
            else {
                accepting_decimals = false;
                full_operation[full_operation.length - 1] = parseFloat(numString);
                addOperator(opAttribute);
                updateDisplay();
            }
        }
        else {
            addOperator(opAttribute);
            updateDisplay();
        }
    });
}

//#endregion EVENTS