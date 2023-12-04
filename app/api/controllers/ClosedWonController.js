const { fetchCompanies, fetchContactBasedOnDeal } = require("../../services/BiginAPI");
const axios = require("axios")
const { BiginCompanies, CloseWonDeals } = require('../models/ClosedWon')
const { DealsStatusEnum } = require('../../../enums/deals')

// const BiginModel = require("../models/BiginModel");

// Redirect route for Permission Accept
const dealRedirect = (req, res) => {
  const SCOPE = "ZohoBigin.modules.ALL";
  // const URL = "https://accounts.zoho.in/oauth/v2/auth";
  const redirect_uri = "http://localhost:3000/api/v1/closed";
  console.log(
    `https://accounts.zoho.in/oauth/v2/auth?scope=${SCOPE}&client_id=${process.env.CLIENT_SECRET}&response_type=code&access_type=offline&redirect_uri=${redirect_uri}`
  );

  res.redirect(
    `https://accounts.zoho.in/oauth/v2/auth?scope=${SCOPE}&client_id=${process.env.CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${redirect_uri}`
  );
};

// Route to handle callback from bigin
const biginCallback = async (req, res) => {

  try {

    // sending request for access_token to BiginAPI 
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    // Creating Payload 
    let formdata = new FormData();
    formdata.append("client_id", process.env.TEST_CLIENT_ID);
    formdata.append("client_secret", process.env.TEST_CLIENT_SECRET);
    formdata.append("code", req.query.code);
    formdata.append("redirect_uri", "http://localhost:3000/api/v1/closed");
    formdata.append("grant_type", "authorization_code");

    // Sending request 
    const url = "https://accounts.zoho.in/oauth/v2/token";
    const response = await axios.post(url, formdata, { headers: headers })


    // sending request to fetch delas from Bigin Pipeline
    const urlDeal = "https://www.zohoapis.in/bigin/v1/Deals"
    const access_token = response.data.access_token
    const headersDeal = {
      "Authorization": `Zoho-oauthtoken ${access_token}`
    }
    const deals = await axios.get(urlDeal, { headers: headersDeal });
    const data = deals.data.data

    // Saving New Deals in the Database 
    if (data) {
      data.forEach(async (e) => {
        const isExists = await CloseWonDeals.findOne({ dealId: `${e.id}` })
        if (!isExists) {
          console.log(e);

          // Fetching conatct based on the ID in Deal to add clientEmail in Deal Collection
          const contact = await fetchContactBasedOnDeal(e.Contact_Name.id, access_token)
          console.log(contact.data[0]?.Email);
          const clientEmail = contact.data[0]?.Email
          const deal = new CloseWonDeals({
            owner: e.Owner,
            description: e.Description,
            address: e.Address,
            closingDate: e.Closing_Date,
            last_activity: e.Last_Activity_Time,
            modifiedBy: e.Modified_By,
            dealName: e.Deal_Name,
            stage: e.Stage,
            accountName: e.Account_Name,
            modifiedTime: e.Modified_Time,
            createdTime: e.Created_Time,
            amount: e.Amount,
            dealId: e.id,
            contactName: e.Contact_Name,
            createdBy: e.Created_By,
            status: DealsStatusEnum.dealAdded,
            clientEmail: clientEmail
          })
          deal.save()
        }
      })
    } 
  } catch (error) {
    console.log(error);
  }
  // res.send("closed won");
  res.redirect(process.env.API_ROOT_URL)
};

// Route to get Access and Refresh token 
// const ZohoAuthToken = async (req, res) => {
//   try {
//     const headers = {
//       "Content-Type": "application/x-www-form-urlencoded",
//     };
//     const old_code = await BiginModel.find();
//     let formdata = new FormData();
//     formdata.append("client_id", process.env.TEST_CLIENT_ID);
//     formdata.append("client_secret", process.env.TEST_CLIENT_SECRET);
//     formdata.append("code", old_code[0].scopeCode);
//     formdata.append("redirect_uri", "http://localhost:3000/api/v1/closed");
//     formdata.append("grant_type", "authorization_code");
//     const url = "https://accounts.zoho.in/oauth/v2/token";
//     const response = await axios.post(url, formdata, { headers: headers})
//     // Deal Part 
//     const urlDeal = "https://www.zohoapis.in/bigin/v1/Deals"
//     const access_token = response.data.access_token
//     const headersDeal = {
//       "Authorization": `Zoho-oauthtoken ${access_token}`
//     }
//     const deals = await axios.get(urlDeal, { headers: headersDeal });
//     const data = deals.data.data

