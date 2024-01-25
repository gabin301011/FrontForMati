let userAllGlobal = [];

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
        loadData(userAllGlobal);
    } else {
        let result = userAllGlobal.filter(function(user) {
            return user.firstName.toLowerCase().includes(getValue.toLowerCase()) || user.lastName.toLowerCase().includes(getValue.toLowerCase());
        });
        loadData(result);
        console.log(result);
    }
} 

function onChangePasswordCheckbox() {
    const isPasswordChecked = document.getElementById("isPassword").checked;
    if (isPasswordChecked) {
        document.getElementById("input-update-password").disabled = false;
    } else {
        document.getElementById("input-update-password").disabled = true;
    }
}

function loadData(users) {
    let tab = '';
    console.log(users);
    users.forEach(x => {
        tab += `
            <div class="car-elem" style="justify-content: space-between;">
                <div style="width: 70%; display: flex; flex-direction: row; align-items: center; padding-left: 15px; padding-top: 10px; padding-bottom: 10px;" value="${x.id}">
                    <div><strong>${x.firstName}&nbsp;${x.lastName}</strong></div>&nbsp;&nbsp;&nbsp;&nbsp;
        `;
        if (x.isAdmin) {
            tab += `<span class="badge rounded-pill text-bg-dark">ADMINISTRATOR</span>`;
        }
        tab += `
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

async function infoUser(box) {
    const userId = box.getAttribute('value');
    const response = await fetch(`https://localhost:7295/api/user/info?id=${userId}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response.json().then(async data => {
        document.getElementById("input-info-id").value = data.id;
        document.getElementById("input-info-firstname").value = data.firstName;
        document.getElementById("input-info-lastname").value = data.lastName;
        document.getElementById("input-info-login").value = data.login;
        document.getElementById("input-info-email").value = data.email;
        if (data.isAdmin) {
            document.getElementById("isAdminCheckboxInfo").checked = true;
        } else {
            document.getElementById("isAdminCheckboxInfo").checked = false;
        }
        console.log(data)
    });
}

async function deleteModalOpen(box) {
    const userId = box.getAttribute('value');
    const response = await fetch(`https://localhost:7295/api/user/info?id=${userId}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response.json().then(async data => {
        let delTextTmp = `Czy na pewno chcesz usnąć użytkownika <strong>${data.firstName}&nbsp;${data.lastName}</strong>?`;
        document.getElementById('deleteText').innerHTML = delTextTmp;
        sessionStorage.setItem('del-user', userId);
    });
}

async function UpdateModalOpen(box) {
    const userId = box.getAttribute('value');
    const response = await fetch(`https://localhost:7295/api/user/info?id=${userId}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response.json().then(async data => {
        document.getElementById("input-update-id").value = data.id;
        document.getElementById("input-update-firstname").value = data.firstName;
        document.getElementById("input-update-lastname").value = data.lastName;
        document.getElementById("input-update-login").value = data.login;
        document.getElementById("input-update-email").value = data.email;
        document.getElementById("input-update-password").value = data.password;
        if (data.isAdmin) {
            document.getElementById("isAdminUpdateCheckbox").checked = true;
        } else {
            document.getElementById("isAdminUpdateCheckbox").checked = false;
        }
        console.log(data)
    });
}

