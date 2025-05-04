document.addEventListener("DOMContentLoaded", () => {
    const contentFrame = document.getElementById('content-frame');

    document.getElementById('profile-btn')?.addEventListener('click', () => {
        contentFrame.src = 'profile.html';
    });

    document.getElementById('dashboard-btn')?.addEventListener('click', () => {
        contentFrame.src = 'dashboard.html';
    });

    document.getElementById('closeBtn')?.addEventListener('click', () => {
        contentFrame.src = 'dashboard.html';
    });
    
    document.getElementById('analyst-btn')?.addEventListener('click', () => {
        contentFrame.src = 'analystdashboard.html';
    });

    document.getElementById('workplan-btn')?.addEventListener('click', () => {
        contentFrame.src = 'workplan.html';
    });

    document.getElementById('I.matrix-btn')?.addEventListener('click', () => {
        contentFrame.src = 'Implimentation matrix.html';
    });

    document.getElementById('Appraisal-btn')?.addEventListener('click', () => {
        contentFrame.src = 'Appraisal.html';
    });

    document.getElementById('Admin-btn')?.addEventListener('click', () => {
        contentFrame.src = 'register.html';
    });

    const menuItems = document.querySelectorAll('.side-menu a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(link => link.classList.remove('active'));
            item.classList.add('active');
        });
    });

    document.getElementById("logout-btn")?.addEventListener("click", function() {
        window.location.href = "login.html";
    });

    const tableBody = document.getElementById('tableBody');
    const table = document.getElementById('workPlanTable');
    const editButton = document.getElementById('editBtn');
    const submitButton = document.getElementById('submitBtn');

    editButton?.addEventListener('click', function() {
        const isEditable = tableBody.contentEditable === "true";
        tableBody.contentEditable = isEditable ? "false" : "true";
        table.classList.toggle('editable-table', !isEditable);
    });

    submitButton?.addEventListener('click', function() {
        const confirmSubmission = confirm("Are you sure you want to submit the changes?");
        if (confirmSubmission) {
            tableBody.contentEditable = "false";
            table.classList.remove('editable-table');
        }
    });
});
