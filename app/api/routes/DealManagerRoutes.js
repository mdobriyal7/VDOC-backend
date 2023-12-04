const express = require('express');
const { allDeals, DealsById, DealsBySalesPerson } =  require('../controllers/DealManager')

const dealRouter = express.Router();


dealRouter.route('/').get(allDeals)
dealRouter.route("/bdm/:email").get(DealsBySalesPerson)
dealRouter.route('/:data').get(DealsById)

module.exports = { dealRouter }