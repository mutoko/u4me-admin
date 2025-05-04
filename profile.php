<?php
session_start(); // Start session

header('Content-Type: application/json'); // Set response type to JSON

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "rcmrd";

// Create a connection to MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Ensure user is logged in
if (!isset($_SESSION['staffNo'])) {
    die(json_encode(["error" => "Unauthorized access"]));
}
// Fetch the logged-in user staffNo
$staffNo = $_SESSION['staffNo']; 


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Fetch form data
    $staffNo2 = $_POST['staffNo2'];
    $staffNo4 = $_POST['staffNo4'];
    $name = $_POST['name'];
    $name4 = $_POST['name4'];
    $name2 = $_POST['name2'];
    $designation1 = $_POST['designation1'];
    $grade2 = $_POST['grade2'];
    $grade1 = $_POST['grade1'];
    $staffNo3 = $_POST['staffNo3'];
    $department1 = $_POST['department1'];
    $name3 = $_POST['name3'];
    $division1 = $_POST['division1'];
    $grade3 = $_POST['grade3'];
    $grade4 = $_POST['grade4'];
    $region1 = $_POST['region1'];
    $fromDate = $_POST['fromDate'];
    $station1 = $_POST['station1'];
    $toDuration = $_POST['toDuration'];
    $duration = $_POST['duration'];
    $employmentDate = $_POST['employmentDate'];

    // Start transaction
    $conn->begin_transaction();

    try {
        // Update employees_data table
        $updateSql = "UPDATE employees_data SET staffNo2=?, name=?, name2=?, 
                      designation1=?, grade2=?, grade1=?, staffNo3=?, department1=?, 
                      name3=?, division1=?, grade3=?, region1=?, fromDate=?, station1=?, 
                      toDuration=?, duration=?, employmentDate=?, staffNo4=?, name4=?, grade4=? 
                      WHERE staffNo=?";

        if ($stmt = $conn->prepare($updateSql)) {
            $stmt->bind_param("sssssssssssssssssssss", 
                              $staffNo2, $name, $name2, $designation1, $grade2, $grade1, $staffNo3, $department1, 
                              $name3, $division1, $grade3, $region1, $fromDate, $station1, $toDuration, 
                              $duration, $employmentDate, $staffNo4, $name4, $grade4, $staffNo);

            if (!$stmt->execute()) {
                throw new Exception("Error updating employees_data: " . $stmt->error);
            }
            $stmt->close();
        } else {
            throw new Exception("Error preparing employees_data query: " . $conn->error);
        }

        // Update users table with staffNo2
        $updateUsersSql = "UPDATE users SET staffNo2=? WHERE staffNo=?";
        
        if ($stmt = $conn->prepare($updateUsersSql)) {
            $stmt->bind_param("ss", $staffNo2, $staffNo);

            if (!$stmt->execute()) {
                throw new Exception("Error updating users table: " . $stmt->error);
            }
            $stmt->close();
        } else {
            throw new Exception("Error preparing users table query: " . $conn->error);
        }

        // Commit transaction
        $conn->commit();
        echo json_encode(["success" => "Record updated successfully"]);

    } catch (Exception $e) {
        // Rollback transaction if any error occurs
        $conn->rollback();
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    // Fetch the data for the logged-in user
    $sql = "SELECT * FROM employees_data WHERE staffNo = ?";
    
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $staffNo);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode($result->fetch_assoc());
        } else {
            echo json_encode(["error" => "No data found"]);
        }
        
        $stmt->close();
    }
}

$conn->close();
?>
