//#region GLOBAL VARIABLES

const OPERATIONS = {
    divide: "divide",
    multiply: "multiply",
    subtract: "subtract",
    sum: "sum",
};

const DISPLAY = document.getElementById("display");
let full_operation = [];

const NUMBER_BUTTONS = document.getElementsByClassName("number-button");
const OPERATION_BUTTONS = document.getElementsByClassName("operator-button");

//#endregion GLOBAL VARIABLES

//#region OP CONTROL

function addItemToOperation(value) {
    if (full_operation.length == 0 && typeof value == "string") return;
    if (typeof full_operation[full_operation.length - 1] == typeof value) {
        full_operation.pop();
        full_operation.push(value);
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
        case OPERATIONS.divide: return b == 0 ? "ZERO DIVISION" : a / b;
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
}

function backspaceDelete() {
    full_operation.pop();
    updateDisplay();
}

function result() {
    if (typeof full_operation[full_operation.length - 1] == "string") return;
    reduceOperation(OPERATIONS.divide);
    reduceOperation(OPERATIONS.multiply);
    reduceOperation(OPERATIONS.subtract);
    reduceOperation(OPERATIONS.sum);

    updateDisplay();
}

//#endregion UI FUNCTIONS

//#region EVENTS

let clear_button = document.getElementById("clear");
let backspace = document.getElementById("backspace");
let equals = document.getElementById("equals");

clear_button.addEventListener("click", () => {
    clear();
});

backspace.addEventListener("click", () => {
    backspaceDelete();
});

equals.addEventListener("click", () => {
    result();
})

for (const number of NUMBER_BUTTONS) {
    let numAttribute = parseInt(number.getAttribute("data-number"));
    number.addEventListener("click", () => {
        addItemToOperation(numAttribute);
        updateDisplay();
    });
}

for (const operator of OPERATION_BUTTONS) {
    let opAttribute = operator.getAttribute("data-operation");
    operator.addEventListener("click", () => {
        addItemToOperation(opAttribute);
        updateDisplay();
    });
}

//#endregion EVENTS