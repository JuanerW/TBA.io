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
        alert('Please fill in all the fields.');
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

// Drag and drop functions
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const task = document.getElementById(data);
    const target = event.target;

    if (target.tagName === 'UL') {
        target.appendChild(task);
    } else if (target.tagName === 'LI') {
        target.parentNode.insertBefore(task, target.nextSibling);
    }
}
