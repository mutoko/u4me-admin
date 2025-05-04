<?php
include 'db_connection.php'; 

if ($connection->connect_error) {
    die("Database connection failed: " . $connection->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') 
{
    // Fetch data from the databas
    $sql = "SELECT * FROM workplan";
    $result = $connection->query($sql);

    $rows = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    }
    echo json_encode($rows); // Return data as JSON
} 

elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
   
    $inputData = file_get_contents("php://input");
    $data = json_decode($inputData, true);  // Decode the JSON data

    if (isset($data['submittedData'])) {
        $submittedData = $data['submittedData'];

        if (!empty($submittedData)) {
            // Prepare the SQL statement for inserting data
            $stmt = $connection->prepare("INSERT INTO workplan (Perspectives, StrategicObjective, SSMARTAObjectives, WeightSSMARTAObjective,
            TargetSSMARTAObjective, Initiatives, SpecificActivities, ExpectedOutput, January, February, March, April, May, June, July, August, 
            September, October, November, December) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");
            if (!$stmt) {
                die("Error preparing insert statement: " . $connection->error);
            }

            // Loop through the submitted data and insert into the database
            foreach ($submittedData as $rowData) 
            {
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

                $stmt->bind_param("sssiisssssssssssssss", $Perspectives, $StrategicObjective, $SSMARTAObjectives, $WeightSSMARTAObjective, 
                $TargetSSMARTAObjective, $Initiatives, $SpecificActivities, $ExpectedOutput, $January, $February, 
                $March, $April, $May, $June, $July, $August, $September, $October, $November, $December);

                 if (!$stmt->execute()) {
                    echo "Error inserting data for $Perspectives $StrategicObjective: " . $stmt->error . "<br>";
                 }
            }

            $stmt->close();
            echo "Data successfully inserted.";
        } else {
            echo "No data received.";
        }
    } else 
    
    {
        echo "No 'submittedData' found in the POST request.";
    }
}

$connection->close();
?>
