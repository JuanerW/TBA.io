document.addEventListener('DOMContentLoaded', () => {
    loadTaskData();
    loadSettings(); // Load settings from localStorage
});
//Changing color with difference vector
function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}
function applyDifference(baseColor, diffVector) {
    let [r, g, b] = hexToRgb(baseColor);
    let [dr, dg, db] = diffVector;

    r = Math.min(255, Math.max(0, r + dr));
    g = Math.min(255, Math.max(0, g + dg));
    b = Math.min(255, Math.max(0, b + db));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function loadSettings() {
    const defaultSettings = {
        sidebarColor: '#F07167',
        headerColor: '#F07167',
        backgroundColor: '#FDFCDC',
        doColor: '#FF8C89',
        decideColor: '#FFEDCD',
        delegateColor: '#33D1CC',
        deleteColor: '#3399CC',
        CompleteColor: '#00AFB9',
        InProgressColor: '#F07167',
        NotStartColor: '#FFD166'
    };
    const settings = JSON.parse(localStorage.getItem('settings')) || defaultSettings;
    document.querySelector('.sidebar').style.backgroundColor = settings.sidebarColor;
    document.querySelector('.header-container').style.backgroundColor = settings.headerColor;


    document.body.style.backgroundColor = settings.backgroundColor;

    document.querySelector('.category-box.do').style.backgroundColor = applyDifference(settings.doColor, [-15, -27, -34]);
    document.querySelector('.category-box.decide').style.backgroundColor = applyDifference(settings.decideColor, [-1, -20, -22]);
    document.querySelector('.category-box.delegate').style.backgroundColor = applyDifference(settings.delegateColor, [-51, -34, -19]);
    document.querySelector('.category-box.delete').style.backgroundColor = applyDifference(settings.deleteColor, [-51, -24, -37]);

}

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

    generateCompletionReport(tasks, completedTaskCount, inProgressTasks, notStartedTasks, averageCompletionTime, mostCommonCategory, taskCompletionTimes);

}

