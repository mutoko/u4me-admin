document.addEventListener("DOMContentLoaded", function () {
    let isEditing = false; // Flag to check edit state

    // Function to fetch data from the server and display it
    function fetchData() {
        fetch('profile.php') // Fetch data from PHP
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error:', data.error);
                    return;
                }

                // Populate the table with the fetched data
                document.getElementById('staffNo').textContent = data.staffNo || 'N/A';
                document.getElementById('staffNo4').textContent = data.staffNo4 || 'N/A';
                document.getElementById('staffNo2').textContent = data.staffNo2 || 'N/A';
                document.getElementById('name').textContent = data.name || 'N/A';
                document.getElementById('name4').textContent = data.name4 || 'N/A';
                document.getElementById('name2').textContent = data.name2 || 'N/A';
                document.getElementById('designation1').textContent = data.designation1 || 'N/A';
                document.getElementById('grade2').textContent = data.grade2 || 'N/A';
                document.getElementById('grade1').textContent = data.grade1 || 'N/A';
                document.getElementById('staffNo3').textContent = data.staffNo3 || 'N/A';
                document.getElementById('department1').textContent = data.department1 || 'N/A';
                document.getElementById('name3').textContent = data.name3 || 'N/A';
                document.getElementById('division1').textContent = data.division1 || 'N/A';
                document.getElementById('grade3').textContent = data.grade3 || 'N/A';
                document.getElementById('grade4').textContent = data.grade4 || 'N/A';
                document.getElementById('region1').textContent = data.region1 || 'N/A';
                document.getElementById('fromDate').textContent = data.fromDate || 'N/A';
                document.getElementById('station1').textContent = data.station1 || 'N/A';
                document.getElementById('toDuration').textContent = data.toDuration || 'N/A';
                document.getElementById('duration').textContent = data.duration || 'N/A';
                document.getElementById('employmentDate').textContent = data.employmentDate || 'N/A';

            })
            .catch(error => console.error('Error fetching data:', error));
    }

    fetchData(); // Load data when the page is opened

    // Handle Edit button click
    document.getElementById("editBtn").addEventListener("click", function () {
        if (!isEditing) {
            // Convert table text into editable input fields
            let fields = ['staffNo', 'staffNo2', 'name', 'name2', 'designation1', 'grade2', 'grade1', 'staffNo3', 'department1', 'name3', 'division1', 'grade3', 'region1', 'fromDate', 'station1', 'toDuration', 'duration', 'employmentDate', 'grade4', 'name4', 'staffNo4'];
            fields.forEach(field => {
                let cell = document.getElementById(field);
                let text = cell.textContent;
                cell.innerHTML = `<input type="text" class="editable" value="${text}">`;
            });

            isEditing = true;
            document.getElementById("updateBtn").disabled = false;
            this.textContent = "Cancel";
        } else {
            fetchData(); // Reload data if cancel is clicked
            isEditing = false;
            document.getElementById("updateBtn").disabled = true;
            this.textContent = "Edit";
        }
    });

    // Handle Update button click
    document.getElementById("updateBtn").addEventListener("click", function () {
        let fields = ['staffNo', 'staffNo2', 'name', 'name2', 'designation1', 'grade2', 'grade1', 'staffNo3', 'department1', 'name3', 'division1', 'grade3', 'region1', 'fromDate', 'station1', 'toDuration', 'duration', 'employmentDate', 'grade4', 'name4', 'staffNo4'];
        let formData = new FormData();

        // Collect data from input fields
        fields.forEach(field => {
            let value = document.getElementById(field).querySelector('input').value;
            formData.append(field, value);
        });

        // Send updated data to PHP
        fetch('profile.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            fetchData();
            document.getElementById("editBtn").textContent = "Edit";
            isEditing = false;
            document.getElementById("updateBtn").disabled = true;
        })
        .catch(error => console.error('Error:', error));
    });
});
