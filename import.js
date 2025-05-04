document.getElementById("Importbtn").addEventListener("click", function () {
    let fileInput = document.getElementById("excelFile");

    if (fileInput.style.display === "none") {
        fileInput.style.display = "inline-block"; // Show file input next to Import button
    }
});

document.getElementById("excelFile").addEventListener("change", function () {
    let file = this.files[0];

    if (!file) return;

    let reader = new FileReader();
    
    reader.onload = function (e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: "array" });

        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        let tableBody = document.getElementById("tableBody");
        // Clear table before inserting new data
        tableBody.innerHTML = ""; 

        jsonData.slice(1).forEach(row => {
            let tr = document.createElement("tr");

            for (let i = 0; i < 20; i++) { // December is index 19
                let td = document.createElement("td");
                td.textContent = row[i] || "";
                tr.appendChild(td);
            }

            // Do not add "Delete" button in the last column (December)
            tableBody.appendChild(tr);
        });

        fileInput.style.display = "none"; // Hide file input after selecting a file
    };

    reader.readAsArrayBuffer(file);
});
