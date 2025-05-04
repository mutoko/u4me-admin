document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("tableBody");
  const addRowButton = document.getElementById("addRowButton");
  const submitButton = document.getElementById("submitButton"); // Reference to the submit button
  const FetchButton = document.getElementById("FetchButton");


  if (!tableBody) {
    console.error("Table body not found!");
    return;
  }

  let isEditable = false; // Tracks whether the table is in edit mode

  // Fetch data when the page loads up
  fetch("workplan.php", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
 })
 .then((response) => response.json()) // Parse JSON response
 .then((data) => {
    // Loop through the data and dynamically create rows in the table
    data.forEach((rowData) => {
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td contenteditable="false" class="first-column">${rowData.Perspectives}</td>
            <td contenteditable="false">${rowData.StrategicObjective}</td>
            <td contenteditable="false">${rowData.SSMARTAObjectives}</td>
            <td contenteditable="false" class="percentage">${formatPercentage(rowData.WeightSSMARTAObjective)}</td>
            <td contenteditable="false" class="percentage">${formatPercentage(rowData.TargetSSMARTAObjective)}</td>
            <td contenteditable="false">${rowData.Initiatives}</td>
            <td contenteditable="false">${rowData.SpecificActivities}</td>
            <td contenteditable="false">${rowData.ExpectedOutput}</td>
            <td contenteditable="false">${rowData.January}</td>
            <td contenteditable="false">${rowData.February}</td>
            <td contenteditable="false">${rowData.March}</td>
            <td contenteditable="false">${rowData.April}</td>
            <td contenteditable="false">${rowData.May}</td>
            <td contenteditable="false">${rowData.June}</td>
            <td contenteditable="false">${rowData.July}</td>
            <td contenteditable="false">${rowData.August}</td>
            <td contenteditable="false">${rowData.September}</td>
            <td contenteditable="false">${rowData.October}</td>
            <td contenteditable="false">${rowData.November}</td>
            <td contenteditable="false">${rowData.December}</td>
             <td>
                  <a href="#" class="add-link" contenteditable="false">Add</a> | <a href="#" class="delete-link" contenteditable="false">Delete</a>
              </td>
        `;

        // Append new row to table body
        tableBody.appendChild(newRow);

        // Attach event listeners for add and delete actions
        attachRowListeners(newRow);
    });
 })

  // Toggle editable mode on the table
  document.getElementById("editButton").addEventListener("click", function () {
    const rows = tableBody.querySelectorAll("tr");
    isEditable = !isEditable;

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      cells.forEach((cell) => {
        cell.contentEditable = isEditable.toString();
      });
    });

    
    // Toggle the dashed-border class for the table
    document.getElementById("editableTable").classList.toggle("dashed-border", isEditable);

    // Toggle the visibility of the Add Row and Delete Row buttons
    addRowButton.style.display = isEditable ? "inline-block" : "none";

    // Change button text between "Edit" and "Done"
    this.innerText = isEditable ? "Done" : "Edit";
  });

  // Add a new row
  addRowButton.addEventListener("click", function () {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true" >0.00%</td>
      <td contenteditable="true" >0.00%</td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
       <td>
                  <a href="#" class="add-link" contenteditable="false">Add</a> | <a href="#" class="delete-link" contenteditable="false">Delete</a>
              </td>
    `;
    tableBody.appendChild(newRow);
    attachRowListeners(newRow); // Attach listeners to the new row
  });

// Formats a number as a percentage 2 decimal places
  function formatPercentage(value) {
    let num = parseFloat(value);
    return !isNaN(num) ? num.toFixed(2) + "%" : "0.00%";
  }
// Function to validate if the sum of WeightSSMARTAObjective does not exceed 100%
  function checkColumnSumValidity() {
    let totalWeight = 0;
    let isValid = true;

    document.querySelectorAll("#tableBody tr").forEach((row) => {
      let weightCell = row.cells[3]; // Targeting WeightSSMARTAObjective column
      let weight = parseFloat(weightCell.innerText.replace("%", "")) || 0;
      totalWeight += weight;
    });

    if (totalWeight > 100) {
      alert("Error: The total sum of WeightSSMARTAObjective should not exceed 100%.");
      isValid = false;
    }

    return isValid;
  }
// Function to validate if TargetSSMARTAObjective does not exceed 100%
  function checkTargetValue() {
    let isValid = true;
    document.querySelectorAll("#tableBody tr").forEach((row) => {
      let targetCell = row.cells[4]; // Targeting TargetSSMARTAObjective column
      let target = parseFloat(targetCell.innerText.replace("%", "")) || 0;
      if (target > 100) {
        alert("Error: TargetSSMARTAObjective value cannot exceed 100%.");
        isValid = false;
      }
    });
    return isValid;
  }

// Event listener for the Submit button
  document.getElementById("submitButton").addEventListener("click", function (event) {
     // Prevent submission if validation fails
    if (!checkColumnSumValidity() || !checkTargetValue()) {
      event.preventDefault();
      return;
    }

    const rows = tableBody.querySelectorAll("tr");
    const submittedData = [];
    
// Extracting table data into an array of objects
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        const rowData = {
          Perspectives: cells[0].innerText.trim(),
          StrategicObjective: cells[1].innerText.trim(),
          SSMARTAObjectives: cells[2].innerText.trim(),
          WeightSSMARTAObjective: cells[3].innerText.trim().replace("%", ""),
          TargetSSMARTAObjective: cells[4].innerText.trim().replace("%", ""),
          Initiatives: cells[5].innerText.trim(),
          SpecificActivities: cells[6].innerText.trim(),
          ExpectedOutput: cells[7].innerText.trim(),
          January: cells[8].innerText.trim(),
          February: cells[9].innerText.trim(),
          March: cells[10].innerText.trim(),
          April: cells[11].innerText.trim(),
          May: cells[12].innerText.trim(),
          June: cells[13].innerText.trim(),
          July: cells[14].innerText.trim(),
          August: cells[15].innerText.trim(),
          September: cells[16].innerText.trim(),
          October: cells[17].innerText.trim(),
          November: cells[18].innerText.trim(),
          December: cells[19].innerText.trim(),
        };
        submittedData.push(rowData);
      });

      // Send data to the server
      fetch("workplan.php", {
        method: "POST",
        headers: {"Content-Type": "application/json", // Use application/json
        },
        body: JSON.stringify({ submittedData }), // Send data as JSON
      })
        .then((response) => response.text())
        .then((message) => {
          alert(message);
          location.reload();
        })
        .catch((error) => console.error("Error submitting data:", error));
    });

  // Attach listeners for add and delete links
  function attachRowListeners(row) {
    // Add event listener for the delete link
    const deleteButton = row.querySelector(".delete-link");
    deleteButton.addEventListener("click", function (event) {
      event.preventDefault();
      row.remove();
    });




    // Add event listener for the add link
    const addButton = row.querySelector(".add-link");
    addButton.addEventListener("click", function (event) {
      event.preventDefault();
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td contenteditable="false" class="Perspectives"></td>
        <td contenteditable="true" class="StrategicObjective"></td>
        <td contenteditable="true" class="SSMARTAObjectives"></td>
        <td contenteditable="true" class="WeightSSMARTAObjective">${formatPercentage(0)}</td>
        <td contenteditable="true" class="TargetSSMARTAObjective">${formatPercentage(0)}</td>
        <td contenteditable="true" class="Initiatives"></td>
        <td contenteditable="true" class="SpecificActivities"></td>
        <td contenteditable="true" class="ExpectedOutput"></td>
        <td contenteditable="true" class="January"></td>
        <td contenteditable="true" class="February"></td>
        <td contenteditable="true" class="March"></td>
        <td contenteditable="true" class="April"></td>
        <td contenteditable="true" class="May"></td>
        <td contenteditable="true" class="June"></td>
        <td contenteditable="true" class="July"></td>
        <td contenteditable="true" class="August"></td>
        <td contenteditable="true" class="September"></td>
        <td contenteditable="true" class="October"></td>
        <td contenteditable="true" class="November"></td>
        <td contenteditable="true" class="December"></td>
         <td>
                  <a href="#" class="add-link" contenteditable="false">Add</a> | <a href="#" class="delete-link" contenteditable="false">Delete</a>
              </td>
      `;
      row.after(newRow);
      attachRowListeners(newRow);
    });
  }

 // ADD DRAG OPTION

        const tableContainer = document.querySelector('.records');
        let isDragging = false;
        let startX, scrollLeft;
    
        // Start dragging
        tableContainer.addEventListener('mousedown', (e) => {
          isDragging = true;
          startX = e.pageX - tableContainer.offsetLeft;
          scrollLeft = tableContainer.scrollLeft;
          tableContainer.style.cursor = 'grabbing';
        });
    
        // Stop dragging
        tableContainer.addEventListener('mouseup', () => {
          isDragging = false;
          tableContainer.style.cursor = 'grab';
        });
    
        // Dragging movement
        tableContainer.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          e.preventDefault(); // Prevent text selection
          const x = e.pageX - tableContainer.offsetLeft;
          const scroll = (x - startX) * 2; // Adjust scroll speed here
          tableContainer.scrollLeft = scrollLeft - scroll;
        });
    
        // Prevent mouse leaving while dragging
        tableContainer.addEventListener('mouseleave', () => {
          if (isDragging) {
            isDragging = false;
            tableContainer.style.cursor = 'grab';
          }
        });


});      

