window.addEventListener("load", async (event) => {
    if (!checIsTokenExsist()) {
        location.href = 'login_page.html';
    }
    var token = getToken();;
    if (token != undefined) {
        if (token.length > 0) {
            const response = await fetch(`https://localhost:7295/api/auth/getLogInfo?token=${token}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            response.json().then(async data => {
                const carId = sessionStorage.getItem('car-stat-id');
                console.log("Samochod", carId);
                const response3 = await fetch(`https://localhost:7295/api/vahicle/${carId}`, {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' }
                });
                response3.json().then(data2 => {
                    document.getElementById('model').innerHTML = data2.model;
                    document.getElementById('registerNumber').innerHTML = data2.registerNumber;
                    document.getElementById('productionYear').innerHTML = data2.productionYear;
                });
                resDay(carId);
                lineFuel(carId);
                burningCar(carId);
            });
        }
    }
});

async function burningCar(carId) {
    const DATA_COUNT = 7;
    const NUMBER_CFG = {count: DATA_COUNT, rmin: 1, rmax: 1, min: 0, max: 100};
    console.log("dg",  + bubbles(NUMBER_CFG))
    const response = await fetch(`https://localhost:7295/api/statistic/CarFuel/${carId}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response.json().then(resData => {
        
    

        const DATA_COUNT = 7;
        const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};
        
        const labels = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec','Lipiec', 'Sierpień', 'Wrzesień', 'Listopad', 'Grudzień'];
        const data = {
          labels: labels,
          datasets: [
            {
              label: 'Pojazd np Alfa Romeo',
              data: [1,2,3,4,5],
              borderColor: 'rgba(255, 99, 132, 0.9)',
              backgroundColor: 'rgba(255, 99, 132, 0.9)',
            }
          ]
        };
        const ctx = document.getElementById('myChart3').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
              indexAxis: 'y',
              elements: {
                bar: {
                  borderWidth: 2,
                }
              },
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'Przebieg pojazdu per kwartał'
                }
              }
            },
          });
    });
}

async function lineFuel(carId) {
    const response = await fetch(`https://localhost:7295/api/statistic/CarFuel/${carId}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response.json().then(resData => {
        console.log(resData)
        const data = {
          labels: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec','Lipiec', 'Sierpień', 'Wrzesień', 'Listopad', 'Grudzień'],
          datasets: [
            {
              label: resData.labels[0],
              data: resData.fuelCount[0],
              borderColor: 'rgba(255, 99, 132, 0.9)',
              fill: false,
              cubicInterpolationMode: 'monotone',
              tension: 0.4
            }, {
              label: resData.labels[1],
              data: resData.fuelCount[1],
              borderColor: 'rgba(0, 204, 68, 0.9)',
              fill: false,
              tension: 0.4
            }, {
              label: resData.labels[2],
              data: resData.fuelCount[2],
              borderColor: 'rgba(51, 102, 255, 0.9)',
              fill: false
            }, {
                label: resData.labels[3],
                data: resData.fuelCount[3],
                borderColor: 'rgba(255, 51, 153, 0.9)',
                fill: false
            }, {
                label: resData.labels[4],
                data: resData.fuelCount[4],
                borderColor: 'rgba(255, 204, 0, 0.9)',
                fill: false
            }
          ]
        };
        
        const ctx = document.getElementById('myChart2').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Przebieg na przestrzeni ostatnich pięciu lat'
                },
              },
              interaction: {
                intersect: false,
              },
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true
                  }
                },
                y: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Value'
                  },
                  suggestedMin: 0,
                  suggestedMax: 20000
                }
              }
            },
          });
    });
}

async function resDay(carId) {
    const response = await fetch(`https://localhost:7295/api/statistic/CarDayRes/${carId}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response.json().then(resData => {
        const data = {
          labels: resData.labels,
          datasets: [
            {
              label: 'Zarezerwowane',
              data: resData.yesData,
              borderColor: 'rgba(0, 204, 68, 0.4)',
              backgroundColor: 'rgba(0, 204, 68, 0.4)',
            },
            {
              label: 'Brak rezerwacji',
              data: resData.noData,
              borderColor: 'rgba(255, 99, 132, 0.2)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
            }
          ]
        };
        
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Ilość dni zarezrowonaych i niezarezerwowanych dla pojazdu per rok'
                }
              }
            },
        });
    });
}
  
function onBackClick() {
    location.href = 'statistic.html'
}

var _seed = Date.now();

function rand(min, max) {
    min = 3;
    max = 30;
    _seed = (_seed * 9301 + 49297) % 233280;
    return min + (_seed / 233280) * (max - min);
  }

function numbers(config) {
    var cfg = config || {};
    var min = 3;
    var max = 100;
    var from = 1;
    var count = 7;
    var decimals = 2;
    var continuity = 1;
    var dfactor = 1 || 0;
    var data = [];
    var i, value;
  
    for (i = 0; i < count; ++i) {
      value = (from[i] || 0) + this.rand(min, max);
      if (this.rand() <= continuity) {
        data.push(Math.round(dfactor * value) / dfactor);
      } else {
        data.push(null);
      }
    }
  
    return data;
  }
  
function points(config) {
    const xs = this.numbers(config);
    const ys = this.numbers(config);
    return xs.map((x, i) => ({x, y: ys[i]}));
  }
  
function bubbles(config) {
    return this.points(config).map(pt => {
      pt.r = this.rand(config.rmin, config.rmax);
      return pt;
    });
  }