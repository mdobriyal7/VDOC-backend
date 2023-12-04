const axios = require("axios");
// const { post } = require("./app/api/routes/ClosedWonRoutes");


async function get_data() {
    try {
        const url = "https://dummyjson.com/products/1"
        const data = await axios.get(url)
        console.log(data.data);
    } catch (error) {
        console.log(error);
    }
    
}
const post_data = async () => {
    try {
        const details = {
            title: "KTM"
        }
        const headers = {
            "content-type": "application/json"
        }
        const url = "https://dummyjson.com/products/add"
        const data = await axios.post(url, details, { headers: headers })
        console.log(data.data);
    } catch (error) {
        console.log(error);
    }
}
// const res = get_data()
// console.log(res.then)
//  get_data()
 post_data()



 const biginTokenRequest = async (code) => {
    try {
        const client_id = process.env.CLIENT_ID
        const client_secret = process.env.CLIENT_SECRET
        const grant_type = "authorization_code"
        const redirect_uri = "http://localhost:3000/api/v1/closed"

        const details = new FormData();
        details.append("client_id", client_id);
        details.append("client_secret", client_secret);
        details.append("code", code);
        details.append("redirect_uri", redirect_uri);
        details.append("grant_type", grant_type);
        console.log(details);

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        const url = process.env.AUTH_URL
        console.log(url);
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
}