<?php
session_start(); // Start session

header("Content-Type: application/json"); 
header("Access-Control-Allow-Origin: *"); 

$servername = "localhost";
$username = "root";
$password = "";
$database = "rcmrd";

// Create database connection
$connection = new mysqli($servername, $username, $password, $database);

if ($connection->connect_error) {
    echo json_encode(["error" => "Database connection failed: " . $connection->connect_error]);
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['staffNo'])) {
    echo json_encode(["error" => "User not authenticated. Please log in again."]);
    exit;
}

$staffNo = intval($_SESSION['staffNo']); // Convert staffNo to integer for security

// Prepare SQL query
$sql = "SELECT Perspectives, SSMARTAObjectives, Initiatives, WeightSSMARTAObjective, TargetSSMARTAObjective FROM workplan WHERE staffNo = ?";
$stmt = $connection->prepare($sql);
$stmt->bind_param("i", $staffNo);
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

// Send JSON response
echo json_encode($rows);

// Close statement and connection
$stmt->close();
$connection->close();
?>
