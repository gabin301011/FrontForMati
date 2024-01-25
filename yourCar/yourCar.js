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
            response.json().then(async data => {
                let tab = '';
                console.log(data)
                const response2 = await fetch(`https://localhost:7295/api/refueling/getUserCar?userId=${data.id}`, {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' }
                });
                response2.json().then(data2 => {
                    console.log(data2)
                    data2.forEach(x => {
                        console.log(x)
                        tab += `
                            <div class="car-elem">
                                <div style="width: 90%; display: flex; flex-direction: row;">
                                    <div style="width: 60%; display: flex; flex-direction: row; align-items: center; padding-left: 15px; padding-top: 10px; padding-bottom: 10px;" value="${x.id}">
                                    <div><strong>${x.model}&nbsp;${x.registerNumber}</strong></div>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span class="badge rounded-pill text-bg-info">Rezerwacja mija za ${x.totalDays} dni</span>
                                    </div>
                                </div>
                                <div style="width: 10%;">
                                    <button type="button" class="btn btn-primary" value="${x.id}" onclick="getCar(this)" style="width:100%; height: 100%;">
                                        <i class="fa-solid fa-right-long fa-2xl" style="color: white"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    });
                    document.getElementById('main-box').innerHTML = tab;
                });
            });
        }
    }
});

function getCar(box) {
    console.log(box)
    const getCarId = box.getAttribute('value');
    sessionStorage.setItem('my-car-id', getCarId);
    location.href = 'refueling.html';
}

function onBackClick() {
    location.href = 'menu.html';
}