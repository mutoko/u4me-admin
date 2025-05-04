document.getElementById('forgotpass').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default link behavior
    window.location.href = 'changepass.html'; // Redirect to change password page
});

document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.querySelector('input[name="password"]');
    const toggleIcon = document.getElementById("togglePassword");

    toggleIcon.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggleIcon.textContent = "visibility"; // Change icon to open eye
        } else {
            passwordInput.type = "password";
            toggleIcon.textContent = "visibility_off"; // Change back to closed eye
        }
    });
});