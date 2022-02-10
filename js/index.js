//-----------------------------------------------------------------------------
// Get current year and display next to the copyright in the footer. Add event
// listener to refresh button. Get barometric pressure forecast data.
//-----------------------------------------------------------------------------

const date = new Date();
let pressureChart;

document.getElementById("year").textContent = date.getFullYear();
document.getElementById("refresh").addEventListener("click", refreshData);

fetchData();

//-----------------------------------------------------------------------------
// Fetch weather data from openweather.org. Get only the hourly data for the
// next 48 hours and extract the barometric pressure data for my current
// location. The openweather API requires an API key and the latitude and
// longitude of the desired location which are listed below:
//
//    Weather (openweather.org) API key: 345279e6dedde84e96c5cf9072b109b0
//    Portsmouth OH latitude and longitude: 38.74, -82.99
//-----------------------------------------------------------------------------

async function fetchData() {
  let response = await fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=38.74&lon=-82.99&units=imperial&exclude=minutely,daily,alerts&appid=345279e6dedde84e96c5cf9072b109b0"
  );
  const data = await response.json();
  const pressureData = data.hourly.map((weather) => weather.pressure);

  chartData(pressureData);
}

//-----------------------------------------------------------------------------
// The pressure data is charted using the Chart.js library from chartjs.org.
// The minimized code is pulled from the content delivery network cdnjs.
//-----------------------------------------------------------------------------

function chartData(pressureData) {
  const ctx = document.getElementById("pressureChart").getContext("2d");
  const labels = Array.from(Array(pressureData.length), (_, i) => i++);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Barometric Pressure for the Next 48 hours",
        data: pressureData,
        fill: false,
        borderColor: "rgb(42, 42, 42)",
        tension: 0.1,
      },
    ],
  };

  pressureChart = new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

//-----------------------------------------------------------------------------
// Destroy current chart and get new data. This called when the Refresh Chart
// button is clicked.
//-----------------------------------------------------------------------------

function refreshData() {
  const ctx = document.getElementById("pressureChart").getContext("2d");
  pressureChart.destroy();
  fetchData();
}
