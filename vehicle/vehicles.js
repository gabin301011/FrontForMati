let carsAllGlobal = [];

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
              await GetAll();
            });
        }
    }
});

function onFilterChange() {
    let getValue = document.getElementById("input-filter").value;
    if (getValue.length == 0) {
        loadData(carsAllGlobal);
    } else {
        let result = carsAllGlobal.filter(function(vehicle) {
            return vehicle.model.toLowerCase().includes(getValue.toLowerCase()) || vehicle.registerNumber.toLowerCase().includes(getValue.toLowerCase());
        });
        loadData(result);
    }
} 

async function deleteModalOpen(box) {
    const vehicleId = box.getAttribute('value');
    const response = await fetch(`https://localhost:7295/api/vahicle/${vehicleId}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response.json().then(async data => {
        let delTextTmp = `Czy na pewno chcesz usnąć pojazd <strong>${data.model}</strong>&nbsp;o numerze rejestracyjnym&nbsp;<strong>${data.registerNumber}</strong>?`;
        document.getElementById('deleteText').innerHTML = delTextTmp;
        sessionStorage.setItem('del-vehi', vehicleId);
    });
}

async function Delete() {
    const vehicleId = sessionStorage.getItem('del-vehi');
    await fetch(`https://localhost:7295/api/vahicle/delete?vehicleId=${vehicleId}`, {
        method: "DELETE"
    }).then(async data => {
        await GetAll();
        document.getElementById('toast-delete-vehicle').style.display = 'block';
        $('#deleteModal').modal('hide');
    });
}

async function UpdateModalOpen(box) {
    const vehicleId = box.getAttribute('value');
    const response = await fetch(`https://localhost:7295/api/vahicle/${vehicleId}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response.json().then(async data => {
        document.getElementById("input-update-id").value = data.id;
        document.getElementById("input-update-model").value = data.model;
        document.getElementById("input-update-registerNumber").value = data.registerNumber;
        document.getElementById("input-update-vin").value = data.vin;
        document.getElementById("input-update-productionYear").value = data.productionYear;
        document.getElementById("input-update-vehicleType").value = data.vehicleType;
        document.getElementById("input-update-gearBoxType").value = data.gearbox;
        document.getElementById("input-update-fuelType").value = data.fuelType;
        document.getElementById("input-update-tiresType").value = data.tiresType;
        document.getElementById("input-update-insuranceTo").value = data.insuranceTo.split("T")[0];
        document.getElementById("input-update-inspectionTo").value = data.inspectionTo.split("T")[0];
    });
}

async function infoUser(box) {
    const vehicleId = box.getAttribute('value');
    const response = await fetch(`https://localhost:7295/api/vahicle/${vehicleId}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response.json().then(async data => {
        document.getElementById("input-info-id").value = data.id;
        document.getElementById("input-info-model").value = data.model;
        document.getElementById("input-info-registerNumber").value = data.registerNumber;
        document.getElementById("input-info-vin").value = data.vin;
        document.getElementById("input-info-productionYear").value = data.productionYear;
        document.getElementById("input-info-vehicleType").value = data.vehicleType;
        document.getElementById("input-info-gearBoxType").value = data.gearbox;
        document.getElementById("input-info-fuelType").value = data.fuelType;
        document.getElementById("input-info-tiresType").value = data.tiresType;
        document.getElementById("input-info-insuranceTo").value = data.insuranceTo.split("T")[0];
        document.getElementById("input-info-inspectionTo").value = data.inspectionTo.split("T")[0];
    });
}

