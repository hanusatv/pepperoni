const lift_api_url = '/lift/get'

const lift_graphOptions = {
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
        let liftdata = {}

        data.sort((a, b) => a.date < b.date ? -1 : 1).forEach((d) => {
            let userExercise = liftdata[d.user, d.exercise]
            if (userExercise) {
                userExercise.push({ x: d.date, y: d.weight });
                liftdata[d.user] = userExercise
            } else {
                liftdata[d.user, d.exercise] = [{ x: d.date, y: d.weight }]
            }
            console.log(liftdata)
        });

        let datasets = []

        let i = 0
        for (const [user, data] of Object.entries(liftdata)) {
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
            options: lift_graphOptions
        }
        const liftChart = new Chart(document.getElementById('liftChart'), chartConfig)
    })
}

buildChartData()