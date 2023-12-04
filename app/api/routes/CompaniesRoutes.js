const express = require('express');
const CompanyRouter = express.Router()
const {getCompanies, getCompany}  = require("../controllers/CompaniesController")

CompanyRouter.route("/").get(getCompanies)
module.exports = {CompanyRouter};