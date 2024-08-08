// Home Page Script

let timers = {}; // Store timers for each task

document.addEventListener('DOMContentLoaded', () => {

    loadSettings(); // Load settings from localStorage
    
    loadTasksFromStorage(); // Load tasks from local storage on page load
    restoreTimersFromStorage(); // Restore timers from local storage on page load

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

    // Add click event listener for clearing completed tasks
    document.getElementById('clearCompletedTasksBtn')?.addEventListener('click', clearCompletedTasks);

    // Show the welcome screen on page load
    showWelcomeScreen();

    updateProgressBar(); // Update progress bar on page load
});


function updateProgressBar() {
    const tasks = document.querySelectorAll('.task');
    const completedTasks = document.querySelectorAll('.task.completed');
    const progress = (completedTasks.length / tasks.length) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
}

function loadSettings() {
    const defaultSettings = {
        sidebarColor: '#F07167',
        headerColor: '#F07167',
        backgroundColor: '#FDFCDC',
        doColor: '#FF8C89',
        decideColor: '#FFEDCD',
        delegateColor: '#33D1CC',
        deleteColor: '#3399CC'
    };

    const settings = JSON.parse(localStorage.getItem('settings')) || defaultSettings;

    document.querySelector('.sidebar').style.backgroundColor = settings.sidebarColor;
    document.querySelector('.header-container').style.backgroundColor = settings.headerColor;
    document.body.style.backgroundColor = settings.backgroundColor;
    document.querySelector('.primary-color').style.backgroundColor = settings.doColor;
    document.querySelector('.secondary-color').style.backgroundColor = settings.decideColor;
    document.querySelector('.accent-color').style.backgroundColor = settings.delegateColor;
    document.querySelector('.text-color').style.backgroundColor = settings.deleteColor;
}

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
    taskInfoElement.innerHTML = taskInfo.split('\n').map(info => `<p>${info}</p>`).join('');
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

function loadTasksFromStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

    tasks.forEach(task => addTaskToDOM(task));
    completedTasks.forEach(task => addTaskToDOM(task, true));
}

function saveTasksToStorage() {
    const tasks = Array.from(document.querySelectorAll('.task:not(.completed-task-item)')).map(taskElement => ({
        id: taskElement.dataset.id,
        name: taskElement.querySelector('.task-name').textContent,
        time: parseInt(taskElement.getAttribute('data-expected-time')),
        urgency: taskElement.getAttribute('data-urgency'),
        importance: taskElement.getAttribute('data-importance'),
        category: taskElement.getAttribute('data-category'),
        deadline: taskElement.getAttribute('data-deadline'),
        status: taskElement.getAttribute('data-status') || 'notStarted'
    }));

    const completedTasks = Array.from(document.querySelectorAll('.completed-task-item')).map(taskElement => ({
        id: taskElement.dataset.id,
        name: taskElement.querySelector('.task-name').textContent,
        time: parseInt(taskElement.getAttribute('data-expected-time')),
        urgency: taskElement.getAttribute('data-urgency'),
        importance: taskElement.getAttribute('data-importance'),
        category: taskElement.getAttribute('data-category'),
        deadline: taskElement.getAttribute('data-deadline'),
        completed: true
    }));

    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

function saveTimersToStorage() {
    localStorage.setItem('timers', JSON.stringify(timers));
}

function restoreTimersFromStorage() {
    const storedTimers = JSON.parse(localStorage.getItem('timers')) || {};
    Object.keys(storedTimers).forEach(taskId => {
        const timerData = storedTimers[taskId];
        if (timerData.endTime) {
            const taskElement = document.querySelector(`.task[data-id="${taskId}"]`);
            if (taskElement) {
                const endTime = new Date(timerData.endTime).getTime();
                timers[taskId] = {
                    remainingTime: timerData.remainingTime,
                    interval: setInterval(() => {
                        updateCountdownDisplay(taskElement, endTime, taskId);
                    }, 1000)
                };
                taskElement.querySelector('.timer-btn').textContent = 'Pause';
                taskElement.querySelector('.timer-btn').classList.add('paused');
            }
        }
    });
}

function addTask() {
    const taskName = document.getElementById('taskName').value.trim();
    const taskTime = document.getElementById('taskTime').value.trim();
    const taskUrgency = document.getElementById('taskUrgency').value;
    const taskImportance = document.getElementById('taskImportance').value;
    const taskCategory = document.getElementById('taskCategory').value;
    const taskDeadline = document.getElementById('taskDeadline').value; // Get the task deadline

    if (!taskName || !taskTime || !taskUrgency || !taskImportance || !taskCategory) {
        return; // Do not submit the form if required fields are empty
    }

    const taskTimeInSeconds = parseInt(taskTime) * 60; // Convert minutes to seconds
    const taskId = 'task' + new Date().getTime(); // Generate a unique ID for the task

    const task = {
        id: taskId,
        name: taskName,
        time: taskTimeInSeconds,
        urgency: taskUrgency,
        importance: taskImportance,
        category: taskCategory,
        deadline: taskDeadline, // Save the task deadline
        status: 'notStarted'
    };

    addTaskToDOM(task);
    saveTaskToStorage(task); // Save the task to localStorage

    closeTaskModal();
    document.getElementById('taskForm').reset();
}

function saveTaskToStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function addTaskToDOM(task, isCompleted = false) {
    const taskElement = document.createElement('li');
    taskElement.classList.add('task', 'fade-in');
    if (isCompleted) {
        taskElement.classList.add('completed-task-item');
    }
    taskElement.setAttribute('data-id', task.id);
    taskElement.setAttribute('data-expected-time', task.time);
    taskElement.setAttribute('data-urgency', task.urgency);
    taskElement.setAttribute('data-importance', task.importance);
    taskElement.setAttribute('data-category', task.category);
    taskElement.setAttribute('data-status', task.status);
    taskElement.setAttribute('data-deadline', task.deadline); // Add the deadline attribute
    taskElement.setAttribute('draggable', 'true');
    taskElement.ondragstart = drag;

    taskElement.innerHTML = `
        <span class="task-name">${task.name}</span>
        <div class="button-group">
            ${isCompleted ? '' : `
                <button class="timer-btn" onclick="toggleTimer(this)">Start</button>
                <button class="finish-btn" onclick="finishTask(this)">Finish</button>
                <button class="edit-btn" onclick="editTask(this)">Edit</button>
                <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
            `}
        </div>
        <span class="timer-display">${formatTime(task.time)}</span>
    `;

    if (isCompleted) {
        taskElement.setAttribute('data-info', `
            Name: ${task.name}
            Time: ${task.time / 60} minutes
            Urgency: ${task.urgency}
            Importance: ${task.importance}
            Category: ${task.category}
            Deadline: ${task.deadline || 'N/A'}
        `);
        document.getElementById('completed-task-list').appendChild(taskElement);
    } else {
        // Determine the correct section based on urgency and importance
        let sectionId;
        if (task.urgency === 'urgent' && task.importance === 'important') {
            sectionId = 'do-list';
        } else if (task.urgency === 'not-urgent' && task.importance === 'important') {
            sectionId = 'decide-list';
        } else if (task.urgency === 'urgent' && task.importance === 'not-important') {
            sectionId = 'delegate-list';
        } else {
            sectionId = 'delete-list';
        }

        document.getElementById(sectionId).appendChild(taskElement);
    }
}

function formatTime(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const remainingSeconds = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${remainingSeconds}`;
}

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
        // Save the remaining time to local storage
        saveTimersToStorage();
    } else {
        // If timer is paused or not started, start/resume it
        const endTime = new Date().getTime() + timers[taskId].remainingTime * 1000;
        button.textContent = 'Pause';
        button.classList.remove('resumed');
        button.classList.add('paused');

        timers[taskId].interval = setInterval(() => {
            updateCountdownDisplay(taskElement, endTime, taskId);
        }, 1000);
        taskElement.setAttribute('data-status', 'inProgress');
        saveTasksToStorage();
        // Save the end time and remaining time to local storage
        timers[taskId].endTime = endTime;
        saveTimersToStorage();
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
        //taskCompleteSound.play();
        updateProgressBar(); // Update progress bar
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
            Deadline: ${taskElement.getAttribute('data-deadline') || 'N/A'}
        `);
        completedTaskList.appendChild(taskElement);
        taskElement.querySelector('.timer-btn').remove();
        taskElement.querySelector('.finish-btn').remove();
        taskElement.querySelector('.edit-btn').remove();
        taskElement.querySelector('.delete-btn').remove();

        saveTasksToStorage();
    }, 600); // Delay to allow the animation to complete
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
    saveTasksToStorage();
    saveTimersToStorage(); // Save the updated timers to storage
}

