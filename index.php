
<?php
// Start session
session_start();

// Check if user is logged in
if (!isset($_SESSION['username'])) 
{
    // If not logged in, redirect to login page
    header("Location: login.html");
    exit;
}

// Check if the user's role is "analyst"
$isAnalyst = isset($_SESSION['role']) && $_SESSION['role'] === 'Analyst';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
    <title>U4me Dashboard</title>
    <link rel="icon" href="img/favicon.png" type="image/x-icon">
    <link rel="stylesheet" href="index.css">

    
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp"rel="stylesheet">
</head>
<body>

    <!-- SIDE BAR on left-->
    <body>
        <!-- SIDE BAR -->
        <input type="checkbox" id="menu-toggle">
        <div class="sidebar">
            <div class="side-header">
                <img src="./img/favicon.png" alt="">
                <h3>U4ME</h3>
            </div>
            
            <div class="side-content">
               
    
                <div class="side-menu">
                    <ul>
                        <li>
                            <a href="#" id="dashboard-btn">
                            <span class="material-icons-sharp">home</span>
                            <small>Dashboard</small>
                            </a>
                        </li>
                        <li>
                            <a href="#" id="profile-btn">
                            <span class="material-icons-sharp">person</span>
                            <small>job Postings</small>
                            </a>
                        </li>
                        <li>
                            <a href="#" id="workplan-btn">
                            <span class="material-icons-sharp">event</span>
                            <small>Applicants</small>
                            </a>
                        </li>
                        <li>
                            <a href="#" id="I.matrix-btn">
                            <span class="material-icons-sharp">checklist_rtl</span>
                            <small>Employees</small>
                            </a>
                        </li>
                        <li>
                            <a href="#" id="Appraisal-btn">
                                <span class="material-icons-sharp">assessment</span>
                                <small>Employers</small>
                            </a>
                        </li>
                         <li>
                            <a href="#" id="pip-btn">
                                <span class="material-icons-sharp">trending_up</span>
                                <small>Employees</small>
                            </a>
                        </li> 
                        <li>
                            <a href="#" id="Admin-btn">
                                <span class="material-icons-sharp">admin_panel_settings</span>
                                <small>Admin</small>
                            </a>
                        </li>
                        <li id="analyst-btn" <?php echo !$isAnalyst ? 'style="display:none;"' : ''; ?>>
                             <a href="#">
                             <span class="material-icons-sharp">analytics</span>
                            <small>Analyst</small>
                              </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </body>
    
    
    <div class="main-content">
        <!-- HEAADER PART -->
        <header>
            <div class="header-content">
                <label for="menu-toggle">
                    <span class="material-icons-sharp">menu</span>
                </label>
                
                <div class="header-menu">
                    
                    <div class="logout">
                            <a href="logout.php" id="logout-button">
                                <span class="material-icons-sharp">power_settings_new</span>
                                <small>Logout</small>
                            </a>
                    </div> 
                    
                </div>
            </div>
        </header>
        <!-- MAIN CONTENT -->
         
        <!-- INTERFACE -->
        <div class="content">
            <iframe id="content-frame" src="dashboard.html" ></iframe>
        </div>
    </div>
    <script src="./index.js"></script>
</body>

</html>