// js imorts
const express = require('express');
const upload = require("../middleware/fileUpload")
// project imports

const { 
    createUser, 
    getAllUser, 
    getUser, 
    login, 
    verifyToken, 
    logout, 
    updateUser, 
    deleteUser 
} = require('../controllers/UserController')



const userRouter = express.Router()
const userLoginRouter =express.Router()
userLoginRouter.route('/login').post(login);
userLoginRouter.route("/logout").get(logout)
userLoginRouter.route('/create').post(upload.single('profilePicture'),createUser);

userRouter.route('/').get(getAllUser)
userRouter.route("/verify").get(verifyToken)
userRouter.route("/:idOrEmail").get(getUser).put(updateUser).delete(deleteUser)




module.exports = { userRouter, userLoginRouter }


