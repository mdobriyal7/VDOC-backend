const ProjectModel = require("../../models/ProjectModel")



const getAllProjects = async (query, options, sortType) => {
    return await ProjectModel.find(query).limit(options.limit).skip(options.skip).sort([sortType])
}

const getProjectById = async (id) => {
    return await ProjectModel.findById(id)
}


const createProject = async (projectData) => {
    return await ProjectModel.create(projectData)
}

const updateProject = async (id, data) => {
    return await ProjectModel.findByIdAndUpdate(id, data)
}

const countProjects = async () => {
    return await ProjectModel.countDocuments()
}




module.exports = { getAllProjects, createProject, getProjectById, updateProject, countProjects }


// shanu @vrd2023