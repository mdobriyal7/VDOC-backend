const express = require('express');

const { dealRedirect, biginCallback, getCompanies } = require('../controllers/ClosedWonController')

const closedWonrouter = express.Router()

closedWonrouter.route('/bigin').get(dealRedirect)
closedWonrouter.route('/closed').get(biginCallback)
closedWonrouter.route('/Bigincompanies').get(getCompanies)
// closedWonrouter.route('/getBiginContactRoute').get(getBiginContactRoute)

module.exports = closedWonrouter;