document.addEventListener("DOMContentLoaded", function () {
    fetchTotals(); // Load totals from the database on page load

    document.getElementById("submitButton").addEventListener("click", function () {
        submitData(); // Save data to the database when submitting
    });

    document.querySelector("#tableBody").addEventListener("input", function (event) {
        let targetCell = event.target.closest("td");

        // Only recalculate when editing the Weight column (index 3)
        if (targetCell && targetCell.cellIndex === 3) {
            calculateTotals();
        }
    });
});

function calculateTotals() {
    let totals = {
        'ORGANIZATION CAPACITY': 0,
        'BUSINESS PROCESS': 0,
        'CUSTOMER': 0,
        'FINANCIAL': 0
    };
    let overallTotal = 0;

    document.querySelectorAll("#tableBody tr").forEach(row => {
        let perspective = row.cells[0]?.innerText.trim().toUpperCase();
        let weight = parseFloat(row.cells[3]?.innerText.trim()) || 0;

        if (totals.hasOwnProperty(perspective)) {
            totals[perspective] += weight;
        }
        overallTotal += weight;
    });

    if (overallTotal > 100) {
        alert("Error: The total percentage cannot exceed 100%. Please adjust the values.");
        return;
    }

    document.getElementById("orgCapacityTotal").innerText = totals['ORGANIZATION CAPACITY'].toFixed(2) + "%";
    document.getElementById("businessOrgTotal").innerText = totals['BUSINESS PROCESS'].toFixed(2) + "%";
    document.getElementById("customerTotal").innerText = totals['CUSTOMER'].toFixed(2) + "%";
    document.getElementById("financialTotal").innerText = totals['FINANCIAL'].toFixed(2) + "%";
    document.getElementById("overallTotal").innerText = overallTotal.toFixed(2) + "%";
}

function fetchTotals() {
    fetch('workplancalc.php?action=fetch')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let totals = data.totals;
                document.getElementById("orgCapacityTotal").innerText = parseFloat(totals.orgCapacity).toFixed(2) + "%";
                document.getElementById("businessOrgTotal").innerText = parseFloat(totals.businessProcess).toFixed(2) + "%";
                document.getElementById("customerTotal").innerText = parseFloat(totals.customer).toFixed(2) + "%";
                document.getElementById("financialTotal").innerText = parseFloat(totals.financial).toFixed(2) + "%";
                document.getElementById("overallTotal").innerText = parseFloat(totals.overallTotal).toFixed(2) + "%";
            } else {
                console.warn("No stored data found:", data.error);
            }
        })
        .catch(error => console.error("Error fetching totals:", error));
}

function submitData() {
    let totals = {
        'ORGANIZATION CAPACITY': parseFloat(document.getElementById("orgCapacityTotal").innerText) || 0,
        'BUSINESS PROCESS': parseFloat(document.getElementById("businessOrgTotal").innerText) || 0,
        'CUSTOMER': parseFloat(document.getElementById("customerTotal").innerText) || 0,
        'FINANCIAL': parseFloat(document.getElementById("financialTotal").innerText) || 0
    };

    let overallTotal = parseFloat(document.getElementById("overallTotal").innerText) || 0;

    fetch('workplancalc.php?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totals: totals, overallTotal: overallTotal })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Data successfully saved.");
            } else {
                alert("Error saving data: " + data.error);
            }
        })
        .catch(error => console.error("Submission error:", error));
}
