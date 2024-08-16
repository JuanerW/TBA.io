let timers = {}; // Object to store timers for each task, with task IDs as keys

document.addEventListener('DOMContentLoaded', () => {
    loadSettings(); // Load user interface settings from localStorage
    loadTasksFromStorage(); // Load and display tasks from localStorage when the page loads
    restoreTimersFromStorage(); // Restore task timers from localStorage on page load

    // Event listener for the signup button, redirecting to the homepage
    document.getElementById('signupBtn')?.addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    // Event listener for the task form submission to add a new task
    document.getElementById('taskForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        addTask(); // Add the new task
    });

    // Event listener to close the task modal if the user clicks outside the modal content
    document.getElementById('taskModal').addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            closeTaskModal(); // Close the task modal
        }
    });

    // Apply a fade-in effect to elements like matrix cells, filter options, and the add task button on page load
    document.querySelectorAll('.matrix-cell, .filter-sort, .add-task-btn').forEach(element => {
        element.classList.add('fade-in');
    });

    // Toggle sidebar visibility with a slide-in effect
    document.querySelector('.openbtn').addEventListener('click', () => {
        const sidebar = document.getElementById('mySidebar');
        sidebar.classList.toggle('slide-in'); // Add or remove the 'slide-in' class
    });

    // Event listener to display task information when a completed task is clicked
    document.getElementById('completed-task-list').addEventListener('click', function (event) {
        const taskElement = event.target.closest('.completed-task-item');
        if (taskElement) {
            const taskInfo = taskElement.getAttribute('data-info'); // Retrieve task info
            openTaskInfoModal(taskInfo); // Open the task info modal with the retrieved data
        }
    });

    // Event listener for clearing all completed tasks when the 'Clear' button is clicked
    document.getElementById('clearCompletedTasksBtn')?.addEventListener('click', clearCompletedTasks);

    updateProgressBar(); // Update the progress bar to reflect the completion status of tasks
    document.getElementById('nextQuestionBtn').addEventListener('click', nextQuestion); // Setup event for 'Next Question' button
});

// Function to update the progress bar based on the number of completed tasks
function updateProgressBar() {
    const tasks = document.querySelectorAll('.task'); // All tasks
    const completedTasks = document.querySelectorAll('.task.completed'); // Completed tasks
    const progress = (completedTasks.length / tasks.length) * 100; // Calculate progress as a percentage
    document.getElementById('progress-bar').style.width = progress + '%'; // Update the progress bar width
}

// Function to load user interface settings from localStorage and apply them to the page
function loadSettings() {
    // Default color settings for various UI elements
    const defaultSettings = {
        sidebarColor: '#F07167',
        headerColor: '#F07167',
        backgroundColor: '#FDFCDC',
        doColor: '#FF8C89',
        decideColor: '#FFEDCD',
        delegateColor: '#33D1CC',
        deleteColor: '#3399CC'
    };

    // Load saved settings from localStorage or use default settings if none are saved
    const settings = JSON.parse(localStorage.getItem('settings')) || defaultSettings;

    // Apply the loaded or default settings to the relevant UI elements
    document.querySelector('.sidebar').style.backgroundColor = settings.sidebarColor;
    document.querySelector('.header-container').style.backgroundColor = settings.headerColor;
    document.body.style.backgroundColor = settings.backgroundColor;
    document.querySelector('.primary-color').style.backgroundColor = settings.doColor;
    document.querySelector('.secondary-color').style.backgroundColor = settings.decideColor;
    document.querySelector('.accent-color').style.backgroundColor = settings.delegateColor;
    document.querySelector('.text-color').style.backgroundColor = settings.deleteColor;
}

// Function to toggle the sidebar's visibility
function toggleNav() {
    const sidebar = document.getElementById("mySidebar");
    const main = document.getElementById("main");

    // Check the current width of the sidebar to determine whether to open or close it
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0"; // Close sidebar
        main.style.marginLeft = "0"; // Reset main content margin
    } else {
        sidebar.style.width = "250px"; // Open sidebar
        main.style.marginLeft = "250px"; // Shift main content to accommodate the sidebar
    }
}

// Function to open the task creation modal
function openTaskModal() {
    const taskModal = document.getElementById('taskModal');
    taskModal.style.display = 'block'; // Display the modal
    taskModal.classList.add('fade-in'); // Add fade-in effect for smooth appearance
}

