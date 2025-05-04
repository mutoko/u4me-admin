<?php
session_start();
include 'db_connection.php';
header("Content-Type: application/json");

// Fetching staffNo from URL query
$staffNo = isset($_GET['staffNo']) ? $_GET['staffNo'] : $_SESSION['staffNo'];

if (!$staffNo) {
    echo json_encode(["success" => false, "error" => "User not logged in or staffNo missing"]);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'fetch') {
    fetchTotals($conn, $staffNo);
} elseif ($action === 'save') {
    saveTotals($conn, $staffNo);
} else {
    echo json_encode(["success" => false, "error" => "Invalid action"]);
}

function fetchTotals($conn, $staffNo) {
    $query = "SELECT orgCapacity, businessProcess, customer, financial, overallTotal FROM performance_totals WHERE staffNo = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $staffNo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $totals = $result->fetch_assoc();
        echo json_encode(["success" => true, "totals" => $totals]);
    } else {
        echo json_encode(["success" => false, "error" => "No data found"]);
    }
}

function saveTotals($conn, $staffNo) {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['totals'], $data['overallTotal'])) {
        echo json_encode(["success" => false, "error" => "Invalid data"]);
        return;
    }

    $totals = $data['totals'];
    $overallTotal = $data['overallTotal'];

    // Delete existing data for this staffNo
    $deleteQuery = "DELETE FROM performance_totals WHERE staffNo = ?";
    $deleteStmt = $conn->prepare($deleteQuery);
    $deleteStmt->bind_param("i", $staffNo);
    $deleteStmt->execute();

    // Insert new data for this staffNo
    $insertQuery = "INSERT INTO performance_totals (staffNo, orgCapacity, businessProcess, customer, financial, overallTotal) 
                    VALUES (?, ?, ?, ?, ?, ?)";
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bind_param(
        "iddddd",
        $staffNo,
        $totals['ORGANIZATION CAPACITY'],
        $totals['BUSINESS PROCESS'],
        $totals['CUSTOMER'],
        $totals['FINANCIAL'],
        $overallTotal
    );

    if ($insertStmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Database error"]);
    }
}
?>
