// js imports
const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const cors = require('cors');
const cookieParser = require('cookie-parser')
// project imports 
const Database = require('./config/database.js');
Database
// routers 
const { userRouter, userLoginRouter } = require("./app/api/routes/UserRoutes.js");
const ClosedWonRouter = require("./app/api/routes/ClosedWonRoutes.js");
const DealsRouter = require("./app/api/routes/DealManagerRoutes.js");
const AuthRouter = require('./app/api/routes/AuthRoutes.js')
const CompanyRouter = require("./app/api/routes/CompaniesRoutes.js")
const { fileUploadRouter, fileSignRouter } = require("./app/api/routes/FileUploadRoutes.js")
const projectRouter = require("./app/api/routes/ProjectRoutes.js")

// Middleware
const { validateUser, validateRefreshToken } = require("./app/api/middleware/validateUser.js");
const logger = require("./app/api/middleware/reqLogger.js")




const app = express();
dotenv.config();
const PORT = process.env.PORT

app.use(cookieParser())
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }))
app.use(logger)
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({extended: false}))

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// user route
app.use(`${process.env.API_ROOT_URL}/users/`, validateUser, userRouter);
app.use(`${process.env.API_ROOT_URL}/auth/`, userLoginRouter)
app.use(`${process.env.API_ROOT_URL}/refreshToken`, validateRefreshToken, AuthRouter.Authrouter)

app.use(`${process.env.API_ROOT_URL}/`, ClosedWonRouter)

// Deals Route
app.use(`${process.env.API_ROOT_URL}/deals`, validateUser, DealsRouter.dealRouter)

// Company Routers
app.use(`${process.env.API_ROOT_URL}/companies`, validateUser, CompanyRouter.CompanyRouter)
app.use(`${process.env.API_ROOT_URL}/files`, upload.array('file'), validateUser, fileUploadRouter)
app.use(`${process.env.API_ROOT_URL}/sign`, upload.array('file'), fileSignRouter)
app.use(`${process.env.API_ROOT_URL}/projects`, upload.none(), validateUser, projectRouter.projectRouter)



// Database Connection`)
app.get(`${process.env.API_ROOT_URL}/`, (req, res) => {
  res.json({
    project: "VDOC",
  });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})

module.exports = app;