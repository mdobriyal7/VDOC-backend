const {fetchAllCompanies, fetchCompanyById} = require("./crud/CompaniesCrud")



const getCompanies = async (req, res) => {
    try{
        const companies = await fetchAllCompanies()
        console.log(companies);
        res.status(200).json({
            message: "Success",
            data : companies
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            error: error
        })
    }
}


const getCompany  =async (req, res) => {
    try {
        const company = await fetchCompanyById(req.params.id)
        console.log(company);
    } catch (error) {
        console.log(error);
    }
}


module.exports = { getCompanies, getCompany }