const jwt = require('jsonwebtoken');
const jwtUtils = require('../../utils/jwtUtils');
const userRoleEnum = require('../../../enums/user');
const { JWTTokenTypes } = require('../../../enums/token')


function validateUser(req, res, next) {
    let token = req.headers.authorization
    if (token){
        try {
            const verifyToken = jwtUtils.verifyToken(token.split(" ")[1])
            if (verifyToken.token_type === JWTTokenTypes.ACCESS_TOKEN) {
                req.body.id = verifyToken.id;
                // console.log(req.body);
                next();
            }
        } catch (error) {
            res.status(401).json({
                message: "Invalid Token"
            })
        }
        
    } else {
        res.status(422).json({
            message: "No Token Provided"
        })
    }
}
// function validateUser(req, res, next) {
//     let token = req.headers.authorization
//     console.log(token);
//     if (token){
//         token = token.split(' ')
//         if (token[0] === "Bearer"){
//             try {
//                 const verifyToken = jwtUtils.verifyToken(token[1])
//                 if (verifyToken.token_type === 'access_token') {
//                     req.body.id = verifyToken.id;
//                     // console.log(req.body);
//                     next();
//                 }
//             } catch (error) {
//                 // console.log(error);
//                 res.status(401).json({
//                     message: "Invalid Token"
//                 })
//                 }
//             }
            
            
//     } else {
//         res.status(422).json({
//             message: "No Token Provided"
//         })
//     } 
//     } 


function validateRefreshToken(req, res, next){
    jwt.verify(
        req.body.refresh_token, 
        process.env.JWT_SECRET_KEY,
        (err, decode) => {
            if (err) {
                next(err)
            }else {
                if (decode.token_type === JWTTokenTypes.REFRESH_TOKEN) {
                    next();
                }else {
                    res.status(429).json({
                        message: "Invalid Refresh Token"
                    })
                }
            }
        } 
    )
}


module.exports = { validateUser, validateRefreshToken }
