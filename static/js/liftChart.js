const lift_api_url = '/lift/get'

const graphOptions = {
    title: {
        text: 'Lift',
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
        colorschemes: {
            scheme: 'brewer.RdYlGn6'

        }
    }
}

async function getLift() {
    const response = await fetch(lift_api_url)
    const responseData = await response.json()
    return responseData
}

function buildChartData() {
    getLift().then(data => {
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

        let i = 0
        for (const [user, data] of Object.entries(userdata)) {
            datasets.push({
                label: user,
                data: data,
                backgroundColor: graphLineColors[i],
                borderColor: graphLineColors[i]
            })
            i = i + 1
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
        const liftChart = new Chart(document.getElementById('liftChart'), chartConfig)
    })
}

buildChartData()