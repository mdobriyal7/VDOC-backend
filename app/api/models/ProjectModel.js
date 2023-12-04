// js imports
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

// project imports
const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true, 
    },
    projectType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    createdBy: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    clientName: {
        type : String,
        required: true
    },
    dealId: ObjectId,
    createdAt:Date,
    productionManagers: Array,
    primaryDesigners: Array,
    secondaryDesigners: Array,
    projectManagers: Array,
    bdManagers: Array,
    SalesTeam: Array,  
    files: Array,
    status: {
        type: Number,
        required: true,
        default: 0
    }

})


// Exporting Model
module.exports = mongoose.model("Project", projectSchema);