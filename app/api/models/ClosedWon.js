const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const DocumentationSchema = new mongoose.Schema({
    fileName: String,
    filePath: String,
    status: Number,
    uploadedBy: ObjectId,
})


const CloseWonDealsSchema = new mongoose.Schema({
    owner: Object,
    description: String,
    clientEmail: String,
    address: String,
    closingDate: Date,
    last_activity: Date,
    modifiedBy: Object,
    dealName: String,
    stage: String,
    accountName: Object,
    modifiedTime: Date,
    createdTime: Date,
    amount: Number,
    contactName: Object,
    createdBy: Object,
    dealId: String, 
    status: Number,
    documents: {
        type: [DocumentationSchema]
    },
    clientDocuments: {
        type: [DocumentationSchema]
    }
})

const BiginCompaniesSchema = new mongoose.Schema({
    owner: Object,
    description: String,
    website: String,
    last_activity: Date,
    recordImage: String,
    modifiedBy: Object,
    phone: String,
    billingCountry: String,
    accountName: String,
    companyId: String,
    billingStreet: String,
    createdTime: Date,
    billingCode: String,
    billingCity: String,
    billingState: String,
    createdBy: Object,
})




// Can Create Index on any field of the schema.
// CloseWonDeals.index({ dealName: 'text', 'accountName.name': 'text' });
const BiginCompanies = new mongoose.model('BiginCompanies', BiginCompaniesSchema);
const CloseWonDeals = new mongoose.model('ClosedWonDeals', CloseWonDealsSchema);
const DealDocumentation = new mongoose.model('DealDocumentation', DocumentationSchema);

module.exports = { BiginCompanies, CloseWonDeals, DealDocumentation }
