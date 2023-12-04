const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Configure Profile Pictur Storage 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userEmail = req.body.email;
        const folderPath = path.join("resources/profilepic/", userEmail, "/")
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true })
        }
        req.body.profilePicturePath = folderPath
        cb(null, folderPath)
    },
    filename: (req, file, cb) => {
        filename = req.body.email.split("@")[0] + "." + file.originalname.split(".")[1]
        req.body.profilePicturePath += filename
        cb(null, filename)
    }
});

const upload = multer({ storage })
module.exports = upload

