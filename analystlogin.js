// Event listener for form submission
document.getElementById("submit").addEventListener("click", function(event) {
    event.preventDefault();

    // Get the username and password values from the form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Prepare data to send to PHP
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    // Create an XMLHttpRequest to send data to PHP
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "analystlogin.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const response = JSON.parse(xhr.responseText);
            
            if (response.success) {
                alert("Login successful! Welcome, " + response.username);
                // Redirect to dashboard or another page
                window.location.href = "analystdashboard.html"; 
            } else {
                alert("Login failed: " + response.message);
            }
        }
    };
    xhr.send(formData);
});
