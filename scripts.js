// Function to toggle the sidebar
function toggleNav() {
    const sidebar = document.getElementById("mySidebar");
    const main = document.getElementById("main");

    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        main.style.marginLeft = "0";
    } else {
        sidebar.style.width = "250px";
        main.style.marginLeft = "250px";
    }
}

function openTaskModal() {
    document.getElementById('taskModal').style.display = 'block';
}

function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signupBtn')?.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    document.getElementById('taskForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addTask();
    });

    document.getElementById('taskModal').addEventListener('click', function(event) {
        if (event.target.className === 'modal') {
            closeTaskModal();
        }
    });
});

function addTask() {
    const taskName = document.getElementById('taskName').value.trim();
    const taskTime = document.getElementById('taskTime').value.trim();
    const taskUrgency = document.getElementById('taskUrgency').value;
    const taskImportance = document.getElementById('taskImportance').value;
    const taskCategory = document.getElementById('taskCategory').value;

    if (!taskName || !taskTime) {
        //alert('Please fill in all the fields.');
        return;
    }

    const task = createTaskElement(taskName, taskTime, taskUrgency, taskImportance, taskCategory);
    appendTaskToMatrix(task, taskUrgency, taskImportance);
    closeTaskModal();
    document.getElementById('taskForm').reset();
}

function createTaskElement(taskName, taskTime, taskUrgency, taskImportance, taskCategory) {
    const task = document.createElement('li');
    task.id = `task-${Date.now()}`;
    task.textContent = `${taskName} - ${taskTime} min`;
    task.className = `${getTaskPriorityClass(taskUrgency, taskImportance)} ${taskCategory}`;
    task.draggable = true;
    task.ondragstart = drag;

    const buttonContainer = document.createElement('div');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editTask(task));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(task));

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);
    task.appendChild(buttonContainer);

    return task;
}

function getTaskPriorityClass(taskUrgency, taskImportance) {
    if (taskImportance === 'important' && taskUrgency === 'urgent') {
        return 'priority-high';
    } else if (taskImportance === 'important' || taskUrgency === 'urgent') {
        return 'priority-medium';
    } else {
        return 'priority-low';
    }
}

function getCategoryColor(taskCategory) {
    switch (taskCategory) {
        case 'work':
            return 'blue';
        case 'personal':
            return 'green';
        case 'other':
            return 'gray';
        default:
            return 'black';
    }
}

function appendTaskToMatrix(task, taskUrgency, taskImportance) {
    if (taskImportance === 'important' && taskUrgency === 'urgent') {
        document.getElementById('do-list').appendChild(task);
    } else if (taskImportance === 'important' && taskUrgency === 'not-urgent') {
        document.getElementById('decide-list').appendChild(task);
    } else if (taskImportance === 'not-important' && taskUrgency === 'urgent') {
        document.getElementById('delegate-list').appendChild(task);
    } else {
        document.getElementById('delete-list').appendChild(task);
    }
}

function editTask(task) {
    const taskDetails = task.firstChild.textContent.split(' - ');
    const taskName = taskDetails[0];
    const taskTime = parseInt(taskDetails[1]);

    document.getElementById('taskName').value = taskName;
    document.getElementById('taskTime').value = taskTime;

    openTaskModal();
    deleteTask(task);
}

function deleteTask(task) {
    task.parentNode.removeChild(task);
}

function login() {
    alert('Login functionality to be implemented.');
}

function searchTasks() {
    const searchValue = document.getElementById('taskSearch').value.toLowerCase();
    const tasks = document.querySelectorAll('.matrix-cell li');

    tasks.forEach(task => {
        const taskText = task.textContent.toLowerCase();
        task.style.display = taskText.includes(searchValue) ? '' : 'none';
    });
}

function filterTasks() {
    const filterValue = document.getElementById('taskFilter').value;
    const tasks = document.querySelectorAll('.matrix-cell li');

    tasks.forEach(task => {
        if (filterValue === 'all') {
            task.style.display = '';
        } else {
            task.style.display = task.classList.contains(filterValue) ? '' : 'none';
        }
    });
}

