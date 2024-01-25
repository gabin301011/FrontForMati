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
                await onCarsListLoad();
            });
        }
    }
});

async function onCarsListLoad() {
    let tab = '';
    const response = await fetch(`https://localhost:7295/api/vahicle/all`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response.json().then(data => {
        data.forEach(x => {
            $("#carSelect").append(`<option value=${x.id}>${x.registerNumber}&nbsp;${x.model}</option>`);
        });
    });
}

function onBackClick() {
    location.href = 'menu.html'; 
}

function onCarChartClick() {
    const elemCheck = document.getElementById('carSelect').value;
    if (elemCheck == -1) {
        document.getElementById('toast-check').style.display = 'block';
        document.getElementById('toast-check').innerHTML = '<div>Pojazd musi być wybrany!</div>';
    } else {
        sessionStorage.setItem('car-stat-id', elemCheck);
        location.href = 'carStat.html';
    }
}