// Function to close the task creation modal
function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none'; // Hide the modal
}

// Function to open the task information modal and display details about the selected task
function openTaskInfoModal(taskInfo) {
    const taskInfoModal = document.getElementById('taskInfoModal');
    const taskInfoElement = document.getElementById('taskInfo');
    taskInfoElement.innerHTML = taskInfo.split('\n').map(info => `<p>${info}</p>`).join(''); // Display task details
    taskInfoModal.style.display = 'block'; // Display the modal
    taskInfoModal.classList.add('fade-in'); // Add fade-in effect
}

// Function to close the task information modal
function closeTaskInfoModal() {
    document.getElementById('taskInfoModal').style.display = 'none'; // Hide the modal
}

// Function to toggle the visibility of the completed tasks list
function toggleCompletedTasks() {
    const completedTaskList = document.getElementById('completed-task-list');
    completedTaskList.classList.toggle('expanded'); // Expand or collapse the completed tasks section
}

// Function to load tasks from localStorage and display them on the page
function loadTasksFromStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Retrieve active tasks
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || []; // Retrieve completed tasks

    // Add each task to the DOM
    tasks.forEach(task => addTaskToDOM(task));
    completedTasks.forEach(task => addTaskToDOM(task, true)); // Mark as completed if necessary
}

// Function to save the current list of tasks to localStorage
function saveTasksToStorage() {
    // Collect and store active tasks
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

    // Collect and store completed tasks
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

    // Save tasks and completed tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

// Function to save active timers for tasks to localStorage
function saveTimersToStorage() {
    localStorage.setItem('timers', JSON.stringify(timers));
}

// Function to restore task timers from localStorage
function restoreTimersFromStorage() {
    const storedTimers = JSON.parse(localStorage.getItem('timers')) || {}; // Retrieve saved timers

    // Restore each timer based on its stored state
    Object.keys(storedTimers).forEach(taskId => {
        const timerData = storedTimers[taskId];
        if (timerData.endTime) {
            const taskElement = document.querySelector(`.task[data-id="${taskId}"]`);
            if (taskElement) {
                const endTime = new Date(timerData.endTime).getTime();
                timers[taskId] = {
                    remainingTime: timerData.remainingTime,
                    interval: setInterval(() => {
                        updateCountdownDisplay(taskElement, endTime, taskId); // Update the timer display
                    }, 1000)
                };
                taskElement.querySelector('.timer-btn').textContent = 'Pause'; // Update button text to 'Pause'
                taskElement.querySelector('.timer-btn').classList.add('paused'); // Add 'paused' class to button
            } else {
                console.error(`Task element with id ${taskId} not found.`); // Log error if task element is missing
            }
        }
    });
}

function addTask() {
    // Retrieve and trim the task details entered by the user
    const taskName = document.getElementById('taskName').value.trim();
    const taskTime = document.getElementById('taskTime').value.trim();
    const taskUrgency = document.getElementById('taskUrgency').value;
    const taskImportance = document.getElementById('taskImportance').value;
    const taskCategory = document.getElementById('taskCategory').value;
    const taskDeadline = document.getElementById('taskDeadline').value; // Get the task deadline

    // Ensure all required fields are filled out before proceeding
    if (!taskName || !taskTime || !taskUrgency || !taskImportance || !taskCategory) {
        return; // Do not submit the form if any required fields are empty
    }

    const taskTimeInSeconds = parseInt(taskTime) * 60; // Convert the task time from minutes to seconds
    const taskId = 'task' + new Date().getTime(); // Generate a unique ID for the task using the current timestamp

    // Create a task object with the collected information
    const task = {
        id: taskId,
        name: taskName,
        time: taskTimeInSeconds,
        urgency: taskUrgency,
        importance: taskImportance,
        category: taskCategory,
        deadline: taskDeadline, // Store the task deadline
        status: 'notStarted'
    };

    addTaskToDOM(task); // Add the new task to the DOM (webpage)
    saveTaskToStorage(task); // Save the task to localStorage

    closeTaskModal(); // Close the task creation modal
    document.getElementById('taskForm').reset(); // Reset the form fields for the next task
}

function saveTaskToStorage(task) {
    // Retrieve existing tasks from localStorage or create an empty array if none exist
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task); // Add the new task to the array
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save the updated tasks array back to localStorage
}

