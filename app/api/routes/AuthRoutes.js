const express = require('express');
Authrouter = express.Router();

const { refresh_token } = require('../controllers/TokenController')

Authrouter.route("/").post(refresh_token)
// Authrouter.route("/verify").get(verifyToken)

module.exports = {Authrouter}
