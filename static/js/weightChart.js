//open file
// for I = rowlength do begin
// Dato[i] = row(datevalue)
// Weight[i] = row(weightvalue)
// const data = {
 //FOR I = 1 do begin
//   datasets: [{
//     label: 'Hanus',
//     data: [{
//       x: Dato[i],
//       y: Weight[i]
//     }, {
  //Until dato.Next = 0 or Weight.Next = 0:
//end

const testarray = ['2021-01-01','2021-12-15'];

const data = {
  datasets: [{
    label: 'Hanus',
    data: [{
      x: testarray[0],
      y: 80
    }, {
      x: testarray[1],
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
      x: '2021-12-01',
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