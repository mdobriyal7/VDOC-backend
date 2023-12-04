const UserModel = require('../../models/UserModel')

const create = async (userData) => {
    return await UserModel.create(userData);
}

const fetchAll = async (query) => {
    if (query){
        return await UserModel.find(query);
    }
    return await UserModel.find();
}

const fetchById = async (id) => {
    return await UserModel.findById(id)
}

const fetchByEmail =  async (email) => {
    return await UserModel.findOne({email});
}


const updateUser = async (id, userDataToUpdate) => {
    console.log(userDataToUpdate);
    return await UserModel.findByIdAndUpdate(id, userDataToUpdate, {new: true});
}


const deleteUser = async (id) => {
    return await UserModel.findByIdAndDelete(id);
}
module.exports = { create, fetchAll, fetchById, fetchByEmail, updateUser, deleteUser }

