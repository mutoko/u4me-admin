<?php
session_start(); // Start session to access logged-in user data

$servername = "localhost";
$username = "root";
$password = "";
$database = "rcmrd";

$connection = new mysqli($servername, $username, $password, $database);

if ($connection->connect_error) {
    die("Database connection failed: " . $connection->connect_error);
}

// Check if a staffNo is provided via GET request; otherwise, use session
$staffNo = isset($_GET['staffNo']) ? $_GET['staffNo'] : (isset($_SESSION['staffNo']) ? $_SESSION['staffNo'] : null);

if (!$staffNo) {
    die("Unauthorized access. Please log in.");
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch data for the specified staffNo
    $sql = "SELECT * FROM workplan WHERE staffNo = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("s", $staffNo);
    $stmt->execute();
    $result = $stmt->get_result();

    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    echo json_encode($rows); // Return data as JSON

    $stmt->close();
} 

elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data (JSON)
    $inputData = file_get_contents("php://input");
    $data = json_decode($inputData, true);  // Decode the JSON data

    if (isset($data['submittedData'])) {
        $submittedData = $data['submittedData'];

        if (!empty($submittedData)) {
            // DELETE existing records for this staffNo before inserting new ones
            $deleteSQL = "DELETE FROM workplan WHERE staffNo = ?";
            $deleteStmt = $connection->prepare($deleteSQL);
            $deleteStmt->bind_param("s", $staffNo);
            $deleteStmt->execute();
            $deleteStmt->close();

            // Prepare the SQL statement for inserting new data
            $stmt = $connection->prepare("INSERT INTO workplan 
                (staffNo, Perspectives, StrategicObjective, SSMARTAObjectives, WeightSSMARTAObjective,
                TargetSSMARTAObjective, Initiatives, SpecificActivities, ExpectedOutput, January, February, March, 
                April, May, June, July, August, September, October, November, December) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            if (!$stmt) {
                die("Error preparing insert statement: " . $connection->error);
            }

            // Loop through the submitted data and insert into the database
            foreach ($submittedData as $rowData) {
                $Perspectives = $rowData['Perspectives'];
                $StrategicObjective = $rowData['StrategicObjective'];
                $SSMARTAObjectives = $rowData['SSMARTAObjectives'];
                $WeightSSMARTAObjective = $rowData['WeightSSMARTAObjective'];
                $TargetSSMARTAObjective = $rowData['TargetSSMARTAObjective'];
                $Initiatives = $rowData['Initiatives'];
                $SpecificActivities = $rowData['SpecificActivities'];
                $ExpectedOutput = $rowData['ExpectedOutput'];
                $January = $rowData['January'];
                $February = $rowData['February'];
                $March = $rowData['March'];
                $April = $rowData['April'];
                $May = $rowData['May'];
                $June = $rowData['June'];
                $July = $rowData['July'];
                $August = $rowData['August'];
                $September = $rowData['September'];
                $October = $rowData['October'];
                $November = $rowData['November'];
                $December = $rowData['December'];

                // Bind parameters and include staffNo for each insert
                $stmt->bind_param("sssssssssssssssssssss", 
                    $staffNo, $Perspectives, $StrategicObjective, $SSMARTAObjectives, $WeightSSMARTAObjective, 
                    $TargetSSMARTAObjective, $Initiatives, $SpecificActivities, $ExpectedOutput, $January, $February, 
                    $March, $April, $May, $June, $July, $August, $September, $October, $November, $December);

                if (!$stmt->execute()) {
                    echo "Error inserting data for $Perspectives $StrategicObjective: " . $stmt->error . "<br>";
                }
            }

            // Close the statement
            $stmt->close();
            echo "Data successfully inserted.";
        } else {
            echo "No data received.";
        }
    } else {
        echo "No 'submittedData' found in the POST request.";
    }
}

$connection->close();
?>
