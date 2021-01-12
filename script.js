// Communication with the server is not implemented.

const initState = [
    {name: 'James',   phone: '+202-555-0188'},
    {name: 'John',    phone: '+202-555-0132'},
    {name: 'Robert',  phone: '+102-555-0100'},
    {name: 'Michael', phone: '+102-555-0114'},
    {name: 'William', phone: '+102-555-0170'},
    {name: 'David',   phone: '+102-555-0153'},
    {name: 'Richard', phone: '202-555-0153'}
];

const EDIT_MODE   = "EDIT_MODE";
const REMOVE_MODE = "REMOVE";

const SAVE = "SAVE";
const EDIT = "EDIT";

let size_x = Object.keys(initState[0]).length;
let size_y = initState.length;

let table;
let active_cell = null;

let get_container, error_container, inputName, inputPhone;

window.onload = function () {
    init();
    generateDefaultTable();
}

function init() {
    get_container   = document.body.querySelector(".tab-container");
    error_container = document.body.querySelector(".error-container");

    inputName  = document.getElementById("inputName");
    inputPhone = document.getElementById("inputPhone");
}

function generateDefaultTable() {
    size_x = Object.keys(initState[0]).length;
    table  = document.createElement("table");
    get_container.appendChild(table);

    for (let y = 0; y < size_y; y++) {
        let dataTR = Object.keys(initState[y]);
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for (let x = 0; x < size_x; x++) {
            let dataTD = initState[y][dataTR[x]];
            tr.appendChild(createCell(dataTD));
        }
        tr.appendChild(createCell("\u00D7", REMOVE_MODE));
        tr.appendChild(createCell("Edit", EDIT_MODE));
    }
}

function addNote() {
    let row;
    let name  = inputName.value;
    let phone = inputPhone.value;
    let isValidData = isValidate(name, phone);

    if (isValidData) {
        row = createRow([name, phone]);
        table.appendChild(row);
        inputName.value  = "";
        inputPhone.value = "";
    }
}

function isValidate(name, phone) {
    const reg = /^[+]?\d{3,}-*\d{3,}-*\d{4,}$/g;

    if (!name.trim() || !phone.match(reg)) {
        error_container.style.display = "block";
        return false;
    } else {
        error_container.style.display = "none";
        return true;
    }
}

function createCell(data, mode) {
    // isEditMode : if edit - true, if saving change - false
    let isEditMode = false, tdButton, tdInput;
    const td = document.createElement("td");

     function handleEvent(mode) {
        if (mode === REMOVE_MODE) {
            removeRow();
        }
        else { //EDIT_MODE
            if (isEditMode) { //if now the edit mode and  we try save
                isSuccessSave() ? isEditMode = false : isEditMode = true;
            } else {
                edit(); // set edit mode
                isEditMode = true;
            }
        }
    }

    if (mode) { // add button
        tdButton = document.createElement("button");
        tdButton.textContent = data;
        tdButton.className   = "btn mode";
        if(mode === EDIT_MODE) {
            td.style.width = "90px";
        }
        tdButton.onclick = function () {
            active_cell  = this;
            handleEvent(mode);
        }
        td.appendChild(tdButton);
    } else { // add text
        tdInput = document.createElement("input");
        tdInput.type  = "text";
        tdInput.value = data;
        tdInput.className = "disabled";
        td.appendChild(tdInput);
    }
    return td;
}


function createRow(dataTD) {
    const newRow = document.createElement("tr");

    for (let i = 0; i < dataTD.length; i++) {
        newRow.appendChild(createCell(dataTD[i]));
    }
    newRow.appendChild(createCell("\u00D7", REMOVE_MODE)); // button "Remove"
    newRow.appendChild(createCell("Edit", EDIT_MODE)); // button "Edit"
    return newRow;
}

function activeCellRowIndex() {
    const searchLocation = table.childNodes;
    let   elementToFind;

    if (active_cell) {
        elementToFind = active_cell.parentElement.parentElement;
        active_cell = null;
        return Array.prototype.indexOf.call(searchLocation, elementToFind);
    }
}

function removeRow() {
    const selectedIndex = activeCellRowIndex();
    table.removeChild(table.childNodes[selectedIndex]);
}

function changeMode(selectedIndex, type) {
    const currentClass = type === EDIT ? "disabled" : "editMode";
    const newClass     = type === EDIT ? "editMode" : "disabled";
    const currentText  = type === EDIT ? "Edit"     : "Save";
    const newText      = type === EDIT ? "Save"     : "Edit";
    const td = table.children[selectedIndex].cells;

    for (let i = 0; i < table.children[selectedIndex].cells.length; i++) {
        if (td[i].children[0].className === currentClass) {
            td[i].children[0].className = newClass;
        }
        if (td[i].children[0].type === "submit" && td[i].children[0].textContent === currentText) {
            td[i].children[0].textContent = newText;
        }
    }

}

function isSuccessSave() {
    const selectedIndex = activeCellRowIndex();
    const td = table.children[selectedIndex].cells;
    let newData = [], isValidData;

    for (let i = 0; i < table.children[selectedIndex].cells.length; i++) {
        if (td[i].children[0].type === "text") {
            newData.push(td[i].children[0].value);
        }
    }
    isValidData = isValidate(...newData);
    if(isValidData) {
        changeMode(selectedIndex, SAVE);
        return true;
    }
    return false;
}

function edit() {
    const selectedIndex = activeCellRowIndex();
    changeMode(selectedIndex, EDIT);
}

