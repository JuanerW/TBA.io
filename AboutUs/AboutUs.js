// Open and close sidebar function
function toggleNav() {
    var sidebar = document.getElementById("mySidebar");
    var main = document.getElementById("main");

    // Check if the sidebar is currently open (width is 250px)
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0"; // Close the sidebar
        main.style.marginLeft = "0"; // Reset the main content margin
    } else {
        sidebar.style.width = "250px"; // Open the sidebar
        main.style.marginLeft = "250px"; // Adjust the main content margin
    }
}

// Open the contact form modal (if you add a modal for the contact form)
function openContactModal() {
    document.getElementById('contactModal').style.display = 'block'; // Display the modal
}

// Close the contact form modal
function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none'; // Hide the modal
}

// Add a task to the task list (if applicable, similar to what you did on the home page)
function addTask() {
    const taskName = document.getElementById('taskName').value; // Get the task name from input
    const taskTime = document.getElementById('taskTime').value; // Get the task time from input
    const taskUrgency = document.getElementById('taskUrgency').value; // Get the task urgency from input
    const taskImportance = document.getElementById('taskImportance').value; // Get the task importance from input
    const taskCategory = document.getElementById('taskCategory').value; // Get the task category from input

    const task = document.createElement('li'); // Create a new list item for the task
    task.textContent = `${taskName} - ${taskTime} min`; // Set the task's text content

    // Apply color based on the task category
    switch (taskCategory) {
        case 'work':
            task.style.color = 'blue'; // Work tasks are blue
            break;
        case 'personal':
            task.style.color = 'green'; // Personal tasks are green
            break;
        case 'other':
            task.style.color = 'gray'; // Other tasks are gray
            break;
    }

    // Create and append the Edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit'; // Set button text
    editButton.onclick = function() { editTask(task) }; // Assign the editTask function to the button's click event
    task.appendChild(editButton); // Add the Edit button to the task

    // Create and append the Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete'; // Set button text
    deleteButton.onclick = function() { deleteTask(task) }; // Assign the deleteTask function to the button's click event
    task.appendChild(deleteButton); // Add the Delete button to the task

    // Determine which list the task should go to based on importance and urgency
    if (taskImportance === 'important' && taskUrgency === 'urgent') {
        document.getElementById('do-list').appendChild(task); // Add to "Do" list
    } else if (taskImportance === 'important' && taskUrgency === 'not-urgent') {
        document.getElementById('decide-list').appendChild(task); // Add to "Decide" list
    } else if (taskImportance === 'not-important' && taskUrgency === 'urgent') {
        document.getElementById('delegate-list').appendChild(task); // Add to "Delegate" list
    } else {
        document.getElementById('delete-list').appendChild(task); // Add to "Delete" list
    }

    closeTaskModal(); // Close the task modal after adding the task
    document.getElementById('taskForm').reset(); // Reset the form fields
}

// Edit a task
function editTask(task) {
    const taskDetails = task.firstChild.textContent.split(' - '); // Split the task content into name and time
    const taskName = taskDetails[0]; // Extract the task name
    const taskTime = parseInt(taskDetails[1]); // Extract and convert the task time

    document.getElementById('taskName').value = taskName; // Populate the task name in the form
    document.getElementById('taskTime').value = taskTime; // Populate the task time in the form
    openTaskModal(); // Open the task modal for editing

    deleteTask(task); // Remove the original task after opening the modal
}

// Delete a task
function deleteTask(task) {
    task.parentNode.removeChild(task); // Remove the task from the list
}

// Load settings from localStorage
function loadSettings() {
    const defaultSettings = {
        sidebarColor: '#F07167', // Default sidebar color
        headerColor: '#F07167', // Default header color
        backgroundColor: '#FDFCDC' // Default background color
    };

    // Retrieve settings from localStorage or use default settings if none exist
    const settings = JSON.parse(localStorage.getItem('settings')) || defaultSettings;

    // Apply the loaded or default settings to the page elements
    document.querySelector('.sidebar').style.backgroundColor = settings.sidebarColor;
    document.querySelector('.header-container').style.backgroundColor = settings.headerColor;
    document.body.style.backgroundColor = settings.backgroundColor;
}

// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadSettings(); // Load and apply settings from localStorage when the page loads
});
