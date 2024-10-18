window.addEventListener("load", function () {
	const loader = document.querySelector(".loader");
	loader.className += " hidden";
});

//Navigation
{
	const collapsedClass = "nav--collapsed";
	const lsKey = "navCollapsed";

	const nav = document.querySelector(".nav");
	const navBorder = document.querySelector(".nav__border");

	navBorder.addEventListener("click", () => {
		nav.classList.toggle(collapsedClass);
	});
}

class DigitalClock {
	constructor(element) {
		this.element = element;
	}

	start() {
		this.update();

		setInterval(() => {
			this.update();
		}, 500);
	}

	update() {
		const parts = this.getTimeParts();
		const minuteFormatted = parts.minute.toString().padStart(2, "0");
		const timeFormatted = `${parts.hour}:${minuteFormatted}`;
		const ampm = parts.isAm ? "AM" : "PM";

		this.element.querySelector(".clock-time").textContent = timeFormatted;
		this.element.querySelector(".clock-ampm").textContent = ampm;
	}

	getTimeParts() {
		const now = new Date();

		return {
			hour: now.getHours() % 12 || 12,
			minute: now.getMinutes(),
			isAm: now.getHours() < 12
		};
	}
}

const clockElement = document.querySelector(".clock");

const clockObject = new DigitalClock(clockElement);

clockObject.start();

//Sticky Notes
const notesContainer = document.getElementById("app");
const addNoteButton = notesContainer.querySelector(".add-note");

getNotes().forEach((note) => {
	const noteElement = createNoteElement(note.id, note.content);
	notesContainer.insertBefore(noteElement, addNoteButton);
});

addNoteButton.addEventListener("click", () => addNote());

function getNotes() {
	return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
}

function saveNotes(notes) {
	localStorage.setItem("stickynotes-notes", JSON.stringify(notes));
}

function createNoteElement(id, content) {
	const element = document.createElement("textarea");

	element.classList.add("note");
	element.value = content;
	element.placeholder = "Empty Sticky Note";

	element.addEventListener("change", () => {
		updateNote(id, element.value);
	});

	element.addEventListener("dblclick", () => {
		const doDelete = confirm("Are you sure you wish to delete this sticky note?");

		if (doDelete) {
			deleteNote(id, element);
		}
	});

	return element;
}

function addNote() {
	const notes = getNotes();
	const noteObject = {
		id: Math.floor(Math.random() * 100000),
		content: ""
	};

	const noteElement = createNoteElement(noteObject.id, noteObject.content);
	notesContainer.insertBefore(noteElement, addNoteButton);

	notes.push(noteObject);
	saveNotes(notes);
}
function updateNote(id, newContent) {
	const notes = getNotes();
	const targetNote = notes.filter((note) => note.id == id)[0];

	targetNote.content = newContent;
	saveNotes(notes);
}

function deleteNote(id, element) {
	const notes = getNotes().filter((note) => note.id != id);

	saveNotes(notes);
	notesContainer.removeChild(element);
}