function addTaskToDOM(task, isCompleted = false) {
    const taskElement = document.createElement('li'); // Create a new list item element for the task
    taskElement.classList.add('task', 'fade-in'); // Add the task and fade-in classes for styling and animation
    if (isCompleted) {
        taskElement.classList.add('completed-task-item'); // If the task is completed, add the completed class
    }

    // Set various data attributes on the task element for use later
    taskElement.setAttribute('data-id', task.id);
    taskElement.setAttribute('data-expected-time', task.time);
    taskElement.setAttribute('data-urgency', task.urgency);
    taskElement.setAttribute('data-importance', task.importance);
    taskElement.setAttribute('data-category', task.category);
    taskElement.setAttribute('data-status', task.status);
    taskElement.setAttribute('data-deadline', task.deadline); // Store the deadline as an attribute
    taskElement.setAttribute('draggable', 'true'); // Make the task element draggable
    taskElement.ondragstart = drag; // Attach the drag event listener

    // Construct the inner HTML of the task element, including buttons for task actions
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
        // If the task is completed, store additional info and append it to the completed tasks list
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
        // Determine which task list (do, decide, delegate, delete) to add the task based on its urgency and importance
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

        // Append the task to the appropriate section
        document.getElementById(sectionId).appendChild(taskElement);
    }
}

// Function to format a given time in seconds into a string of the format HH:MM:SS
function formatTime(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0'); // Calculate hours
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0'); // Calculate minutes
    const remainingSeconds = String(seconds % 60).padStart(2, '0'); // Calculate remaining seconds
    return `${hours}:${minutes}:${remainingSeconds}`; // Return the formatted time
}

// Function to toggle the task timer between start, pause, and resume
function toggleTimer(button) {
    const taskElement = button.closest('.task'); // Find the closest task element
    const taskId = taskElement.dataset.id; // Get the task ID from the data attribute

    if (!timers[taskId]) {
        timers[taskId] = { remainingTime: parseInt(taskElement.dataset.expectedTime) }; // Initialize timer if not already set
    }

    if (timers[taskId].interval) {
        // If the timer is running, pause it
        clearInterval(timers[taskId].interval); // Stop the interval
        button.textContent = 'Resume'; // Update button text to 'Resume'
        button.classList.remove('paused');
        button.classList.add('resumed');
        timers[taskId].interval = null; // Clear the interval reference
        saveTimersToStorage(); // Save the remaining time to localStorage
    } else {
        // If the timer is paused or not started, start or resume it
        const endTime = new Date().getTime() + timers[taskId].remainingTime * 1000; // Calculate the end time
        button.textContent = 'Pause'; // Update button text to 'Pause'
        button.classList.remove('resumed');
        button.classList.add('paused');

        // Start the timer interval to update the countdown every second
        timers[taskId].interval = setInterval(() => {
            updateCountdownDisplay(taskElement, endTime, taskId); // Update the countdown display
        }, 1000);
        taskElement.setAttribute('data-status', 'inProgress'); // Mark the task as in progress
        saveTasksToStorage(); // Save the task's new status to localStorage
        timers[taskId].endTime = endTime; // Store the end time in the timer object
        saveTimersToStorage(); // Save the updated timer information to localStorage
    }
}

// Function to open a popup window when the timer reaches zero
function openEndPopup(title) {
    // Open a new popup window with specified dimensions
    const popup = window.open('', 'popupWindow', 'width=400,height=200');

    if (popup) {
        // Write HTML content to the popup window
        popup.document.write(`
            <html>
            <head>
                <title>Task Boost Assistant</title>
                <style>
                    body {
                        background-color: #F07167;
                        color: white;
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding: 20px;
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                <h2>The task called "${title}" has zero minutes left</h2>
            </body>
            </html>
        `);

        popup.document.close(); // Close the document stream to render the content
    } else {
        alert('Unable to open popup window. Please make sure your browser allows popups.'); // Alert the user if popups are blocked
    }
}

