function getToken() {
    const getCookieFromData = document.cookie;
    const getId = getCookieFromData.split("=")[1]
    return getId;
}

function setCookie(token) {
    document.cookie = "token="+ token +"; SameSite=None; Secure";
}

function checIsTokenExsist() {
    var token = getToken();
    console.log(token)
    if (token != undefined) {
        if (token.length > 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}