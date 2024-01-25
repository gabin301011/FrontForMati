window.addEventListener("load", async (event) => {
    if (checIsTokenExsist()) {
        location.href = 'menu.html';
    }
});

async function onLoginClick() {
    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;

    let body = {
        login: login,
        password: password
    };

    const response = await fetch("https://localhost:7295/api/auth/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    response.json().then(data => {
        if (data.status == 404) {
            document.getElementById('toast-message').style.display = 'block';
            document.getElementById("toastDangerMessage").innerText = data.message;
            document.getElementById('toast-message-success').style.display = 'none';
            document.getElementById("toastDangerMessageSuccess").innerText = '';
        } else if (data.status == 200) {
            setCookie(data.token)
            document.getElementById('toast-message').style.display = 'none';
            document.getElementById("toastDangerMessage").innerText = '';
            document.getElementById('toast-message-success').style.display = 'block';
            document.getElementById("toastDangerMessageSuccess").innerText = data.message;
            location.href = 'menu.html';
        }
    });
}

async function onCloseToast() {
    document.getElementById('toast-message').style.display = 'none';
    document.getElementById("toastDangerMessage").innerText = '';
    document.getElementById('toast-message-success').style.display = 'none';
    document.getElementById("toastDangerMessageSuccess").innerText = '';
}