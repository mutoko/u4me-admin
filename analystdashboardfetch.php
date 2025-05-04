<?php
session_start();

// Check if the user is logged in and staffNo is set in the session
if (!isset($_SESSION['staffNo'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

// Database connection
$servername = "localhost";
$username = "root";  
$password = "";      
$dbname = "rcmrd";  

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch data from employees_data table and include overallTotal from performance_totals table
$sql = "SELECT e.staffNo, e.username, e.name, e.designation1, e.department1, a.supervisor_appraisal, p.overallTotal
        FROM employees_data e
        LEFT JOIN appraisal_totals a ON e.staffNo = a.staffNo
        LEFT JOIN performance_totals p ON e.staffNo = p.staffNo";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

$employees = [];
while ($row = $result->fetch_assoc()) {
    // If overallTotal is null, set it as null for "Not Submitted"
    $row['overallTotal'] = $row['overallTotal'] ?? null;
    $row['supervisor_appraisal'] = $row['supervisor_appraisal'] ?? null;
    $employees[] = $row;
}

$stmt->close();
$conn->close();

// Return the data as JSON
echo json_encode($employees);
?>