// Function to update the countdown display on a task element
function updateCountdownDisplay(taskElement, endTime, taskId) {
    const currentTime = new Date().getTime(); // Get the current time
    let remainingTime = Math.floor((endTime - currentTime) / 1000); // Calculate the remaining time in seconds

    if (remainingTime <= 0) {
        // If the timer has run out, stop the countdown and reset the display
        clearInterval(timers[taskId].interval); // Clear the interval to stop the timer
        taskElement.querySelector('.timer-display').textContent = "00:00:00"; // Reset the display to zero
        taskElement.querySelector('.timer-btn').textContent = "Start"; // Update the button text to 'Start'
        taskElement.querySelector('.timer-display').classList.add('timer-exceeded'); // Add a class to indicate time exceeded
        timers[taskId].remainingTime = 0; // Set the remaining time to zero
        timers[taskId].interval = null; // Clear the interval reference
        return; // Exit the function
    }

    timers[taskId].remainingTime = remainingTime; // Update the remaining time in the timer object

    const hours = String(Math.floor(remainingTime / 3600)).padStart(2, '0'); // Format hours
    const minutes = String(Math.floor((remainingTime % 3600) / 60)).padStart(2, '0'); // Format minutes
    const seconds = String(remainingTime % 60).padStart(2, '0'); // Format seconds

    const timerDisplay = taskElement.querySelector('.timer-display');
    timerDisplay.textContent = `${hours}:${minutes}:${seconds}`; // Update the timer display

    // Check if there is exactly 1 minute (60 seconds) left
    if (remainingTime === 2) { // Assuming task title is in an element with class 'task-title'
        const taskName = taskElement.querySelector('.task-name').textContent;
        openEndPopup(taskName); // Open a popup alerting the user that time is almost up
    }

    if (remainingTime <= parseInt(taskElement.dataset.expectedTime)) {
        timerDisplay.classList.remove('timer-exceeded'); // Remove the exceeded class if the time is within expected
    } else {
        timerDisplay.classList.add('timer-exceeded'); // Add the exceeded class if the time has gone over
    }
}

// Function to mark a task as completed
function finishTask(button) {
    const taskElement = button.closest('.task'); // Find the task element associated with the button
    const taskId = taskElement.dataset.id; // Get the task ID from the data attribute
    clearInterval(timers[taskId]?.interval); // Clear the task's timer if it is running

    // Add visual feedback to indicate the task is completed
    taskElement.classList.add('completed'); // Mark the task as completed
    setTimeout(() => {
        taskElement.classList.add('task-complete'); // Add animation class for smooth transition
        updateProgressBar(); // Update the progress bar to reflect the completed task
    }, 300);

    // After the animation, move the task to the completed tasks list
    setTimeout(() => {
        const completedTaskList = document.getElementById('completed-task-list');
        taskElement.classList.remove('task'); // Remove the 'task' class
        taskElement.classList.add('completed-task-item'); // Add the completed task item class
        taskElement.setAttribute('data-info', `
            Name: ${taskElement.querySelector('.task-name').textContent}
            Time: ${taskElement.getAttribute('data-expected-time') / 60} minutes
            Urgency: ${taskElement.getAttribute('data-urgency')}
            Importance: ${taskElement.getAttribute('data-importance')}
            Category: ${taskElement.getAttribute('data-category')}
            Deadline: ${taskElement.getAttribute('data-deadline') || 'N/A'}
        `);
        completedTaskList.appendChild(taskElement); // Move the task to the completed list
        taskElement.querySelector('.timer-btn').remove(); // Remove task action buttons
        taskElement.querySelector('.finish-btn').remove();
        taskElement.querySelector('.edit-btn').remove();
        taskElement.querySelector('.delete-btn').remove();

        saveTasksToStorage(); // Save the updated task list to localStorage
    }, 600); // Delay to allow the animation to complete
}


function editTask(button) {
    // Find the closest task element related to the clicked button
    const taskElement = button.closest('.task');
    
    // Extract the task details from the DOM elements and data attributes
    const taskName = taskElement.querySelector('.task-name').textContent;
    const taskTime = parseInt(taskElement.getAttribute('data-expected-time')) / 60; // Convert seconds to minutes
    const taskUrgency = taskElement.getAttribute('data-urgency');
    const taskImportance = taskElement.getAttribute('data-importance');
    const taskCategory = taskElement.getAttribute('data-category');

    // Populate the task form fields with the current task's details
    document.getElementById('taskName').value = taskName;
    document.getElementById('taskTime').value = taskTime;
    document.getElementById('taskUrgency').value = taskUrgency;
    document.getElementById('taskImportance').value = taskImportance;
    document.getElementById('taskCategory').value = taskCategory;

    // Open the task modal for editing
    openTaskModal();

    // Delete the old task entry; a new one will be added upon form submission
    deleteTask(button);
}

