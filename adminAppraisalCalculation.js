document.addEventListener("DOMContentLoaded", function() {
    const selfAppraisal = document.getElementById("selfappraisal");
    const supervisorAppraisal = document.getElementById("supervisorappraisal");
    const errorMessage = document.getElementById("error-message");

    const urlParams = new URLSearchParams(window.location.search);
    const staffNo = urlParams.get('staffNo');

    if (!staffNo) {
        alert('Invalid employee selection');
        window.location.href = 'dashboard.html';
        return;
    }

    // Fetch existing appraisal data when page loads
    function fetchAppraisalData() {
        fetch(`adminAppraisalCalculation.php?staffNo=${staffNo}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.data) {
                selfAppraisal.textContent = `${parseFloat(data.data.self_appraisal || 0).toFixed(2)}%`;
                supervisorAppraisal.textContent = `${parseFloat(data.data.supervisor_appraisal || 0).toFixed(2)}%`;
                errorMessage.textContent = "";  // Clear the error message
            } else {
                selfAppraisal.textContent = "0.00%";
                supervisorAppraisal.textContent = "0.00%";
                errorMessage.textContent = "No appraisal data found.";
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            errorMessage.textContent = "Failed to load appraisal data.";
        });
    }

    // Parse percentage values from cells
    function parsePercentage(value) {
        return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    }

    // Calculate Score percentage (column 8)
    function calculateCustomValue(row) {
        const target = parsePercentage(row.cells[13]?.textContent || "0");
        const actual = parsePercentage(row.cells[14]?.textContent || "0");
        const result = target !== 0 ? (actual * 100) / target : 0;
        row.cells[15].textContent = `${result.toFixed(2)}%`;
    }

    // Calculate Weighted Average (column 9)
    function calculateRow(row) {
        const weight = parsePercentage(row.cells[12]?.textContent || "0");
        const score = parsePercentage(row.cells[15]?.textContent || "0");
        const result = (weight * score) / 100;
        row.cells[16].textContent = `${result.toFixed(2)}%`;
    }

    // Calculate Total Self-Appraisal
    function calculateTotal() {
        let total = 0;
        const tableBody = document.getElementById("tableBody");
        tableBody.querySelectorAll("tr").forEach(row => {
            const weightedAvg = parsePercentage(row.cells[16]?.textContent || "0");
            total += weightedAvg;
        });
        supervisorAppraisal.textContent = `${total.toFixed(2)}%`;
    }

    // Real-time calculation handler
    function handleChanges() {
        const tableBody = document.getElementById("tableBody");
        tableBody.addEventListener("input", (e) => {
            const cell = e.target;
            const row = cell.closest("tr");
            const cellIndex = cell.cellIndex;

            // Trigger calculations when relevant columns change
            if ([13, 14].includes(cellIndex)) {
                calculateCustomValue(row);
            }
            if ([12, 13, 14, 15].includes(cellIndex)) {
                calculateRow(row);
                calculateTotal();
            }
        });
    }

    // MutationObserver for dynamic rows
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === "TR") {
                    calculateCustomValue(node);
                    calculateRow(node);
                    calculateTotal();
                }
            });
        });
    });

    // Initialize
    const tableBody = document.getElementById("tableBody");
    if (tableBody) {
        // Initial calculation
        tableBody.querySelectorAll("tr").forEach(row => {
            calculateCustomValue(row);
            calculateRow(row);
        });
        calculateTotal();
        
        // Set up event listeners
        handleChanges();
        observer.observe(tableBody, { childList: true });
        fetchAppraisalData();
    }

    // Save handler - Ensure submitButton exists before attaching event
    const submitButton = document.getElementById("submitButton");
    if (submitButton) {
        submitButton.addEventListener("click", function(event) {
            event.preventDefault();  // Prevent form submission if inside a form
            const selfAppraisalValue = parsePercentage(selfAppraisal.textContent).toFixed(2);
            const supervisorAppraisalValue = parsePercentage(supervisorAppraisal.textContent).toFixed(2);
            
            fetch('adminAppraisalCalculation.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    self_appraisal: selfAppraisalValue,
                    supervisor_appraisal: supervisorAppraisalValue,
                    staffNo: staffNo // Include staffNo to identify the employee
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert(data.message);
                } else {
                    errorMessage.textContent = "Failed to save appraisal data.";
                }
            })
            .catch(error => {
                console.error('Error saving data:', error);
                errorMessage.textContent = "Error saving appraisal data.";
            });
        });
    }

    // Edit handler - Ensure editButton exists before attaching event
    const editButton = document.getElementById("editButton");
    if (editButton) {
        editButton.addEventListener("click", function () {
            const table = document.getElementById("editableTable");
            const rows = table.getElementsByTagName("tr");
            let isEditable = table.classList.contains("dashed-border"); // Check if already editable

            for (let i = 1; i < rows.length; i++) { // Skip header row
                const cells = rows[i].getElementsByTagName("td");
                for (let j = 0; j < cells.length; j++) {
                    if (j === 13 || j === 14 || j === 17 || j === 18 || j === 19) { // Only make column 13,14,17,18 and 19 editable
                        cells[j].contentEditable = !isEditable ? "true" : "false";
                    } else {
                        cells[j].contentEditable = "false"; // Keep all other columns uneditable
                    }
                }
            }

            // Toggle button text between "Appraise" and "Done"
            if (editButton.textContent.trim() === "Appraise") {
                editButton.textContent = "Done";
            } else {
                editButton.textContent = "Appraise";
            }

            // Add or remove dashed border style
            table.classList.toggle("dashed-border");
        });
    }
});
