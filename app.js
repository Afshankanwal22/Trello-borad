// -------------------------
// Add Card
// -------------------------
function showAddCard(button) {
  const cardsContainer = button.closest(".list").querySelector(".cards");

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter a title for this card...";
  input.className = "w-full p-2 rounded-lg border border-gray-300 mt-2 bg-white";

  input.addEventListener("keypress", e => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      const card = createCardElement(input.value.trim());
      cardsContainer.appendChild(card);
      input.remove();
    }
  });

  button.insertAdjacentElement("beforebegin", input);
  input.focus();
}

// -------------------------
// Create Card with inline edit/delete
// -------------------------
function createCardElement(text) {
  const card = document.createElement("div");
  card.className =
    "task bg-white p-3 rounded-lg shadow cursor-grab flex items-center justify-between space-x-2";

  // Left section (circle + text)
  const leftSection = document.createElement("div");
  leftSection.className = "flex items-center space-x-2 flex-1";

  const circle = document.createElement("div");
  circle.className =
    "w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center cursor-pointer";

  const content = document.createElement("span");
  content.textContent = text;
  content.className = "flex-1";

  // toggle done
  circle.addEventListener("click", () => {
    circle.classList.toggle("bg-green-400");
    circle.classList.toggle("border-green-400");
    content.classList.toggle("line-through");
    content.classList.toggle("text-gray-400");
  });

  leftSection.appendChild(circle);
  leftSection.appendChild(content);

  // Right section (edit + delete)
  const rightSection = document.createElement("div");
  rightSection.className = "flex items-center space-x-2";

  // ✏️ Edit
  const editBtn = document.createElement("button");
  editBtn.innerHTML = "✏️";
  editBtn.className = "text-gray-600 hover:text-blue-500 transition duration-200";
  editBtn.title = "Edit";

  editBtn.addEventListener("click", () => {
    // Convert span to input for inline editing
    const input = document.createElement("input");
    input.type = "text";
    input.value = content.textContent;
    input.className = "border rounded p-1 flex-1";
    leftSection.replaceChild(input, content);
    input.focus();

    // Save on Enter or blur
    const save = () => {
      if (input.value.trim() !== "") {
        content.textContent = input.value.trim();
      }
      leftSection.replaceChild(content, input);
    };

    input.addEventListener("keypress", e => {
      if (e.key === "Enter") save();
    });
    input.addEventListener("blur", save);
  });

  // 🗑️ Delete
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.className = "text-gray-600 hover:text-red-500 transition duration-200";
  deleteBtn.title = "Delete";
  deleteBtn.addEventListener("click", () => {
    card.remove(); // instantly delete
  });

  rightSection.appendChild(editBtn);
  rightSection.appendChild(deleteBtn);

  card.appendChild(leftSection);
  card.appendChild(rightSection);

  TaskDrag(card);
  return card;
}

// -------------------------
// Add List
// -------------------------
function showAddList() {
  const board = document.getElementById("board");

  const newList = document.createElement("div");
  newList.className = "list bg-blue-100 rounded-xl p-4 w-72 flex-shrink-0";

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.placeholder = "Enter list title...";
  titleInput.className =
    "w-full p-2 rounded-lg border border-gray-300 mb-2 bg-white";

  titleInput.addEventListener("keypress", e => {
    if (e.key === "Enter" && titleInput.value.trim() !== "") {
      newList.innerHTML = `
        <h2 class="font-semibold mb-3">${titleInput.value.trim()}</h2>
        <div class="cards space-y-2"></div>
        <button onclick="showAddCard(this)" class="text-sm text-gray-600 mt-2 hover:underline">+ Add a card</button>
      `;
      ListDrop(newList.querySelector(".cards"));
    }
  });

  newList.appendChild(titleInput);
  board.insertBefore(newList, document.getElementById("add-list"));
  titleInput.focus();
}

// -------------------------
// Drag & Drop
// -------------------------
function TaskDrag(task) {
  task.draggable = true;
  task.addEventListener("dragstart", () => task.classList.add("dragging"));
  task.addEventListener("dragend", () => task.classList.remove("dragging"));
}

function ListDrop(list) {
  list.addEventListener("dragover", e => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    if (dragging) list.appendChild(dragging);
  });
}

// Initialize
document.querySelectorAll(".cards").forEach(ListDrop);
