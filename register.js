document.getElementById('registrationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Gather the form data
    const newUsername = document.getElementById('new_username').value;
    const newName = document.getElementById('new_name').value;
    const newPassword = document.getElementById('new_password').value;
    const staffNo2 = document.getElementById('staffNo2').value;
    const staffNo = document.getElementById('staffNo').value;
    const role = document.getElementById('role').value;
    const adminUsername = document.getElementById('admin_username').value;
    const adminPassword = document.getElementById('admin_password').value;
    const adminMessage = document.getElementById('adminMessage');

    // Clear previous messages
    adminMessage.innerHTML = "";
    adminMessage.style.color = "";

    // Validate password length
    if (newPassword.length < 4) {
        adminMessage.innerHTML = "User Password must be at least 4 characters long.";
        adminMessage.style.color = "red";
        return; // Stop form submission
    }

    // Send data to PHP backend for validation
    fetch('register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newUsername,
            newName,
            newPassword,
            staffNo2,
            staffNo,
            role,
            adminUsername,
            adminPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            adminMessage.innerHTML = data.message;
            adminMessage.style.color = "green"; // Success message in green
            document.getElementById('registrationForm').reset(); // Reset form on success
        } else {
            adminMessage.innerHTML = data.message;
            adminMessage.style.color = "red"; // Error message in red
        }
    })
    .catch(error => {
        adminMessage.innerHTML = "Error: " + error.message;
        adminMessage.style.color = "red";
    });
});
