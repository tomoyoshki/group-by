
function getToken() {
    const tokenString = localStorage.getItem('token');
    return tokenString
}


function setToken(userToken) {
    if (userToken) {
        localStorage.setItem('token', userToken);
    }
}

function removeToken(userToken) {
    console.log("Removing token")
    localStorage.removeItem('token')
}

export {getToken, setToken, removeToken}