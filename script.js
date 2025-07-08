window.myCharts = [];

// Reusable chart rendering function
function renderChart(canvasID, labels, values, label) {
  const ctx = document.getElementById(canvasID).getContext('2d');

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: values,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          labels: { font: { size: 20 } }
        },
        title: { display: false }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time',
            font: { size: 20 }
          }
        },
        y: {
          title: {
            display: true,
            text: label,
            font: { size: 20 }
          }
        }
      }
    }
  });

  window.myCharts.push(chart);
}

// Fetch data from ThingSpeak and render a chart
async function fetchThingSpeakData(canvasID, fieldNum, label) {
  const CHANNEL_ID = '2844572'; // 🔁 Replace with your actual channel ID
  const RESULTS = 200; // Number of recent data points to fetch
  const API_KEY = 'YRO0PW021PLF1KUD';
  const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/${fieldNum}.json?api_key=${API_KEY}&results=${RESULTS}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const labels = data.feeds.map(feed => feed.created_at.split('T')[1].substring(0, 5)); // HH:MM
    const values = data.feeds.map(feed => parseFloat(feed[`field${fieldNum}`]));

    renderChart(canvasID, labels, values, label);
  } catch (error) {
    console.error(`Failed to fetch data for ${label}:`, error);
  }
}

// Trigger fetching for multiple fields/charts
window.addEventListener('DOMContentLoaded', () => {
  fetchThingSpeakData('chart1', 1, 'Temperature (°C)');
  fetchThingSpeakData('chart2', 2, 'Humidity (%)');
  fetchThingSpeakData('chart3', 3, 'Distance');
  fetchThingSpeakData('chart4', 4, 'Turbidity (NTU)');
  fetchThingSpeakData('chart5', 5, 'pH Value');
});