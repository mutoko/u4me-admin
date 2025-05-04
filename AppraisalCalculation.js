document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("tableBody");
    const selfAppraisal = document.getElementById("selfappraisal");
    const supervisorAppraisal = document.getElementById("supervisorappraisal");
    const errorMessage = document.createElement("p"); 
    errorMessage.id = "errorMessage";
    errorMessage.style.color = "red";
    errorMessage.style.fontWeight = "bold";
    document.querySelector("table").after(errorMessage);

    // Fetch existing appraisal data when page loads
    function fetchAppraisalData() {
        fetch('AppraisalCalculation.php', {
            method: 'GET',
            credentials: 'same-origin',
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.data) {
                selfAppraisal.textContent = `${parseFloat(data.data.self_appraisal || 0).toFixed(2)}%`;
                supervisorAppraisal.textContent = `${parseFloat(data.data.supervisor_appraisal || 0).toFixed(2)}%`;
                errorMessage.textContent = "";
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
        const target = parsePercentage(row.cells[6]?.textContent || "0");
        const actual = parsePercentage(row.cells[7]?.textContent || "0");
        const result = target !== 0 ? (actual * 100) / target : 0;
        row.cells[8].textContent = `${result.toFixed(2)}%`;
    }

    // Calculate Weighted Average (column 9)
    function calculateRow(row) {
        const weight = parsePercentage(row.cells[5]?.textContent || "0");
        const score = parsePercentage(row.cells[8]?.textContent || "0");
        const result = (weight * score) / 100;
        row.cells[9].textContent = `${result.toFixed(2)}%`;
    }

    // Calculate Total Self-Appraisal
    function calculateTotal() {
        let total = 0;
        tableBody.querySelectorAll("tr").forEach(row => {
            const weightedAvg = parsePercentage(row.cells[9]?.textContent || "0");
            total += weightedAvg;
        });
        selfAppraisal.textContent = `${total.toFixed(2)}%`;
    }

    // Real-time calculation handler
    function handleChanges() {
        tableBody.addEventListener("input", (e) => {
            const cell = e.target;
            const row = cell.closest("tr");
            const cellIndex = cell.cellIndex;

            // Trigger calculations when relevant columns change
            if ([6, 7].includes(cellIndex)) {
                calculateCustomValue(row);
            }
            if ([5, 6, 7, 8].includes(cellIndex)) {
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

    // Save handler
    document.getElementById("submitButton").addEventListener("click", function() {
        const selfAppraisalValue = parsePercentage(selfAppraisal.textContent).toFixed(2);
        const supervisorAppraisalValue = parsePercentage(supervisorAppraisal.textContent).toFixed(2);
        
        fetch('AppraisalCalculation.php', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                self_appraisal: selfAppraisalValue,
                supervisor_appraisal: supervisorAppraisalValue
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
});