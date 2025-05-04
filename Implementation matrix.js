document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("tableBody");

  if (!tableBody) {
    console.error("Table body not found!");
    return;
  }

  // Fetch data when the page loads up
  fetch("implementation matrix.php", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Function to filter data based on the selected quarter
      function filterData(quarter) {
        // Clear existing rows
        tableBody.innerHTML = '';

        // Loop through the data and dynamically create rows in the table
        data.forEach((rowData) => {
          const newRow = document.createElement("tr");

          let filteredRow = `
            <td class="first-column">${rowData.Perspectives}</td>
            <td>${rowData.StrategicObjective}</td>
            <td>${rowData.SSMARTAObjectives}</td>
            <td class="percentage">${rowData.WeightSSMARTAObjective}%</td>
            <td class="percentage">${rowData.TargetSSMARTAObjective}%</td>
            <td>${rowData.Initiatives}</td>
            <td>${rowData.SpecificActivities}</td>
            <td>${rowData.ExpectedOutput}</td>
            <td>${rowData.January}</td>
            <td>${rowData.February}</td>
            <td>${rowData.March}</td>
            <td>${rowData.April}</td>
            <td>${rowData.May}</td>
            <td>${rowData.June}</td>
            <td>${rowData.July}</td>
            <td>${rowData.August}</td>
            <td>${rowData.September}</td>
            <td>${rowData.October}</td>
            <td>${rowData.November}</td>
            <td>${rowData.December}</td>
          `;

          // Adjust row data based on the selected quarter
          switch (quarter)
           {
            case '1st Quarter':
              filteredRow = `
                <td class="first-column">${rowData.Perspectives}</td>
                <td>${rowData.StrategicObjective}</td>
                <td>${rowData.SSMARTAObjectives}</td>
                <td class="percentage">${rowData.WeightSSMARTAObjective}%</td>
                <td class="percentage">${rowData.TargetSSMARTAObjective}%</td>
                <td>${rowData.Initiatives}</td>
                <td>${rowData.SpecificActivities}</td>
                <td>${rowData.ExpectedOutput}</td>
                <td>${rowData.January}</td>
                <td>${rowData.February}</td>
                <td>${rowData.March}</td>
                <td></td>
                <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
              `;
              break;
            case 'Mid Year':
              filteredRow = `
                <td class="first-column">${rowData.Perspectives}</td>
                <td>${rowData.StrategicObjective}</td>
                <td>${rowData.SSMARTAObjectives}</td>
                <td class="percentage">${rowData.WeightSSMARTAObjective}%</td>
                <td class="percentage">${rowData.TargetSSMARTAObjective}%</td>
                <td>${rowData.Initiatives}</td>
                <td>${rowData.SpecificActivities}</td>
                <td>${rowData.ExpectedOutput}</td>
                <td>${rowData.January}</td>
                <td>${rowData.February}</td>
                <td>${rowData.March}</td>
                <td>${rowData.April}</td>
                <td>${rowData.May}</td>
                <td>${rowData.June}</td><td></td><td></td><td></td><td></td><td></td>
              `;
              break;
            case '3rd Quarter':
              filteredRow = `
                <td class="first-column">${rowData.Perspectives}</td>
                <td>${rowData.StrategicObjective}</td>
                <td>${rowData.SSMARTAObjectives}</td>
                <td class="percentage">${rowData.WeightSSMARTAObjective}%</td>
                <td class="percentage">${rowData.TargetSSMARTAObjective}%</td>
                <td>${rowData.Initiatives}</td>
                <td>${rowData.SpecificActivities}</td>
                <td>${rowData.ExpectedOutput}</td>
                <td>${rowData.January}</td>
                <td>${rowData.February}</td>
                <td>${rowData.March}</td>
                <td>${rowData.April}</td>
                <td>${rowData.May}</td>
                <td>${rowData.June}</td>
                <td>${rowData.July}</td>
                <td>${rowData.August}</td>
                <td>${rowData.September}</td>
                <td></td><td></td>
              `;
              break;
            case 'Full Year':
              // Full year with all months
              break;
            default:
              break;
          }

          // Insert the row into the table
          newRow.innerHTML = filteredRow;
          tableBody.appendChild(newRow);
        });
      }

      // Fetch data from the server in percentange format
  function formatPercentage(value) {
    let num = parseFloat(value);
    if (!isNaN(num)) {
      return num.toFixed(2) + "%";
    }
    return "0.00%";
  }
 // Check if total of percentages exceeds 100%
 function checkPercentageLimit() {
  let totalWeight = 0;
  let totalTarget = 0;

  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row) => {
    const weight = parseFloat(row.querySelector(".percentage").innerText.replace("%", ""));
    const target = parseFloat(row.querySelectorAll(".percentage")[1].innerText.replace("%", ""));
    totalWeight += weight;
    totalTarget += target;
  });

  if (totalWeight > 100 || totalTarget > 100) {
    submitButton.disabled = true; 
  } else {
    submitButton.disabled = false; // Enable submit button if total is valid
  }
}

      // Initialize to show full year data
      filterData('Full Year');

      // Attach click event to each quarter button by ID
      document.getElementById('firstQuarter').addEventListener('click', () => {
        filterData('1st Quarter');
      });
      document.getElementById('midYear').addEventListener('click', () => {
        filterData('Mid Year');
      });
      document.getElementById('thirdQuarter').addEventListener('click', () => {
        filterData('3rd Quarter');
      });
      document.getElementById('fullYear').addEventListener('click', () => {
        filterData('Full Year');
      });
    })
    .catch((error) => console.error("Error fetching data:", error));

  // Add hand drag functionality for horizontal scrolling
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
