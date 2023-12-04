const jwt = require('jsonwebtoken')
const { JWTTokenTypes } = require('../../enums/token')

const createToken = (payload) => {
    if (payload.token_type === JWTTokenTypes.ACCESS_TOKEN) {
        const access_token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { "expiresIn": process.env.ACCESS_TOKEN_EXP})
        return access_token
    } else if (payload.token_type === JWTTokenTypes.FILE_TOKEN){
        const file_token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { "expiresIn": process.env.FILE_TOKEN_EXP })
        return file_token
    } else {
        const refresh_token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { "expiresIn": process.env.REFRESH_TOKEN_EXP })
        return refresh_token
    }
}

const verifyToken = (token) => {
    token = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if (token) {
        return token
    } else {
        return false
    }
    // return jwt
}

const decodeToken = (token) => {
    const decodeToken = jwt.decode(token);
    return decodeToken
}

module.exports = {createToken, verifyToken, decodeToken};