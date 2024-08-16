// Calendar Page Script

// Wait until the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {
    // Array containing the names of each month
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    // Array specifying the number of days in each month (February is 28 days, not accounting for leap years)
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Get the current date
    let currentDate = new Date();
    
    // Function to determine if a given year is a leap year
    function isLeapYear(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }

    // Function to get the number of days in a specific month and year
    function getDaysInMonth(month, year) {
        if (month === 1 && isLeapYear(year)) { // Check if February in a leap year
            return 29;
        }
        return daysInMonth[month];
    }

    // Function to fetch tasks from localStorage
    function fetchTasks() {
        try {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Retrieve tasks or default to an empty array
            console.log("Tasks fetched successfully:", tasks); // Log the tasks
            return tasks;

        } catch (error) {
            console.error("Failed to fetch tasks:", error); // Log any errors
            return []; // Return an empty array in case of an error
        }
    }

    // Function to render tasks on the calendar
    function renderTasks(tasks, year, month) {
        console.log("Rendering tasks for year:", year, " month:", month); // Log the rendering process
        tasks.forEach(task => {
            const taskDate = new Date(task.deadline); // Use the task deadline for date comparison

            console.log("Checking task:", task); // Log the task being processed
            if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
                const day = taskDate.getDate(); // Get the day of the task
                const cell = document.querySelector(`#calendarBody td[data-day="${day}"]`); // Find the corresponding cell in the calendar
                if (cell) {
                    const taskDiv = document.createElement('div'); // Create a div for the task
                    taskDiv.classList.add('task'); // Add a class for styling

                    taskDiv.textContent = `${task.name}`; // Display only the task name

                    const taskDetails = document.createElement('div'); // Create a div for task details
                    taskDetails.classList.add('task-details'); // Add a class for styling
                    taskDetails.style.display = 'none'; // Hide details by default
                    taskDetails.innerHTML = `
                        <strong>Time:</strong> ${task.time / 60} minutes<br>
                        <strong>Urgency:</strong> ${task.urgency}<br>
                        <strong>Importance:</strong> ${task.importance}<br>
                        <strong>Category:</strong> ${task.category}
                    `; // Add task details to the innerHTML

                    taskDiv.appendChild(taskDetails); // Append details to the task div

                    // Toggle display of task details on click
                    taskDiv.addEventListener('click', () => {
                        taskDetails.style.display = taskDetails.style.display === 'none' ? 'block' : 'none';
                    });

                    cell.appendChild(taskDiv); // Append the task to the corresponding day cell
                }
            }
        });
    }

    // Function to render the calendar for a specific date
    async function renderCalendar(date) {
        const month = date.getMonth(); // Get the current month
        const year = date.getFullYear(); // Get the current year
        const firstDay = new Date(year, month, 1).getDay(); // Get the day of the week for the first day of the month
        const days = getDaysInMonth(month, year); // Get the number of days in the month

        document.getElementById('month').textContent = monthNames[month]; // Update the displayed month name
        document.getElementById('year').textContent = year; // Update the displayed year

        const calendarBody = document.getElementById('calendarBody'); // Get the table body element
        calendarBody.innerHTML = ''; // Clear any existing rows

        let row = document.createElement('tr'); // Start a new row
        for (let i = 0; i < firstDay; i++) {
            let cell = document.createElement('td'); // Create empty cells for days before the first of the month
            cell.classList.add('inactive'); // Add a class to style inactive days
            row.appendChild(cell); // Append the cell to the row
        }

        for (let day = 1; day <= days; day++) {
            if (row.children.length === 7) { // Check if the row is full
                calendarBody.appendChild(row); // Append the row to the table body
                row = document.createElement('tr'); // Start a new row
            }

            let cell = document.createElement('td'); // Create a cell for each day of the month
            cell.textContent = day; // Set the day number as cell content
            cell.dataset.day = day; // Add a data attribute for the day
            row.appendChild(cell); // Append the cell to the row
        }

        while (row.children.length < 7) { // Fill in any remaining cells in the last row
            let cell = document.createElement('td'); // Create an empty cell
            cell.classList.add('inactive'); // Add a class to style inactive days
            row.appendChild(cell); // Append the cell to the row
        }

        calendarBody.appendChild(row); // Append the final row to the table body

        const tasks = fetchTasks(); // Fetch tasks from localStorage
        renderTasks(tasks, year, month); // Render tasks on the calendar
    }

    // Function to populate the date picker dropdowns
    function populateDatePicker() {
        const monthSelect = document.getElementById('monthSelect'); // Get the month select element
        const yearSelect = document.getElementById('yearSelect'); // Get the year select element

        monthSelect.innerHTML = ''; // Clear existing options
        yearSelect.innerHTML = ''; // Clear existing options

        monthNames.forEach((month, index) => {
            let option = document.createElement('option'); // Create a new option element
            option.value = index; // Set the option value to the month index
            option.textContent = month; // Set the option text to the month name
            monthSelect.appendChild(option); // Append the option to the month select
        });

        for (let year = 1900; year <= 2100; year++) { // Populate year dropdown from 1900 to 2100
            let option = document.createElement('option'); // Create a new option element
            option.value = year; // Set the option value to the year
            option.textContent = year; // Set the option text to the year
            yearSelect.appendChild(option); // Append the option to the year select
        }

        monthSelect.value = currentDate.getMonth(); // Set the current month as the selected option
        yearSelect.value = currentDate.getFullYear(); // Set the current year as the selected option
    }

    // Event listener for the "Previous Month" button
    document.getElementById('prevMonth').addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1); // Decrease the month by 1
        renderCalendar(currentDate); // Re-render the calendar with the new month
    });

    // Event listener for the "Next Month" button
    document.getElementById('nextMonth').addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1); // Increase the month by 1
        renderCalendar(currentDate); // Re-render the calendar with the new month
    });

    // Event listener for the "Open Picker" button
    document.getElementById('openPicker').addEventListener('click', function () {
        document.getElementById('datePicker').style.display = 'block'; // Show the date picker modal
        populateDatePicker(); // Populate the date picker dropdowns
    });

    // Event listener for the "Set Date" button in the date picker
    document.getElementById('setDate').addEventListener('click', function () {
        const month = document.getElementById('monthSelect').value; // Get the selected month
        const year = document.getElementById('yearSelect').value; // Get the selected year
        currentDate.setMonth(month); // Set the calendar to the selected month
        currentDate.setFullYear(year); // Set the calendar to the selected year
        renderCalendar(currentDate); // Re-render the calendar with the selected date
        document.getElementById('datePicker').style.display = 'none'; // Hide the date picker modal
    });

    // Event listener for the "Home" button
    document.getElementById('homeButton').addEventListener('click', function () {
        window.location.href = '../index.html'; // Redirect to the home page
    });

    // Initial render of the calendar
    renderCalendar(currentDate);
});
