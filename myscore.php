<?php
session_start();
if (!isset($_SESSION['staffNo'])) {
    die(json_encode(['error' => 'Unauthorized: Please log in.']));
}

$servername = "localhost";
$username = "root";
$password = "";
$database = "rcmrd";
$connection = new mysqli($servername, $username, $password, $database);

if ($connection->connect_error) {
    die(json_encode(['error' => 'Database connection failed.']));
}

$staffNo = $_SESSION['staffNo']; 

// Fetch the logged-in user's appraisal data
$sql = "SELECT supervisor_appraisal FROM appraisal_totals WHERE staffNo = ?";
$stmt = $connection->prepare($sql);
$stmt->bind_param("s", $staffNo);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row; // Contains the user's own appraisal data
}

header('Content-Type: application/json');
echo json_encode($data);

$stmt->close();
$connection->close();
?>