//     if (data) {
//       data.forEach(async (e) => {
//         const isExists = await CloseWonDeals.findOne({ dealId: `${e.id}` })
//         if (!isExists) {
//           console.log(e);
//           const contact = await fetchContactBasedOnDeal(e.Contact_Name.id, access_token)
//           console.log(contact.data[0]?.Email);
//           const clientEmail = contact.data[0]?.Email
//           const deal = new CloseWonDeals({
//             owner: e.Owner,
//             description: e.Description,
//             address: e.Address,
//             closingDate: e.Closing_Date,
//             last_activity: e.Last_Activity_Time,
//             modifiedBy: e.Modified_By,
//             dealName: e.Deal_Name,
//             stage: e.Stage,
//             accountName: e.Account_Name,
//             modifiedTime: e.Modified_Time,
//             createdTime: e.Created_Time,
//             amount: e.Amount,
//             dealId: e.id,
//             contactName: e.Contact_Name,
//             createdBy: e.Created_By,
//             status: DealsStatusEnum.dealAdded,
//             clientEmail: clientEmail
//           })
//           deal.save()
//         }
//       })
//       res.status(200).json({
//         message: "success"
//       })
//     }else {
//       res.status(200).json({
//         message: "empty success"
//       })
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       error: error,
//     });
//   }
// };


// Route to the get the Won deals directly from bigin and save in Database
// const getWonDeals = async (req, res) => {
//   try {
//     const deals = await fetchWonDeals();
//     if (deals) {
//       deals.forEach(async (e) => {
//         const isExists = await CloseWonDeals.findOne({ dealId: `${e.id}` })
//         if (!isExists) {
//           console.log(e);
//           const contact = await fetchContactBasedOnDeal(e.Contact_Name.id)
//           console.log(contact.data[0].Email);
//           const clientEmail = contact.data[0].Email
//           const deal = new CloseWonDeals({
//             owner: e.Owner,
//             description: e.Description,
//             address: e.Address,
//             closingDate: e.Closing_Date,
//             last_activity: e.Last_Activity_Time,
//             modifiedBy: e.Modified_By,
//             dealName: e.Deal_Name,
//             stage: e.Stage,
//             accountName: e.Account_Name,
//             modifiedTime: e.Modified_Time,
//             createdTime: e.Created_Time,
//             amount: e.Amount,
//             dealId: e.id,
//             contactName: e.Contact_Name,
//             createdBy: e.Created_By,
//             status: DealsStatusEnum.dealAdded,
//             clientEmail: clientEmail
//           })
//           deal.save()
//         }
//       })
//       res.status(200).json({
//         message: "success"
//       })
//     }

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       error: error
//     })
//   }
// }

const getCompanies = async (req, res) => {
  try {
    const companies = await fetchCompanies();
    if (companies) {
      companies.forEach(async (e) => {
        const isExists = await BiginCompanies.findOne({ dealId: `${e.id}` })
        if (!isExists) {
          try {
            const company = new BiginCompanies({
              owner: e.Owner,
              description: e.Description,
              website: e.Website,
              last_activity: e.Last_Activity_Time,
              recordImage: e.Record_Image,
              modifiedBy: e.Modified_By,
              phone: e.Phone,
              billingCountry: e.Billing_Country,
              accountName: e.Account_Name,
              companyId: e.id,
              billingStreet: e.Billing_Street,
              createdTime: e.Created_Time,
              billingCode: e.Billing_Code,
              billingCity: e.Billing_City,
              billingState: e.Billing_State,
              createdBy: e.Created_By,
            })
            await company.save()
          } catch (error) {
            console.log(error);
          }

        }
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: error
    })
  }
}

module.exports = { dealRedirect, biginCallback, getCompanies };


