// Lấy dữ liệu sản lượng hiện tại
fetch('/api/current-production')
    .then(response => response.json())
    .then(data => {
        document.getElementById('production-value').textContent = data.production;
    });

// Biểu đồ sản lượng theo ngày
const dailyProductionChart = new Chart(document.getElementById('daily-production-chart'), {
    type: 'line',
    data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'],
        datasets: [{
            label: 'Sản lượng (kWh)',
            data: [100, 150, 200, 250, 300],
            fill: false,
            borderColor: '#333'
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

// Biểu đồ sản lượng theo tháng
const monthlyProductionChart = new Chart(document.getElementById('monthly-production-chart'), {
    type: 'bar',
    data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'],
        datasets: [{
            label: 'Sản lượng (kWh)',
            data: [1000, 1500, 2000, 2500]
        }]}});
