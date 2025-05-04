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

// Create connectio
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch data from employees_data table and include overallTotal from performance_totals2 and appraisal_totals2 table
$sql = "SELECT e.staffNo, e.username, e.name, e.designation1, e.department1, 
                a2.supervisor_appraisal, p2.overallTotal
        FROM employees_data e
        LEFT JOIN appraisal_totals a2 ON e.staffNo = a2.staffNo
        LEFT JOIN performance_totals p2 ON e.staffNo = p2.staffNo";
        
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

$employees = [];
while ($row = $result->fetch_assoc()) {
    // If overallTotal or supervisorAppraisal is null, set them as null for "Not Submitted"
    $row['overallTotal'] = $row['overallTotal'] ?? null;
    $row['supervisor_appraisal'] = $row['supervisor_appraisal'] ?? null;
    $employees[] = $row;
}

$stmt->close();
$conn->close();

// Return the data as JSON
echo json_encode($employees);
?> 
