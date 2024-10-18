//define UI variables
let newTaskInput = document.querySelector("#task");
let newTaskBtn = document.querySelector("#submit");
let taskList = document.querySelector(".collection");
let filterTaskInput = document.querySelector("#filter");
let clearTasksBtn = document.querySelector(".clear-tasks");

//define event listeners
newTaskBtn.addEventListener("click",addTask)
taskList.addEventListener("click",deleteTask)
clearTasksBtn.addEventListener("click",clearTask)
filterTaskInput.addEventListener("keyup",filterTask)
//run on page refresh
recreateList();

//recreate the list
function recreateList(){
  let taskArray = JSON.parse(localStorage.getItem("tasks"))
  taskList.innerHTML = ""
  taskArray.forEach(function(task,index){
        //create the tasks collection
      let li = document.createElement("li")
      li.className = "collection-item"
      li.appendChild(document.createTextNode(task))
      const link = document.createElement("a")
      link.className = "delete-item secondary-content"
      link.innerHTML = `<i id=${index} class='fa fa-remove'></i>`
      li.appendChild(link)
     
      //append the li to the ul
      taskList.appendChild(li)
  })
}
//make tasks array from localstorage
function makeTasksArray(){
  let tasks
  if(localStorage.getItem("tasks") === null){
    tasks = []
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"))
  }
  return tasks
}

//add a new task logic
function addTask(e){
  e.preventDefault();
  let task = newTaskInput.value
  //add the task to local storage
  let tasks = makeTasksArray();
  if(task != ""){
    if(tasks.indexOf(task) != -1){
    alert("The item already there!")
    newTaskInput.value = ""
    } else {
    tasks.unshift(task)
    localStorage.setItem("tasks", JSON.stringify(tasks))
    //clear the input0
    newTaskInput.value = ""
    recreateList()
  }
  }
  
}
//delete a task from the list
function deleteTask(e){
  if(e.target.tagName == "I"){
    let id = e.target.getAttribute("id")
    let tasks = makeTasksArray()
    tasks.splice(id,1)
    localStorage.setItem("tasks", JSON.stringify(tasks))
    recreateList()
  }
}
//clear task btn
function clearTask(){
  localStorage.removeItem("tasks")
  recreateList()
}

//filter tasks
function filterTask(e){
  let value = e.target.value.toLowerCase()
  document.querySelectorAll(".collection-item").forEach(function(item){
    if(item.textContent.toLowerCase().indexOf(value) != -1 ){
      item.style.display = "block"
    } else {
      item.style.display = "none"
    }
  })
}