function sortTasks() {
    const sortValue = document.getElementById('taskSort').value;
    const lists = ['do-list', 'decide-list', 'delegate-list', 'delete-list'];

    lists.forEach(listId => {
        const list = document.getElementById(listId);
        Array.from(list.children)
            .sort((a, b) => {
                if (sortValue === 'priority') {
                    return getPriorityValue(b) - getPriorityValue(a);
                } else if (sortValue === 'deadline') {
                    return parseInt(a.textContent.split(' - ')[1]) - parseInt(b.textContent.split(' - ')[1]);
                }
            })
            .forEach(node => list.appendChild(node));
    });
}

function getPriorityValue(task) {
    if (task.classList.contains('priority-high')) return 3;
    if (task.classList.contains('priority-medium')) return 2;
    return 1;
}

document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const taskName = document.getElementById('taskName').value.trim();
    const taskTime = document.getElementById('taskTime').value.trim();
    const taskUrgency = document.getElementById('taskUrgency').value;
    const taskImportance = document.getElementById('taskImportance').value;
    const taskCategory = document.getElementById('taskCategory').value;

    // Check if any of the fields are empty
    if (!taskName || !taskTime || !taskUrgency || !taskImportance || !taskCategory) {
        alert("Please fill in all the fields.");
        return;
    }

    const taskTimeInSeconds = parseInt(taskTime) * 60; // Convert minutes to seconds

    const taskId = 'task' + new Date().getTime(); // Generate a unique ID for the task

    const taskElement = document.createElement('li');
    taskElement.classList.add('task');
    taskElement.setAttribute('data-id', taskId);
    taskElement.setAttribute('data-expected-time', taskTimeInSeconds);
    taskElement.setAttribute('data-urgency', taskUrgency);
    taskElement.setAttribute('data-importance', taskImportance);
    taskElement.setAttribute('data-category', taskCategory);
    taskElement.setAttribute('draggable', 'true');
    taskElement.ondragstart = drag;

    taskElement.innerHTML = `
        <span class="task-name">${taskName}</span>
        <button class="timer-btn" onclick="toggleTimer(this)">Start</button>
        <button class="finish-btn" onclick="finishTask(this)">Finish</button>
        <button class="edit-btn" onclick="editTask(this)">Edit</button>
        <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
        <span class="timer-display">${formatTime(taskTimeInSeconds)}</span>
    `;

    // Determine the correct section based on urgency and importance
    let sectionId;
    if (taskUrgency === 'urgent' && taskImportance === 'important') {
        sectionId = 'do-list';
    } else if (taskUrgency === 'not-urgent' && taskImportance === 'important') {
        sectionId = 'decide-list';
    } else if (taskUrgency === 'urgent' && taskImportance === 'not-important') {
        sectionId = 'delegate-list';
    } else {
        sectionId = 'delete-list';
    }

    document.getElementById(sectionId).appendChild(taskElement);

    closeTaskModal();
    document.getElementById('taskForm').reset();
});

function formatTime(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const remainingSeconds = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${remainingSeconds}`;
}

function editTask(button) {
    const taskElement = button.closest('.task');
    const taskName = taskElement.querySelector('.task-name').textContent;
    const taskTime = parseInt(taskElement.getAttribute('data-expected-time')) / 60; // Convert seconds to minutes
    const taskUrgency = taskElement.getAttribute('data-urgency');
    const taskImportance = taskElement.getAttribute('data-importance');
    const taskCategory = taskElement.getAttribute('data-category');

    document.getElementById('taskName').value = taskName;
    document.getElementById('taskTime').value = taskTime;
    document.getElementById('taskUrgency').value = taskUrgency;
    document.getElementById('taskImportance').value = taskImportance;
    document.getElementById('taskCategory').value = taskCategory;
    openTaskModal();

    deleteTask(button); // Remove the old task, new one will be added on form submission
}

function deleteTask(button) {
    const taskElement = button.closest('.task');
    taskElement.remove();
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const taskElement = document.getElementById(data);
    event.target.closest('ul').appendChild(taskElement);
}


