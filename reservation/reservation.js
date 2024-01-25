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
                await onCarClick();
                // const response2 = await fetch(`https://localhost:7295/api/vahicle/all`, {
                //     method: "GET",
                //     headers: { 'Content-Type': 'application/json' }
                // });
                // response2.json().then(data2 => {
                    
                // });
            });
        }
    }
});

async function onCarClick() {
    let tab = '';
    const response = await fetch("https://localhost:7295/api/vahicle/all", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    });
    response.json().then(data => {
        data.forEach(x => {
            tab += `
                <div class="car-elem">
                    <div style="width: 90%; display: flex; flex-direction: row;">
                        <div style="display: flex; flex-direction: row; align-items: center; padding-left: 15px; padding-top: 10px; padding-bottom: 10px;" value="${x.id}">
                            <div><strong>${x.model}&nbsp;${x.registerNumber}</strong></div>&nbsp;&nbsp;&nbsp;&nbsp;
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
}

async function onUserClick() {
    let tab = '';
    const response = await fetch("https://localhost:7295/api/user/users", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    });
    response.json().then(data => {
        data.forEach(x => {
            tab += `
                <div class="car-elem">
                    <div style="width: 90%; display: flex; flex-direction: row;">
                        <div style="width:50%">
                            <div>${x.id}</div>
                            <div>${x.firstName}</div>
                            <div>${x.lastName}</div>
                            <div>${x.login}</div>
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
}

function getCar(box) {
    console.log(box)
    const getCarId = box.getAttribute('value');
    sessionStorage.setItem('car-res-id', getCarId);
    location.href = 'carReservation.html';
}

function onBackClick() {
    location.href = 'menu.html'
}