document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("tableBody");
  const submitButton = document.getElementById("submitButton");

  // Fetch existing data on page load
  fetch("Appraisalsubmit.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const rows = data.appraisals;
        rows.forEach((rowData) => {
          const row = document.createElement("tr");
          const values = Object.values(rowData);
          let uomHasPercent = false;

          // In the values.forEach loop, update the section handling indices 13 and 14:
values.forEach((value, index) => {
  const cell = document.createElement("td");
  let displayValue = value;

  // Check UoM column (index 3)
  if (index === 3) {
    uomHasPercent = String(value).includes('%');
  }

  // Format percentages
  if (index === 5) { 
    displayValue = parseFloat(value) + '%';
  } else if ([6, 7, 13].includes(index)) { 
    if (uomHasPercent && !isNaN(value)) {
      displayValue = parseFloat(value) + '%';
    }
  }

  
  if (index === 12) 
    { // Always add % for Supervisor's Target (column 13)
    if (!isNaN(value)) {
      displayValue = parseFloat(value) + '%';
    }
  } 
  else if (index === 14) 
    { // Follow UoM check for Actual Achievement
    if (uomHasPercent && !isNaN(value)) {
      displayValue = parseFloat(value) + '%';
    }
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
      alert("Error fetching existing data");
    });

  function checkscoreValue() {
    let isValid = true;
    document.querySelectorAll("#tableBody tr").forEach((row) => {
      let targetCell = row.cells[8];
      let target = parseFloat(targetCell.innerText.replace("%", "")) || 0;
      if (target < 0) {
        alert("Error: score value cannot be negative.");
        isValid = false;
      }
    });
    return isValid;
  }

  function validateBeforeSubmit() {
    let isValid = true;
    const invalidCells = [];
  
    document.querySelectorAll("#tableBody tr").forEach(row => {
      const cells = row.querySelectorAll("td");
      const measureCell = cells[3].textContent.trim();
      const isPercentage = measureCell.includes('%');
  
      [6, 7].forEach(colIndex => {
        const cell = cells[colIndex];
        const rawValue = cell.textContent.replace("%", "");
        const value = parseFloat(rawValue);
  
        if (isPercentage) {
          // Validate percentage values between 1-100
          if (isNaN(value) || value < 1 || value > 100) {
            cell.classList.add("invalid-cell");
            invalidCells.push(cell);
            isValid = false;
          }
        } else {
          // Validate non-percentage values >= 0
          if (isNaN(value) || value < 0) {
            cell.classList.add("invalid-cell");
            invalidCells.push(cell);
            isValid = false;
          }
        }
      });
    });
  
    if (!isValid) {
      alert("Validation failed. Highlighted fields should be 1-100 when Unit of Measure is %.");
      invalidCells[0].scrollIntoView({ behavior: "smooth" });
      return false;
    }
    return checkscoreValue();
  }

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
        
        // Remove % before submission for relevant columns
        if ([5, 6, 7].includes(index)) {
          value = value.replace("%", "");
        }

        // Map to correct properties
        const columnMap = [
          'Perspectives', 'SSMARTAObjectives', 'Initiatives', 'UoM', 'DI',
          'WeightSSMARTAObjective', 'TargetSSMARTAObjective', 'Annual_Actual_Achievement',
          'Annual_Score', 'Annual_Weighted_Average', 'Annual_Detailed_Explanation',
          'Annual_Evidence', 'Supervisor_WeightSSMARTAObjective', 
          'Supervisor_TargetSSMARTAObjective', 'Supervisor_ActualAchievement',
          'Supervisor_Score', 'Supervisor_Weighted_Average', 'Supervisor_Comments',
          'Supervisor_IdentifiedGaps', 'Supervisor_Strategies'
        ];

        rowData[columnMap[index]] = value;
      });

      submittedData.push(rowData);
    });

    fetch("Appraisalsubmit.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submittedData }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        data.status === "success" && location.reload();
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        alert("Error submitting data");
      });
  });

  // Empty validation placeholders
  function checkColumnSumValidity() { return true; }
  function checkTargetValue() { return true; }
});