// Base class for general UI functionalities
class UIComponent {
    constructor() {
        this.sidebar = document.getElementById("mySidebar");
        this.main = document.getElementById("main");
    }

    toggleNav() {
        if (this.sidebar.style.width === "250px") {
            this.sidebar.style.width = "0";
            this.main.style.marginLeft = "0";
        } else {
            this.sidebar.style.width = "250px";
            this.main.style.marginLeft = "250px";
        }
    }

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    loadSettings() {
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
}

// Derived class for task management
class TaskManager extends UIComponent {
    constructor() {
        super();
    }

    addTask() {
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
        editButton.onclick = () => this.editTask(task);
        task.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => this.deleteTask(task);
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

        this.closeModal('taskModal');
        document.getElementById('taskForm').reset();
    }

    editTask(task) {
        const taskDetails = task.firstChild.textContent.split(' - ');
        const taskName = taskDetails[0];
        const taskTime = parseInt(taskDetails[1]);

        document.getElementById('taskName').value = taskName;
        document.getElementById('taskTime').value = taskTime;
        this.openModal('taskModal');

        this.deleteTask(task);
    }

    deleteTask(task) {
        task.parentNode.removeChild(task);
    }
}

// Instantiate the TaskManager class
const taskManager = new TaskManager();

// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    taskManager.loadSettings();

    // Example usage for toggling navigation
    document.querySelector('.openbtn').addEventListener('click', () => taskManager.toggleNav());
});

// Example usage for adding a task
document.getElementById('addTaskButton').addEventListener('click', () => taskManager.addTask());
