document.getElementById("submitBtn").addEventListener("click", function () {
  // Prepare the data to be sent
  let tableData = [];

  // Loop through the rows of the table and collect the data
  document.querySelectorAll("#dataTable tbody tr").forEach(row => {
      let rowData = {
          Perspectives: row.cells[0].innerText.trim(),
          StrategicObjective: row.cells[1].innerText.trim(),
          SSMARTAObjectives: row.cells[2].innerText.trim(),
          WeightSSMARTAObjective: parseFloat(row.cells[3].innerText.trim()) || 0,
          TargetSSMARTAObjective: parseFloat(row.cells[4].innerText.trim()) || 0,
          Initiatives: row.cells[5].innerText.trim(),
          SpecificActivities: row.cells[6].innerText.trim(),
          ExpectedOutput: row.cells[7].innerText.trim(),
          January: row.cells[8].innerText.trim(),
          February: row.cells[9].innerText.trim(),
          March: row.cells[10].innerText.trim(),
          April: row.cells[11].innerText.trim(),
          May: row.cells[12].innerText.trim(),
          June: row.cells[13].innerText.trim(),
          July: row.cells[14].innerText.trim(),
          August: row.cells[15].innerText.trim(),
          September: row.cells[16].innerText.trim(),
          October: row.cells[17].innerText.trim(),
          November: row.cells[18].innerText.trim(),
          December: row.cells[19].innerText.trim()
      };
      tableData.push(rowData);
  });

  // Log the data to ensure it's being collected correctly
  console.log("Table Data to Send:", tableData);

  // Send the data to the PHP script
  fetch("implementation submit.php", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ submittedData: tableData })
  })
  .then(response => response.text())
  .then(data => {
      console.log("Server Response:", data); // Log the server response
      alert(data); // Show alert with the server's response
  })
  .catch(error => {
      console.error("Error:", error); // Catch and log any errors
  });
});
