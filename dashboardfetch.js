document.addEventListener('DOMContentLoaded', function () {
    // Call the function on page load
    fetchAndUpdateData();

    // Set up a real-time interval to refresh data every 5 seconds (adjust as needed)
    setInterval(fetchAndUpdateData, 5000); // Fetch data every 5 second
});

function fetchAndUpdateData() {
    fetch('dashboardfetch.php')
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

                // Collect data for the chart
                names.push(employee.name);
                scores.push(supervisorAppraisal !== null ? parseFloat(supervisorAppraisal) : 0);
            });

            // Call function to create chart
            createAppraisalChart(names, scores);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function createAppraisalChart(names, scores) {
    const ctx = document.getElementById('appraisalChart').getContext('2d');

    // Define colors based on your provided theme
    const colors = [
        '#22BAA0',  // main color
        '#548dd4',  // primary
        '#ff7782',  // danger
        '#41f1b6',  // success
        '#ffbb55',  // warning
        '#7d8da1',  // info-dark
        '#dce1eb',  // info-light
        '#3f71e8',  // primary-variant
        '#677483'   // dark-variant
    ];

    // Assign colors dynamically
    const backgroundColors = names.map((_, index) => colors[index % colors.length]);

    new Chart(ctx, {
        type: 'doughnut', // Use doughnut chart for this case
        data: {
            labels: names,  // Names will appear in the legend
            datasets: [{
                label: 'Supervisor Appraisal (%)',
                data: scores,  // Supervisor Appraisal values will be used as the data
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => '#fff'), // White border
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true, // Ensure the aspect ratio is maintained
            plugins: {
                legend: {
                    position: 'top',  // Place the legend at the top
                    labels: {
                        font: {
                            size: 14
                        },
                        boxWidth: 15, // Adjust box width for legend items
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.raw.toFixed(1)}%`;
                        }
                    }
                },
                datalabels: {
                    color: '#fff',  // White color for the text inside the pie
                    font: {
                        size: 14,  // Size of the text
                        weight: 'bold'
                    },
                    formatter: (value, context) => {
                        // Display the percentage inside the pie
                        return `${value.toFixed(1)}%`;
                    },
                    anchor: 'center', // Anchor the label in the center of each slice
                    align: 'center',  // Align the label at the center
                }
            }
        },
        plugins: [ChartDataLabels] 
    });
}

function appraiseEmployee(staffNo) {
    window.location.href = `adminAppraisal.html?staffNo=${staffNo}`;
}

function fetchAdminWorkplan(staffNo) {
    window.location.href = `adminworkplan.html?staffNo=${staffNo}`;
}
