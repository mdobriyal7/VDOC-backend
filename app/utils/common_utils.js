function stringToBase64API(api_string) {
    return btoa(api_string);
}

function stringToBase64Creds(creds) {
    return btoa(creds)
}


const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = { stringToBase64API, stringToBase64Creds, delay};
