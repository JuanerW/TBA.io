document.addEventListener('DOMContentLoaded', () => {
    loadTeamMembers();
    loadComments();
    document.getElementById('teamMemberForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addTeamMember();
    });
    document.getElementById('evaluationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateEvaluationScore();
    });
    document.getElementById('commentForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addComment();
    });
});

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

function loadTeamMembers() {
    const teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    teamMembers.forEach(member => addTeamMemberToDOM(member));
}

function addTeamMember() {
    const memberName = document.getElementById('memberName').value.trim();
    const memberRole = document.getElementById('memberRole').value.trim();

    if (!memberName || !memberRole) {
        return; // Do not submit the form if required fields are empty
    }

    const member = {
        id: 'member' + new Date().getTime(), // Generate a unique ID for the member
        name: memberName,
        role: memberRole,
        evaluationScore: 0 // Default evaluation score
    };

    addTeamMemberToDOM(member);
    saveTeamMemberToStorage(member);

    closeTeamMemberModal();
    document.getElementById('teamMemberForm').reset();
}

function addTeamMemberToDOM(member) {
    const memberElement = document.createElement('li');
    memberElement.setAttribute('data-id', member.id);
    memberElement.innerHTML = `
        <span>${member.name} <span class="member-role">(${member.role})</span></span>
        <span class="evaluation-score">Score: ${member.evaluationScore}</span>
        <button class="evaluation-btn" onclick="editEvaluationScore('${member.id}')">Edit Score</button>
        <button class="comment-btn" onclick="openCommentModal('${member.id}')">Add Comment</button>
        <button onclick="removeTeamMember(this)">Remove</button>
    `;
    document.getElementById('team-list').appendChild(memberElement);
}

function saveTeamMemberToStorage(member) {
    const teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    teamMembers.push(member);
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
}

function removeTeamMember(button) {
    const memberElement = button.closest('li');
    const memberId = memberElement.dataset.id;

    memberElement.remove();

    let teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    teamMembers = teamMembers.filter(member => member.id !== memberId);
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
}

function editEvaluationScore(memberId) {
    const teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    const member = teamMembers.find(member => member.id === memberId);

    if (member) {
        document.getElementById('evaluationMemberId').value = member.id;
        document.getElementById('evaluationScore').value = member.evaluationScore;
        openEvaluationModal();
    }
}

function updateEvaluationScore() {
    const memberId = document.getElementById('evaluationMemberId').value;
    const newScore = document.getElementById('evaluationScore').value;

    let teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    teamMembers = teamMembers.map(member => {
        if (member.id === memberId) {
            member.evaluationScore = newScore;
        }
        return member;
    });

    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    document.getElementById('team-list').innerHTML = '';
    teamMembers.forEach(member => addTeamMemberToDOM(member));
    closeEvaluationModal();
}

function openTeamMemberModal() {
    document.getElementById('teamMemberModal').style.display = 'block';
    document.getElementById('teamMemberModal').classList.add('fade-in');
}

function closeTeamMemberModal() {
    document.getElementById('teamMemberModal').style.display = 'none';
}

function openEvaluationModal() {
    document.getElementById('evaluationModal').style.display = 'block';
    document.getElementById('evaluationModal').classList.add('fade-in');
}

function closeEvaluationModal() {
    document.getElementById('evaluationModal').style.display = 'none';
}

function openCommentModal(memberId) {
    document.getElementById('commentMemberId').value = memberId;
    document.getElementById('commentModal').style.display = 'block';
    document.getElementById('commentModal').classList.add('fade-in');
}

function closeCommentModal() {
    document.getElementById('commentModal').style.display = 'none';
}

function addComment() {
    const memberId = document.getElementById('commentMemberId').value;
    const commentText = document.getElementById('commentText').value.trim();

    if (!commentText) {
        return; // Do not submit the form if the comment is empty
    }

    const comment = {
        id: 'comment' + new Date().getTime(),
        memberId,
        text: commentText,
        timestamp: new Date().toLocaleString()
    };

    saveCommentToStorage(comment);
    addCommentToDOM(comment);

    closeCommentModal();
    document.getElementById('commentForm').reset();
}

function saveCommentToStorage(comment) {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push(comment);
    localStorage.setItem('comments', JSON.stringify(comments));
}

function loadComments() {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.forEach(comment => addCommentToDOM(comment));
}

function addCommentToDOM(comment) {
    const teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    const member = teamMembers.find(member => member.id === comment.memberId);
    const memberName = member ? member.name : 'Unknown';

    const commentElement = document.createElement('li');
    commentElement.setAttribute('data-id', comment.id);
    commentElement.innerHTML = `
        <span>${comment.timestamp} - <span class="comment-text">${comment.text}</span> <strong>(${memberName})</strong></span>
        <button onclick="removeComment(this)">Delete</button>
    `;
    document.getElementById('comments-list').appendChild(commentElement);
}

function removeComment(button) {
    const commentElement = button.closest('li');
    const commentId = commentElement.dataset.id;

    commentElement.remove();

    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments = comments.filter(comment => comment.id !== commentId);
    localStorage.setItem('comments', JSON.stringify(comments));
}
