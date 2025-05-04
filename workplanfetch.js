document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("tableBody");
    const fetchButton = document.getElementById("FetchButton");
    const progressContainer = document.getElementById("progressContainer");
    const progressBar = document.getElementById("progressBar");

    if (!tableBody) {
        console.error("Table body not found!");
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
        }, 200); // Progress bar animation speed
    }

    function fetchEmployeesData() {
        fetch("workplanfetch.php")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                tableBody.innerHTML = ""; // Clear existing rows

                if (data.length === 0 || (data.length === 1 && data[0].message)) {
                    const newRow = document.createElement("tr");
                    newRow.innerHTML = `<td colspan="20" style="text-align:center; color:red;">
                        ${data[0].message || "No data found, consult your supervisor."}
                    </td>`;
                    tableBody.appendChild(newRow);
                } else {
                    data.forEach((row) => {
                        const newRow = document.createElement("tr");
                        newRow.innerHTML = `
                            <td>${row.Perspectives || ''}</td>
                            <td>${row.StrategicObjective || ''}</td>
                            <td>${row.SSMARTAObjectives || ''}</td>
                            <td>${row.WeightSSMARTAObjective || ''}</td>
                            <td>${row.TargetSSMARTAObjective || ''}</td>
                            <td>${row.Initiatives || ''}</td>
                            <td>${row.SpecificActivities || ''}</td>
                            <td>${row.ExpectedOutput || ''}</td>
                            <td>${row.January || ''}</td>
                            <td>${row.February || ''}</td>
                            <td>${row.March || ''}</td>
                            <td>${row.April || ''}</td>
                            <td>${row.May || ''}</td>
                            <td>${row.June || ''}</td>
                            <td>${row.July || ''}</td>
                            <td>${row.August || ''}</td>
                            <td>${row.September || ''}</td>
                            <td>${row.October || ''}</td>
                            <td>${row.November || ''}</td>
                            <td>${row.December || ''}</td>
                            <td>
                                <a href="#" class="add-link" contenteditable="false">Add</a> | 
                                <a href="#" class="delete-link" contenteditable="false">Delete</a>
                            </td>
                        `;
                        tableBody.appendChild(newRow);
                    });
                }
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
