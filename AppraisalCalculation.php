<?php
session_start();
include 'db_connection.php'; 

// Check if user is logged in and has a staffNo stored in session
if (!isset($_SESSION['staffNo'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$staffNo = $_SESSION['staffNo'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle saving appraisal totals
    $selfAppraisal = isset($_POST['self_appraisal']) ? floatval($_POST['self_appraisal']) : 0;
    $supervisorAppraisal = isset($_POST['supervisor_appraisal']) ? floatval($_POST['supervisor_appraisal']) : 0;
    
    // Delete existing record for staffNo
    $deleteQuery = "DELETE FROM appraisal_totals WHERE staffNo = ?";
    $stmt = $conn->prepare($deleteQuery);
    $stmt->bind_param("s", $staffNo);
    $stmt->execute();

    // Insert new record
    $insertQuery = "INSERT INTO appraisal_totals (staffNo, self_appraisal, supervisor_appraisal) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($insertQuery);
    $stmt->bind_param("sdd", $staffNo, $selfAppraisal, $supervisorAppraisal);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Data saved successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save data"]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch existing appraisal data
    $fetchQuery = "SELECT self_appraisal, supervisor_appraisal FROM appraisal_totals WHERE staffNo = ?";
    $stmt = $conn->prepare($fetchQuery);
    $stmt->bind_param("s", $staffNo);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        echo json_encode(["status" => "success", "data" => $row]);
    } else {
        echo json_encode(["status" => "error", "message" => "No data found"]);
    }
    exit;
}
?>
