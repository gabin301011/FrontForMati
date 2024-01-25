let globalCarId = 0;
let globalUserId = 0;

window.addEventListener("load", async (event) => {
    let tab = '';
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
                console.log(data)
                globalUserId = data.id;
                const carId = sessionStorage.getItem('my-car-id');
                if (carId != null) {
                    if (carId.length > 0 ) {
                        globalCarId = carId;
                        const response2 = await fetch(`https://localhost:7295/api/vahicle/${carId}`, {
                            method: "GET",
                            headers: { 'Content-Type': 'application/json' }
                        });
                        response2.json().then(data2 => {
                            console.log(data2)
                            document.getElementById('model').innerHTML = data2.model;
                            document.getElementById('registerNumber').innerHTML = data2.registerNumber;
                            document.getElementById('productionYear').innerHTML = data2.productionYear;
                        });
                        const response5 = await fetch(`https://localhost:7295/api/refueling/get-actual-counter-status?carId=${carId}`, {
                            method: "GET",
                            headers: { 'Content-Type': 'application/json' }
                        });
                        response5.json().then(data5 => {
                            console.log(data5)
                            document.getElementById('counterStatus').innerHTML = `${data5} KM`;
                        });
                        const response3 = await fetch(`https://localhost:7295/api/refueling/get-user-refueling-all?userId=${data.id}&carId=${carId}`, {
                            method: "GET",
                            headers: { 'Content-Type': 'application/json' }
                        });
                        response3.json().then(data3 => {
                            console.log(data3)
                            data3.forEach(x => {
                                let dataFormat = x.addDate.split("T")[0];
                                tab += `
                                <div class="last-fuel-elem">
                                    <div class="fuel-elem-top">
                                        <div style="width: 50%; display: flex; flex-direction: row;">
                                            <div class="info-elem-left text-last-fuel">Data dodania:&nbsp;</div>
                                            <div class="info-elem-right text-last-fuel"><strong>${dataFormat}</strong></div>
                                        </div>
                                        <div style="width: 50%; display: flex; flex-direction: row;">
                                            <div class="info-elem-left text-last-fuel">Ilość:&nbsp;</div>
                                            <div class="info-elem-right text-last-fuel"><strong>${x.quantity}&nbsp;L</strong></div>
                                        </div>
                                    </div>
                                    <div class="fuel-elem-top">
                                        <div style="width: 50%; display: flex; flex-direction: row;">
                                            <div class="info-elem-left text-last-fuel">Kwota:&nbsp;</div>
                                            <div class="info-elem-right text-last-fuel"><strong>${x.price}&nbsp;PLN</strong></div>
                                        </div>
                                        <div style="width: 50%; display: flex; flex-direction: row;">
                                            <div class="info-elem-left text-last-fuel">Stan licznika:&nbsp;</div>
                                            <div class="info-elem-right text-last-fuel"><strong>${x.counterStatus}&nbsp;KM</strong></div>
                                        </div>
                                    </div>
                                </div>
                                `;
                            });
                            document.getElementById('last-refuelings').innerHTML = tab;
                        });
                    }
                }
            });
        }
    }
});

async function onAddRefueling() {
    console.log(globalCarId, globalUserId);
    const body = {
        userId: globalUserId,
        vehicleId: globalCarId,
        quantity: document.getElementById('quantity-input').value,
        price: document.getElementById('cash-input').value,
        counterStatus: document.getElementById('counter-input').value
    };
    const response = await fetch("https://localhost:7295/api/refueling/add-refueling", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }).then(async data => {
        let tab = '';
        const response3 = await fetch(`https://localhost:7295/api/refueling/get-user-refueling-all?userId=${globalUserId}&carId=${globalCarId}`, {
                            method: "GET",
                            headers: { 'Content-Type': 'application/json' }
                        });
                        response3.json().then(data3 => {
                            console.log(data3)
                            data3.forEach(x => {
                                let dataFormat = x.addDate.split("T")[0];
                                tab += `
                                <div class="last-fuel-elem">
                                    <div class="fuel-elem-top">
                                        <div style="width: 50%; display: flex; flex-direction: row;">
                                            <div class="info-elem-left text-last-fuel">Data dodania:&nbsp;</div>
                                            <div class="info-elem-right text-last-fuel"><strong>${dataFormat}</strong></div>
                                        </div>
                                        <div style="width: 50%; display: flex; flex-direction: row;">
                                            <div class="info-elem-left text-last-fuel">Ilość:&nbsp;</div>
                                            <div class="info-elem-right text-last-fuel"><strong>${x.quantity}&nbsp;L</strong></div>
                                        </div>
                                    </div>
                                    <div class="fuel-elem-top">
                                        <div style="width: 50%; display: flex; flex-direction: row;">
                                            <div class="info-elem-left text-last-fuel">Kwota:&nbsp;</div>
                                            <div class="info-elem-right text-last-fuel"><strong>${x.price}&nbsp;PLN</strong></div>
                                        </div>
                                        <div style="width: 50%; display: flex; flex-direction: row;">
                                            <div class="info-elem-left text-last-fuel">Stan licznika:&nbsp;</div>
                                            <div class="info-elem-right text-last-fuel"><strong>${x.counterStatus}&nbsp;KM</strong></div>
                                        </div>
                                    </div>
                                </div>
                                `;
                            });
                            document.getElementById('last-refuelings').innerHTML = tab;
                        });
        console.log("Dodano!")
        //wyzeruj inputy
    })
    document.getElementById('toast-add-refueling').style.display = 'block';
    $('#fuelModal').modal('hide');
}

function onCloseToast() {
    document.getElementById('toast-add-refueling').style.display = 'none';
}

function onBackClick() {
    location.href = 'your_car.html'
}