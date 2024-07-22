let timers = {}; // Store timers for each task

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
    const taskModal = document.getElementById('taskModal');
    taskModal.style.display = 'block';
    taskModal.classList.add('fade-in');
}

function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

function openTaskInfoModal(taskInfo) {
    const taskInfoModal = document.getElementById('taskInfoModal');
    const taskInfoElement = document.getElementById('taskInfo');
    taskInfoElement.textContent = taskInfo;
    taskInfoModal.style.display = 'block';
    taskInfoModal.classList.add('fade-in');
}

function closeTaskInfoModal() {
    document.getElementById('taskInfoModal').style.display = 'none';
}

function toggleCompletedTasks() {
    const completedTaskList = document.getElementById('completed-task-list');
    completedTaskList.classList.toggle('expanded');
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
        if (event.target.classList.contains('modal')) {
            closeTaskModal();
        }
    });

    // Apply fade-in effect to elements on page load
    document.querySelectorAll('.matrix-cell, .filter-sort, .add-task-btn').forEach(element => {
        element.classList.add('fade-in');
    });

    // Toggle sidebar with slide-in effect
    document.querySelector('.openbtn').addEventListener('click', () => {
        const sidebar = document.getElementById('mySidebar');
        sidebar.classList.toggle('slide-in');
    });

    // Add click event listener to completed tasks
    document.getElementById('completed-task-list').addEventListener('click', function(event) {
        const taskElement = event.target.closest('.completed-task-item');
        if (taskElement) {
            const taskInfo = taskElement.getAttribute('data-info');
            openTaskInfoModal(taskInfo);
        }
    });
});

function toggleTimer(button) {
    const taskElement = button.closest('.task');
    const taskId = taskElement.dataset.id;

    if (!timers[taskId]) {
        timers[taskId] = { remainingTime: parseInt(taskElement.dataset.expectedTime) };
    }

    if (timers[taskId].interval) {
        // If timer is running, pause it
        clearInterval(timers[taskId].interval);
        button.textContent = 'Resume';
        button.classList.remove('paused');
        button.classList.add('resumed');
        timers[taskId].interval = null;
    } else {
        // If timer is paused or not started, start/resume it
        const endTime = new Date().getTime() + timers[taskId].remainingTime * 1000;
        button.textContent = 'Pause';
        button.classList.remove('resumed');
        button.classList.add('paused');

        timers[taskId].interval = setInterval(() => {
            updateCountdownDisplay(taskElement, endTime, taskId);
        }, 1000);
    }
}

function updateCountdownDisplay(taskElement, endTime, taskId) {
    const currentTime = new Date().getTime();
    let remainingTime = Math.floor((endTime - currentTime) / 1000);

    if (remainingTime <= 0) {
        clearInterval(timers[taskId].interval);
        taskElement.querySelector('.timer-display').textContent = "00:00:00";
        taskElement.querySelector('.timer-btn').textContent = "Start";
        taskElement.querySelector('.timer-display').classList.add('timer-exceeded');
        timers[taskId].remainingTime = 0;
        timers[taskId].interval = null;
        return;
    }

    timers[taskId].remainingTime = remainingTime;

    const hours = String(Math.floor(remainingTime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((remainingTime % 3600) / 60)).padStart(2, '0');
    const seconds = String(remainingTime % 60).padStart(2, '0');

    const timerDisplay = taskElement.querySelector('.timer-display');
    timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;

    if (remainingTime <= parseInt(taskElement.dataset.expectedTime)) {
        timerDisplay.classList.remove('timer-exceeded');
    } else {
        timerDisplay.classList.add('timer-exceeded');
    }
}

function finishTask(button) {
    const taskElement = button.closest('.task');
    const taskId = taskElement.dataset.id;
    clearInterval(timers[taskId]?.interval);

    // Mark the task as completed with animation
    taskElement.classList.add('completed');
    setTimeout(() => {
        taskElement.classList.add('task-complete');
    }, 300);

    setTimeout(() => {
        const completedTaskList = document.getElementById('completed-task-list');
        taskElement.classList.remove('task');
        taskElement.classList.add('completed-task-item');
        taskElement.setAttribute('data-info', `
            Name: ${taskElement.querySelector('.task-name').textContent}
            Time: ${taskElement.getAttribute('data-expected-time') / 60} minutes
            Urgency: ${taskElement.getAttribute('data-urgency')}
            Importance: ${taskElement.getAttribute('data-importance')}
            Category: ${taskElement.getAttribute('data-category')}
        `);
        completedTaskList.appendChild(taskElement);
        taskElement.querySelector('.timer-btn').remove();
        taskElement.querySelector('.finish-btn').remove();
        taskElement.querySelector('.edit-btn').remove();
        taskElement.querySelector('.delete-btn').remove();
    }, 600); // Delay to allow the animation to complete
}

document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addTask();
});

function addTask() {
    const taskName = document.getElementById('taskName').value.trim();
    const taskTime = document.getElementById('taskTime').value.trim();
    const taskUrgency = document.getElementById('taskUrgency').value;
    const taskImportance = document.getElementById('taskImportance').value;
    const taskCategory = document.getElementById('taskCategory').value;

    if (!taskName || !taskTime || !taskUrgency || !taskImportance || !taskCategory) {
        //alert('Please fill in all the fields.');
        return;
    }

    const taskTimeInSeconds = parseInt(taskTime) * 60; // Convert minutes to seconds
    const taskId = 'task' + new Date().getTime(); // Generate a unique ID for the task

    const taskElement = document.createElement('li');
    taskElement.classList.add('task', 'fade-in');
    taskElement.setAttribute('data-id', taskId);
    taskElement.setAttribute('data-expected-time', taskTimeInSeconds);
    taskElement.setAttribute('data-urgency', taskUrgency);
    taskElement.setAttribute('data-importance', taskImportance);
    taskElement.setAttribute('data-category', taskCategory);
    taskElement.setAttribute('draggable', 'true');
    taskElement.ondragstart = drag;

    taskElement.innerHTML = `
        <span class="task-name">${taskName}</span>
        <div class="button-group">
            <button class="timer-btn" onclick="toggleTimer(this)">Start</button>
            <button class="finish-btn" onclick="finishTask(this)">Finish</button>
            <button class="edit-btn" onclick="editTask(this)">Edit</button>
            <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
        </div>
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
}

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
    const taskId = taskElement.dataset.id;
    clearInterval(timers[taskId]?.interval); // Clear the timer interval if it exists
    delete timers[taskId]; // Remove the timer from the timers object
    taskElement.remove();
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(data);
    const dropTarget = event.target.closest('ul');
    if (dropTarget && dropTarget.id.includes('-list')) {
        dropTarget.appendChild(draggedElement);
    }
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
