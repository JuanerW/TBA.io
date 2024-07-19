let timers = {}; // Store timers for each task

function toggleTimer(button) {
    const taskElement = button.closest('.task');
    const taskId = taskElement.dataset.id;

    if (timers[taskId]) {
        clearInterval(timers[taskId].interval);
        button.textContent = 'Start';
        timers[taskId].paused = true;
    } else {
        const remainingTime = timers[taskId]?.remainingTime || parseInt(taskElement.dataset.expectedTime); // Expected time in seconds
        const endTime = new Date().getTime() + remainingTime * 1000;
        button.textContent = 'Pause';

        timers[taskId] = {
            interval: setInterval(() => updateCountdownDisplay(taskElement, endTime, taskId), 1000),
            endTime: endTime,
            remainingTime: remainingTime
        };
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
