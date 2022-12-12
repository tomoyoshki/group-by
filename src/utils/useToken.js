
function getToken() {
    const tokenString = localStorage.getItem('token');
    return tokenString
}

function getRole() {
    const tokenString = localStorage.getItem('role');
    return tokenString
}


function setToken(userToken) {
    if (userToken) {
        localStorage.setItem('token', userToken);
        console.log("Token set: ", userToken)
        console.log("Test: ", getToken())
    } else {
        console.log("Failed to set token: ", userToken)
    }
}

function setRole(userToken) {
    if (userToken) {
        localStorage.setItem('role', userToken);
    }
}

function removeToken() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
}

export {getToken, setToken, removeToken, getRole, setRole}