async function Update() {
    const id = document.getElementById("input-update-id").value;
    const model = document.getElementById("input-update-model").value;
    const registerNumber = document.getElementById("input-update-registerNumber").value;
    const vin = document.getElementById("input-update-vin").value;
    const productionYear = document.getElementById("input-update-productionYear").value;
    const vehicleType = document.getElementById("input-update-vehicleType").value;
    const gearBoxType = document.getElementById("input-update-gearBoxType").value;
    const fuelType = document.getElementById("input-update-fuelType").value;
    const tiresType = document.getElementById("input-update-tiresType").value;
    const insuranceTo = document.getElementById("input-update-insuranceTo").value;
    const inspectionTo = document.getElementById("input-update-inspectionTo").value;
    if (model.length <= 0) {
        document.getElementById('toast-check-update').style.display = 'block';
        document.getElementById('toast-check-update').innerHTML = '<div>Pole <strong>Model</strong> musi być uzupełnione!</div>';
    } else if (registerNumber <= 0) {
        document.getElementById('toast-check-update').style.display = 'block';
        document.getElementById('toast-check-update').innerHTML = '<div>Pole <strong>Numer rejestracyjny</strong> musi być uzupełnione!</div>';
    } else if (vin <= 0) {
        document.getElementById('toast-check-update').style.display = 'block';
        document.getElementById('toast-check-update').innerHTML = '<div>Pole <strong>Vin</strong> musi być uzupełnione!</div>';
    } else if (productionYear <= 0 || productionYear == '') {
        document.getElementById('toast-check-update').style.display = 'block';
        document.getElementById('toast-check-update').innerHTML = '<div>Pole <strong>Rok produkcji</strong> musi być uzupełnione!</div>';
    } else if (vehicleType == -1) {
        document.getElementById('toast-check-update').style.display = 'block';
        document.getElementById('toast-check-update').innerHTML = '<div>Pole <strong>Typ samochodu</strong> musi być uzupełnione!</div>';
    } else if (gearBoxType == -1) {
        document.getElementById('toast-check-update').style.display = 'block';
        document.getElementById('toast-check-update').innerHTML = '<div>Pole <strong>Typ skrzyni</strong> musi być uzupełnione!</div>';
    } else if (fuelType == -1) {
        document.getElementById('toast-check-update').style.display = 'block';
        document.getElementById('toast-check-update').innerHTML = '<div>Pole <strong>Typ paliwa</strong> musi być uzupełnione!</div>';
    } else if (tiresType == -1) {
        document.getElementById('toast-check-update').style.display = 'block';
        document.getElementById('toast-check-update').innerHTML = '<div>Pole <strong>Typ opon</strong> musi być uzupełnione!</div>';
    } else if (insuranceTo == '') {
        document.getElementById('toast-check-update').style.display = 'block';
        document.getElementById('toast-check-update').innerHTML = '<div>Pole <strong>Ubezpieczenie do</strong> musi być uzupełnione!</div>';
    } else if (inspectionTo == '') {
        document.getElementById('toast-check-update').style.display = 'block';
        document.getElementById('toast-check-update').innerHTML = '<div>Pole <strong>Przegląd do</strong> musi być uzupełnione!</div>';
    } else {
        document.getElementById('toast-check-update').style.display = 'none';
        document.getElementById('toast-check-update').innerHTML = '';
        let body = {
            id: id,
            model: model,
            registerNumber: registerNumber,
            vin: vin,
            productionYear: productionYear,
            vehicleType: vehicleType,
            gearBox: gearBoxType,
            fuelType: fuelType,
            tiresType: tiresType,
            insuranceTo: insuranceTo,
            inspectionTo: inspectionTo
        };
        const response = await fetch(`https://localhost:7295/api/vahicle/update`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(async x => {
            await GetAll();
            document.getElementById('toast-update-user').style.display = 'block';
            $('#updateModal').modal('hide');
            closeNow();
        })
    }
}

async function addNow() {
    const model = document.getElementById("input-add-model").value;
    const registerNumber = document.getElementById("input-add-registerNumber").value;
    const vin = document.getElementById("input-add-vin").value;
    const productionYear = document.getElementById("input-add-productionYear").value;
    const vehicleType = document.getElementById("input-add-vehicleType").value;
    const gearBoxType = document.getElementById("input-add-gearBoxType").value;
    const fuelType = document.getElementById("input-add-fuelType").value;
    const tiresType = document.getElementById("input-add-tiresType").value;
    const insuranceTo = document.getElementById("input-add-insuranceTo").value;
    const inspectionTo = document.getElementById("input-add-inspectionTo").value;
    if (model.length <= 0) {
        document.getElementById('toast-check-add').style.display = 'block';
        document.getElementById('toast-check-add').innerHTML = '<div>Pole <strong>Model</strong> musi być uzupełnione!</div>';
    } else if (registerNumber <= 0) {
        document.getElementById('toast-check-add').style.display = 'block';
        document.getElementById('toast-check-add').innerHTML = '<div>Pole <strong>Numer rejestracyjny</strong> musi być uzupełnione!</div>';
    } else if (vin <= 0) {
        document.getElementById('toast-check-add').style.display = 'block';
        document.getElementById('toast-check-add').innerHTML = '<div>Pole <strong>Vin</strong> musi być uzupełnione!</div>';
    } else if (productionYear <= 0 || productionYear == '') {
        document.getElementById('toast-check-add').style.display = 'block';
        document.getElementById('toast-check-add').innerHTML = '<div>Pole <strong>Rok produkcji</strong> musi być uzupełnione!</div>';
    } else if (vehicleType == -1) {
        document.getElementById('toast-check-add').style.display = 'block';
        document.getElementById('toast-check-add').innerHTML = '<div>Pole <strong>Typ samochodu</strong> musi być uzupełnione!</div>';
    } else if (gearBoxType == -1) {
        document.getElementById('toast-check-add').style.display = 'block';
        document.getElementById('toast-check-add').innerHTML = '<div>Pole <strong>Typ skrzyni</strong> musi być uzupełnione!</div>';
    } else if (fuelType == -1) {
        document.getElementById('toast-check-add').style.display = 'block';
        document.getElementById('toast-check-add').innerHTML = '<div>Pole <strong>Typ paliwa</strong> musi być uzupełnione!</div>';
    } else if (tiresType == -1) {
        document.getElementById('toast-check-add').style.display = 'block';
        document.getElementById('toast-check-add').innerHTML = '<div>Pole <strong>Typ opon</strong> musi być uzupełnione!</div>';
    } else if (insuranceTo == '') {
        document.getElementById('toast-check-add').style.display = 'block';
        document.getElementById('toast-check-add').innerHTML = '<div>Pole <strong>Ubezpieczenie do</strong> musi być uzupełnione!</div>';
    } else if (inspectionTo == '') {
        document.getElementById('toast-check-add').style.display = 'block';
        document.getElementById('toast-check-add').innerHTML = '<div>Pole <strong>Przegląd do</strong> musi być uzupełnione!</div>';
    } else {
        document.getElementById('toast-check-add').style.display = 'none';
        document.getElementById('toast-check-add').innerHTML = '';
        let body = {
            model: model,
            registerNumber: registerNumber,
            vin: vin,
            productionYear: productionYear,
            vehicleType: vehicleType,
            gearBox: gearBoxType,
            fuelType: fuelType,
            tiresType: tiresType,
            insuranceTo: insuranceTo,
            inspectionTo: inspectionTo
        };
        const response = await fetch(`https://localhost:7295/api/vahicle/add`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(async x => {
            await GetAll();
            document.getElementById('toast-add-vehicle').style.display = 'block';
            $('#addModal').modal('hide');
            closeNow();
        })
    }
}

async function GetAll() {
    const response = await fetch(`https://localhost:7295/api/vahicle/all`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response.json().then(async data => {
        carsAllGlobal = data;
        loadData(carsAllGlobal)
    });
}
function onCloseToast() {
    document.getElementById('toast-add-vehicle').style.display = 'none';
    $('#addModal').modal('hide');
}

function loadData(cars) {
    let tab = '';
    cars.forEach(x => {
        tab += `
            <div class="car-elem" style="justify-content: space-between;">
                <div style="width: 70%; display: flex; flex-direction: row; align-items: center; padding-left: 15px; padding-top: 10px; padding-bottom: 10px;" value="${x.id}">
                    <div><strong>${x.model}&nbsp;${x.registerNumber}</strong></div>&nbsp;&nbsp;&nbsp;&nbsp;
                        <div>
        `;
        const now = new Date();
        const getCurrentMonth = now.getMonth() + 1;
        const tireWinter = [1, 2, 3, 11, 12];
        const tireSummer = [4, 5, 6, 7, 8, 9, 10];
        if (x.tiresType == 'ZIMOWE' && tireSummer.find(x => x == getCurrentMonth)) {
            tab += `<span class="badge rounded-pill text-bg-danger">Opony&nbsp;${x.tiresType}</span>&nbsp;`;
        } else if (x.tiresType == 'LETNIE' && tireWinter.find(x => x == getCurrentMonth)) {
            tab += `<span class="badge rounded-pill text-bg-danger">Opony&nbsp;${x.tiresType}</span>&nbsp;`;
        } else {
            tab += `<span class="badge rounded-pill text-bg-success">Opony&nbsp;${x.tiresType}</span>&nbsp;`;
        }
        const inspectionTo = x.inspectionTo.split("T")[0];
        const insepctionToTmp = new Date(inspectionTo);
        const dangerousDate = new Date(insepctionToTmp.setDate(insepctionToTmp.getDate() - 21));
        if (now >= dangerousDate && now < new Date(inspectionTo)) {
            tab += `<span class="badge rounded-pill text-bg-warning">Termin przeglądu do&nbsp;${inspectionTo.split("-")[2]}-${inspectionTo.split("-")[1]}-${inspectionTo.split("-")[0]}</span>&nbsp;`;
        } else if (now > new Date(inspectionTo)) {
            tab += `<span class="badge rounded-pill text-bg-danger">Termin przeglądu do&nbsp;${inspectionTo.split("-")[2]}-${inspectionTo.split("-")[1]}-${inspectionTo.split("-")[0]}</span>&nbsp;`;
        } else {
            tab += `<span class="badge rounded-pill text-bg-success">Termin przeglądu do&nbsp;${inspectionTo.split("-")[2]}-${inspectionTo.split("-")[1]}-${inspectionTo.split("-")[0]}</span>&nbsp;`;
        }
        //-----------------------------------------------
        const insuranceTo = x.insuranceTo.split("T")[0];
        const insuranceToTmp = new Date(insuranceTo);
        const dangerousDateIns = new Date(insuranceToTmp.setDate(insuranceToTmp.getDate() - 21));
        if (now >= dangerousDateIns && now < new Date(insuranceTo)) {
            tab += `<span class="badge rounded-pill text-bg-warning">Termin ubezpieczenia do&nbsp;${insuranceTo.split("-")[2]}-${insuranceTo.split("-")[1]}-${insuranceTo.split("-")[0]}</span>`;
        } else if (now > new Date(insuranceTo)) {
            tab += `<span class="badge rounded-pill text-bg-danger">Termin ubezpieczenia do&nbsp;${insuranceTo.split("-")[2]}-${insuranceTo.split("-")[1]}-${insuranceTo.split("-")[0]}</span>`;
        } else {
            tab += `<span class="badge rounded-pill text-bg-success">Termin ubezpieczenia do&nbsp;${insuranceTo.split("-")[2]}-${insuranceTo.split("-")[1]}-${insuranceTo.split("-")[0]}</span>`;
        }
        tab += `
                </div>
                </div>
                <div style="width: 30%; display: flex; flex-direction: row; justify-content: flex-end;">
                    <button type="button" class="btn" onclick="infoUser(this)" style="" value="${x.id}" data-bs-toggle="modal" data-bs-target="#infoModal">
                        <i class="fa-solid fa-circle-info fa-xl" style="color: #0c6ffd;"></i>
                    </button>
                    <button type="button" class="btn" onclick="UpdateModalOpen(this)" style="" value="${x.id}" data-bs-toggle="modal" data-bs-target="#updateModal">
                        <i class="fa-regular fa-pen-to-square fa-xl" style="color: #188755;"></i>
                    </button>
                    <button type="button" class="btn" onclick="deleteModalOpen(this)" style="" value="${x.id}" data-bs-toggle="modal" data-bs-target="#deleteModal">
                        <i class="fa-regular fa-trash-can fa-xl" style="color: #dc3545;"></i>
                    </button>
                </div>
            </div>
        `;
    });
    document.getElementById('main-box').innerHTML = tab;
}

function onBackClick() {
    location.href = "menu.html";
}

function closeNow() {
    document.getElementById("input-add-model").value = "";
    document.getElementById("input-add-registerNumber").value = "";
    document.getElementById("input-add-vin").value = "";
    document.getElementById("input-add-productionYear").value = "";
    document.getElementById("input-add-vehicleType").value = -1;
    document.getElementById("input-add-gearBoxType").value = -1;
    document.getElementById("input-add-fuelType").checked = -1;
    document.getElementById("input-add-tiresType").value = -1;
    document.getElementById("input-add-insuranceTo").value = "";
    document.getElementById("input-add-inspectionTo").value = "";

    document.getElementById("input-update-id").value = "";
    document.getElementById("input-update-model").value = "";
    document.getElementById("input-update-registerNumber").value = "";
    document.getElementById("input-update-vin").value = "";
    document.getElementById("input-update-productionYear").value = "";
    document.getElementById("input-update-vehicleType").value = -1;
    document.getElementById("input-update-gearBoxType").value = -1;
    document.getElementById("input-update-fuelType").checked = -1;
    document.getElementById("input-update-tiresType").value = -1;
    document.getElementById("input-update-insuranceTo").value = "";
    document.getElementById("input-update-inspectionTo").value = "";
}