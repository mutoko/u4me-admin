<?php
session_start();
include 'db_connection.php'; 

// Ensure the user is logged in
if (!isset($_SESSION['staffNo'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

// Retrieve the staff number
$staffNo = $_GET['staffNo'] ?? $_POST['staffNo'] ?? null;
if (!$staffNo) {
    echo json_encode(['error' => 'No staff number provided']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle saving appraisal totals
    $selfAppraisal = isset($_POST['self_appraisal']) ? floatval($_POST['self_appraisal']) : 0;
    $supervisorAppraisal = isset($_POST['supervisor_appraisal']) ? floatval($_POST['supervisor_appraisal']) : 0;

    // Delete existing record for staffNo and insert the new record
    $stmt = $conn->prepare("DELETE FROM appraisal_totals2 WHERE staffNo = ?");
    $stmt->bind_param("s", $staffNo);
    $stmt->execute();

    $stmt = $conn->prepare("INSERT INTO appraisal_totals2 (staffNo, self_appraisal, supervisor_appraisal) VALUES (?, ?, ?)");
    $stmt->bind_param("sdd", $staffNo, $selfAppraisal, $supervisorAppraisal);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Data saved successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save data", "error" => $stmt->error]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch existing appraisal data
    $stmt = $conn->prepare("SELECT self_appraisal, supervisor_appraisal FROM appraisal_totals2 WHERE staffNo = ?");
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
