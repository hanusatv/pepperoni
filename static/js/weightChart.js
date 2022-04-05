const weight_api_url = '/weight/get'

const weight_graphOptions = {
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
  },
  plugins: {

  }
}
const graphStyling = {

}
const graphLineColors = [
  "#fca44c",
  "#ff4d4d",
  "#91531a",
  "#9b50a7",
  "#c1c3d7",
  "#4c3a27"
]
async function getWeight() {
  const response = await fetch(weight_api_url)
  const responseData = await response.json()
  return responseData
}

function buildChartData() {
  getWeight().then(data => {
    let userdata = {}

    data.sort((a, b) => a.date < b.date ? -1 : 1).forEach((d) => {
      let user = userdata[d.user]
      if (user) {
        user.push({ x: d.date, y: d.weight });
        userdata[d.user] = user
      } else {
        userdata[d.user] = [{ x: d.date, y: d.weight }]
      }
    });

    let datasets = []

    Object.entries(userdata).forEach(([user, data], i) => {
      datasets.push({
        label: user,
        data: data,
        backgroundColor: graphLineColors[i],
        borderColor: graphLineColors[i]
      })
    })

    let chart = {
      datasets: datasets
    }

    const chartConfig = {
      type: 'line',
      data: chart,
      options: weight_graphOptions
    }
    const weightChart = new Chart(document.getElementById('weightChart'), chartConfig)
  })
}

buildChartData()