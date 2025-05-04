document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("tableBody");
    const fetchButton = document.getElementById("FetchButton");
    const progressContainer = document.getElementById("progressContainer");
    const progressBar = document.getElementById("progressBar");

    if (!tableBody || !fetchButton || !progressContainer || !progressBar) {
        console.error("One or more required elements not found in the document.");
        return;
    }

    fetchButton.addEventListener("click", function () {
        progressContainer.style.display = "block"; // Show progress bar
        animateProgressBar();
        fetchEmployeesData();
    });

    function animateProgressBar() {
        let progress = 0;
        progressBar.style.width = "0%";
        progressBar.innerText = "0%";

        const interval = setInterval(() => {
            if (progress >= 100) {
                clearInterval(interval);
            } else {
                progress += 10;
                progressBar.style.width = progress + "%";
                progressBar.innerText = progress + "%";
            }
        }, 200);
    }

    function fetchEmployeesData() {
        fetch("Appraisalfetch.php")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched data:", data); // Debugging

                tableBody.innerHTML = ""; // Clear existing rows before appending new ones

                // Filter data to only include rows where the 'Initiatives' column is not empty or null
                const filteredData = data.filter(row => row.Initiatives && row.Initiatives.trim() !== "");

                if (filteredData.length === 0) {
                    tableBody.innerHTML = `<tr>
                        <td colspan="20" style="text-align:center; color:red;">
                            No valid data found, consult your supervisor.
                        </td>
                    </tr>`;
                    return; // Stop execution if no data
                }

                const fragment = document.createDocumentFragment(); // Optimize DOM manipulation

                filteredData.forEach((row) => {
                    const newRow = document.createElement("tr");
                    newRow.innerHTML = `
                        <td contenteditable="false"><strong>${row.Perspectives || ""}</strong></td>
                        <td contenteditable="false">${row.SSMARTAObjectives || ""}</td>
                        <td contenteditable="false">${row.Initiatives || ""}</td>
                        <td contenteditable="false">%</td> <!-- Updated DI column -->
                        <td contenteditable="false">I</td> <!-- Updated UoM column -->
                        <td contenteditable="false">${row.WeightSSMARTAObjective || "0%"}</td>
                        <td contenteditable="false">${row.TargetSSMARTAObjective || "0%"}</td>
                        <td contenteditable="false">100%</td> <!-- Default achievement -->
                        <td contenteditable="false">100%</td> <!-- Default score -->
                        <td contenteditable="false"></td>
                        <td contenteditable="false"></td>
                        <td contenteditable="false"></td>
                        <td contenteditable="false">${row.WeightSSMARTAObjective || "0%"}</td>
                        <td contenteditable="false">${row.TargetSSMARTAObjective || "0%"}</td>
                        <td contenteditable="false">100%</td>
                        <td contenteditable="false">100%</td>
                        <td contenteditable="false"></td>
                        <td contenteditable="false"></td>
                        <td contenteditable="false"></td>
                        <td contenteditable="false"></td>
                    `;
                    fragment.appendChild(newRow);
                });

                tableBody.appendChild(fragment); // Append rows in one operation for efficiency
            })
            .catch((error) => console.error("Error fetching employees data:", error))
            .finally(() => {
                progressBar.style.width = "100%";
                progressBar.innerText = "100%";
                setTimeout(() => {
                    progressContainer.style.display = "none"; // Hide after completion
                }, 1000);
            });
    }
});

// Edit button functionality
document.getElementById("editButton").addEventListener("click", function () {
    const table = document.getElementById("editableTable");
    const rows = table.getElementsByTagName("tr");
    let isEditable = table.classList.contains("dashed-border"); // Check if already editable

    for (let i = 1; i < rows.length; i++) { // Skip header row
        const cells = rows[i].getElementsByTagName("td");
        for (let j = 0; j < cells.length; j++) {
            if (j === 3 || j === 6 || j === 7 || j === 10 || j === 11) { // Make specific columns editable
                cells[j].contentEditable = !isEditable ? "true" : "false";
            } else {
                cells[j].contentEditable = "false"; // Keep other columns uneditable
            }
        }
    }

    // Toggle button text between "Appraise" and "Done"
    const button = document.getElementById("editButton");
    button.textContent = button.textContent.trim() === "Appraise" ? "Done" : "Appraise";

    // Add or remove dashed border style
    table.classList.toggle("dashed-border");
});