//Virtual Keyboard
const Keyboard = {
	elements: {
		main: null,
		keysContainer: null,
		keys: []
	},

	eventHandlers: {
		oninput: null,
		onclose: null
	},

	properties: {
		value: "",
		capsLock: false
	},

	init() {
		// Create main elements
		this.elements.main = document.createElement("div");
		this.elements.keysContainer = document.createElement("div");

		// Setup main elements
		this.elements.main.classList.add("keyboard", "keyboard--hidden");
		this.elements.keysContainer.classList.add("keyboard__keys");
		this.elements.keysContainer.appendChild(this._createKeys());

		this.elements.keys = this.elements.keysContainer.querySelectorAll(
			".keyboard__key"
		);

		// Add to DOM
		this.elements.main.appendChild(this.elements.keysContainer);
		document.body.appendChild(this.elements.main);

		// Automatically use keyboard for elements with .use-keyboard-input

		document.querySelectorAll(".note").forEach((element) => {
			element.addEventListener("focus", () => {
				this.open(element.value, (currentValue) => {
					element.value = currentValue;
				});
			});
		});
	},

	_createKeys() {
		const fragment = document.createDocumentFragment();
		const keyLayout = [
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"0",
			"backspace",
			"q",
			"w",
			"e",
			"r",
			"t",
			"y",
			"u",
			"i",
			"o",
			"p",
			"caps",
			"a",
			"s",
			"d",
			"f",
			"g",
			"h",
			"j",
			"k",
			"l",
			"enter",
			"done",
			"z",
			"x",
			"c",
			"v",
			"b",
			"n",
			"m",
			",",
			".",
			"?",
			"space"
		];

		// Creates HTML for an icon
		const createIconHTML = (icon_name) => {
			return `<i class="material-icons">${icon_name}</i>`;
		};

		keyLayout.forEach((key) => {
			const keyElement = document.createElement("button");
			const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

			// Add attributes/classes
			keyElement.setAttribute("type", "button");
			keyElement.classList.add("keyboard__key");

			switch (key) {
				case "backspace":
					keyElement.classList.add("keyboard__key--wide");
					keyElement.innerHTML = createIconHTML("backspace");

					keyElement.addEventListener("click", () => {
						this.properties.value = this.properties.value.substring(
							0,
							this.properties.value.length - 1
						);
						this._triggerEvent("oninput");
					});

					break;

				case "caps":
					keyElement.classList.add(
						"keyboard__key--wide",
						"keyboard__key--activatable"
					);
					keyElement.innerHTML = createIconHTML("keyboard_capslock");

					keyElement.addEventListener("click", () => {
						this._toggleCapsLock();
						keyElement.classList.toggle(
							"keyboard__key--active",
							this.properties.capsLock
						);
					});

					break;

				case "enter":
					keyElement.classList.add("keyboard__key--wide");
					keyElement.innerHTML = createIconHTML("keyboard_return");

					keyElement.addEventListener("click", () => {
						this.properties.value += "\n";
						this._triggerEvent("oninput");
					});

					break;

				case "space":
					keyElement.classList.add("keyboard__key--extra-wide");
					keyElement.innerHTML = createIconHTML("space_bar");

					keyElement.addEventListener("click", () => {
						this.properties.value += " ";
						this._triggerEvent("oninput");
					});

					break;

				case "done":
					keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
					keyElement.innerHTML = createIconHTML("check_circle");

					keyElement.addEventListener("click", () => {
						this.close();
						this._triggerEvent("onclose");
					});

					break;

				default:
					keyElement.textContent = key.toLowerCase();

					keyElement.addEventListener("click", () => {
						this.properties.value += this.properties.capsLock
							? key.toUpperCase()
							: key.toLowerCase();
						this._triggerEvent("oninput");
					});

					break;
			}

			fragment.appendChild(keyElement);

			if (insertLineBreak) {
				fragment.appendChild(document.createElement("br"));
			}
		});

		return fragment;
	},

	_triggerEvent(handlerName) {
		if (typeof this.eventHandlers[handlerName] == "function") {
			this.eventHandlers[handlerName](this.properties.value);
		}
	},

	_toggleCapsLock() {
		this.properties.capsLock = !this.properties.capsLock;

		for (const key of this.elements.keys) {
			if (key.childElementCount === 0) {
				key.textContent = this.properties.capsLock
					? key.textContent.toUpperCase()
					: key.textContent.toLowerCase();
			}
		}
	},

	open(initialValue, oninput, onclose) {
		this.properties.value = initialValue || "";
		this.eventHandlers.oninput = oninput;
		this.eventHandlers.onclose = onclose;
		this.elements.main.classList.remove("keyboard--hidden");
	},

	close() {
		this.properties.value = "";
		this.eventHandlers.oninput = oninput;
		this.eventHandlers.onclose = onclose;
		this.elements.main.classList.add("keyboard--hidden");
	}
};

