const express = require('express');
const { dealDocumentation, 
        dealDocumentationConfirm,
        fetchDocumentation,
        downloadFiles,
        updateFileStatus ,
        sendFilesToClient,
        authorize_client
    } = require('../controllers/FilesController')


const fileUploadRouter = express.Router();
const fileSignRouter = express.Router();

fileUploadRouter.route("/fetch/:id").get(fetchDocumentation)
fileUploadRouter.route("/dealDocuments/upload").post(dealDocumentation)
fileUploadRouter.route("/paymentDocuments/upload").post(dealDocumentationConfirm)
fileUploadRouter.route("/download/:id").post(downloadFiles)
fileUploadRouter.route("/update/:id").put(updateFileStatus)
fileUploadRouter.route("/sendClientFiles").post(sendFilesToClient)
fileSignRouter.route("/authorize_client").post(authorize_client)

module.exports = { fileUploadRouter, fileSignRouter }