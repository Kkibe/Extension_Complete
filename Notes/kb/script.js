const draggableElements = document.querySelectorAll(".board__boxes");
const droppableElements = document.querySelectorAll(".board__conatiner");

draggableElements.forEach((draggable) => {
  draggable.addEventListener("dragstart", () => {
    draggable.classList.add("dragging");
  });

  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});

droppableElements.forEach((droppable) => {
  droppable.addEventListener("dragover", (e) => {
    e.preventDefault();
    const nearestElement = getNearestElement(droppable, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (nearestElement == null) {
      droppable.appendChild(draggable);
    } else {
      droppable.insertBefore(draggable, nearestElement);
    }
  });
});

function getNearestElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".board__boxes:not(.dragging)")
  ];

  return draggableElements.reduce(
    (closest, draggable) => {
      const box = draggable.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: draggable };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