window.addEventListener("DOMContentLoaded", function () {
	Keyboard.init();
});

//KanbanBoard
var cards = document.querySelectorAll(".card");
var dropzones = document.querySelectorAll(".dropzone");
var btnsAddCard = document.querySelectorAll(".btn-add-card");

const tasks = [
	{ id: 1, status: "progress", text: "Task1" },
	{ id: 2, status: "todo", text: "Task2" },
	{ id: 3, status: "done", text: "Task3" },
	{ id: 4, status: "done", text: "Task4" },
	{ id: 5, status: "todo", text: "Task5" }
];

window.onload = () => {
	initKanban();
	loadTasks(tasks);
};

btnsAddCard.forEach((btn) => {
	btn.addEventListener("click", addNewCard);
});

function loadTasks(tasks) {
	if (tasks.length > 0) {
		const todoDropzone = document.querySelector(".dropzone.todo");
		const todoTasks = tasks.filter((task) => task.status == "todo");
		todoTasks.forEach((task) => {
			todoDropzone.appendChild(htmlCard(task));
		});

		const progressDropzone = document.querySelector(".dropzone.in-progress");
		const progressTasks = tasks.filter((task) => task.status == "progress");
		progressTasks.forEach((task) => {
			progressDropzone.appendChild(htmlCard(task));
		});

		const doneDropzone = document.querySelector(".dropzone.done");
		const doneTasks = tasks.filter((task) => task.status == "done");
		doneTasks.forEach((task) => {
			doneDropzone.appendChild(htmlCard(task));
		});

		const btnCloseCard = document.querySelectorAll(".close");
		btnCloseCard.forEach((btn) => {
			btn.addEventListener("click", deleteCard);
		});
	}
}

function htmlCard(task) {
	const card = document.createElement("div");
	card.classList.add("card");
	card.setAttribute("draggable", "true");
	card.setAttribute("id", task.id);
	let html = `
            <div class="status"></div>
            <span class="close">x</span>
            <div class="content">
                <textarea class = "item" placeholder="Type your task here...">${task.text}</textarea>
            </div>
    `;
	card.innerHTML = html;

	card.addEventListener("dragstart", dragstart);
	card.addEventListener("drag", drag);
	card.addEventListener("dragend", dragend);
	return card;
}

function addNewCard(e) {
	const dropzone = e.target.nextElementSibling;

	const card = document.createElement("div");
	const statusCard = document.createElement("div");
	const contentCard = document.createElement("div");
	const btnCloseCard = document.createElement("span");
	const textAreaCard = document.createElement("textarea");

	btnCloseCard.classList.add("close");
	btnCloseCard.innerText = "x";
	btnCloseCard.addEventListener("click", deleteCard);

	card.classList.add("card");
	card.setAttribute("draggable", "true");
	statusCard.classList.add("status");
	contentCard.classList.add("content");
	textAreaCard.setAttribute("placeholder", "Type your task here...");
	textAreaCard.classList.add("item");

	contentCard.appendChild(textAreaCard);
	card.appendChild(statusCard);
	card.appendChild(btnCloseCard);
	card.appendChild(contentCard);

	card.addEventListener("dragstart", dragstart);
	card.addEventListener("drag", drag);
	card.addEventListener("dragend", dragend);
	dropzone.append(card);
	textAreaCard.focus();
}

function initKanban() {
	cards.forEach(function (card) {
		card.addEventListener("dragstart", dragstart);
		card.addEventListener("drag", drag);
		card.addEventListener("dragend", dragend);
	});

	dropzones.forEach(function (dropzone) {
		dropzone.addEventListener("dragenter", dragenter);
		dropzone.addEventListener("dragover", dragover);
		dropzone.addEventListener("dragleave", dragleave);
		dropzone.addEventListener("drop", drop);
	});

	console.log("Init Kanban");
}

