<?php
session_start(); 

if (!isset($_SESSION['staffNo'])) {
    die(json_encode(["status" => "error", "message" => "Staff not logged in"]));
}

$servername = "localhost";
$username = "root";
$password = "";
$database = "rcmrd";

$conn = new mysqli($servername, $username, $password, $database);

// Retrieve staffNo from the session
$staffNo = $_SESSION['staffNo'];

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Check if the request method is POST (i.e., for submitting new data)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        die(json_encode(["status" => "error", "message" => "Invalid request data"]));
    }

    // Prepare the SQL statement to delete existing records for this staffNo from both tables
    $deleteStmt1 = $conn->prepare("DELETE FROM appraisal_perfomance WHERE staffNo = ?");
    if (!$deleteStmt1) {
        die(json_encode(["status" => "error", "message" => "SQL preparation failed for delete from appraisal_perfomance"]));
    }
    $deleteStmt1->bind_param("s", $staffNo);
    $deleteStmt1->execute();
    $deleteStmt1->close();

    $deleteStmt2 = $conn->prepare("DELETE FROM appraisal_perfomance2 WHERE staffNo = ?");
    if (!$deleteStmt2) {
        die(json_encode(["status" => "error", "message" => "SQL preparation failed for delete from appraisal_perfomance2"]));
    }
    $deleteStmt2->bind_param("s", $staffNo);
    $deleteStmt2->execute();
    $deleteStmt2->close();

    // Prepare SQL statement for inserting new records into both tables
    $insertStmt1 = $conn->prepare("INSERT INTO appraisal_perfomance (
        staffNo, Perspectives, SSMARTAObjectives, Initiatives, UoM, DI,
        WeightSSMARTAObjective, TargetSSMARTAObjective, Annual_Actual_Achievement, Annual_Score,
        Annual_Weighted_Average, Annual_Detailed_Explanation, Annual_Evidence, 
        Supervisor_WeightSSMARTAObjective, Supervisor_TargetSSMARTAObjective,
        Supervisor_ActualAchievement, Supervisor_Score, Supervisor_Weighted_Average,
        Supervisor_Comments, Supervisor_IdentifiedGaps, Supervisor_Strategies
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    if (!$insertStmt1) {
        die(json_encode(["status" => "error", "message" => "SQL preparation failed for insert into appraisal_perfomance"]));
    }

    $insertStmt2 = $conn->prepare("INSERT INTO appraisal_perfomance2 (
        staffNo, Perspectives, SSMARTAObjectives, Initiatives, UoM, DI,
        WeightSSMARTAObjective, TargetSSMARTAObjective, Annual_Actual_Achievement, Annual_Score,
        Annual_Weighted_Average, Annual_Detailed_Explanation, Annual_Evidence, 
        Supervisor_WeightSSMARTAObjective, Supervisor_TargetSSMARTAObjective,
        Supervisor_ActualAchievement, Supervisor_Score, Supervisor_Weighted_Average,
        Supervisor_Comments, Supervisor_IdentifiedGaps, Supervisor_Strategies
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    if (!$insertStmt2) {
        die(json_encode(["status" => "error", "message" => "SQL preparation failed for insert into appraisal_perfomance2"]));
    }

    // Loop through the submitted data and insert into both tables
    foreach ($data['submittedData'] as $rowData) {
        $Perspectives = $rowData['Perspectives'];
        $SSMARTAObjectives = $rowData['SSMARTAObjectives'];
        $Initiatives = $rowData['Initiatives'];
        $UoM = $rowData['UoM'];
        $DI = $rowData['DI'];
        $WeightSSMARTAObjective = $rowData['WeightSSMARTAObjective'];
        $TargetSSMARTAObjective = $rowData['TargetSSMARTAObjective'];
        $Annual_Actual_Achievement = $rowData['Annual_Actual_Achievement'];
        $Annual_Score = $rowData['Annual_Score'];
        $Annual_Weighted_Average = $rowData['Annual_Weighted_Average'];
        $Annual_Detailed_Explanation = $rowData['Annual_Detailed_Explanation'];
        $Annual_Evidence = $rowData['Annual_Evidence'];
        $Supervisor_WeightSSMARTAObjective = $rowData['Supervisor_WeightSSMARTAObjective'];
        $Supervisor_TargetSSMARTAObjective = $rowData['Supervisor_TargetSSMARTAObjective'];
        $Supervisor_ActualAchievement = $rowData['Supervisor_ActualAchievement'];
        $Supervisor_Score = $rowData['Supervisor_Score'];
        $Supervisor_Weighted_Average = $rowData['Supervisor_Weighted_Average'];
        $Supervisor_Comments = $rowData['Supervisor_Comments'];
        $Supervisor_IdentifiedGaps = $rowData['Supervisor_IdentifiedGaps'];
        $Supervisor_Strategies = $rowData['Supervisor_Strategies'];

        // Add % to relevant fields in the insert query, without multiplying by 100
        $Annual_Score = $Annual_Score . "%";
        $Annual_Weighted_Average = $Annual_Weighted_Average . "%";
        $Supervisor_Score = $Supervisor_Score . "%";
        $Supervisor_Weighted_Average = $Supervisor_Weighted_Average . "%";

        // Bind parameters for insertion into the first table
        $insertStmt1->bind_param("isssssdddddssdddddsss", 
            $staffNo, $Perspectives, $SSMARTAObjectives, $Initiatives, $UoM, $DI, $WeightSSMARTAObjective,
            $TargetSSMARTAObjective, $Annual_Actual_Achievement, $Annual_Score, $Annual_Weighted_Average,
            $Annual_Detailed_Explanation, $Annual_Evidence, $Supervisor_WeightSSMARTAObjective,
            $Supervisor_TargetSSMARTAObjective, $Supervisor_ActualAchievement, $Supervisor_Score,
            $Supervisor_Weighted_Average, $Supervisor_Comments, $Supervisor_IdentifiedGaps, $Supervisor_Strategies
        );

        // Bind parameters for insertion into the second table
        $insertStmt2->bind_param("isssssdddddssdddddsss", 
            $staffNo, $Perspectives, $SSMARTAObjectives, $Initiatives, $UoM, $DI, $WeightSSMARTAObjective,
            $TargetSSMARTAObjective, $Annual_Actual_Achievement, $Annual_Score, $Annual_Weighted_Average,
            $Annual_Detailed_Explanation, $Annual_Evidence, $Supervisor_WeightSSMARTAObjective,
            $Supervisor_TargetSSMARTAObjective, $Supervisor_ActualAchievement, $Supervisor_Score,
            $Supervisor_Weighted_Average, $Supervisor_Comments, $Supervisor_IdentifiedGaps, $Supervisor_Strategies
        );

        // Execute insert queries for both tables
        if (!$insertStmt1->execute()) {
            echo "Error inserting data for $Perspectives $SSMARTAObjectives into appraisal_perfomance: " . $insertStmt1->error . "<br>";
        }
        
        if (!$insertStmt2->execute()) {
            echo "Error inserting data for $Perspectives $SSMARTAObjectives into appraisal_perfomance2: " . $insertStmt2->error . "<br>";
        }
    }

    // Close insert statements
    $insertStmt1->close();
    $insertStmt2->close();

    // Return success message
    echo json_encode(["status" => "success", "message" => "Records inserted successfully"]);

} else {
    // Fetch the existing data for GET requests (e.g., page load)
    $sql = "SELECT 
            Perspectives, SSMARTAObjectives, Initiatives, UoM, DI, WeightSSMARTAObjective,
            TargetSSMARTAObjective, Annual_Actual_Achievement, Annual_Score, Annual_Weighted_Average,
            Annual_Detailed_Explanation, Annual_Evidence, Supervisor_WeightSSMARTAObjective,
            Supervisor_TargetSSMARTAObjective, Supervisor_ActualAchievement, Supervisor_Score,
            Supervisor_Weighted_Average, Supervisor_Comments, Supervisor_IdentifiedGaps, Supervisor_Strategies
          FROM appraisal_perfomance WHERE staffNo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $staffNo); // Use "s" for string (staffNo)

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $appraisals = [];

        // Fetch all rows
        while ($row = $result->fetch_assoc()) {
            // Append % to decimal fields
            $row['Annual_Score'] .= '%';
            $row['Annual_Weighted_Average'] .= '%';
            $row['Supervisor_Score'] .= '%';
            $row['Supervisor_Weighted_Average'] .= '%';

            $appraisals[] = $row;
        }

        // Return the data as JSON
        echo json_encode(["status" => "success", "appraisals" => $appraisals]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error fetching data"]);
    }

    // Close connections
    $stmt->close();
    $conn->close();
}
?>
