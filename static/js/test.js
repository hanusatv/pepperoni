const api_url = '/weight/get'
const graphOptions = {
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
const graphStyling = {

}

async function getWeight() {
  const response = await fetch(api_url)
  const responseData = await response.json()
  return responseData
}

async function buildChartData() {
  getWeight().then(responseData => {
    let data = responseData
    let userdata = {};

    data.sort((a, b) => a.date < b.date ? -1 : 1).forEach((d) => {
      let user = userdata[d.user];
      if (user) {
        user.push({ x: d.date, y: d.weight });
        userdata[d.user] = user;
      } else {
        userdata[d.user] = [{ x: d.date, y: d.weight }]
      }
    });

    let datasets = [];

    for (const [user, data] of Object.entries(userdata)) {
      datasets.push({
        label: user,
        data: data
      })
    }

    let chart = {
      datasets: datasets
    }

    console.log(chart)
    const chartConfig = {
      type: 'line',
      data: chart,
      options: graphOptions
    }
    const weightChart = new Chart(document.getElementById('weightChart'), chartConfig)
  })
}

buildChartData()




/* 
{datasets:[
  {
    label: "Hanus",
    data:[
      {
      x: date,
      y: weight
      },{
      x: date,
      y: weight
      }
    ]
  },{
    label: "Magnus",
    data:[
      {
      x: date,
      y: weight
      },{
      x: date,
      y: weight
      }
    ]
  }
]} 
*/