function clearCompletedTasks() {
    // Remove all completed tasks from the DOM
    const completedTaskList = document.getElementById('completed-task-list');
    completedTaskList.innerHTML = '';

    // Clear completed tasks from local storage
    localStorage.removeItem('completedTasks');
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
        saveTasksToStorage();
    }
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
            task.style.display = task.getAttribute('data-category') === filterValue ? '' : 'none';
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
                    return new Date(a.getAttribute('data-deadline')) - new Date(b.getAttribute('data-deadline'));
                }
            })
            .forEach(node => list.appendChild(node));
    });
}

function getPriorityValue(task) {
    if (task.getAttribute('data-urgency') === 'urgent' && task.getAttribute('data-importance') === 'important') return 3;
    if (task.getAttribute('data-urgency') === 'not-urgent' && task.getAttribute('data-importance') === 'important') return 2;
    if (task.getAttribute('data-urgency') === 'urgent' && task.getAttribute('data-importance') === 'not-important') return 1;
    return 0;
}

// Tutorial functions
function startTutorial() {
    introJs().setOptions({
        steps: [
            {
                intro: "Welcome to the Task Manager! Let's go through the core features."
            },
            {
                element: '.add-task-btn',
                intro: 'Click here to add a new task.'
            },
            {
                element: '#do-this',
                intro: 'These are urgent and important tasks. Do them immediately to prevent any negative consequences.'
            },
            {
                element: '#decide-this',
                intro: 'These tasks are important but not urgent. Schedule them to be done at a later time.'
            },
            {
                element: '#delegate-this',
                intro: 'These tasks are urgent but not important. Delegate them to others if possible.'
            },
            {
                element: '#delete-this',
                intro: 'These tasks are neither urgent nor important. Consider eliminating them.'
            },
            {
                element: '.filter-sort',
                intro: 'Use these options to filter, sort and search your tasks.'
            },
            {
                element: '.completed-tasks',
                intro: 'Completed tasks will appear here.'
            },
            {
                element: '.header-icon[href="./calendar/calendar.html"]',
                intro: 'Click here to view the calendar.'
            },
            {
                element: '.header-icon[href="./login/login.html"]',
                intro: 'Click here to login.'
            },
            {
                element: '.openbtn',
                intro: 'Click here to open the sidebar menu.'
            },
            {
                element: '.header-icon[onclick="startTutorial()"]',
                intro: 'Click this icon anytime to replay the tutorial. Enjoy ^^ '
            }
        ]
    }).start();
}
