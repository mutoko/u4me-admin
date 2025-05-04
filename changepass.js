document.getElementById('submit').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the form from submitting traditionally

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = {
        username: username,
        password: password
    };

    fetch('changepass.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' . response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Server Response:', data);
        if (data.success) {
            alert('Password updated successfully!');
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            alert('Failed to update password: ' . data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please check the console for details.');
    });
});

// Redirect to login page when clicking "Login in to your Account?"
document.getElementById('forgotpass').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = 'login.html';
});