function deleteTask(button) {
    // Find the closest task element related to the clicked button
    const taskElement = button.closest('.task');
    const taskId = taskElement.dataset.id;

    // Clear the timer interval for the task, if any
    clearInterval(timers[taskId]?.interval);
    
    // Remove the task's timer from the timers object
    delete timers[taskId];
    
    // Remove the task element from the DOM
    taskElement.remove();

    // Save the updated task list and timers to localStorage
    saveTasksToStorage();
    saveTimersToStorage();
}

function clearCompletedTasks() {
    // Clear all completed tasks from the DOM
    const completedTaskList = document.getElementById('completed-task-list');
    completedTaskList.innerHTML = '';

    // Remove completed tasks from localStorage
    localStorage.removeItem('completedTasks');
}

function allowDrop(event) {
    event.preventDefault(); // Allow the item to be dropped
}

function drag(event) {
    // Set the data being dragged, identified by the task ID
    event.dataTransfer.setData("text/plain", event.target.id);
}

function drop(event) {
    event.preventDefault(); // Prevent the default drop action

    // Get the ID of the dragged element
    const data = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(data);

    // Find the closest drop target that is a task list (ul element)
    const dropTarget = event.target.closest('ul');
    if (dropTarget && dropTarget.id.includes('-list')) {
        // Append the dragged element to the new list and save the updated task list to localStorage
        dropTarget.appendChild(draggedElement);
        saveTasksToStorage();
    }
}

function searchTasks() {
    // Get the search value and convert it to lowercase
    const searchValue = document.getElementById('taskSearch').value.toLowerCase();

    // Select all tasks across all quadrants
    const tasks = document.querySelectorAll('.matrix-cell li');

    // Loop through the tasks and show/hide them based on the search value
    tasks.forEach(task => {
        const taskText = task.textContent.toLowerCase();
        task.style.display = taskText.includes(searchValue) ? '' : 'none';
    });
}

function filterTasks() {
    // Get the selected filter value
    const filterValue = document.getElementById('taskFilter').value;

    // Select all tasks across all quadrants
    const tasks = document.querySelectorAll('.matrix-cell li');

    // Loop through the tasks and show/hide them based on the selected category
    tasks.forEach(task => {
        if (filterValue === 'all') {
            task.style.display = '';
        } else {
            task.style.display = task.getAttribute('data-category') === filterValue ? '' : 'none';
        }
    });
}

function sortTasks() {
    // Get the selected sort option (priority or deadline)
    const sortValue = document.getElementById('taskSort').value;

    // Define the IDs of the task lists to be sorted
    const lists = ['do-list', 'decide-list', 'delegate-list', 'delete-list'];

    // Loop through each task list and sort the tasks based on the selected option
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
            .forEach(node => list.appendChild(node)); // Re-append the sorted tasks to the list
    });
}

// Function to determine the priority value of a task based on its urgency and importance
function getPriorityValue(task) {
    if (task.getAttribute('data-urgency') === 'urgent' && task.getAttribute('data-importance') === 'important') return 3;
    if (task.getAttribute('data-urgency') === 'not-urgent' && task.getAttribute('data-importance') === 'important') return 2;
    if (task.getAttribute('data-urgency') === 'urgent' && task.getAttribute('data-importance') === 'not-important') return 1;
    return 0;
}

// Arrays containing questions for quick and detailed assessments
const quickQuestions = [
    { question: "Does this task have a strict deadline that must be met?", type: "both" },
    { question: "Will completing this task have a significant impact on achieving your goals?", type: "importance" },
    { question: "Can this task be delegated to someone else without major issues?", type: "urgency" }
];

