const chartConfig = {
    title: {
        text: 'Grafik Tingkat Kepadatan Setiap Siklus',
        align: 'left'
    },

    yAxis: {
        title: {
            text: 'Tingkat Kepadatan'
        },
        scrollbar: {
            enabled: true
        }
    },

    xAxis: {
        title: {
            text: 'Siklus Lampu'
        }
    },

    legend: {
        layout: 'horizontal',
        align: 'center',
        // verticalAlign: 'middle'
    },

    credits: {
        enabled: false
    },

    series: [],

    plotOptions: {
        series: {
            pointStart: 1,
            pointInterval: 1 // one
        }
    },

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

};