
const data = {
  datasets: [{
    label: 'Dataset with point data',
    data: [{
      x: '2021-12-01',
      y: 80
    }, {
      x: '2021-12-15',
      y: 85
    }, {
      x: '2021-12-22',
      y: 90
    }, {
      x: '2021-12-31',
      y: 115
    }],
  }]
};

const config = {
    type: 'line',
    data: data,
    options: {
      plugins: {
        title: {
          text: 'Chart.js Time Scale',
          display: true
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            // Luxon format string
            tooltipFormat: 'DD T'
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'value'
          }
        }
      },
    },
  };


const weightChart = new Chart(
    document.getElementById('weightChart'),
    config
  );