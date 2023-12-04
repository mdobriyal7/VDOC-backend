const fs = require('fs');
const path = require('path');
const DealCrud = require('../controllers/crud/DealManagerCrud')
const { CloseWonDeals, DealDocumentation } = require("../models/ClosedWon")
const { FileStatusEnums } = require("../../../enums/files");
const { DealsStatusEnum } = require('../../../enums/deals');
// const { delay } = require('../../utils/common_utils');
const jwtUtils = require('../../utils/jwtUtils');
const transporter  = require("../../utils/mail_utils");
const { JWTTokenTypes }  = require('../../../enums/token')


// for BDM to upload file for verification
const dealDocumentation = async (req, res) => {
    const dealId = req.body.dealid; // Get the ID from the request body
    const uploadedFiles = req.files; // Get the uploaded files array
    const reqType = "dealDoc"
    let filesToStore = [];
    try {
        const uploadDir = path.join("resources/deals/", dealId);
        // Create a directory based on user ID if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        for (const file of uploadedFiles) {
            const fileName = `${file.originalname.split(".")[0]}_${dealId}.${file.originalname.split(".")[1]}`
            const filePath = path.join(uploadDir, fileName);
            const dealDocumentation = DealDocumentation({
                fileName: fileName,
                filePath: filePath,
                status: FileStatusEnums.isPending,
                uploadedBy: req.body.id
            })
            filesToStore.push(dealDocumentation);
            // Save the file to the specified path
            fs.writeFileSync(filePath, file.buffer);
        }
        await DealCrud.updateDealDocumetns(dealId, { filesToStore }, reqType)
        await DealCrud.updateDeals(dealId, { status: DealsStatusEnum.dealDocumentUploaded })
        res.status(200).json({ message: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}

// for client to upload the payment Screenshot or other business related file 
const dealDocumentationConfirm = async (req, res) => {
    const dealId = req.body.dealid
    const uploadedFiles = req.files
    const reqType = "clientDoc"
    let filesToStore = []

    try {
        const uploadDir = path.join("resources/deals/", dealId, "confirmed/");
        // Create a directory based on user ID if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }
        let counter = 1
        for (const file of uploadedFiles) {
            const fileName = `file_${counter}_${dealId}.${file.originalname.split(".")[1]}`
            const filePath = path.join(uploadDir, fileName)
            const dealDocumentation = DealDocumentation({
                fileName: fileName,
                filePath: filePath,
                status: FileStatusEnums.isPending,
                uploadedBy: req.body.id
            })
            filesToStore.push(dealDocumentation)
            // Save the file to the specified path
            fs.writeFileSync(filePath, file.buffer)
        }
        await DealCrud.updateDealDocumetns(dealId, { filesToStore }, reqType)
        res.status(200).json({ message: 'success' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}


// to fetch the documents of a deal based type weather client or BDMs 
const fetchDocumentation = async (req, res) => {
    // console.log("req.params",req.params);
    try {
        const data = await DealCrud.fetchFilesById(req.params.id)
        const documentFiles = []
        const clientDocuments = []
        const rootDir = path.resolve(__dirname, '../../../');

        data.documents.forEach((file) => {
            const filePath = path.join(rootDir, file.filePath)
            // const filePath = file.filePath
            console.log(filePath);
            
            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath, {encoding: 'base64'})
                const fileSize = Buffer.from(fileData, 'base64').length;
                const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2)
                documentFiles.push({
                    fileId: file._id,
                    fileStatus: file.status,
                    fileSize: fileSizeMB,
                    fileName: file.fileName,
                    data: fileData
                })
            }
        })

        data.clientDocuments.forEach((file) => {
            const filePath = file.filepath

            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath, {encoding: 'base64'})
                const fileSize = Buffer.from(fileData, 'base64').length;
                const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2)
                clientDocuments.push({
                    fileId: file._id,
                    fileSize: fileSizeMB,
                    fileStatus: file.status,
                    fileName: file.filename,
                    data: fileData
                })
            }    
        })
        console.log(documentFiles);
        if (documentFiles.length > 0 || clientDocuments.length > 0) {
            // res.set('Content-Type', 'application/pdf');
            res.status(200).json({
                message: "Success",
                documentFiles: documentFiles,
                clientDocuments: clientDocuments,
            });
        } else {
            res.status(404).json({
                error: "No files found for this deal.",
            });
        }
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


const downloadFiles = async (req, res) => {
    try {
        if (req.body.fileType === "document") {
            const filepath = await CloseWonDeals.findById(req.params.id).select({ documents: 1 })
            filepath.documents.forEach((element) => {
                if (req.body.filename === element.fileName) {
                    if (fs.existsSync(process.cwd() + "\\" + element.filePath)) {
                        res.download(process.cwd() + "\\" + element.filePath)
                    }else {
                        res.status(404).json({
                            "message": "No file found"
                        })
                    }
                } else {
                    return
                }
            });
        } else  {
            const filepath = await CloseWonDeals.findById(req.params.id).select({ clientDocuments: 1 })
            filepath.clientDocuments.forEach((element) => {
                if (req.body.filename === element.filename) {
                    if (fs.existsSync(process.cwd() + "\\" + element.filepath)) {
                        res.download(process.cwd() + "\\" + element.filepath)
                    } else {
                        return
                    }
                } else {
                    res.status(404).json({
                        "message": "No file found"
                    })
                }
            });
        }   
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
    }
    
const updateFileStatus = async (req, res) => {
    try {
        const deal = await CloseWonDeals.findById(req.params.id)
        const fileIndex = deal.documents.findIndex(doc => doc._id.toString() === req.body.fileId)
        if (fileIndex === -1) {
            const clientFileIndex = deal.clientDocuments.find(doc => doc._id.toString() === req.body.fileId);
            if (clientFileIndex === -1) {
                res.status(404).json({
                    message: "File not Found"
                })
            }
            if (req.body.status === FileStatusEnums.isConfirmed) {
                deal.clientDocuments[clientFileIndex].status = FileStatusEnums.isConfirmed
            }else {
                deal.clientDocuments[clientFileIndex].status = FileStatusEnums.isRejected
            }
        } else {
            if (req.body.status === FileStatusEnums.isConfirmed) {
                deal.documents[fileIndex].status = FileStatusEnums.isConfirmed
            } else {
                deal.documents[fileIndex].status = FileStatusEnums.isRejected
            }
            
        }

        const docsVerified = deal.documents.every(doc => doc.status === FileStatusEnums.isConfirmed)
        if (docsVerified) {
            deal.status = DealsStatusEnum.dealDocumentApproved
        }
        await deal.save()
        res.status(200).json({
            message: "success",
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


const sendFilesToClient = async (req, res) => {
    try {
        await new Promise(r => setTimeout(r, 2000));
        const deal = await DealCrud.fetchById(req.body?.dealId)

        console.log("client Email", deal.clientEmail);
        
        const tokenPayload = {
            dealId: deal._id,
            clientEmail: deal.clientEmail,
            token_type: JWTTokenTypes.FILE_TOKEN
        }
        const token = jwtUtils.createToken(tokenPayload)
        console.log(token);
        const url = `localhost:5173/document_sign?token=${token}`
        
        const mailOptions = { 
            from: process.env.MAIL_SENDER,
            to: "shanutyagi010@gmail.com",
            subject: "Test mail for sending file",
            html:`
            <p>Here are the links to your files:</p>
            <a href="${url}">${url}</a>
            `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Mail Sent:", info.response);
        deal.status = DealsStatusEnum.dealDocumentSent
        await deal.save()
        res.status(200).json({
            message: "success"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        })
    }
}

const authorize_client = async (req, res) => {
    try {
        const clientEmail = req.body.email 
        const token = req.body.token
        const verifyToken = jwtUtils.verifyToken(token)
        // verifyEmail = DealCrud
        if (verifyToken) {
            const deal = await DealCrud.fetchById(verifyToken.dealId)
            if (clientEmail === verifyToken.clientEmail && clientEmail === deal.clientEmail && deal.status < DealsStatusEnum.dealDocumentReceivedForApproval) {
                res.status(200).json({
                    status: true,
                    message: "success"
                })
            }else {
                res.status(200).json({
                    data: {
                        clientEmail: clientEmail,
                        verifyToken: verifyToken 
                    },
                    status: false,
                    message: "email not matching"
                })
            }
        }else {
            res.status(200).json({
                status: false,
                message: "invalid token"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        })
    }
}

module.exports = { 
    dealDocumentation, 
    fetchDocumentation, 
    dealDocumentationConfirm,
    downloadFiles,
    updateFileStatus,
    sendFilesToClient,
    authorize_client
}

