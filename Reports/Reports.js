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

    generateCompletionReport(tasks, completedTaskCount, inProgressTasks, notStartedTasks, averageCompletionTime, mostCommonCategory, taskCompletionTimes);

}

function generateCompletionReport(tasks, completedTasks, inProgressTasks, notStartedTasks, averageCompletionTime, mostCommonCategory, taskCompletionTimes) {
    const totalTasks = completedTasks + inProgressTasks + notStartedTasks;
    let report = '';

    if (totalTasks === 0) {
        const messages = [
            'You currently have no tasks.<br>It’s a great time to plan new goals and take action!<br>Consider what you want to achieve in the coming days, and start setting some actionable tasks.<br>Remember, starting small can lead to big changes!',
            'No tasks are present at the moment.<br>This could be the perfect opportunity to reflect on your goals and set new ones.<br>What are some things you’ve been wanting to accomplish?<br>Now is a great time to map out your plans and start taking steps forward.',
            'Your task list is empty, which means you have a clean slate to work with.<br>Use this opportunity to think about both your short-term and long-term objectives.<br>Planning ahead can set the stage for future success, so why not start today?'
        ];
        report = messages[Math.floor(Math.random() * messages.length)];
    } else {
        const completionRate = ((completedTasks / totalTasks) * 100).toFixed(2);

        if (completionRate >= 90) {
            const messages = [
                `Fantastic job! You have completed ${completedTasks} out of ${totalTasks} tasks, achieving an outstanding completion rate of ${completionRate}%.<br>Keep up the great work, your productivity is truly inspiring!<br>Remember to take breaks and celebrate your success!<br>Reflect on what strategies have worked for you so far, and consider how you can maintain this momentum.`,
                `Amazing work! You've successfully completed ${completedTasks} out of ${totalTasks} tasks.<br>Your completion rate of ${completionRate}% is exceptional.<br>Celebrate your success and maintain this high level of productivity!<br>Think about setting even more challenging goals, as you're clearly capable of achieving them.`,
                `Incredible effort! You've finished ${completedTasks} of ${totalTasks} tasks, with an impressive completion rate of ${completionRate}%.<br>Keep pushing forward and enjoy the rewards of your hard work!<br>Use this success as motivation to tackle new challenges and continue growing.`
            ];
            report = messages[Math.floor(Math.random() * messages.length)];
        } else if (completionRate >= 70) {
            const messages = [
                `Well done! You have completed ${completedTasks} out of ${totalTasks} tasks, with a solid completion rate of ${completionRate}%.<br>You're on the right track, keep pushing forward and aim even higher!<br>Remember, every step forward is progress!<br>Consider what you can do to improve your productivity further, and don't hesitate to adjust your strategies as needed.`,
                `Great progress! You've completed ${completedTasks} out of ${totalTasks} tasks, achieving a completion rate of ${completionRate}%.<br>Stay focused and continue striving for excellence!<br>Reflect on your current practices and identify areas where you can optimize your workflow.`,
                `Good job! With a completion rate of ${completionRate}%, having completed ${completedTasks} out of ${totalTasks} tasks, you are progressing well.<br>Keep the momentum going by setting clear goals and maintaining a positive attitude.<br>Remember, consistency is key to achieving your goals.`
            ];
            report = messages[Math.floor(Math.random() * messages.length)];
        } else if (completionRate >= 50) {
            const messages = [
                `Good start! You have completed ${completedTasks} out of ${totalTasks} tasks, with a completion rate of ${completionRate}%.<br>There’s room for improvement, but you’re off to a good start.<br>Focus on time management to boost your efficiency!<br>Every small effort adds up to big results!<br>Consider breaking your tasks into smaller, more manageable parts to make progress more visible.`,
                `Nice effort! Completing ${completedTasks} out of ${totalTasks} tasks shows a completion rate of ${completionRate}%.<br>Focus on enhancing your time management skills to boost your productivity further.<br>Look at where you spend most of your time and identify any areas where you might be able to streamline or delegate tasks.`,
                `Decent progress! You've completed ${completedTasks} of ${totalTasks} tasks, resulting in a ${completionRate}% completion rate.<br>Keep improving and strive for higher efficiency!<br>Think about adopting new productivity techniques or tools that might help you work more effectively.`
            ];
            report = messages[Math.floor(Math.random() * messages.length)];
        } else {
            const messages = [
                `Keep going! You have completed ${completedTasks} out of ${totalTasks} tasks, with a completion rate of ${completionRate}%.<br>Don't be discouraged; with better planning and focus, you can definitely catch up and succeed!<br>Believe in yourself and keep moving forward!<br>Consider reviewing your goals and ensuring they are realistic and achievable within your current schedule.`,
                `Stay motivated! Completing ${completedTasks} out of ${totalTasks} tasks shows a completion rate of ${completionRate}%.<br>Stay positive and work on your planning to improve your results.<br>It might help to prioritize tasks and focus on the most impactful ones first.`,
                `Don't give up! You've completed ${completedTasks} of ${totalTasks} tasks, achieving a ${completionRate}% completion rate.<br>Focus on planning and organization to improve your performance.<br>Remember, every setback is an opportunity to learn and grow.<br>Keep pushing yourself, and you'll find your stride.`
            ];
            report = messages[Math.floor(Math.random() * messages.length)];
        }
    }

    document.getElementById('completionReport').innerHTML = `<strong>Report:</strong> ${report}`;
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
