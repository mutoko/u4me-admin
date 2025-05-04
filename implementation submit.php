<?php
session_start(); // Start session to access logged-in user data

$servername = "localhost";
$username = "root";
$password = "";
$database = "rcmrd";

// Create database connection
$connection = new mysqli($servername, $username, $password, $database);

// Check connection
if ($connection->connect_error) {
    die("Database connection failed: " . $connection->connect_error);
}

// Ensure user is logged in and staffNo is set in session
if (!isset($_SESSION['staffNo'])) {
    die("Unauthorized access. Please log in.");
}

$staffNo = $_SESSION['staffNo']; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data (JSON)
    $inputData = file_get_contents("php://input");

    // Log received data for debugging
    error_log("Input Data: " . $inputData);

    if (!$inputData) {
        die("Error: No JSON data received.");
    }

    // Decode the JSON data
    $data = json_decode($inputData, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON Decoding Error: " . json_last_error_msg());
        die("JSON Decoding Error");
    }

    // Log decoded data for debugging
    error_log("Decoded Data: " . print_r($data, true));

    if (isset($data['submittedData']) && !empty($data['submittedData'])) {
        $submittedData = $data['submittedData'];

        // DELETE existing records for this staffNo before inserting new ones
        $deleteSQL = "DELETE FROM implementationmatrix WHERE staffNo = ?";
        $deleteStmt = $connection->prepare($deleteSQL);
        $deleteStmt->bind_param("s", $staffNo);
        $deleteStmt->execute();
        $deleteStmt->close();

        // Prepare the SQL statement for inserting new data
        $stmt = $connection->prepare("INSERT INTO implementationmatrix 
            (staffNo, Perspectives, StrategicObjective, SSMARTAObjectives, WeightSSMARTAObjective,
            TargetSSMARTAObjective, Initiatives, SpecificActivities, ExpectedOutput, January, February, March, 
            April, May, June, July, August, September, October, November, December) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        if (!$stmt) {
            die("Error preparing insert statement: " . $connection->error);
        }

        // Loop through the submitted data and insert into the database
        foreach ($submittedData as $rowData) {
            $stmt->bind_param("sssssssssssssssssssss", 
                $staffNo, 
                $rowData['Perspectives'], 
                $rowData['StrategicObjective'], 
                $rowData['SSMARTAObjectives'], 
                $rowData['WeightSSMARTAObjective'],  
                $rowData['TargetSSMARTAObjective'],  
                $rowData['Initiatives'], 
                $rowData['SpecificActivities'], 
                $rowData['ExpectedOutput'], 
                $rowData['January'], 
                $rowData['February'], 
                $rowData['March'], 
                $rowData['April'], 
                $rowData['May'], 
                $rowData['June'], 
                $rowData['July'], 
                $rowData['August'], 
                $rowData['September'], 
                $rowData['October'], 
                $rowData['November'], 
                $rowData['December']
            );

            if (!$stmt->execute()) {
                die("Error inserting data: " . $stmt->error);
            }
        }

        // Close the statement
        $stmt->close();
        echo "Data successfully inserted.";
    } else {
        die("No valid data received.");
    }
}

// Close the database connection
$connection->close();
?>
