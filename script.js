const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const ListColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
  updatedOnLoad = true;
}

getSavedColumns();
updateSavedColumns();

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const ArrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  ArrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// Filter arrya to remove empty itemas
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null)
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  // Append
  columnEl.appendChild(listEl)
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad) {
    getSavedColumns();
  }
    // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backLogItem, index) => {
    createItemEl(backlogList, 0, backLogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressLogItem, index) => {
    createItemEl(progressList, 1, progressLogItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update item - Delete if necessary, or update Array value
function updateItem(id, column) {
  let selectedArray = listArrays[column];
  const selectedColumnEl = ListColumns[column].children;
  console.log(selectedArray);
  console.log(listArrays[column]);
  if(!dragging) {
    if(!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
      console.log(selectedArray);
      console.log(listArrays[column]);
      // listArrays[column] = selectedArray.map(i => i.textContent);
      listArrays[column] = listArrays[column].filter(function (el) {
        return el != null;
      });
      console.log(listArrays[column]);
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

// Add to column List, reset text
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

// show add Item Input box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden ';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';

}

// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible ';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Allows Array to reflect Drag and Drops
function rebuildArrays() {
  // backlogListArray = [];
  // for(let i = 0; i < backlogList.children.length; i++) {
  //   backlogListArray.push(backlogList.children[i].textContent);
  // }
  backlogListArray = Array.from(backlogList.children).map(i => i.textContent);
  progressListArray = Array.from(progressList.children).map(i => i.textContent);
  completeListArray = Array.from(completeList.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);
  updateDOM();
}

// When item starts Dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// Column Allows fo item to drop
function allowDrop(e) {
  e.preventDefault();
}

// When the item insters column Area
function dragEnter(column) {
  ListColumns[column].classList.add('over');
  currentColumn = column;
}

// Droppin item in column
function drop(e) {
  e.preventDefault();
  // Remove Background Color/Padding
  ListColumns.forEach((column) => {
    column.classList.remove('over')
  });
  // Add item to column
  const parent = ListColumns[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging Complete
  dragging = false;
  rebuildArrays();
}

// On Load
updateDOM();