function generateCompletionReport(tasks, completedTasks, inProgressTasks, notStartedTasks, averageCompletionTime, mostCommonCategory, taskCompletionTimes) {
    const totalTasks = completedTasks + inProgressTasks + notStartedTasks;
    let report = '';

    if (totalTasks === 0) {
        const messages = [
            'You currently have no tasks.<br><br>It\'s a great time to plan new goals and take action!<br><br>Consider what you want to achieve in the coming days, and start setting some actionable tasks.<br><br>Remember, starting small can lead to big changes!',
            'No tasks are present at the moment.<br><br>This could be the perfect opportunity to reflect on your goals and set new ones.<br><br>What are some things you\'ve been wanting to accomplish?<br><br>Now is a great time to map out your plans and start taking steps forward.',
            'Your task list is empty, which means you have a clean slate to work with.<br><br>Use this opportunity to think about both your short-term and long-term objectives.<br><br>Planning ahead can set the stage for future success, so why not start today?'
        ];
        report = messages[Math.floor(Math.random() * messages.length)];
    } else {
        const completionRate = ((completedTasks / totalTasks) * 100).toFixed(2);

        if (completionRate >= 90) {
            const messages = [
                `Fantastic job! You have completed ${completedTasks} out of ${totalTasks} tasks, achieving an outstanding completion rate of ${completionRate}%.<br><br>Keep up the great work, your productivity is truly inspiring!<br><br>Remember to take breaks and celebrate your success!<br><br>Reflect on what strategies have worked for you so far, and consider how you can maintain this momentum.`,
                `Amazing work! You've successfully completed ${completedTasks} out of ${totalTasks} tasks.<br><br>Your completion rate of ${completionRate}% is exceptional.<br><br>Celebrate your success and maintain this high level of productivity!<br><br>Think about setting even more challenging goals, as you're clearly capable of achieving them.`,
                `Incredible effort! You've finished ${completedTasks} of ${totalTasks} tasks, with an impressive completion rate of ${completionRate}%.<br><br>Keep pushing forward and enjoy the rewards of your hard work!<br><br>Use this success as motivation to tackle new challenges and continue growing.`
            ];
            report = messages[Math.floor(Math.random() * messages.length)];
        } else if (completionRate >= 70) {
            const messages = [
                `Well done! You have completed ${completedTasks} out of ${totalTasks} tasks, with a solid completion rate of ${completionRate}%.<br><br>You're on the right track, keep pushing forward and aim even higher!<br><br>Remember, every step forward is progress!<br><br>Consider what you can do to improve your productivity further, and don't hesitate to adjust your strategies as needed.`,
                `Great progress! You've completed ${completedTasks} out of ${totalTasks} tasks, achieving a completion rate of ${completionRate}%.<br><br>Stay focused and continue striving for excellence!<br><br>Reflect on your current practices and identify areas where you can optimize your workflow.`,
                `Good job! With a completion rate of ${completionRate}%, having completed ${completedTasks} out of ${totalTasks} tasks, you are progressing well.<br><br>Keep the momentum going by setting clear goals and maintaining a positive attitude.<br><br>Remember, consistency is key to achieving your goals.`
            ];
            report = messages[Math.floor(Math.random() * messages.length)];
        } else if (completionRate >= 50) {
            const messages = [
                `Good start! You have completed ${completedTasks} out of ${totalTasks} tasks, with a completion rate of ${completionRate}%.<br><br>There\'s room for improvement, but you\'re off to a good start.<br><br>Focus on time management to boost your efficiency!<br><br>Every small effort adds up to big results!<br><br>Consider breaking your tasks into smaller, more manageable parts to make progress more visible.`,
                `Nice effort! Completing ${completedTasks} out of ${totalTasks} tasks shows a completion rate of ${completionRate}%.<br><br>Focus on enhancing your time management skills to boost your productivity further.<br><br>Look at where you spend most of your time and identify any areas where you might be able to streamline or delegate tasks.`,
                `Decent progress! You've completed ${completedTasks} of ${totalTasks} tasks, resulting in a ${completionRate}% completion rate.<br><br>Keep improving and strive for higher efficiency!<br><br>Think about adopting new productivity techniques or tools that might help you work more effectively.`
            ];
            report = messages[Math.floor(Math.random() * messages.length)];
        } else {
            const messages = [
                `Keep going! You have completed ${completedTasks} out of ${totalTasks} tasks, with a completion rate of ${completionRate}%.<br><br>Don't be discouraged; with better planning and focus, you can definitely catch up and succeed!<br><br>Believe in yourself and keep moving forward!<br><br>Consider reviewing your goals and ensuring they are realistic and achievable within your current schedule.`,
                `Stay motivated! Completing ${completedTasks} out of ${totalTasks} tasks shows a completion rate of ${completionRate}%.<br><br>Stay positive and work on your planning to improve your results.<br><br>It might help to prioritize tasks and focus on the most impactful ones first.`,
                `Don't give up! You've completed ${completedTasks} of ${totalTasks} tasks, achieving a ${completionRate}% completion rate.<br><br>Focus on planning and organization to improve your performance.<br><br>Remember, every setback is an opportunity to learn and grow.<br><br>Keep pushing yourself, and you'll find your stride.`
            ];
            report = messages[Math.floor(Math.random() * messages.length)];
        }
    }

    document.getElementById('completionReport').innerHTML = `${report}`;
}





