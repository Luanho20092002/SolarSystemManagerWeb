function load_dashboard_graph() {
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
} 

function load_file() {
    $("#watt-file_BTN").click(function() {
        var formData = new FormData()
        formData.append("file", $("#file")[0].files[0])
        $.ajax({
            url : '/upload',
            type : 'POST',
            data : formData,
            processData: false,  
            contentType: false,  
            success : function(data) {
                load_predict_graph(data[0], data[1], data[2])
            }
         });
    })
}

function load_predict_graph(date, past, future) {
    var ctx = document.getElementById('myChart').getContext('2d');
    null_arr = [null, null,null,null,null,null,null,null,null,null,null,null,null, past[past.length - 1]]

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: date, 
            datasets: [{
                label: 'Quá khứ',
                data: past, 
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'Dự đoán',
                data: null_arr.concat(future), 
                backgroundColor: 'rgba(13, 110, 253, 0.2)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 1 
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'kw'
                    }
                }
            }
        }
    });
}


$(document).ready(function() {

    $.get("/get_dashboard", function(data){
        $("#content").html(data);
        load_dashboard_graph();
    });

    $("#dashboard_btn").click(function() {
        $.ajax({
            url: "/get_dashboard",
            type: "GET",
            success: function (data) {
                $("#content").html(data);
                load_dashboard_graph();
            },
            error: function() {
                console.log('Không thể tải file dashboard.html');
            }
        })
    })


    $("#predict_btn").click(function() {
        $.ajax({
            url: "/get_prediction",
            type: "GET",
            success: function (data) {
                $("#content").html(data);
                load_file()               
            },
            error: function() {
                console.log('Không thể tải file');
            }
        })
    })

    
});

