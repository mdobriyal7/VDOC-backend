const axios = require("axios")
const BiginModel = require('../api/models/BiginModel')
const CloseWonDeals = require('../api/models/ClosedWon')
const { URL } = require('url');

const biginAuthorizationRequest = async () => {
    const SCOPE = "ZohoBigin.modules.READ"
    const URL = "https://accounts.zoho.in/oauth/v2/auth"
    const redirect_uri = "http://localhost:3000/closed"
    try {
        const res = await axios.get(URL, { params : {
            scope: SCOPE,
            client_id: process.env.CLIENT_ID,
            response_type: "code",
            access_type: "offline",
            redirect_uri: redirect_uri
        }})
        const {data} = await res 
        console.log(data);
    } catch (error) {
        console.log(error);
        return error
    }
}

const biginTokenRequest = async () => {
    try {
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        const old_code = await BiginModel.find()
        let formdata = new FormData();
        formdata.append("client_id", process.env.TEST_CLIENT_ID);
        formdata.append("client_secret", process.env.TEST_CLIENT_SECRET);
        formdata.append("code", old_code[0].scopeCode);
        formdata.append("redirect_uri", "http://localhost:3000/api/v1/closed");
        formdata.append("grant_type", "authorization_code");
        const url = "https://accounts.zoho.in/oauth/v2/token";
        let response = await fetch(url, {
            method: "POST",
            body: formdata,
            headers: headers
        });
       console.log(response.data)
        // const url = "https://accounts.zoho.in/oauth/v2/token"
        // const data = await axios.post(url, details, {headers: headers});
    } catch (error) {
        console.log(error);
    }
}

const fetchWonDeals = async (token) => {
    try {
        // const url = "https://www.zohoapis.in/bigin/v1/Deals"
        const url = "https://www.zohoapis.in/bigin/v1/Deals/search?criteria=(Stage:equals:Closed Won)"
        const access_token = token
        const headers = {
            "Authorization": `Zoho-oauthtoken ${access_token}`
        }  

        const deals = await axios.get(url, { headers: headers });
        // console.log(deals.data); 
        const data = deals.data.data
        return data
    } catch (error) {
        console.log(error.status);
        console.log(error.data);
        return {}
    }
}


//  Fetch contact based on Deal
const fetchContactBasedOnDeal = async (id, token) => {
    try {
        const url = `https://www.zohoapis.in/bigin/v1/Contacts/${id}`
        const access_token = token
        const headers = {
            "Authorization": `Zoho-oauthtoken ${access_token}`
        }
        const contact = await axios.get(url, {headers : headers})
        // console.log(contact.data);
        const contactData = contact.data
        return contactData
    } catch (error) {
        console.log(error);
        return {}
    }
}

const fetchCompanies = async () => {
    try {

        const url = "https://www.zohoapis.in/bigin/v1/Accounts"
        const access_token = "1000.9a2b52d05be1f5f91128c3034943c389.b2a212cf11955872fc6de2a0c892b472"
        const headers = {
            "Authorization": `Zoho-oauthtoken ${access_token}`
        }

        const companies = await axios.get(url, {headers: headers})
        const companiesData = companies.data.data
        return companiesData
    }catch (error) {
        console.log(error);
        return false
    }
}

module.exports = { biginTokenRequest, fetchWonDeals, fetchCompanies, fetchContactBasedOnDeal }


// {
//                 owner: e.Owner,
//                 description: e.Description,
//                 address: e.Address,
//                 closingDate: e.Closing_Date,
//                 last_activity: e.Last_Activity_Time,
//                 modifiedBy: e.Modified_By,
//                 dealName: e.Deal_Name,
//                 stage: e.Stage,
//                 accountName: e.Account_Name,
//                 modifiedTime: e.Modified_Time,
//                 createdTime: e.Created_Time,
//                 amount: e.Amount,
//                 contactName: e.Contact_Name,
//                 createdBy: e.Created_By,
//                 approvedState: e['$approved_State'],
// }