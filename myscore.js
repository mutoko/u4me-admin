document.addEventListener('DOMContentLoaded', function () {
    fetchSupervisorAppraisalData();
// function to fetch data from myscore.php
    function fetchSupervisorAppraisalData() {
        fetch('myscore.php')
            .then(response => response.json())
            .then(data => {
                if (!data || data.length === 0 || !data[0].supervisor_appraisal) {
                    showDecisionMessage("No appraisal data available.");
                    return;
                }

                const score = parseFloat(data[0].supervisor_appraisal);
                updateDecisionMessage(score);
                createAppraisalPieChart(score);
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                showDecisionMessage("Failed to load appraisal data.");
            });
    }

    function updateDecisionMessage(score) {
        let message = "";
        // decision making
        if (score >= 100) message = "🌟 Outstanding!";
        else if (score >= 85) message = "👏 Very Good!";
        else if (score >= 70) message = "👍 Good!";
        else if (score >= 55) message = "⚠️ Fair!";
        else message = "🚨 Needs Improvement!.";

        document.getElementById('decisionMessage').innerText = message;
    }

    function createAppraisalPieChart(score) {
        const ctx = document.getElementById('supervisorAppraisalChart')?.getContext('2d');
        if (!ctx) return;

        const remaining = 100 - score;

        // Determine color based on score range
        let scoreColor;
        if (score >= 100) scoreColor = '#548dd4';  // Blue
        else if (score >= 85) scoreColor = '#41f1b6';  // Green
        else if (score >= 70) scoreColor = '#ffbb55';  // Orange
        else if (score >= 55) scoreColor = '#ff7782';  // Red
        else scoreColor = '#d9534f';  // Dark Red

        if (ctx.chart) {
            ctx.chart.destroy();
        }

        ctx.chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [`Your Score: ${score.toFixed(1)}%`, `Remaining: ${remaining.toFixed(1)}%`],
                datasets: [{
                    data: [score, remaining],
                    backgroundColor: [scoreColor, '#F0F0F0'],
                    borderColor: ['#ffffff', '#DDDDDD'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.raw.toFixed(1)}%`
                        }
                    },
                    datalabels: {
                        color: '#000',
                        anchor: 'center',
                        align: 'center',
                        font: {
                            size: 18,
                            weight: 'bold'
                        },
                        formatter: (value, context) => {
                            return context.dataIndex === 0 ? `${value.toFixed(1)}%` : '';
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    function showDecisionMessage(message) {
        document.getElementById('decisionMessage').innerText = message;
    }
});
