<?php
// Start session
session_start();

// Include database connection
include('db_connection.php');

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form input
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepare the SQL query to check if the username and password exist in the database
    $sql = "SELECT staffNo, staffNo2, role, username FROM users WHERE username = ? AND password = ?";

    if ($stmt = $conn->prepare($sql)) {
        // Bind parameters to the query
        $stmt->bind_param("ss", $username, $password);
        $stmt->execute();
        
        // Get the result
        $result = $stmt->get_result();

        // If credentials are correct
        if ($result->num_rows > 0) 
        {
            // Fetch user details
            $user = $result->fetch_assoc();

           // Store user data in session
           $_SESSION['username'] = $user['username'];
           $_SESSION['staffNo'] = $user['staffNo']; // Store staffNo in session
           $_SESSION['staffNo2'] = $user['staffNo2']; // Store staffNo2 in session
           $_SESSION['role'] = $user['role']; // Store role in session


            // Redirect to profile page
            header("Location: index.php");
            

            exit();
        } 
        else 
        {
            // Invalid credentials
            echo "<script>alert('Invalid username or password'); window.location.href='login.html';</script>";
        }

        // Close statement
        $stmt->close();
    }
}

// Close the database connection
$conn->close();
?>
