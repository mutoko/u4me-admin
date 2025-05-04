document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("tableBody");
  const submitButton = document.getElementById("submitButton");
  const urlParams = new URLSearchParams(window.location.search);
  const staffNo = urlParams.get('staffNo');

  // Fetch existing data on page load
  fetch(`adminAppraisalsubmit.php?staffNo=${staffNo}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("My data is:", data)
      if (data.status === "success") {
        const rows = data.appraisals;
        rows.forEach((rowData) => {
          const row = document.createElement("tr");
          const values = Object.values(rowData);
          let uomHasPercent = false;

          values.forEach((value, index) => {
            const cell = document.createElement("td");
            let displayValue = value;

            // Check UoM column (index 3)
            if (index === 3) {
              uomHasPercent = String(value).includes('%');
            }

            // Format percentages for specific columns
            if ([5, 6, 7, 13, 14, 8].includes(index)) {
              if (!isNaN(value)) {
                displayValue = parseFloat(value).toFixed(2) + '%';
              }
            }

            // Handle Supervisor columns and annual score
            if (index === 9 && !value.includes('%') && !isNaN(value)) {
              displayValue = parseFloat(value) + '%'; // Add % to Column 9 if it doesn't have it
            }

            cell.textContent = displayValue;
            row.appendChild(cell);
          });
          tableBody.appendChild(row);
        });
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Error loading existing data");
    });

  // Validate score values
  function checkscoreValue() {
    let isValid = true;
    document.querySelectorAll("#tableBody tr").forEach((row) => {
      const targetCell = row.cells[8]; // Annual_Score column
      const target = parseFloat(targetCell.textContent.replace("%", "")) || 0;
      if (target < 0) {
        alert("Error: Score value cannot be negative.");
        isValid = false;
      }
    });
    return isValid;
  }

  // Main validation logic
  function validateBeforeSubmit() {
    let isValid = true;
    const invalidCells = [];
  
    document.querySelectorAll("#tableBody tr").forEach(row => {
      const cells = row.querySelectorAll("td");
      const measureCell = cells[3].textContent.trim();
      const isPercentage = measureCell.includes('%');
  
      [6, 7, 13, 14, 8].forEach(colIndex => { // Columns 7, 8, 14, 15
        const cell = cells[colIndex];
        const rawValue = cell.textContent.replace("%", "");
        const value = parseFloat(rawValue);
  
        if (isPercentage) {
          // Check if it's a valid percentage (1 - 100 for percentage columns)
          if (isNaN(value) || value < 1 || value > 100) {
            cell.classList.add("invalid-cell");
            invalidCells.push(cell);
            isValid = false;
          }
        } else {
          // Allow any numeric value in columns 8
          if (isNaN(value)) {
            cell.classList.add("invalid-cell");
            invalidCells.push(cell);
            isValid = false;
          }
        }
      });
    });
  
    if (!isValid) {
      alert("Validation failed: Highlighted fields must be valid numbers or percentages.");
      invalidCells[0].scrollIntoView({ behavior: "smooth" });
    }
    return isValid && checkscoreValue();
  }

  // Submit handler
  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (!validateBeforeSubmit()) return;

    const rows = tableBody.querySelectorAll("tr");
    const submittedData = [];

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      const rowData = {};

      cells.forEach((cell, index) => {
        let value = cell.textContent.trim();
        
        // Remove % from numeric columns before submission
        if ([5, 6, 7, 12, 13, 14, 8].includes(index)) {
          value = value.replace("%", "");
        }

        // Map columns to database fields
        const columnMap = [
          'Perspectives', 'SSMARTAObjectives', 'Initiatives', 'UoM', 'DI',
          'WeightSSMARTAObjective', 'TargetSSMARTAObjective', 
          'Annual_Actual_Achievement', 'Annual_Score', 'Annual_Weighted_Average',
          'Annual_Detailed_Explanation', 'Annual_Evidence', 
          'Supervisor_WeightSSMARTAObjective', 'Supervisor_TargetSSMARTAObjective',
          'Supervisor_ActualAchievement', 'Supervisor_Score', 
          'Supervisor_Weighted_Average', 'Supervisor_Comments',
          'Supervisor_IdentifiedGaps', 'Supervisor_Strategies'
        ];

        rowData[columnMap[index]] = value;
      });

      submittedData.push(rowData);
    });

    // Submit data with staffNo
    fetch("adminAppraisalsubmit.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        staffNo: staffNo,
        submittedData: submittedData
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        if (data.status === "success") location.reload();
      })
      .catch((error) => {
        console.error("Submission error:", error);
        alert("Failed to save data");
      });
  });
});