function dragstart(e) {
	// console.log('start');
	dropzones.forEach((dropzone) => dropzone.classList.add("highlight"));
	this.classList.add("is-dragging");
}

function drag(e) {
	// console.log('drag');
}

function dragend(e) {
	// console.log('dragend');
	dropzones.forEach((dropzone) => dropzone.classList.remove("highlight"));
	this.classList.remove("is-dragging");
}

function dragenter(e) {
	// console.log('dragenter');
}

function dragover(e) {
	// console.log('dragover');
	e.preventDefault();
	this.classList.add("over");
	const cardBeingDragged = document.querySelector(".is-dragging");
	const afterElement = getDragAfterElement(this, e.clientY);
	if (afterElement == null) {
		this.appendChild(cardBeingDragged);
	} else {
		this.insertBefore(cardBeingDragged, afterElement);
	}
}

function dragleave(e) {
	this.classList.remove("over");
}

function drop(e) {
	this.classList.remove("over");
}

function getDragAfterElement(dropzone, y) {
	const draggableElements = [
		...dropzone.querySelectorAll(".card:not(.is-dragging)")
	];

	return draggableElements.reduce(
		(closet, child) => {
			const box = child.getBoundingClientRect();
			const offset = y - box.top - box.height / 2;
			if (offset < 0 && offset > closet.offset) {
				return { offset: offset, element: child };
			} else {
				return closet;
			}
		},
		{ offset: Number.NEGATIVE_INFINITY }
	).element;
}

function deleteCard(e) {
	e.target.parentNode.remove();
}

//Scroll to Top Button
const scrollToTopButton = document.querySelector(".scrollToTopButton");
scrollToTopButton.addEventListener("click", function () {
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: "smooth"
	});
});

//Word Counter
function atLeastTwoCharacters(text) {
	const letters = text.match(/[a-z]/gi) || [];

	return letters.length >= 2;
}

function abscenceOfThreeConsecutiveCharacters(text) {
	for (const character of text) {
		const occurrences = Array.from(text).filter((v) => v == character).length;

		if (occurrences >= 3) {
			return false;
		}
	}

	return true;
}

const checks = [atLeastTwoCharacters, abscenceOfThreeConsecutiveCharacters];
const textInput = document.querySelector(".text-input");
const wordCountElement = document.querySelector(".word-count");
const letterCountElement = document.querySelector(".letter-count");
const spaceCountElement = document.querySelector(".space-count");

textInput.addEventListener("input", () => {
	const splitted = textInput.value.trim().split(/[\s-]/);
	const letterCount = (textInput.value.match(/[a-z]/gi) || []).length;
	const spaceCount = (textInput.value.match(/\s+/g) || []).length;
	let wordCount = 0;

	outer: for (const text of splitted) {
		for (const check of checks) {
			if (!check(text)) {
				continue outer;
			}
		}

		wordCount++;
	}

	wordCountElement.textContent = wordCount;
	letterCountElement.textContent = letterCount;
	spaceCountElement.textContent = spaceCount;
});

//Settings
function setupTabs() {
	document.querySelectorAll(".tabs__button").forEach((button) => {
		button.addEventListener("click", () => {
			const sidebar = button.parentElement;
			const tabsContainer = sidebar.parentElement;
			const tabNumber = button.dataset.forTab;
			const tabToActivate = tabsContainer.querySelector(
				`.tabs__content[data-tab="${tabNumber}"]`
			);

			sidebar.querySelectorAll(".tabs__button").forEach((button) => {
				button.classList.remove("tabs__button--active");
			});

			tabsContainer.querySelectorAll(".tabs__content").forEach((tab) => {
				tab.classList.remove("tabs__content--active");
			});

			button.classList.add("tabs__button--active");
			tabToActivate.classList.add("tabs__content--active");
		});
	});
}

