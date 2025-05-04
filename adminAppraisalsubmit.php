<?php
session_start();
header("Content-Type: application/json");
include 'db_connection.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

if (!isset($_SESSION['staffNo'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

try {
    $conn->autocommit(FALSE); // Start transaction

    // Get staff number from request
    $staffNo = $_GET['staffNo'] ?? json_decode(file_get_contents('php://input'), true)['staffNo'] ?? null;

    if (!$staffNo) {
        throw new Exception("Missing staff number. Check if staffNo is being sent correctly.");
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['submittedData'])) {
            throw new Exception("No appraisal data received");
        }

        // Process updates
        foreach ($input['submittedData'] as $row) {
            $stmt = $conn->prepare("
                UPDATE appraisal_perfomance2 SET
                    Perspectives = ?,
                    SSMARTAObjectives = ?,
                    Initiatives = ?,
                    UoM = ?,
                    DI = ?,
                    WeightSSMARTAObjective = ?,
                    TargetSSMARTAObjective = ?,
                    Annual_Actual_Achievement = ?,
                    Annual_Score = ?,
                    Annual_Weighted_Average = ?,
                    Annual_Detailed_Explanation = ?,
                    Annual_Evidence = ?,
                    Supervisor_WeightSSMARTAObjective = ?,
                    Supervisor_TargetSSMARTAObjective = ?,
                    Supervisor_ActualAchievement = ?,
                    Supervisor_Score = ?,
                    Supervisor_Weighted_Average = ?,
                    Supervisor_Comments = ?,
                    Supervisor_IdentifiedGaps = ?,
                    Supervisor_Strategies = ?
                WHERE staffNo = ? AND Initiatives = ?
            ");

            // Bind parameters with correct types
            $stmt->bind_param(
                "ssssssddddsssssddsssis",
                $row['Perspectives'],
                $row['SSMARTAObjectives'],
                $row['Initiatives'],
                $row['UoM'],
                $row['DI'],
                $row['WeightSSMARTAObjective'],
                $row['TargetSSMARTAObjective'],
                $row['Annual_Actual_Achievement'],
                $row['Annual_Score'],
                $row['Annual_Weighted_Average'],
                $row['Annual_Detailed_Explanation'],
                $row['Annual_Evidence'],
                $row['Supervisor_WeightSSMARTAObjective'],
                $row['Supervisor_TargetSSMARTAObjective'],
                $row['Supervisor_ActualAchievement'],
                $row['Supervisor_Score'],
                $row['Supervisor_Weighted_Average'],
                $row['Supervisor_Comments'],
                $row['Supervisor_IdentifiedGaps'],
                $row['Supervisor_Strategies'],
                $staffNo,
                $row['Initiatives']
            );

            if (!$stmt->execute()) {
                throw new Exception("Update failed for Initiative {$row['Initiatives']}: " . $stmt->error);
            }
        }

        $conn->commit();
        echo json_encode(['status' => 'success', 'message' => 'Appraisal Submited successfully']);
    }

    // GET Request Handler
    elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $conn->prepare("
            SELECT 
                Perspectives, SSMARTAObjectives, Initiatives, UoM, DI,
                WeightSSMARTAObjective, TargetSSMARTAObjective,
                Annual_Actual_Achievement, Annual_Score, Annual_Weighted_Average,
                Annual_Detailed_Explanation, Annual_Evidence,
                Supervisor_WeightSSMARTAObjective, Supervisor_TargetSSMARTAObjective,
                Supervisor_ActualAchievement, Supervisor_Score,
                Supervisor_Weighted_Average, Supervisor_Comments,
                Supervisor_IdentifiedGaps, Supervisor_Strategies
            FROM appraisal_perfomance2
            WHERE staffNo = ?
        ");
        
        $stmt->bind_param("s", $staffNo);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $appraisals = $result->fetch_all(MYSQLI_ASSOC);
        
        echo json_encode([
            'status' => 'success',
            'appraisals' => $appraisals ?: []
        ]);
    }

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'received_data' => file_get_contents('php://input') // Debug aid
    ]);
} finally {
    $conn->close();
}
?>