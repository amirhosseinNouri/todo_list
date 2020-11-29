let items = [] ;

const all_colors = {
  red : "#e84188",
  blue : "#487eb0",
  green : "green",
  yellow : "yellow"
}
 


let nextId ;

const refreshBtn = document.querySelector(".refresh");
const title = document.querySelector("#title");
const date = document.querySelector("#date");
const time = document.querySelector("#time");
const colorPeak = document.querySelector(".color-peak");
const itemContainer = document.querySelector("#item-container");

let selectedColor;

/* Refresh tasks and render all the list again.
   Completed task wont display after refreshing. */
const refresh = () => {
  loadData()
  itemContainer.innerHTML = "";
  let loading = document.createElement("div");
  loading.classList.add("lds-dual-ring");
  itemContainer.style.justifyContent = "center";
  itemContainer.appendChild(loading);

  setTimeout(renderItems, 1000);
};

refreshBtn.addEventListener("click", refresh);

/* Select Color of task and assing it to the selectedColor variable. */
colorPeak.addEventListener("click", (event) => {
  if (!event.target.getAttribute("data-color")) return;
  document.querySelectorAll(".color-peak div").forEach((div) => {
    div.style.width = "17px";
    div.style.height = "17px";
  });
  event.target.style.width = "20px";
  event.target.style.height = "20px";
  selectedColor = event.target.getAttribute("data-color");
});

/* Check if the selected day, is tomorrow of yesterday */
const calculateDate = (date) => {
  let day = date.substring(8);
  let month = date.substring(5, 7);
  let year = date.substring(0, 4);

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  if (day == dd && month == mm && year == yyyy) return "Today";
  else if (yyyy == year && month == mm && day > dd) return "Tomorrow";
  return date;
};

/* Gets new task's inforamtion and stores them.
   List will be rendered again. */
const addNewTask = (event) => {
  event.preventDefault();
  if (!title.value) {
    title.classList.add("error");
    return;
  }

  obj = {};
  obj.id = nextId;
  obj.title = title.value;
  obj.star = false;
  obj.color = selectedColor;
  obj.date = calculateDate(date.value);
  obj.time = time.value;
  obj.done = false;

  nextId++;
  clearForm()
  items.push(obj);
  saveData()
  renderItems();
  hideModal();
};

const clearForm = () =>{
  title.value = ""
  date.value  =""
  time.value = ""
}

/* Append created item to itemContainer */
const renderItems = () => {
  itemContainer.style.justifyContent = "flex-start";
  itemContainer.innerHTML = "";
  items.forEach((item) => {
    if (!item.done) createElement(item);
  });

  if (!itemContainer.innerHTML) {
    itemContainer.style.justifyContent = "center";
    itemContainer.innerHTML = "Add a task to get started";
  }

  eventsOnItems();
  eventsOnStars();
};

/* Create an item element */
const createElement = ({ id, title, star, color, date, time, done }) => {
  let item = document.createElement("div");
  item.classList.add("item");
  item.setAttribute("data-id", id);

  let colorDiv = document.createElement("div");
  colorDiv.classList.add("color");
  colorDiv.style.backgroundColor = `${all_colors[color]}`;

  
  let body = document.createElement("div");
  body.classList.add("body");

  let titleDiv = document.createElement("div");
  titleDiv.classList.add("title");
  titleDiv.innerHTML = title;

  let dateDive = document.createElement("div");
  dateDive.classList.add("date");
  dateDive.innerHTML = `${date}  at  ${time}`;

  let starContainer = document.createElement("div");
  starContainer.classList.add("star");
  let starIcon = document.createElement("i");

  if (star) {
    starIcon.classList.toggle("fas");
  } else {
    starIcon.classList.toggle("far");
  }
  starIcon.classList.add("fa-star");

  if (done) {
    titleDiv.classList.add("task-done");
    dateDive.classList.add("task-done");
  }

  item.appendChild(colorDiv);
  body.appendChild(titleDiv);
  body.appendChild(dateDive);
  item.appendChild(body);
  starContainer.appendChild(starIcon);
  item.appendChild(starContainer);

  itemContainer.appendChild(item);
};

title.addEventListener("focus", () => {
  title.classList.remove("error");
});

/* Find ancestor of selected item with .item class */
const findItemNode = (el, cls) => {
  if (el.classList.contains(cls)) return el;
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
};

/* Task done */
const changeDone = (id, value) => {
  let item = items.find((i) => i.id === parseInt(id));
  item.done = value;
  saveData()
};

/* To check if task if done */
const isDone = (id) => {
  return items.find((i) => i.id === parseInt(id)).done;
};

let childs;

/* Event listener on generated items */
const eventsOnItems = () => {
  document.querySelectorAll(".item").forEach((item) => {
    item.addEventListener("click", (event) => {
      test = event.target;
      let item = findItemNode(event.target, "item");

      let id = item.getAttribute("data-id");
      childs = item.children;
      if (isDone(id)) {
        childs[1].children[0].classList.remove("task-done");
        childs[1].children[1].classList.remove("task-done");
        changeDone(id, false);
      } else {
        childs[1].children[0].classList.add("task-done");
        childs[1].children[1].classList.add("task-done");
        changeDone(id, true);
      }
    });
  });
};

const changeImportance = (id, value) => {
  items.find((i) => i.id === parseInt(id)).star = value;
};

const isImportante = (id) => {
  return items.find((i) => i.id === parseInt(id)).star;
};

const eventsOnStars = () => {
  document.querySelectorAll(".fa-star").forEach((star) => {
    star.addEventListener("click", (event) => {
      event.stopPropagation();
      let item = findItemNode(event.target, "item");
      let id = item.getAttribute("data-id");

      if (isImportante(id)) {
        changeImportance(id, false);
      } else {
        changeImportance(id, true);
      }

      renderItems();
    });
  });
};

/* modal */
const showModal = () => {
  selectedColor = "white";
  modal.classList.remove("hide");
  modal.classList.add("show");
};

const hideModal = () => {
  modal.classList.remove("show");
  modal.classList.add("hide");
};

const modal = document.querySelector(".modal");
const btn = document.querySelector("#btn");
const close = document.querySelector(".close");
btn.addEventListener("click", () => {
  showModal();
});

close.addEventListener("click", () => {
  hideModal();
});

window.onclick = function (event) {
  if (event.target == modal) {
    hideModal();
  }
};

document
  .querySelector('button[type="submit"]')
  .addEventListener("submit", addNewTask);

document
  .querySelector("form").addEventListener("submit" , addNewTask)

/* LocalStorage methods */

const loadData = () =>{
  let data =  window.localStorage.getItem("tasks")
  if(!data) items = []
  else items = JSON.parse(data) 
  nextId = items.length
}

const saveData = () =>{
  window.localStorage.setItem("tasks" , JSON.stringify(items))
  console.log(items.length);
  console.log(nextId);
}


refresh();
