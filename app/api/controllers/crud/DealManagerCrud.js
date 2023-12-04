const { model } = require('mongoose')
const { CloseWonDeals } = require('../../models/ClosedWon')

const fetchAll = async (query, options, sortType) => {
    return await CloseWonDeals.find(query).limit(options.limit).skip(options.skip).sort([sortType])
}

const countDocuments = async () => {
    return await CloseWonDeals.countDocuments()
}

const fetchBySalesPerson = async (email) => {
    return await CloseWonDeals.find({ 'owner.email': email })
}

const fetchById = async (id) => {
    return await CloseWonDeals.findById(id)
}

const fetchFilesById = async (id) => {
    return await CloseWonDeals.findById(id).select({documents: 1, clientDocuments: 1})
}

const updateDeals = async (id, update) => {
    return await CloseWonDeals.findByIdAndUpdate(id, update)
}

const updateDealDocumetns = async (id, data, reqType) => {
    if (reqType === "dealDoc") {
        return await CloseWonDeals.findByIdAndUpdate(id, {$push:{ documents: data.filesToStore }}, {new: true})
    }

    if(reqType === "clientDoc") {
        return await CloseWonDeals.findByIdAndUpdate(id, { clientDocuments: data.filesToStore })
    }
}

module.exports = { 
    fetchAll, 
    fetchBySalesPerson, 
    fetchById,
    updateDealDocumetns, 
    fetchFilesById, 
    countDocuments,
    updateDeals
 }
