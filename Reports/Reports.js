// Toggle sidebar function
function toggleNav() {
    var sidebar = document.getElementById("mySidebar");
    var main = document.getElementById("main");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        main.style.marginLeft = "0";
    } else {
        sidebar.style.width = "250px";
        main.style.marginLeft = "250px";
    }
}

// Initialize Chart.js pie chart
function loadPieChart(completedTasks, incompleteTasks) {
    var ctx = document.getElementById('taskPieChart').getContext('2d');
    var taskPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Completed Tasks', 'Incomplete Tasks'],
            datasets: [{
                label: 'Task Completion Status',
                data: [completedTasks, incompleteTasks],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.6)',  // Completed (green)
                    'rgba(231, 76, 60, 0.6)'    // Incomplete (red)
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Task Completion Status'
                }
            }
        }
    });

    document.getElementById('completedTasks').textContent = `Completed Tasks: ${completedTasks}`;
    document.getElementById('incompleteTasks').textContent = `Incomplete Tasks: ${incompleteTasks}`;
}

// Example data
var completedTasks = 30;
var incompleteTasks = 20;

// Load the pie chart with example data on window load
window.onload = function() {
    loadPieChart(completedTasks, incompleteTasks);
};
