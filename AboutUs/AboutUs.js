// Open and close sidebar function
function toggleNav() {
    var sidebar = document.getElementById("mySidebar");
    var main = document.getElementById("main");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        main.style.marginLeft = "0";
    } else {
        sidebar.style.width = "250px";
        main.style.marginLeft = "250px";
    }
}

// Open and close the contact form modal (if you add a modal for the contact form)
function openContactModal() {
    document.getElementById('contactModal').style.display = 'block';
}

function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none';
}

// Add a task to the task list (if applicable, similar to what you did on the home page)
function addTask() {
    const taskName = document.getElementById('taskName').value;
    const taskTime = document.getElementById('taskTime').value;
    const taskUrgency = document.getElementById('taskUrgency').value;
    const taskImportance = document.getElementById('taskImportance').value;
    const taskCategory = document.getElementById('taskCategory').value;

    const task = document.createElement('li');
    task.textContent = `${taskName} - ${taskTime} min`;

    switch (taskCategory) {
        case 'work':
            task.style.color = 'blue';
            break;
        case 'personal':
            task.style.color = 'green';
            break;
        case 'other':
            task.style.color = 'gray';
            break;
    }

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = function() { editTask(task) };
    task.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() { deleteTask(task) };
    task.appendChild(deleteButton);

    if (taskImportance === 'important' && taskUrgency === 'urgent') {
        document.getElementById('do-list').appendChild(task);
    } else if (taskImportance === 'important' && taskUrgency === 'not-urgent') {
        document.getElementById('decide-list').appendChild(task);
    } else if (taskImportance === 'not-important' && taskUrgency === 'urgent') {
        document.getElementById('delegate-list').appendChild(task);
    } else {
        document.getElementById('delete-list').appendChild(task);
    }

    closeTaskModal();
    document.getElementById('taskForm').reset();
}

// Edit a task
function editTask(task) {
    const taskDetails = task.firstChild.textContent.split(' - ');
    const taskName = taskDetails[0];
    const taskTime = parseInt(taskDetails[1]);

    document.getElementById('taskName').value = taskName;
    document.getElementById('taskTime').value = taskTime;
    openTaskModal();

    deleteTask(task);
}

// Delete a task
function deleteTask(task) {
    task.parentNode.removeChild(task);
}

function loadSettings() {
    const defaultSettings = {
        sidebarColor: '#F07167',
        headerColor: '#F07167',
        backgroundColor: '#FDFCDC'
    };
    const settings = JSON.parse(localStorage.getItem('settings')) || defaultSettings;
    document.querySelector('.sidebar').style.backgroundColor = settings.sidebarColor;
    document.querySelector('.header-container').style.backgroundColor = settings.headerColor;
    document.body.style.backgroundColor = settings.backgroundColor;

}


document.addEventListener('DOMContentLoaded', () => {
    loadSettings(); // Load settings from localStorage
});
