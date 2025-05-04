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

    // Begin transaction to ensure both tables are updated simultaneously
    $conn->begin_transaction();

    try {
        // Delete existing records in both tables for the staffNo
        $deleteQuery1 = "DELETE FROM appraisal_totals WHERE staffNo = ?";
        $deleteQuery2 = "DELETE FROM appraisal_totals2 WHERE staffNo = ?";  // Deleting from 'appraisal_totals2' table

        $stmt1 = $conn->prepare($deleteQuery1);
        $stmt1->bind_param("s", $staffNo);
        $stmt1->execute();

        $stmt2 = $conn->prepare($deleteQuery2);
        $stmt2->bind_param("s", $staffNo);
        $stmt2->execute();

        // Insert new record into 'appraisal_totals'
        $insertQuery1 = "INSERT INTO appraisal_totals (staffNo, self_appraisal, supervisor_appraisal) VALUES (?, ?, ?)";
        $stmt3 = $conn->prepare($insertQuery1);
        $stmt3->bind_param("sdd", $staffNo, $selfAppraisal, $supervisorAppraisal);
        $stmt3->execute();

        // Insert new record into 'appraisal_totals2'
        $insertQuery2 = "INSERT INTO appraisal_totals2 (staffNo, self_appraisal, supervisor_appraisal) VALUES (?, ?, ?)";
        $stmt4 = $conn->prepare($insertQuery2);
        $stmt4->bind_param("sdd", $staffNo, $selfAppraisal, $supervisorAppraisal);
        $stmt4->execute();

        // If all queries succeed, commit the transaction
        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Data saved successfully"]);
    } catch (Exception $e) {
        // If any query fails, rollback the transaction
        $conn->rollback();
        echo json_encode(["status" => "error", "message" => "Failed to save data: " . $e->getMessage()]);
    }
    exit;
}

// Fetch appraisal data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Retrieve data from 'appraisal_totals' or 'appraisal_totals2'
    $query = "SELECT self_appraisal, supervisor_appraisal FROM appraisal_totals WHERE staffNo = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $staffNo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode([
            "status" => "success",
            "data" => $row
        ]);
    } else {
        // No data found
        echo json_encode(["status" => "error", "message" => "No appraisal data found"]);
    }
    exit;
}
?>
