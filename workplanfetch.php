<?php
session_start(); // Start session

$servername = "localhost";
$username = "root";
$password = "";
$database = "rcmrd";

// Create database connection
$connection = new mysqli($servername, $username, $password, $database);

if ($connection->connect_error) {
    die("Database connection failed: " . $connection->connect_error);
}

// Ensure staffNo2 is set in the session
if (isset($_SESSION['staffNo2'])) {
    $staffNo2 = intval($_SESSION['staffNo2']); // Convert to integer for security

    // Prepare SQL query
    $sql = "SELECT * FROM workplan WHERE StaffNo = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("i", $staffNo2);
    $stmt->execute();
    $result = $stmt->get_result();

    $rows = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    } else {
        // Return an empty array with a message
        $rows[] = ["message" => "No data found, consult your supervisor."];
    }

    echo json_encode($rows);

    // Close statement
    $stmt->close();
} else {
    echo json_encode(["error" => "User not authenticated. Please log in again."]);
}

// Close connection
$connection->close();
?>
