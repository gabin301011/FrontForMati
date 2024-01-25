window.addEventListener("load", async (event) => {
    if (!checIsTokenExsist()) {
        location.href = 'login_page.html';
    }
    var token = getToken();;
    if (token != undefined) {
    if (/*token != undefined ||*/ token.length > 0) {
         const response = await fetch(`https://localhost:7295/api/auth/getLogInfo?token=${token}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        response.json().then(data => {
            let tab = '';
            //Witaj osobo
            tab += `<div class="box" style="background-color: rgb(51, 133, 255)">
                        <div class="box-text">Witaj ###</div>
                    </div>`;
            //Panel użytkownika
            tab += `<div class="box" style="background-color: rgb(51, 133, 255)" onclick="onUserPanelClick()">
                        <div class="box-text">Panel użytkownika</div>
                    </div>`;
            //Pojazdy
            if (data.isAdmin) {
                console.log("ADMIN")
            tab += `<div class="box" style="background-color: rgb(51, 133, 255)" onclick="onVehicleClick()">
                        <div class="box-text">Pojazdy</div>
                    </div>`;
            }
            //Tankowanie
            tab += `<div class="box" style="background-color: rgb(51, 133, 255)" onclick="onYourCarClick()">
                        <div class="box-text">Tankowania</div>
                    </div>`;
            //Użytkownicy
            if (data.isAdmin) {
            tab += `<div class="box" style="background-color: rgb(51, 133, 255)" onclick="onUserClick()">
                        <div class="box-text">Użytkownicy</div>
                    </div>`;
            }
            //Statystyki
            if (data.isAdmin) {
            tab += `<div class="box" style="background-color: rgb(51, 133, 255)" onclick="onStatisticClick()">
                        <div class="box-text">Statystyki</div>
                    </div>`;
            }
            //Rezerwacja
            if (data.isAdmin) {
            tab += `<div class="box" style="background-color: rgb(51, 133, 255)" onclick="onReservationClick()">
                        <div class="box-text">Rezerwacje</div>
                    </div>`;
            }
            //Wyloguj
            tab += `<div class="box" style="background-color: rgb(51, 133, 255)" onclick="onLogoutClick()">
                        <div class="box-text">Wyloguj się</div>
                    </div>`;
            //na końcu
            document.getElementById('menu-box').innerHTML = tab;
        })
    }
}
});

function onLogoutClick() {
    document.cookie = "token="
    location.href = 'login_page.html';
}

function onUserPanelClick() {
    location.href = 'userPanel.html';
}

function onVehicleClick() {
    location.href = 'vehicles.html';
}

function onYourCarClick() {
    location.href = 'your_car.html';
}

function onReservationClick() {
    location.href = 'reservation.html';
}

function onStatisticClick() {
    location.href = 'statistic.html';
}

function onUserClick() {
    location.href = 'users.html';
}