const longQuestions = [
    { question: "Does this task have a strict deadline that must be met?", type: "both" },
    { question: "Will completing this task have a significant impact on achieving your goals?", type: "importance" },
    { question: "Can this task be delegated to someone else without major issues?", type: "urgency" },
    { question: "Will delaying this task cause negative consequences?", type: "urgency" },
    { question: "Is this task required to meet a commitment made to others?", type: "importance" },
    { question: "Will this task help you avoid future problems or crises?", type: "both" },
    { question: "Is this task directly related to your core responsibilities?", type: "importance" },
    { question: "Will completing this task significantly improve your efficiency or productivity?", type: "importance" },
    { question: "Will this task contribute to long-term success or strategic goals?", type: "importance" },
    { question: "Is this task dependent on the completion of other tasks?", type: "urgency" }
];

let currentQuestions = []; // Array to hold the current set of questions
let currentQuestionIndex = 0; // Index of the current question
let importanceScore = 0; // Score for task importance
let urgencyScore = 0; // Score for task urgency

function openTaskModal() {
    // Open the task creation modal
    document.getElementById('taskModal').style.display = 'block';
}

function closeTaskModal() {
    // Close the task creation modal
    document.getElementById('taskModal').style.display = 'none';
}

function openAssessmentChoices(type) {
    // Close the task modal and open the assessment choices modal
    closeTaskModal();
    document.getElementById('assessmentChoicesModal').style.display = 'block';
    document.getElementById('assessmentChoicesModal').dataset.type = type; // Store the type of assessment in the modal's data attribute
}

function closeAssessmentChoices() {
    // Close the assessment choices modal and reopen the task modal
    document.getElementById('assessmentChoicesModal').style.display = 'none';
    openTaskModal();
}

function openQuickAssessment() {
    // Start the quick assessment
    currentQuestions = quickQuestions;
    closeAssessmentChoices();
    openModal();
}

function openLongAssessment() {
    // Start the detailed assessment
    currentQuestions = longQuestions;
    closeAssessmentChoices();
    openModal();
}

function openModal() {
    // Open the assessment modal and display the first question
    document.getElementById('importanceUrgencyModal').style.display = 'block';
    showQuestion();
}

function closeModal() {
    // Close the assessment modal and reset variables
    document.getElementById('importanceUrgencyModal').style.display = 'none';
    currentQuestionIndex = 0;
    importanceScore = 0;
    urgencyScore = 0;
}

function showQuestion() {
    // Display the current question in the modal
    document.getElementById('question-container').innerText = currentQuestions[currentQuestionIndex].question;
    document.getElementById('question-number').innerText = `Question ${currentQuestionIndex + 1}/${currentQuestions.length}`;
    document.getElementById('nextQuestionBtn').style.display = 'none'; // Hide the "Next" button until the question is answered
}

function answerQuestion(answer) {
    // Update the scores based on the user's answer
    const questionType = currentQuestions[currentQuestionIndex].type;
    if (answer === 'yes') {
        if (questionType === 'importance') {
            importanceScore++;
        } else if (questionType === 'urgency') {
            urgencyScore++;
        } else if (questionType === 'both') {
            importanceScore++;
            urgencyScore++;
        }
    }
    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuestions.length) {
        // If there are more questions, show the next one
        showQuestion();
    } else {
        // If the assessment is complete, display the result
        displayResult();
        closeModal();
    }
}

function displayResult() {
    // Determine the urgency and importance of the task based on the scores
    const suggestion = determineImportanceUrgency();
    document.getElementById('resultText').innerText = `Based on your answers, the task is: ${suggestion}`;
    openResultModal();
}

function determineImportanceUrgency() {
    const totalQuestions = currentQuestions.length;
    const importancePercentage = (importanceScore / totalQuestions) * 100;
    const urgencyPercentage = (urgencyScore / totalQuestions) * 100;

    // Return a suggestion based on the percentage scores
    if (importancePercentage >= 50 && urgencyPercentage >= 50) {
        return "Urgent and Important";
    } else if (importancePercentage >= 50) {
        return "Important but Not Urgent";
    } else if (urgencyPercentage >= 50) {
        return "Urgent but Not Important";
    } else {
        return "Not Urgent and Not Important";
    }
}

function openResultModal() {
    // Open the result modal to display the assessment result
    document.getElementById('resultModal').style.display = 'block';
}

function closeResultModal() {
    // Close the result modal
    document.getElementById('resultModal').style.display = 'none';
}

// Tutorial functions to guide users through the app's features
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
                element: '.header-icon[href="./Calendar/calendar.html"]',
                intro: 'Click here to view the calendar.'
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
