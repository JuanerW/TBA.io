document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('taskPieChart').getContext('2d');
    const completedTasks = 20; // Example value
    const incompleteTasks = 10; // Example value
    const inProgressTasks = 5; // Example value
    const averageTime = "2 hours"; // Example value
    const commonCategory = "Work"; // Example value
    const doTasks = 8; // Example value
    const decideTasks = 7; // Example value
    const delegateTasks = 9; // Example value
    const deleteTasks = 10; // Example value

    const taskPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Completed Tasks', 'Incomplete Tasks'],
            datasets: [{
                data: [completedTasks, incompleteTasks],
                backgroundColor: ['#00AFB9', '#F07167'],
                hoverBackgroundColor: ['#007D89', '#C14A4E']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    document.getElementById('completedTasks').textContent = `Completed Tasks: ${completedTasks}`;
    document.getElementById('incompleteTasks').textContent = `Incomplete Tasks: ${incompleteTasks}`;
    document.getElementById('inProgressTasks').textContent = `In Progress Tasks: ${inProgressTasks}`;
    document.getElementById('averageTime').textContent = averageTime;
    document.getElementById('commonCategory').textContent = commonCategory;
    document.getElementById('doTasks').textContent = doTasks;
    document.getElementById('decideTasks').textContent = decideTasks;
    document.getElementById('delegateTasks').textContent = delegateTasks;
    document.getElementById('deleteTasks').textContent = deleteTasks;
});

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

function setTimeRange(range) {
    // Placeholder function to handle time range selection
    console.log(`Selected time range: ${range}`);
}
