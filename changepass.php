<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin (for testing)

$servername = "localhost";
$username = "root";
$password = "";
$database = "rcmrd";

// Create database connection
$connection = new mysqli($servername, $username, $password, $database);

if ($connection->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $connection->connect_error]);
    exit;
}

// Get the JSON data from the request body
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid input data."]);
    exit;
}

// Extract username and new password from the request
$username = $data['username'];
$newPassword = $data['password']; // Store password as plain text

// Prepare SQL query to update the password
$sql = "UPDATE users SET password = ? WHERE username = ?";
$stmt = $connection->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $connection->error]);
    exit;
}

// Bind parameters and execute the query
$stmt->bind_param("ss", $newPassword, $username);
$stmt->execute();

// Check if the update was successful
if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Password updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "No user found with that username or password unchanged."]);
}

// Close statement and connection
$stmt->close();
$connection->close();
?>