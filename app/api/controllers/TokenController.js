const jwtUtils = require('../../utils/jwtUtils')
const { JWTTokenTypes } = require('../../../enums/token')


const refresh_token = async (req, res) => {
    const token = jwtUtils.decodeToken(req.body.refresh_token)
    if (token.token_type === JWTTokenTypes.REFRESH_TOKEN) {
        const access_payload = {
            id: token.id,
            user_type: token.user_type,
            token_type: JWTTokenTypes.ACCESS_TOKEN
        };
        const refresh_payload = {
            id: token.id,
            token_type: JWTTokenTypes.REFRESH_TOKEN
        };

        const access_token = jwtUtils.createToken(access_payload)
        const refresh_token = jwtUtils.createToken(refresh_payload)

        res.status(200).json({
            status: "success",
            message: "Token Refreshed",
            data: {
                access_token: access_token,
                refresh_token: refresh_token
            }
        });
    } else {
        res.status(400).json({
            message: "Invalid Token or An error Occured",
            status: "false"
        })
    }
}

module.exports = { refresh_token }