document.addEventListener("DOMContentLoaded", () => {
	setupTabs();
});

//Switch Theme
const toggleSwitch = document.querySelector(".toggle__input");
const body = document.querySelector(".body");

toggleSwitch.addEventListener("click", () => {
	if (toggleSwitch.checked == true) {
		body.classList.remove("themeLight");
		body.classList.add("themeDark");
		document.querySelector(".InfoOne").style.color = "white";
		document.querySelector(".InfoTwo").style.color = "white";
	} else {
		body.classList.remove("themeDark");
		body.classList.add("themeLight");
		document.querySelector(".InfoOne").style.color = "black";
		document.querySelector(".InfoTwo").style.color = "black";
	}
});

//Budget Tracker
var balance = 0;
var data = document.getElementById("dataList");
var expenses = [];
var header =
	"<tr>" +
	"<td style='width: 70px; color: purple;'>" +
	"<b>" +
	"Date" +
	"</b>" +
	"</td>" +
	"<td style='width: 100px; color: purple;'>" +
	"<b>" +
	"Category" +
	"</b>" +
	"</td>" +
	"<td style='color: purple;'>" +
	"<b>" +
	"Amount" +
	"</b>" +
	"</td>" +
	"<td>" +
	"</td>" +
	"<td style='color: purple;'>" +
	"<b>" +
	"Edit" +
	"</b>" +
	"</td>" +
	"<td style='color: purple;'>" +
	"<b>" +
	"Delete" +
	"</b>" +
	"</td>" +
	"</tr>";

function Expense(expense, category, dateExp) {
	this.expense = expense;
	this.category = category;
	this.dateExp = dateExp;
}

function addIncome() {
	if (document.getElementById("income").value == "") {
		alert("Enter Your Amount");
	} else {
		balance += parseInt(document.getElementById("income").value);
		document.getElementById("income").value = "";
		showIncome();
	}
}

function showIncome() {
	document.getElementById("currentIncome").innerText = balance;
}

function addExpense() {
	var expense = document.getElementById("expense");
	var category = document.getElementById("category");
	var dateExp = document.getElementById("dateExpense");
	var dateFilter = document.getElementById("dateFilter");

	if (expense.value == "") {
		alert("Enter your expense amount");
	} else if (dateExp.value == "") {
		alert("Please choose your expense date");
	} else if (category.value == "categories") {
		alert("Choose your expense category");
	} else {
		var newExpense = new Expense(
			parseInt(expense.value),
			category.value,
			dateExp.value
		);
		expenses.push(newExpense);
		balance -= parseInt(expense.value);
		dateFilter.innerHTML += "<option>" + dateExp.value + "</option>";
		showIncome();
		renderItem();
		valueReset();
	}
}

function valueReset() {
	document.getElementById("expense").value = "";
	document.getElementById("category").value = "Categories";
	document.getElementById("dateExpense").value = "";
}

function renderItem() {
	var item = "";
	for (var i = 0; i < expenses.length; i++) {
		item =
			"<tr>" +
			"<td>" +
			expenses[i].dateExp +
			"</td>" +
			"<td>" +
			expenses[i].category +
			"</td>" +
			"<td>" +
			expenses[i].expense +
			"<td/>" +
			"<td>" +
			"<button onclick = 'editItem(this)'>" +
			"edit" +
			"</button>" +
			"</td>" +
			"<td>" +
			"<button onclick = 'deleteItem(this)'>" +
			"delete" +
			"</button>" +
			"</td>" +
			"</tr>";
	}
	data.innerHTML += item;
}

