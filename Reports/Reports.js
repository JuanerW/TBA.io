document.addEventListener('DOMContentLoaded', () => {
    loadTaskData();
});

function loadTaskData() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

    const doTasks = tasks.filter(task => task.urgency === 'urgent' && task.importance === 'important').length;
    const decideTasks = tasks.filter(task => task.urgency === 'not-urgent' && task.importance === 'important').length;
    const delegateTasks = tasks.filter(task => task.urgency === 'urgent' && task.importance === 'not-important').length;
    const deleteTasks = tasks.filter(task => task.urgency === 'not-urgent' && task.importance === 'not-important').length;

    document.getElementById('doTasks').textContent = doTasks;
    document.getElementById('decideTasks').textContent = decideTasks;
    document.getElementById('delegateTasks').textContent = delegateTasks;
    document.getElementById('deleteTasks').textContent = deleteTasks;

    const inProgressTasks = tasks.filter(task => task.status === 'inProgress').length;
    const notStartedTasks = tasks.length - inProgressTasks;
    const completedTaskCount = completedTasks.length;

    document.getElementById('completedTasks').textContent = `Completed Tasks: ${completedTaskCount}`;
    document.getElementById('incompleteTasks').textContent = `Not Started Tasks: ${notStartedTasks}`;
    document.getElementById('inProgressTasks').textContent = `In Progress Tasks: ${inProgressTasks}`;

    const taskCompletionTimes = completedTasks.map(task => task.time);
    const averageCompletionTime = taskCompletionTimes.length ? taskCompletionTimes.reduce((a, b) => a + b, 0) / taskCompletionTimes.length : 0;
    document.getElementById('averageTime').textContent = `${(averageCompletionTime / 60).toFixed(2)} min`;

    const categories = tasks.map(task => task.category);
    const categoryCounts = categories.reduce((acc, category) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    const mostCommonCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b, '');
    document.getElementById('commonCategory').textContent = mostCommonCategory;

    generatePieChart(completedTaskCount, inProgressTasks, notStartedTasks);
}

function generatePieChart(completedTasks, inProgressTasks, notStartedTasks) {
    const ctx = document.getElementById('taskPieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Completed Tasks', 'In Progress Tasks', 'Not Started Tasks'],
            datasets: [{
                data: [completedTasks, inProgressTasks, notStartedTasks],
                backgroundColor: ['#00AFB9', '#F07167', '#FFD166'],
                hoverBackgroundColor: ['#007D89', '#C14A4E', '#D8A73C']
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

function setTimeRange(range) {
    // Placeholder function to handle time range selection
    console.log(`Selected time range: ${range}`);
}
