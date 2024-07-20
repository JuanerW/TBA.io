let timers = {}; // Store timers for each task

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
        timers[taskId].interval = null;
    } else {
        // If timer is paused or not started, start/resume it
        const endTime = new Date().getTime() + timers[taskId].remainingTime * 1000;
        button.textContent = 'Pause';

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

    const completedTaskList = document.getElementById('completed-task-list');
    completedTaskList.appendChild(taskElement);

    taskElement.querySelector('.timer-btn').remove();
    taskElement.querySelector('.finish-btn').remove();
    taskElement.querySelector('.edit-btn').remove();
    taskElement.querySelector('.delete-btn').remove();
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
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const taskElement = document.getElementById(data);
    event.target.closest('ul').appendChild(taskElement);
}