function generatePieChart(completedTasks, inProgressTasks, notStartedTasks) {
    const defaultSettings = {
        sidebarColor: '#F07167',
        headerColor: '#F07167',
        backgroundColor: '#FDFCDC',
        doColor: '#FF8C89',
        decideColor: '#FFEDCD',
        delegateColor: '#33D1CC',
        deleteColor: '#3399CC',
        CompleteColor: '#00AFB9',
        InProgressColor: '#F07167',
        NotStartColor: '#FFD166'
    };

    // Load settings from localStorage or use default settings
    const settings = JSON.parse(localStorage.getItem('settings')) || defaultSettings;

    // Retrieve colors from settings
    const CompleteColors = settings.CompleteColor;
    const InProgressColors = settings.InProgressColor;
    const NotStartColors = settings.NotStartColor;

    // Debugging output to ensure colors are correctly assigned
    console.log('CompleteColors:', CompleteColors);
    console.log('InProgressColors:', InProgressColors);
    console.log('NotStartColors:', NotStartColors);

    const ctx = document.getElementById('taskPieChart').getContext('2d');

    if (ctx) {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Completed Tasks', 'In Progress Tasks', 'Not Started Tasks'],
                datasets: [{
                    data: [completedTasks, inProgressTasks, notStartedTasks],
                    backgroundColor: [CompleteColors, InProgressColors, NotStartColors],
                    hoverBackgroundColor: [
                        applyDifference(CompleteColors, [-15, -27, -34]), 
                        applyDifference(InProgressColors, [-15, -27, -34]), 
                        applyDifference(NotStartColors, [-15, -27, -34])
                    ]
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
    } else {
        console.error('Failed to get canvas context for pie chart');
    }
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
function showModal() {
    generateReportTable();
    const modal = document.getElementById('reportModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('reportModal');
    modal.style.display = 'none';
}

function exportToPDF() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    doc.text('Task Report', 10, 10);
    doc.text('Tasks:', 10, y);
    y += 10;

    tasks.forEach((task, index) => {
        doc.text(`Task ${index + 1}: ${task.name}`, 10, y);
        y += 10;
        doc.text(`Time: ${task.time} min, Importance: ${task.importance}, Urgency: ${task.urgency}`, 10, y);
        y += 10;
    });

    y += 10;
    doc.text('Completed Tasks:', 10, y);
    y += 10;

    completedTasks.forEach((task, index) => {
        doc.text(`Completed Task ${index + 1}: ${task.name}`, 10, y);
        y += 10;
        doc.text(`Time: ${task.time} min, Importance: ${task.importance}, Urgency: ${task.urgency}`, 10, y);
        y += 10;
    });

    y += 10;
    const inProgressTasks = tasks.filter(task => task.status === 'inProgress').length;
    const notStartedTasks = tasks.length - inProgressTasks;
    const completedTaskCount = completedTasks.length;
    const taskCompletionTimes = completedTasks.map(task => task.time);
    const averageCompletionTime = taskCompletionTimes.length ? taskCompletionTimes.reduce((a, b) => a + b, 0) / taskCompletionTimes.length : 0;
    const categories = tasks.map(task => task.category);
    const categoryCounts = categories.reduce((acc, category) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});
    const mostCommonCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b, '');

    doc.text(`Completed Tasks: ${completedTaskCount}`, 10, y);
    y += 10;
    doc.text(`In Progress Tasks: ${inProgressTasks}`, 10, y);
    y += 10;
    doc.text(`Not Started Tasks: ${notStartedTasks}`, 10, y);
    y += 10;
    doc.text(`Average Completion Time: ${(averageCompletionTime / 60).toFixed(2)} min`, 10, y);
    y += 10;
    doc.text(`Most Common Category: ${mostCommonCategory}`, 10, y);

    doc.save('task_report.pdf');
}

function generateReportTable() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    const inProgressTasks = tasks.filter(task => task.status === 'inProgress').length;
    const notStartedTasks = tasks.length - inProgressTasks;
    const completedTaskCount = completedTasks.length;
    const taskCompletionTimes = completedTasks.map(task => task.time);
    const averageCompletionTime = taskCompletionTimes.length ? taskCompletionTimes.reduce((a, b) => a + b, 0) / taskCompletionTimes.length : 0;
    const categories = tasks.map(task => task.category);
    const categoryCounts = categories.reduce((acc, category) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});
    const mostCommonCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b, '');

    const reportTable = `
        <table>
            <tr>
                <th>Task Name</th>
                <th>Time (sec)</th>
                <th>Importance</th>
                <th>Urgency</th>
            </tr>
            ${tasks.map(task => `
            <tr>
                <td>${task.name}</td>
                <td>${task.time}</td>
                <td>${task.importance}</td>
                <td>${task.urgency}</td>
            </tr>`).join('')}
            <tr>
                <td colspan="4"><strong>Completed Tasks</strong></td>
            </tr>
            ${completedTasks.map(task => `
            <tr>
                <td>${task.name}</td>
                <td>${task.time}</td>
                <td>${task.importance}</td>
                <td>${task.urgency}</td>
            </tr>`).join('')}
            <tr>
                <td colspan="4"><strong>Summary</strong></td>
            </tr>
            <tr>
                <td>Completed Tasks</td>
                <td colspan="3">${completedTaskCount}</td>
            </tr>
            <tr>
                <td>In Progress Tasks</td>
                <td colspan="3">${inProgressTasks}</td>
            </tr>
            <tr>
                <td>Not Started Tasks</td>
                <td colspan="3">${notStartedTasks}</td>
            </tr>
            <tr>
                <td>Average Completion Time (min)</td>
                <td colspan="3">${(averageCompletionTime / 60).toFixed(2)}</td>
            </tr>
            <tr>
                <td>Most Common Category</td>
                <td colspan="3">${mostCommonCategory}</td>
            </tr>
        </table>
    `;
    document.getElementById('reportContainer').innerHTML = reportTable;
}

