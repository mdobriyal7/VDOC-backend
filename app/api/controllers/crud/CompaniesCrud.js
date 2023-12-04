const { BiginCompanies } = require("../../models/ClosedWon")


const fetchAllCompanies = async () => {
    return await BiginCompanies.find({})
}


const fetchCompanyById = async (id) => {
    return await BiginCompanies.findById(id)
}


module.exports = { fetchAllCompanies, fetchCompanyById }