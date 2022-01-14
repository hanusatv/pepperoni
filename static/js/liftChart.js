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
}

async function getLift() {
    const response = await fetch(lift_api_url)
    const responseData = await response.json()
    return responseData
}

function buildChartData() {
    getLift().then(data => {
        let userData = {};

        data.forEach(d => {
            let label = `${d.user} ${d.exercise}`;
            let currentData = userData[label];
            if (currentData) {
                currentData.push({ x: d.date, y: d.weight });
                userData[label] = currentData;
            } else {
                userData[label] = [{ x: d.date, y: d.weight }];
            }
        })


        let datasets = [];

        Object.entries(userData).forEach(([label, data], i) => {
            datasets.push({
                label: label,
                data: data,
                backgroundColor: graphLineColors[i],
                borderColor: graphLineColors[i]
            })
        })
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