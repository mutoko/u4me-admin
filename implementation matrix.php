<?php
// Start session
session_start();

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "rcmrd";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Ensure user is logged in and staffNo is set in session
if (!isset($_SESSION['staffNo'])) {
    die("Unauthorized access. Please log in.");
}

$staffNo = $_SESSION['staffNo']; // Retrieve staffNo from the session

// Prepare and execute the query to fetch data only for the logged-in user's staffNo
$sql = "SELECT * FROM workplan WHERE staffNo = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("SQL prepare error: " . $conn->error);
}

$stmt->bind_param("s", $staffNo);
$stmt->execute();
$result = $stmt->get_result();

$data = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Close statement and connection
$stmt->close();
$conn->close();

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
