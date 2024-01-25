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
                const carId = sessionStorage.getItem('car-res-id');
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
                refreshReservation();
            });
            const response3 = await fetch("https://localhost:7295/api/user/users", {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
            });
            response3.json().then(async data => {
                data.forEach(x => {
                    $("#userSelect").append(`<option value=${x.id}>${x.firstName}&nbsp;${x.lastName}</option>`);
                });
            });
        }
    }
});

function closeNow() {
    document.getElementById('toast-check').style.display = 'none';
}

async function addNow(btn) {
    const dataFrom = document.getElementById('dateFromInput').value;
    const dataTo = document.getElementById('dateToInput').value;
    const user = document.getElementById('userSelect').value;
    //deafult
    const buttonAtt = btn.getAttribute('value');
    const dateFromDefault = buttonAtt.split("#")[0];
    const dateToDefault =  buttonAtt.split("#")[1];
    if (new Date(dataFrom) > new Date(dataTo)) {
        document.getElementById('toast-check').style.display = 'block';
        document.getElementById('toast-check').innerHTML = '<div>Data od nie może być większa niż data do!</div>';
    } else if (new Date(dataFrom) < new Date(dateFromDefault)) {
        document.getElementById('toast-check').style.display = 'block';
        document.getElementById('toast-check').innerHTML = '<div>Data od nie może być mniejsza niż defaultowa</div>';
    } else if (new Date(dataTo) > new Date(dateToDefault)) {
        document.getElementById('toast-check').style.display = 'block';
        document.getElementById('toast-check').innerHTML = '<div>Data do nie może być większa niż defaultowa</div>';
    } else if (user == -1) {
        document.getElementById('toast-check').style.display = 'block';
        document.getElementById('toast-check').innerHTML = '<div>Nie wybrano użytkownika!</div>';
    } else {
        document.getElementById('toast-check').style.display = 'none';
        document.getElementById('toast-check').innerHTML = '<div></div>';
    }
    const carId = sessionStorage.getItem('car-res-id');
    let body = {
        vehicleId: carId,
        userId: user,
        dateFrom: dataFrom,
        dateTo: dataTo
    };
    const response = await fetch("https://localhost:7295/api/refueling/add-reservation", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    response.json().then(data => {
        refreshReservation();
        //TODO
    });
}

function addReservationModal(buttonBox) {
    const buttonAtt = buttonBox.getAttribute('value');
    document.getElementById('dateFromInput').value = buttonAtt.split("#")[0];
    document.getElementById('dateToInput').value = buttonAtt.split("#")[1];
    console.log(buttonAtt);
    document.getElementById("addNowBtn").value = buttonAtt;
}

async function refreshReservation() {
    console.log("fssdvdsvdv")
    let tab = '';
    const carId = sessionStorage.getItem('car-res-id');
    const response2 = await fetch(`https://localhost:7295/api/refueling/get-car-calendar?carId=${carId}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response2.json().then(async data2 => {
        console.log(data2)
        let tmp_month = 0;
        data2.forEach(x => {
            let dataFormatFrom = x.dateFrom.split("T")[0];
            let dataFormatTo = x.dateTo.split("T")[0];
            let getMonth = dataFormatFrom.split("-")[1];
            let getYear = dataFormatFrom.split("-")[0];
            if (getMonth == 0 || tmp_month != getMonth) {
                tmp_month = getMonth;
                tab += `<div style="margin-left: 5px; font-style: italic; font-weight: 500; color: #848b94;">
                    ${parseMonth(tmp_month)}&nbsp;${getYear}
                </div>`;
            }
            if (x.isFree) {
                tab += `<div class="car-elem">`;
            } else {
                tab += `<div style="" class="car-elem">`;
            }
            if (x.isFree) {
                tab += `
                <div style="background-color: #24c278; display: flex; align-items: center; width: 10%; justify-content: center; border-bottom-left-radius: 5px; border-top-left-radius: 5px;">
                    <span style="color: white;"><strong>FREE</strong></span>
                </div>
                <div style="width: 60%; display: flex; align-items: center; justify-content: flex-start; padding-left: 5px;">
                    <div><strong>OD:</strong>&nbsp;${dataFormatFrom.split("-")[2]}&nbsp;${parseMonth(dataFormatFrom.split("-")[1])}&nbsp;${dataFormatFrom.split("-")[0]}
                    &nbsp;&nbsp;<strong>DO:</strong>&nbsp;${dataFormatTo.split("-")[2]}&nbsp;${parseMonth(dataFormatTo.split("-")[1])}&nbsp;${dataFormatTo.split("-")[0]}</div>
                </div>
                <div style="width: 30%; margin: 5px;">
            `;
            } else {
                tab += `
                <div style="width: 70%; display: flex; flex-direction: row; margin: 5px;">
                    <div style="width:50%">
                        <div style="display: flex;">
                            <div><strong>OD:&nbsp;</strong></div>
                            <div>${dataFormatFrom.split("-")[2]}&nbsp;${parseMonth(dataFormatFrom.split("-")[1])}&nbsp;${dataFormatFrom.split("-")[0]}</div>
                        </div>
                        <div style="display: flex;">
                            <div><strong>DO:&nbsp;</strong></div>
                            <div>${dataFormatTo.split("-")[2]}&nbsp;${parseMonth(dataFormatTo.split("-")[1])}&nbsp;${dataFormatTo.split("-")[0]}</div>
                        </div>
                    </div>
                    <div style="width:50%; display: flex; align-items: center;">
                        <div style="font-weight: 500;">ID:&nbsp;${x.user.id},&nbsp;${x.user.firstName}&nbsp;${x.user.lastName}</div>
                    </div>
                </div>
                <div style="width: 30%; display: flex; justify-content: flex-end;">
            `;
            }
            if (x.isFree) {
                tab += `
                <button type="button" class="btn btn-success" onclick="addReservationModal(this)" style="width:100%; height: 100%;" 
                    value="${dataFormatFrom}#${dataFormatTo}" data-bs-toggle="modal" data-bs-target="#addModal">
                    REZERWUJ
                </button>`;
            } else {
                tab += `
                <button type="button" class="btn" onclick="deleteReservation(this)" style="" value="${x.id}" data-bs-toggle="modal" data-bs-target="#deleteModal">
                    <i class="fa-regular fa-trash-can fa-xl" style="color: #dc3545;"></i>
                </button>
                `; 
            }
            tab += `
                </div>
            </div>
            `;
        });
        document.getElementById('main-box').innerHTML = tab;
    });
}

async function deleteReservation(delButton) {
    const deleteReservationId = delButton.getAttribute('value');
    sessionStorage.setItem('del-res', deleteReservationId);
    const response = await fetch(`https://localhost:7295/api/refueling/get-reservation?reservationId=${deleteReservationId}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response.json().then(data => {
        let dataFormatFrom = data.dateFrom.split("T")[0];
        let dataFormatTo = data.dateTo.split("T")[0];
        let delTextTmp = `Czy na pewno chcesz usnąć rezerwację pojazdu <strong>${data.vehicle.model}</strong> 
        dla użytkownika <strong>${data.user.firstName}</strong> <strong>${data.user.lastName}</strong> 
        w dniach od 
        <strong>${dataFormatFrom .split("-")[2]}&nbsp;${parseMonth(dataFormatFrom .split("-")[1])}&nbsp;${dataFormatFrom .split("-")[0]}
        </strong> do 
        <strong>${dataFormatTo.split("-")[2]}&nbsp;${parseMonth(dataFormatTo.split("-")[1])}&nbsp;${dataFormatTo.split("-")[0]}</strong>`;
        document.getElementById('deleteText').innerHTML = delTextTmp;
    });
}

async function deleteNow() {
    let getResId = sessionStorage.getItem('del-res');
    console.log(getResId);
    const response = await fetch(`https://localhost:7295/api/refueling/deleteReservation?reservationId=${getResId}`, {
        method: "DELETE"
    }).then(data => {
        refreshReservation();
        document.getElementById('toast-delete-reservation').style.display = 'block';
        $('#fuelModal').modal('hide');
    });
}

function onCloseToast() {
    console.log(document.getElementById('toast-delete-reservation'))
    document.getElementById('toast-delete-reservation').style.display = 'none';
}

function parseMonth(number) {
    switch(number) {
        case '01':
            return 'Styczeń';
        case '02':
            return 'Luty';
        case '03':
            return 'Marzec';
        case '04':
            return 'Kwiecień';
        case '05':
            return 'Maj';
        case '06':
            return 'Czerwiec';
        case '07':
            return 'Lipiec';
        case '08':
            return 'Sierpień';
        case '09':
            return 'Wrzesień';
        case '10':
            return 'Październik';
        case '11':
            return 'Listopad';
        case '12':
            return 'Grudzień';
        default:
            return 'Default';
    }
}

function onBackClick() {
    location.href = 'reservation.html'
}