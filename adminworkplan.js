document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("tableBody");
  const addRowButton = document.getElementById("addRowButton");
  const submitButton = document.getElementById("submitButton"); 
  const fetchButton = document.getElementById("FetchButton");

  const urlParams = new URLSearchParams(window.location.search);
  const staffNo = urlParams.get('staffNo');

  if (!staffNo) {
      alert('Invalid employee selection');
      window.location.href = 'dashboard.html';
      return;
  }

  if (!tableBody) {
    console.error("Table body not found!");
    return;
  }

  let isEditable = false; 

  // Fetch workplan data when the page loads
  fetch(`adminworkplan.php?staffNo=${staffNo}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  .then(response => response.json())
  .then(data => {
    tableBody.innerHTML = ''; // Clear table before inserting new data

    data.forEach(rowData => {
      const newRow = document.createElement("tr");

      newRow.innerHTML = `
          <td contenteditable="false">${rowData.Perspectives}</td>
          <td contenteditable="false">${rowData.StrategicObjective}</td>
          <td contenteditable="false">${rowData.SSMARTAObjectives}</td>
          <td contenteditable="false">${formatPercentage(rowData.WeightSSMARTAObjective)}</td>
          <td contenteditable="false">${formatPercentage(rowData.TargetSSMARTAObjective)}</td>
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
              <a href="#" class="add-link">Add</a> | <a href="#" class="delete-link">Delete</a>
          </td>
      `;
      tableBody.appendChild(newRow);
      attachRowListeners(newRow);
    });
  })
  .catch(error => console.error("Error fetching workplan data:", error));

  // Toggle editable mode
  document.getElementById("editButton").addEventListener("click", function () {
    const rows = tableBody.querySelectorAll("tr");
    isEditable = !isEditable;

    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      cells.forEach(cell => {
        cell.contentEditable = isEditable.toString();
        if (isEditable) {
          cell.style.border = "2px dashed #000"; // Change border to dashed
        } else {
          cell.style.border = "1px solid #ccc"; // Reset border to solid
        }
      });
    });

    addRowButton.style.display = isEditable ? "inline-block" : "none";
    this.innerText = isEditable ? "Done" : "Edit";
});


  // Add new row
  addRowButton.addEventListener("click", function () {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true">0.00%</td>
      <td contenteditable="true">0.00%</td>
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
          <a href="#" class="add-link">Add</a> | <a href="#" class="delete-link">Delete</a>
      </td>
    `;
    tableBody.appendChild(newRow);
    attachRowListeners(newRow);
  });

  function formatPercentage(value) {
    let num = parseFloat(value);
    return !isNaN(num) ? num.toFixed(2) + "%" : "0.00%";
  }

  // Submit data
  submitButton.addEventListener("click", function (event) {
    const rows = tableBody.querySelectorAll("tr");
    const submittedData = [];

    rows.forEach(row => {
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
    fetch(`adminworkplan.php?staffNo=${staffNo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submittedData }),
    })
    .then(response => response.text())
    .then(message => {
      alert(message);
      location.reload();
    })
    .catch(error => console.error("Error submitting data:", error));
  });

  function attachRowListeners(row) {
    row.querySelector(".delete-link").addEventListener("click", function (event) {
      event.preventDefault();
      row.remove();
    });

    row.querySelector(".add-link").addEventListener("click", function (event) {
      event.preventDefault();
      addRowButton.click();
    });
  }
});


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