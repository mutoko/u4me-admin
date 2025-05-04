<?php
// Database connection 
$host = 'localhost';
$dbname = 'rcmrd';
$user = 'root'; 
$pass = ''; 
// Set content type to JSON
header('Content-Type: application/json');

// Get the JSON data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Extract values from the data
$newUsername = $data['newUsername'];
$newName = $data['newName'];
$newPassword = $data['newPassword'];
$staffNo2 = $data['staffNo2'];
$staffNo = $data['staffNo'];
$role = $data['role'];
$adminUsername = $data['adminUsername'];
$adminPassword = $data['adminPassword'];

// Validate password length
if (strlen($newPassword) < 4) 
{
    echo json_encode(['success' => false, 'message' => 'User Password must be at least 4 characters long.']);
    exit();
}

try {
    // Create a PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Start a transaction
    $pdo->beginTransaction();

    // Fetch the admin credentials from the database
    $stmt = $pdo->prepare('SELECT * FROM users WHERE username = :username');
    $stmt->bindParam(':username', $adminUsername);
    $stmt->execute();
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if admin username exists
    if (!$admin) 
    {
        echo json_encode(['success' => false, 'message' => 'Invalid admin username']);
        exit();
    }

    // Compare the admin password directly 
    if ($adminPassword !== $admin['password']) 
    {
        echo json_encode(['success' => false, 'message' => 'Invalid admin password']);
        exit();
    }

    // Verify if the logged-in user is an admin
    if ($admin['role'] !== 'Admin') {
        echo json_encode(['success' => false, 'message' => 'Only admins can register new users, Contact your Supervisor']);
        exit();
    }

    // Check if the username or staffNo already exists in the users table
    $checkStmt = $pdo->prepare('SELECT * FROM users WHERE username = :username OR staffNo = :staffNo');
    $checkStmt->bindParam(':username', $newUsername);
    $checkStmt->bindParam(':staffNo', $staffNo);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        // If either username or staffNo already exists
        echo json_encode(['success' => false, 'message' => 'The username or staff number already exists, choose a different one.']);
        exit();
    }

    // Insert into users table
    $insertStmt1 = $pdo->prepare('INSERT INTO users (username, name, password, role, staffNo, staffNo2) 
                                  VALUES (:username, :name, :password, :role, :staffNo, :staffNo2)');
    $insertStmt1->bindParam(':staffNo2', $staffNo2);
    $insertStmt1->bindParam(':staffNo', $staffNo);
    $insertStmt1->bindParam(':username', $newUsername);
    $insertStmt1->bindParam(':name', $newName);
    $insertStmt1->bindParam(':password', $newPassword);
    $insertStmt1->bindParam(':role', $role);
    $insertStmt1->execute();

    // Insert into employees table
    $insertStmt2 = $pdo->prepare('INSERT INTO employees_data (username, name, password, staffNo, role, staffNo2) 
                                  VALUES (:username, :name, :password, :staffNo, :role , :staffNo2)');
    $insertStmt2->bindParam(':staffNo2', $staffNo2);
    $insertStmt2->bindParam(':name', $newName);
    $insertStmt2->bindParam(':username', $newUsername);
    $insertStmt2->bindParam(':password', $newPassword);
    $insertStmt2->bindParam(':staffNo', $staffNo); 
    $insertStmt2->bindParam(':role', $role);
    $insertStmt2->execute();

    // Commit transaction if both inserts succeed
    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'User registered successfully']);

} catch (PDOException $e) 
{
    // Rollback transaction on error
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