async function addNow(user) {
    const firstName = document.getElementById("input-add-firstname").value;
    const lastName = document.getElementById("input-add-lastname").value;
    const email = document.getElementById("input-add-email").value;
    const login = document.getElementById("input-add-login").value;
    const password = document.getElementById("input-add-password").value;
    const isAdmin = document.getElementById("isAdminCheckbox").checked;
    if (login.length <= 0) {
        document.getElementById('toast-check').style.display = 'block';
        document.getElementById('toast-check').innerHTML = '<div>Pole <strong>Login</strong> musi być uzupełnione!</div>';
    } else if (password.length <= 0) {
        document.getElementById('toast-check').style.display = 'block';
        document.getElementById('toast-check').innerHTML = '<div>Pole <strong>Hasło</strong> musi być uzupełnione!</div>';
    } else {
        document.getElementById('toast-check').style.display = 'none';
        document.getElementById('toast-check').innerHTML = '';
        let body = {
            firstName: firstName,
            lastName: lastName,
            login: login,
            email: email,
            password: password,
            isAdmin: isAdmin
        };
        const response = await fetch(`https://localhost:7295/api/user/userAdd`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(async x => {
            await GetAll();
            document.getElementById('toast-add-user').style.display = 'block';
            $('#addModal').modal('hide');
            closeNow();
        })
    }
}

function onCloseToast() {
    document.getElementById('toast-add-user').style.display = 'none';
    document.getElementById('toast-update-user').style.display = 'none';
    document.getElementById('toast-delete-user').style.display = 'none';
}

async function GetAll() {
    const response = await fetch(`https://localhost:7295/api/user/users`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response.json().then(async data => {
        userAllGlobal = data;
        loadData(userAllGlobal)
    });
}

async function GetById(userId) {
    const response = await fetch(`https://localhost:7295/api/user/info?id=${userId}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    response.json().then(async data => {
        await GetAll();
        document.getElementById('toast-update-user').style.display = 'block';
        $('#updateModal').modal('hide');
    });
}

async function Update() {
    const id = document.getElementById("input-update-id").value;
    const firstName = document.getElementById("input-update-firstname").value;
    const lastName = document.getElementById("input-update-lastname").value;
    const email = document.getElementById("input-update-email").value;
    const login = document.getElementById("input-update-login").value;
    const password = document.getElementById("input-update-password").value;
    const isAdmin = document.getElementById("isAdminUpdateCheckbox").checked;
    let body = {
        id: id,
        login: login,
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        isAdmin: isAdmin
    };
    if (login.length <= 0) {
        document.getElementById('toast-check-update').style.display = 'block';
        document.getElementById('toast-check-update').innerHTML = '<div>Pole <strong>Login</strong> musi być uzupełnione!</div>';
    } else if (document.getElementById("isPassword").checked) {
        if (password.length <= 0) {
            document.getElementById('toast-check-update').style.display = 'block';
            document.getElementById('toast-check-update').innerHTML = '<div>Pole <strong>Nowe hasło</strong> musi być uzupełnione!</div>';
        } else {
            const response = await fetch(`https://localhost:7295/api/user/userUpdate`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }).then(async x => {
                await GetAll();
                document.getElementById('toast-update-user').style.display = 'block';
                $('#updateModal').modal('hide');
                document.getElementById('toast-check-update').style.display = 'none';
                document.getElementById('toast-check-update').innerHTML = '';
                closeNow();
            })
        }
    } else {
        body.password = "";
        const response = await fetch(`https://localhost:7295/api/user/userUpdate`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(async x => {
            await GetAll();
            document.getElementById('toast-update-user').style.display = 'block';
            $('#updateModal').modal('hide');
            document.getElementById('toast-check-update').style.display = 'none';
            document.getElementById('toast-check-update').innerHTML = '';
            closeNow();
        })
    }
}

async function Delete() {
    const userId = sessionStorage.getItem('del-user');
    await fetch(`https://localhost:7295/api/user/userDelete?userId=${userId}`, {
        method: "DELETE"
    }).then(async data => {
        await GetAll();
        document.getElementById('toast-delete-user').style.display = 'block';
        $('#deleteModal').modal('hide');
    });
}

function onBackClick() {
    location.href = "menu.html";
}

function closeNow() {
    document.getElementById("input-add-firstname").value = "";
    document.getElementById("input-add-lastname").value = "";
    document.getElementById("input-add-email").value = "";
    document.getElementById("input-add-login").value = "";
    document.getElementById("input-add-password").value = "";
    document.getElementById("isAdminCheckbox").checked = false;
    document.getElementById("input-update-id").value = "";
    document.getElementById("input-update-firstname").value = "";
    document.getElementById("input-update-lastname").value = "";
    document.getElementById("input-update-email").value = "";
    document.getElementById("input-update-login").value = "";
    document.getElementById("input-update-password").value = "";
    document.getElementById("isAdminUpdateCheckbox").checked = false;
    document.getElementById("isPassword").checked = false;
    document.getElementById('toast-check-update').style.display = 'none';
    document.getElementById('toast-check-update').innerHTML = '';
}