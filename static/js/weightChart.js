const api_url = '/weight/get';

async function getWeight() {
  const response = await fetch(api_url);
  const responseData = await response.json();
  console.log(responseData);
}
getWeight();

const data = {
  datasets: [{
    label: 'Hanus',
    data: [{
      x: '2021-12-20',
      y: 80
    }, {
      x: '2021-12-21',
      y: 85
    }, {
      x: '2021-12-22',
      y: 90
    }, {
      x: '2021-12-31',
      y: 115
    }],
  },{
    label: 'Mangus',
    data:[{
      x: '2022-12-01',
      y: 100
    }, {
      x: '2021-12-15',
      y: 95
    }, {
      x: '2021-12-22',
      y: 90
    }, {
      x: '2021-12-31',
      y: 75
    }]
  }]
};

const config = {
    type: 'line',
    data: data,
    options: {
      title: {
        text: 'Weight',
        display: true
      },
      scales: {
        x: {
          type: 'time',
          time: {
            // Luxon format string
            tooltipFormat: 'dd-MM-yyyy'
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'kg'
        }
      }
    }
  }
};


const weightChart = new Chart(
    document.getElementById('weightChart'),
    config
  );