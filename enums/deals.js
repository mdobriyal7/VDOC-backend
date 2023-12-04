// Enum for Deals Status
const DealsStatusEnum = {
    dealAdded: 0,
    dealDocumentUploaded: 1,
    dealDocumentApproved: 2,
    dealDocumentRejection: 3,
    dealDocumentReceived: 4,

    dealDocumentSent: 5,
    dealDocumentReceivedForApproval: 6,
    dealDocumentReceivedApproved: 7,

    projectCreated: 8,
}

module.exports = { DealsStatusEnum };