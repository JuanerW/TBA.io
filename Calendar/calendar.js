// Calendar Page Script

document.addEventListener('DOMContentLoaded', function () {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let currentDate = new Date();
    
    function isLeapYear(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }

    function getDaysInMonth(month, year) {
        if (month === 1 && isLeapYear(year)) {
            return 29;
        }
        return daysInMonth[month];
    }


    function fetchTasks() {
        try {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            console.log("Tasks fetched successfully:", tasks); 
            return tasks;

        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            return [];
        }
    }

    function renderTasks(tasks, year, month) {
        console.log("Rendering tasks for year:", year, " month:", month); 
        tasks.forEach(task => {

            const taskDate = new Date(task.deadline); // Use the task deadline


            console.log("Checking task:", task); 
            if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
                const day = taskDate.getDate();
                const cell = document.querySelector(`#calendarBody td[data-day="${day}"]`);
                if (cell) {
                    const taskDiv = document.createElement('div');
                    taskDiv.classList.add('task');

                    taskDiv.textContent = `${task.name}`; // Only show the task name
                    
                    const taskDetails = document.createElement('div');
                    taskDetails.classList.add('task-details');
                    taskDetails.style.display = 'none'; // Hide details by default
                    taskDetails.innerHTML = `
                        <strong>Time:</strong> ${task.time / 60} minutes<br>

                    

                        <strong>Urgency:</strong> ${task.urgency}<br>
                        <strong>Importance:</strong> ${task.importance}<br>
                        <strong>Category:</strong> ${task.category}
                    `;
                    taskDiv.appendChild(taskDetails);
                    

                    taskDiv.addEventListener('click', () => {
                        taskDetails.style.display = taskDetails.style.display === 'none' ? 'block' : 'none';
                    });
                    

                    cell.appendChild(taskDiv);
                }
            }
        });
    }

    async function renderCalendar(date) {
        const month = date.getMonth();
        const year = date.getFullYear();
        const firstDay = new Date(year, month, 1).getDay();
        const days = getDaysInMonth(month, year);

        document.getElementById('month').textContent = monthNames[month];
        document.getElementById('year').textContent = year;

        const calendarBody = document.getElementById('calendarBody');
        calendarBody.innerHTML = '';

        let row = document.createElement('tr');
        for (let i = 0; i < firstDay; i++) {
            let cell = document.createElement('td');
            cell.classList.add('inactive');
            row.appendChild(cell);
        }

        for (let day = 1; day <= days; day++) {
            if (row.children.length === 7) {
                calendarBody.appendChild(row);
                row = document.createElement('tr');
            }

            let cell = document.createElement('td');
            cell.textContent = day;
            cell.dataset.day = day;
            row.appendChild(cell);
        }

        while (row.children.length < 7) {
            let cell = document.createElement('td');
            cell.classList.add('inactive');
            row.appendChild(cell);
        }

        calendarBody.appendChild(row);


        const tasks = fetchTasks();

        renderTasks(tasks, year, month);
    }

    function populateDatePicker() {
        const monthSelect = document.getElementById('monthSelect');
        const yearSelect = document.getElementById('yearSelect');

        monthSelect.innerHTML = '';
        yearSelect.innerHTML = '';

        monthNames.forEach((month, index) => {
            let option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            monthSelect.appendChild(option);
        });

        for (let year = 1900; year <= 2100; year++) {
            let option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }

        monthSelect.value = currentDate.getMonth();
        yearSelect.value = currentDate.getFullYear();
    }

    document.getElementById('prevMonth').addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    document.getElementById('nextMonth').addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    document.getElementById('openPicker').addEventListener('click', function () {
        document.getElementById('datePicker').style.display = 'block';
        populateDatePicker();
    });

    document.getElementById('setDate').addEventListener('click', function () {
        const month = document.getElementById('monthSelect').value;
        const year = document.getElementById('yearSelect').value;
        currentDate.setMonth(month);
        currentDate.setFullYear(year);
        renderCalendar(currentDate);
        document.getElementById('datePicker').style.display = 'none';
    });


    
    document.getElementById('homeButton').addEventListener('click', function () {
        window.location.href = '../index.html'; 

    });

    renderCalendar(currentDate);
});
