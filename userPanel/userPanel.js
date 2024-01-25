let globalUserId;

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
            sessionStorage.setItem('is-edit', 0); // 0 - nie edytowane; 1 - edytowane
            response.json().then(async data => {
                globalUserId = data.id;
                await getUserData(data.id);
            });
        }
    }
});

async function getUserData(userId) {
    const response2 = await fetch(`https://localhost:7295/api/user/info?id=${userId}`, {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' }
                });
                response2.json().then(data2 => {
                    document.getElementById("input-firstName").value = data2.firstName;
                    document.getElementById("input-lastName").value = data2.lastName;
                    document.getElementById("input-login").value = data2.login;
                    document.getElementById("input-email").value = data2.email;
                });
}

async function onEditClick() {
    const getIsEdit = sessionStorage.getItem('is-edit');
    if (getIsEdit == 0) {
        sessionStorage.setItem('is-edit', 1);
    } else if (getIsEdit == 1) {
        sessionStorage.setItem('is-edit', 0);
    }
    const getIsEdit2 = sessionStorage.getItem('is-edit');
    if (getIsEdit2 == 0) {
        await getUserData(globalUserId);
        document.getElementById("input-firstName").disabled = true;
        document.getElementById("input-lastName").disabled = true;
        document.getElementById("input-login").disabled = true;
        document.getElementById("input-email").disabled = true;
        document.getElementById("onSaveBtnId").innerHTML = ``;
        document.getElementById("checkUserData").innerHTML = ``;
    } else if (getIsEdit2 == 1) {
        document.getElementById("input-firstName").disabled = false;
        document.getElementById("input-lastName").disabled = false;
        document.getElementById("input-login").disabled = true;
        document.getElementById("input-email").disabled = false;
        document.getElementById("onSaveBtnId").innerHTML = `<button onclick="editNow()" style="margin-bottom: 5px;" type="button" class="btn btn-success">Zapisz</button>`;
        document.getElementById("checkUserData").innerHTML = ``;
    }
}

async function editNow() {
    const firstName = document.getElementById("input-firstName").value;
    const lastName = document.getElementById("input-lastName").value;
    const email = document.getElementById("input-email").value;
    if (email.length <= 0) {
        document.getElementById("checkUserData").innerHTML = `<div class="alert alert-danger" role="alert">Pole <strong>Email</strong> nie może być puste!</div>`;
    } else {
        document.getElementById("checkUserData").innerHTML = ``;
        document.getElementById("onSaveBtnId").innerHTML = ``;
        sessionStorage.setItem('is-edit', 0);
        document.getElementById("input-firstName").disabled = true;
        document.getElementById("input-lastName").disabled = true;
        document.getElementById("input-email").disabled = true;
        const body = {
            id: globalUserId,
            email: email,
            firstName: firstName,
            lastName: lastName
        };
        const response = await fetch(`https://localhost:7295/api/user/currUserUpdate`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(async x => {
            await getUserData(globalUserId);
            document.getElementById("checkUserData").innerHTML = `<div class="alert alert-success" role="alert">Dane zostały zmienione<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
        });
    }
}

async function editNowPassword() {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const repeatNewPassword = document.getElementById("repeatNewPassword").value;
    console.log(oldPassword);
    console.log(newPassword);
    console.log(repeatNewPassword);
    if (oldPassword.length <= 0) {
        document.getElementById("checkPassword").innerHTML = `<div class="alert alert-danger" role="alert">Pole <strong>Stare hasło</strong> musi być wypełnione!</div>`;
    } else if (newPassword.length <= 0) {
        document.getElementById("checkPassword").innerHTML = `<div class="alert alert-danger" role="alert">Pole <strong>Nowe hasło</strong> musi być wypełnione!</div>`;
    } else if (repeatNewPassword.length <= 0) {
        document.getElementById("checkPassword").innerHTML = `<div class="alert alert-danger" role="alert">Pole <strong>Powtórz nowe hasło</strong> musi być wypełnione!</div>`;
    } else {
        if (newPassword != repeatNewPassword) {
            document.getElementById("checkPassword").innerHTML = `<div class="alert alert-danger" role="alert">Wpisane nowe hasła nie są takie same!</div>`;
        } else {
            const body = {
                userId: globalUserId,
                oldPassword: oldPassword
            };
            const response = await fetch(`https://localhost:7295/api/user/checkOldPassword`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            response.json().then(async x => {
                console.log(x.isCorrect)
                if(!x.isCorrect) {
                    document.getElementById("checkPassword").innerHTML = `<div class="alert alert-danger" role="alert">Stare hasło jest niepoprawne!</div>`;
                } else {
                    const body2 = {
                        userId: globalUserId,
                        oldPassword: newPassword
                    };
                    const response2 = await fetch(`https://localhost:7295/api/user/ChangePassword`, {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body2)
                    }).then(x => {
                        document.getElementById("checkPassword").innerHTML = `<div class="alert alert-success" role="alert">Hasło zostało zmienione!</div>`;
                        document.getElementById("oldPassword").value = '';
                        document.getElementById("newPassword").value = '';
                        document.getElementById("repeatNewPassword").value = '';
                    });
                }
            });
        }
    }
}

function onBackClick() {
    location.href = "menu.html";
}