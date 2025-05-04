document.addEventListener('DOMContentLoaded', function () {
    // Call the function on page load
    fetchAndUpdateData();
});

function fetchAndUpdateData() {
    fetch('analystdashboardfetch.php')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = ''; // Clear existing rows

            let names = [];
            let scores = [];

            data.forEach(employee => {
                const row = document.createElement('tr');

                // Determine the Work Plan status based on overallTotal
                let overallTotal = employee.overallTotal;
                let workPlanStatus = overallTotal === null ? 'Not Submitted' : 'Submitted';
                let workPlanColor = overallTotal === null ? '#ff7782' : '#41f1b6';  // Red if not submitted, green if submitted

                // Determine the Supervisor status based on supervisor_appraisal
                let supervisorAppraisal = employee.supervisor_appraisal;
                let supervisorStatus = 'Not Submitted'; // Default status for supervisor
                let supervisorColor = '#ff7782'; // Default color for supervisor status

                if (supervisorAppraisal !== null) {
                    if (supervisorAppraisal >= 0 && supervisorAppraisal < 2) {
                        supervisorStatus = 'Pending...';
                        supervisorColor = '#3f71e8'; // Blue color for Pending...
                    } else if (supervisorAppraisal >= 2) {
                        supervisorStatus = 'Appraised';
                        supervisorColor = '#41f1b6'; // Green color for Appraised
                    }
                }

                row.innerHTML = ` 
                    <td>${employee.staffNo}</td>
                    <td>${employee.username}</td>
                    <td>${employee.name}</td>
                    <td>${employee.designation1}</td>
                    <td>${employee.department1}</td>
                    <td>${supervisorAppraisal !== null ? supervisorAppraisal + '%' : 'N/A'}</td>
                    <td style="color: ${workPlanColor}">${workPlanStatus}</td> <!-- Work Plan column -->
                    <td style="color: ${supervisorColor}">${supervisorStatus}</td> <!-- Supervisor status column -->
                    <td>
                        <button class="appraisebtn" onclick="fetchAdminWorkplan('${employee.staffNo}')">WORKPLAN</button>
                        <button class="appraisebtn" onclick="appraiseEmployee('${employee.staffNo}')">APPRAISE</button>
                    </td>
                `;

                tableBody.appendChild(row);

                // Collect data for the chart (now unused)
                names.push(employee.name);
                scores.push(supervisorAppraisal !== null ? parseFloat(supervisorAppraisal) : 0);
            });

            // Chart creation has been removed
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to fetch the data from the backend API
async function fetchData() {
    try {
        const response = await fetch('analystdashboardfetch.php');
        const data = await response.json();
        allRecords = data; // Store the fetched data globally
        populateTable(allRecords); // Initialize table with all data first
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to populate the table with all records
function populateTable(records) {
    const tableBody = document.getElementById('tableBody');
    const noDataMessage = document.getElementById('noDataMessage');
    tableBody.innerHTML = ''; // Clear the table first

    // If no records found, show "No Data" message
    if (records.length === 0) {
        noDataMessage.style.display = 'block';
    } else {
        noDataMessage.style.display = 'none';
        // Populate the table with data
        records.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.staffNo}</td>
                <td>${record.username}</td>
                <td>${record.name}</td>
                <td>${record.designation}</td>
                <td>${record.department}</td>
                <td>${record.score}</td>
                <td>${record.workplan}</td>
                <td>${record.appraisal}</td>
                <td><button>Action</button></td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Function to filter the table by department (CBT or GDT)
function filterTableByDepartment(department) {
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.getElementsByTagName('tr');
    let noDataFound = true;

    // Loop through each row and check if the department matches the selected value
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const departmentCell = row.cells[4]; // Column 5 (Department)
        if (departmentCell && departmentCell.textContent.trim() === department) {
            row.style.display = ''; // Show the row if the department matches
            noDataFound = false;
        } else {
            row.style.display = 'none'; // Hide the row if the department doesn't match
        }
    }

    // If no data matches the selected department, show "No Data" message
    const noDataMessage = document.getElementById('noDataMessage');
    if (noDataFound) {
        noDataMessage.style.display = 'block';
    } else {
        noDataMessage.style.display = 'none';
    }
}

// Event listener to handle dropdown change for department filter
document.getElementById('dataType').addEventListener('change', function() {
    const selectedType = this.value;
    filterTableByDepartment(selectedType); // Filter the table by selected department
});

// Function to initialize the page with the selected department filter on load
function initializePage() {
    const selectedType = document.getElementById('dataType').value; // Get selected directorate
    filterTableByDepartment(selectedType); // Filter the table on load
}

// Initialize the table on page load
window.onload = function() {
    fetchData(); // Fetch data from the backend and populate the table
    initializePage(); // Apply department filter based on selected value
};

// Appraise Employee and Fetch Workplan functions
function appraiseEmployee(staffNo) {
    window.location.href = `adminAppraisal.html?staffNo=${staffNo}`;
}

function fetchAdminWorkplan(staffNo) {
    window.location.href = `adminworkplan.html?staffNo=${staffNo}`;
}