function showFilterExpense() {
	var dateFilter = document.getElementById("dateFilter").value;
	var category = document.getElementById("showExpense").value;

	var item = "";
	for (var i = 0; i < expenses.length; i++) {
		if (category == "Categories" && dateFilter == "Date") {
			item +=
				"<tr>" +
				"<td>" +
				expenses[i].dateExp +
				"</td>" +
				"<td>" +
				expenses[i].category +
				"</td>" +
				"<td>" +
				expenses[i].expense +
				"<td/>" +
				"<td>" +
				"<button onclick = 'editItem(this)'>" +
				"edit" +
				"</button>" +
				"</td>" +
				"<td>" +
				"<button onclick = 'deleteItem(this)'>" +
				"delete" +
				"</button>" +
				"</td>" +
				"</tr>";
		}

		if (category == expenses[i].category && dateFilter == "Date") {
			item +=
				"<tr>" +
				"<td>" +
				expenses[i].dateExp +
				"</td>" +
				"<td>" +
				expenses[i].category +
				"</td>" +
				"<td>" +
				expenses[i].expense +
				"<td/>" +
				"<td>" +
				"<button onclick = 'editItem(this)'>" +
				"edit" +
				"</button>" +
				"</td>" +
				"<td>" +
				"<button onclick = 'deleteItem(this)'>" +
				"delete" +
				"</button>" +
				"</td>" +
				"</tr>";
		}

		if (category == expenses[i].category && dateFilter == expenses[i].dateExp) {
			item +=
				"<tr>" +
				"<td>" +
				expenses[i].dateExp +
				"</td>" +
				"<td>" +
				expenses[i].category +
				"</td>" +
				"<td>" +
				expenses[i].expense +
				"<td/>" +
				"<td>" +
				"<button onclick = 'editItem(this)'>" +
				"edit" +
				"</button>" +
				"</td>" +
				"<td>" +
				"<button onclick = 'deleteItem(this)'>" +
				"delete" +
				"</button>" +
				"</td>" +
				"</tr>";
		}

		if (category == "Categories" && dateFilter == expenses[i].dateExp) {
			item +=
				"<tr>" +
				"<td>" +
				expenses[i].dateExp +
				"</td>" +
				"<td>" +
				expenses[i].category +
				"</td>" +
				"<td>" +
				expenses[i].expense +
				"<td/>" +
				"<td>" +
				"<button onclick = 'editItem(this)'>" +
				"edit" +
				"</button>" +
				"</td>" +
				"<td>" +
				"<button onclick = 'deleteItem(this)'>" +
				"delete" +
				"</button>" +
				"</td>" +
				"</tr>";
		}
	}
	data.innerHTML = header + item;
}

function editItem(i) {
	var dateExp = i.parentNode.parentNode.childNodes[0].innerHTML;
	var oldValue = i.parentNode.parentNode.childNodes[1].innerHTML;
	var oldAmount = i.parentNode.parentNode.childNodes[2].innerHTML;
	var newAmount = (i.parentNode.parentNode.childNodes[2].innerHTML = +prompt(
		"Enter New Amount",
		oldAmount
	));
	var diffAmount = oldAmount - newAmount;
	balance = document.getElementById("currentIncome").innerText =
		balance + diffAmount;

	for (var i = 0; i < expenses.length; i++) {
		if (
			expenses[i].category == oldValue &&
			expenses[i].dateExp == dateExp &&
			expenses[i].expense == oldAmount
		) {
			expenses[i].expense = newAmount;
		}
	}
}

function deleteItem(i) {
	var dateExp = i.parentNode.parentNode.childNodes[0].innerHTML;
	var oldValue = i.parentNode.parentNode.childNodes[1].innerHTML;
	var oldAmount = i.parentNode.parentNode.childNodes[2].innerHTML;
	i.parentNode.parentNode.remove();

	for (var j = 0; j < expenses.length; j++) {
		if (
			expenses[j].category == oldValue &&
			expenses[j].dateExp == dateExp &&
			expenses[j].expense == oldAmount
		) {
			expenses.splice(j, 1);
			balance = document.getElementById("currentIncome").innerText =
				parseInt(balance) + parseInt(oldAmount);
		}
	}
}