// JavaScript to handle JSON data

// Fetch data from JSON file
function fetchData() {
  fetch('path/to/your/tba_data.json')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      displayTasks(data.tasks);
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Display tasks on the web page
function displayTasks(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const listItem = document.createElement('li');
    listItem.textContent = `${task.title} - ${task.status}`;
    taskList.appendChild(listItem);
  });
}

// Add a new task
function addTask(newTask) {
  fetch('path/to/your/tba_data.json')
    .then(response => response.json())
    .then(data => {
      data.tasks.push(newTask);
      saveData(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Save modified data back to JSON file (requires server-side handling)
function saveData(data) {
  fetch('path/to/your/tba_data.json', {
    method: 'POST', // or PUT
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => console.log('Data saved:', result))
  .catch(error => console.error('Error saving data:', error));
}

// Call fetchData when the page loads
document.addEventListener('DOMContentLoaded', fetchData);

//path:  asserts/js/dataHandlers.js